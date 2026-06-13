require('dotenv').config({ path: '.env' });
const nodemailer = require('nodemailer');

console.log("User:", process.env.GMAIL_USER);
console.log("Pass:", process.env.GMAIL_PASS ? "Set" : "Not Set");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: `"Test Admissions" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // sending to oneself
      subject: "Test Email via Nodemailer",
      html: "<p>If you get this, Nodemailer is working perfectly!</p>",
    });
    console.log("Email sent! Message ID:", info.messageId);
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

testEmail();
