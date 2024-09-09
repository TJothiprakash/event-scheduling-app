// mailer.js
const nodemailer = require("nodemailer");

// Create a transporter
const transporter = nodemailer.createTransport({
  host: "", // SMTP server for Gmail
  port: 587, // Commonly used port for TLS
  secure: false, // Set to true if using port 465
  auth: {
    user: "", // Your Gmail address
    pass: "", // Your email password or application-specific password
  },
});


// Function to send email
const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: "", // Sender address
    to, // List of receivers
    subject, // Subject line
    text, // Plain text body
    html, // HTML body
  };

  return transporter
    .sendMail(mailOptions)
    .then((info) => {
      console.log("Email sent: " + info.response);
      return info;
    })
    .catch((error) => {
      console.error("Error sending email: ", error);
      throw error; // Rethrow the error for further handling if needed
    });
};

module.exports = { sendEmail };
