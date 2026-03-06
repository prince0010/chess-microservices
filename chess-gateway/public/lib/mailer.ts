import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false // This is the key fix for self-signed cert issues
    }
});

transporter.verify((error) => {
    if (error) {
        console.error('❌ SMTP Connection Error:', error);
        console.error('   Check your network/VPN/SSL settings');
    } else {
        console.log('✅ SMTP Server is ready to send emails');
    }
});