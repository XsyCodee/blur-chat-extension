# Blur Chat — Ekstensi Chrome/Edge

Blur seluruh isi WhatsApp Web dan Telegram Web. Blur hilang saat kursor
diarahkan ke area chat.

## Pasang

1. Buka `chrome://extensions` (Chrome) atau `edge://extensions` (Edge)
2. Nyalakan **Developer mode** (kanan atas)
3. Klik **Load unpacked**
4. Pilih folder ini: `/root/projects/blur-chat-extension`

Setelah terpasang, buka `https://web.whatsapp.com` atau `https://web.telegram.org`.
Halaman langsung kabur. Arahkan kursor ke area chat untuk melihat.

## Pakai

```
Klik ikon ekstensi  ->  nyalakan sakelar
Kursor keluar dari area chat  ->  blur kembali
Kursor masuk area chat        ->  blur hilang
```

Status tersimpan per-browser, jadi tetap menyala setelah halaman ditutup.

## Cara kerja

Bukan menutup elemen satu per satu. Satu kelas `.bc-on` dipasang di `<html>`,
lalu CSS memberi `filter: blur(14px)` pada seluruh halaman.

```
Alasan: WhatsApp dan Telegram merender ulang isi terus-menerus.
Kalau gaya ditempel ke tiap elemen, chat yang baru masuk akan lolos.
Dengan filter di <html>, apa pun yang dirender otomatis ikut terblur.
```

## Berkas

```
manifest.json    Manifest V3
blur.css         aturan blur + transisi
blur.js          pendeteksi kursor, penyimpanan status
popup.html       panel sakelar
popup.js         logika sakelar
icon16/48/128    ikon
```

## Batasan yang perlu diketahui

```
1  Ini menutupi layar, bukan mengamankan data.
   Kalau seseorang membuka DevTools atau mematikan ekstensi,
   isi chat tetap bisa dibaca. Untuk privasi dari orang lewat di
   belakang kamu, ini cukup.

2  Tidak berlaku di aplikasi desktop WhatsApp/Telegram.
   Hanya versi web di browser.

3  Di Telegram Web, area chat dideteksi lewat [role="main"].
   Kalau Telegram mengubah struktur, blur mungkin tidak hilang
   saat kursor masuk. Perbaiki di fungsi diDalamChat().

4  Screenshot layar saat blur masih akan tampak blur —
   blur diterapkan di compositor browser, bukan overlay gambar.
```

## Kalau mau ubah tingkat blur

Edit `blur.css`:

```css
html.bc-on { filter: blur(14px) !important; }
```

Ganti `14px` sesuai selera. Semakin besar, semakin tidak terbaca.
