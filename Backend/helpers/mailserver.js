import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAILJET_APIKEY,
        pass: process.env.MAILJET_SECRET,
    },
});

export {transporter}