import nodemailer from "nodemailer"
import moment from "moment/moment"

export default async (req, res) => {
  const { name, email, text } = JSON.parse(req.body)
  console.log(req.body.name)

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
          <p> SentTime : ${moment().format('MMMM Do YYYY, h:mm:ss a')} <p>
          <p> Name : ${email} </p>
          <p> Name : ${name} </p>
          <p> description : </p>
          <p> ${text} </p>
        </div>
        `
  })
  res.status(200).json(req.body);
}