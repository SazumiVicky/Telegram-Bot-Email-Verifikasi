const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const TelegramBot = require('node-telegram-bot-api');

const emailRegex = /\S+@\S+\.\S+/;
const codeRegex = /^[0-9]{6}$/;


//This is what must be changed
const token = 'YOUR_BOT_TOKENS';
const email = 'YOUR_GMAIL';
const password = 'YOUR_PASSWORD_GMAIL';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password
  }
});

let state = 'start';
let verifiedEmails = {};

const ruserFile = path.join(__dirname, 'ruser.json');

try {
  const rawData = fs.readFileSync(ruserFile);
  verifiedEmails = JSON.parse(rawData);
} catch (err) {
  if (err.code === 'ENOENT') {
    fs.writeFileSync(ruserFile, JSON.stringify({}));
  } else {
    console.error(err);
  }
}

if (Object.keys(verifiedEmails).length === 0) {
  console.log('ruser.json is empty');
}

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.trim();

  const verifiedEmail = Object.keys(verifiedEmails).find(email => verifiedEmails[email].chatId === chatId);
  if (verifiedEmail) {
    bot.sendMessage(chatId, 'Anda sudah terverifikasi. Terima kasih!');
    return;
  }

  switch (state) {
    case 'start':
      if (!verifiedEmails) {
        verifiedEmails = {};
      }
      bot.sendMessage(chatId, 'Silakan verifikasi email terlebih dahulu dengan menempelkan alamat email:');
      state = 'email';
      break;
    case 'email':
      if (emailRegex.test(message)) {
        if (verifiedEmails[message]) {
          bot.sendMessage(chatId, 'Maaf, email yang Anda masukkan telah digunakan. Mohon gunakan email lain.');
          state = 'start';
          break;
        }
        const code = Math.floor(Math.random() * 900000) + 100000;
        ejs.renderFile(path.join(__dirname, '/views/template.ejs'), { code }, (err, html) => {
          if (err) {
            console.log(err);
          } else {
            const mailOptions = {
              from: email,
              to: message,
              subject: 'Ayaka confirmation ><',
              html: html
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            verifiedEmails[message] = { code: code, chatId: chatId };
            fs.writeFileSync(ruserFile, JSON.stringify(verifiedEmails));
            bot.sendMessage(chatId, `Kode verifikasi telah dikirim ke ${message}. Silakan masukkan kode verifikasi:`);
            state = 'code';
          }
        });
      } else {
        bot.sendMessage(chatId, 'Alamat email tidak valid. Silakan coba lagi.');
      }
      break;
    case 'code':
      const verifiedEmail = Object.keys(verifiedEmails).find(email => verifiedEmails[email].chatId === chatId);
      if (!verifiedEmail) {
        bot.sendMessage(chatId, 'Anda belum memasukkan email. Silakan masukkan email terlebih dahulu.');
        state = 'start';
        break;
      }
      if (codeRegex.test(message) && verifiedEmails[verifiedEmail].code === Number(message)) {
        bot.sendMessage(chatId, 'Email Anda berhasil diverifikasi. Terima kasih!');
        state = 'start';
      } else {
        bot.sendMessage(chatId, 'Kode konfirmasi tidak valid. Silakan coba lagi.');
      }
      break;
    default:
      bot.sendMessage(chatId, 'Terjadi kesalahan. Silakan ulangi lagi.');
      state = 'start';
      break;
  }
});