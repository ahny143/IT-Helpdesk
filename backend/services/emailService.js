const nodemailer = require("nodemailer");

const required = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"];
const missing = required.filter((key) => !process.env[key]);
const port = Number(process.env.SMTP_PORT);
const configured = missing.length === 0 && Number.isInteger(port) && port > 0 && port < 65536;
if (!configured) console.warn(`Email notifications disabled: ${missing.length ? `missing ${missing.join(", ")}` : "SMTP_PORT is invalid"}`);
const transporter = configured ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } }) : null;

const sendNotificationEmail = async ({ to, title, message, ticketCode }) => {
    if (!transporter) return { sent: false, configured: false };
    try {
        await transporter.sendMail({ from: process.env.SMTP_FROM, to, subject: `[IT Helpdesk] ${title}`, text: `${message}${ticketCode ? `\nTicket: ${ticketCode}` : ""}` });
        return { sent: true, configured: true };
    } catch (error) {
        console.error("Notification email failed:", error.message);
        return { sent: false, configured: true };
    }
};
module.exports = { sendNotificationEmail, configured };
