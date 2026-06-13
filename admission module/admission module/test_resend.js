const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_KVCVBSzX_9CqRvAkFMft2y5szBc83BxZ2');

async function testEmail() {
  try {
    console.log("Using API Key:", (process.env.RESEND_API_KEY || 're_KVCVBSzX_9CqRvAkFMft2y5szBc83BxZ2').substring(0, 5) + '...');
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: 'Hello World',
      html: '<p>It works!</p>',
    });

    console.log("Response:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testEmail();
