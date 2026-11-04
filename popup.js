const sakelar = document.getElementById('sakelar');
const status = document.getElementById('status');

function tulisStatus(aktif) {
  status.innerHTML = aktif
    ? 'Blur <b>menyala</b>. Seluruh isi chat kabur; arahkan kursor ke area chat untuk melihat.'
    : 'Blur <b>mati</b>. Halaman tampil normal.';
}

async function tabAktif() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function halamanCocok(url) {
  if (!url) return false;
  return url.startsWith('https://web.whatsapp.com') || url.startsWith('https://web.telegram.org');
}

(async () => {
  const tab = await tabAktif();

  if (!halamanCocok(tab?.url)) {
    sakelar.disabled = true;
    status.innerHTML = 'Buka <b>web.whatsapp.com</b> atau <b>web.telegram.org</b> dulu.';
    return;
  }

  chrome.tabs.sendMessage(tab.id, { tipe: 'tanya' }, (jawab) => {
    if (chrome.runtime.lastError) {
      status.textContent = 'Muat ulang halamannya (F5) lalu coba lagi.';
      return;
    }
    sakelar.checked = !!jawab?.aktif;
    tulisStatus(!!jawab?.aktif);
  });

  sakelar.addEventListener('change', () => {
    chrome.tabs.sendMessage(tab.id, { tipe: 'set', aktif: sakelar.checked }, (jawab) => {
      if (chrome.runtime.lastError) {
        status.textContent = 'Gagal. Muat ulang halaman lalu coba lagi.';
        return;
      }
      tulisStatus(!!jawab?.aktif);
    });
  });
})();
