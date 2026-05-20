const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });

    // Detect Gmail immediate rejection
    if (info.rejected && info.rejected.length > 0) {
      console.error("Email rejected:", info.rejected);
      throw new Error("Email address does not exist or cannot receive mail");
    }

    return info;

  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw new Error("Email could not be sent. " + error.message);
  }
};

module.exports = sendEmail;
