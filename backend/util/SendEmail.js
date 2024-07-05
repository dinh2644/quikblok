const nodemailer = require("nodemailer");

module.exports.sendEmail = async (email, link) => {
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
      subject: "Account Verification",
      text: "Welcome",
      html: `<div><a href=${link}>Click here to activate your account.</a></div>`,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
