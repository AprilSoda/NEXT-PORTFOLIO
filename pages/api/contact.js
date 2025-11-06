import nodemailer from "nodemailer"
import moment from "moment/moment"

const handler = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // req.body is already parsed by Next.js
    const { name, email, text } = req.body

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
      host: "smtp.hiworks.com",
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    })

    await transport.sendMail({
      from: `${email}`,
      to: "hello@kimtaekyun.dev",
      subject: "Kim Tea Kyun Website - Contact Call",
      html: `
        <div className="email" style="max-width:1080px; width:100%;">
          <p style="margin-bottom: 16px"><strong>VFX DEV LOG CONTACT CALL</strong></p>
          <p> SentTime : ${moment().format('MMMM Do YYYY, h:mm:ss a')} </p>
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