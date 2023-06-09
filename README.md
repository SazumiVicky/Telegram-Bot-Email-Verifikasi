# Telegram Bot Email Verifikasi
<h4>Untuk menjalankan kode nya ada beberapa package yang harus kamu install.</h4>

<p>1. Pastikan Anda sudah menginstal Node.js dan npm. Anda dapat mengunduh dan menginstalnya dari situs resmi Node.js: https://nodejs.org/</p>

<p>2. Buka terminal atau command prompt Anda dan navigasikan ke direktori di mana file kode Anda berada.</p>

<p>3. Ketik perintah berikut untuk menginstal modul fs, path, nodemailer, ejs, dan node-telegram-bot-api:</p>

```
npm install fs path nodemailer ejs node-telegram-bot-api
```
</p>4. Tunggu hingga proses instalasi selesai. Setelah selesai, Anda dapat menjalankan kode Anda dengan menggunakan Node.js.</p>

<p>Dengan mengikuti langkah-langkah di atas, Anda harus dapat menginstal semua modul yang diperlukan untuk menjalankan kode tersebut. Jika ada masalah atau kesulitan, pastikan untuk memeriksa pesan kesalahan yang muncul di terminal atau command prompt Anda.</p>

##

<p>Pastikan Anda telah mengubah kode berikut dengan Token botAnda, email yang ingin Anda gunakan sebagai pengirim kode verifikasi dan password email Anda, Saya sarankan untuk menggunakan layanan Google Email saja.</p>

```
//This is what must be changed
const token = 'YOUR_BOT_TOKENS';
const email = 'YOUR_GMAIL';
const password = 'YOUR_PASSWORD_GMAIL';
```

##

<p>Untuk mengganti tampilan template verifikasi email, kamu cukup mengubah  <code>template.ejs</code> pada direktori berikut:</p>

```
Telegram-Bot-Email-Verifikasi
-index.js
- views
  - template.ejs
```

##

<p>Pada kode berikut, jika file <code>ruser.json</code> tidak ditemukan, maka bot akan secara otomatis membuat file <ruser.json>, file tersebut dimuat oleh bot agar mencegah seseorang menggunakan email yang sama untuk melakukan verifikasi, dan menyimpan data kamu agar pada bot dimulai ulang, data kamu akan tetap aman, dan tidak perlu melakukan verifikasi lagi.</p>
  
```
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
```
