const nodemailer = require("nodemailer");

module.exports.sendResetPasswordLink = async (email, link) => {
  try {
    var transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    // send email
    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: "Reset Password Link",
      text: "Test",
      html: `<div><a href=${link}>Click here to reset your password.</a></div>`,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent!");
    console.log(error);
    return error;
  }
};