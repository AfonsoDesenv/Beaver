var nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'teste@gmail.com',
    pass: 'testeTCC1234'
  }
})

export const SendMail = (email_config) => {

  var config = {
    from: 'Beaver <teste@gmail.com>',
    to: `${email_config.name_to} <${email_config.email_to}>`,
    subject: email_config.subject,
    html: email_config.text
  }

  transport.sendMail(config, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado ' + info.response);
    }
  });
}
