import nodemailer from "nodemailer"

const handler = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // req.body is already parsed by Next.js
    const { name, email, text, website, renderedAt } = req.body

    // Spam guards — respond 200 "ok" but DON'T send, so bots think they
    // succeeded and don't adapt/retry:
    //  1) honeypot: a hidden field only bots fill
    //  2) too-fast / missing render timestamp: bots post instantly (or skip it)
    if (website) {
      return res.status(200).json({ success: true, message: 'ok' })
    }
    if (!renderedAt || Date.now() - Number(renderedAt) < 3000) {
      return res.status(200).json({ success: true, message: 'ok' })
    }

    // Validate required fields
    if (!name || !email || !text) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const transport = nodemailer.createTransport({
      host: "smtps.hiworks.com", // hiworks official SMTP host (note the trailing "s")
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS // hiworks: use the "mail-only password" if OTP login is on
      }
    })

    await transport.sendMail({
      from: process.env.MAIL_USER, // must be the authenticated mailbox or hiworks rejects the send
      replyTo: email, // replies go to the visitor who submitted the form
      to: "hello@kimtaekyun.dev",
      subject: "Kim Tae Kyun Website - Contact Call",
      html: `
        <div className="email" style="max-width:1080px; width:100%;">
          <p style="margin-bottom: 16px"><strong>VFX DEV LOG CONTACT CALL</strong></p>
          <p> SentTime : ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'medium' })} </p>
          <p> Email : ${email} </p>
          <p> Name : ${name} </p>
          <p> Description : </p>
          <p> ${text} </p>
        </div>
        `
    })

    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending error:', error)
    res.status(500).json({ error: 'Failed to send email. Please try again later.' })
  }
}

export default handler