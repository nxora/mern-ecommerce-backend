import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendMail(to, subject, text) {

    try {
        const { error } = await resend.emails.send({
            from: "Parfait Bliss <onboarding@resend.dev>",
            to,
            subject,
            text,
        })
        if (error) {
            console.error('Resond API error: ', error);
            throw new Error("Failed to send Email");
        }
        console.log("Verification sent to ", to);
    } catch (err) {
        console.error('Email sending failed:', err);
        throw err;
    }

}
module.exports = sendMail