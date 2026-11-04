/*
 * Blur Chat — hanya ISI, bukan nama.
 *
 * JavaScript di sini kecil perannya: hanya menyalakan/mematikan kelas
 * di <html> dan menyimpan status. Semua pembluran dikerjakan blur.css.
 *
 * Kenapa CSS, bukan JS yang menempel gaya ke elemen:
 * WhatsApp dan Telegram merender ulang daftar chat terus-menerus.
 * Selektor CSS ikut ke node baru otomatis; gaya inline tidak.
 */

(() => {
  'use strict';

  const AKAR = document.documentElement;
  const KUNCI = 'bc_aktif';

  let aktif = false;

  /* ---------------------------------------------------------------
   * Halaman login / QR: jangan dib blur sama sekali
   * ------------------------------------------------------------- */
  function sedangLogin() {
    if (document.querySelector('canvas')) return true;          // QR WhatsApp
    if (document.querySelector('[data-testid="qrcode"]')) return true;
    if (document.querySelector('.auth-pages, .login-page, .page-sign')) return true;
    return false;
  }

  function perbarui() {
    if (!aktif) {
      AKAR.classList.remove('bc-on', 'bc-login');
      return;
    }
    AKAR.classList.add('bc-on');
    AKAR.classList.toggle('bc-login', sedangLogin());
  }

  function setAktif(nilai) {
    aktif = !!nilai;
    perbarui();
  }

  /* ---------------------------------------------------------------
   * Pesan dari popup
   * ------------------------------------------------------------- */
  chrome.runtime.onMessage.addListener((pesan, _pengirim, balas) => {
    if (pesan?.tipe === 'tanya') {
      balas({ aktif });
      return true;
    }
    if (pesan?.tipe === 'set') {
      setAktif(pesan.aktif);
      chrome.storage.local.set({ [KUNCI]: aktif });
      balas({ aktif });
      return true;
    }
    return false;
  });

  /* ---------------------------------------------------------------
   * Pantau perubahan halaman: login -> masuk, atau sebaliknya
   * ------------------------------------------------------------- */
  const pengamat = new MutationObserver(() => {
    if (!aktif) return;
    const loginSekarang = sedangLogin();
    if (loginSekarang !== AKAR.classList.contains('bc-login')) {
      AKAR.classList.toggle('bc-login', loginSekarang);
    }
  });

  /* ---------------------------------------------------------------
   * Mulai
   * ------------------------------------------------------------- */
  chrome.storage.local.get([KUNCI], (hasil) => {
    setAktif(hasil[KUNCI]);
  });

  if (document.body) {
    pengamat.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      pengamat.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
