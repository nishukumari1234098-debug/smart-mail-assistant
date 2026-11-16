import nodemailer from "nodemailer"

export const sendEmail = async ({ to, subject, message})=>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    })

    const result = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: message
    })

    return result
}