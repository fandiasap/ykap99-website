"use strict";

const bingkai = document.getElementById("formulir");
const tautanSurvei = document.getElementById("tab-survei");
const pratinjau = window.location.protocol === "file:" || new URLSearchParams(location.search).get("pratinjau") === "1";
const sumber = pratinjau ? "Kuesioner.html" : bingkai.dataset.url;
bingkai.src = sumber;
tautanSurvei.href = sumber;

const panggung = document.getElementById("panggung");
const pilih = document.getElementById("pilih-logo");
const karya = document.getElementById("karya");
function tampilkanLogo(nomor) {
  const total = pilih.options.length;
  const indeks = (nomor + total) % total;
  const item = pilih.options[indeks];
  pilih.selectedIndex = indeks;
  karya.src = item.dataset.src;
  karya.alt = item.dataset.alt;
  document.getElementById("deskripsi-logo").textContent = "Logo " + (indeks + 1) + " dari " + total + ". " + item.dataset.alt;
}
document.getElementById("kontrol-logo").hidden = false;
pilih.onchange = () => tampilkanLogo(pilih.selectedIndex);
document.getElementById("sebelum").onclick = () => tampilkanLogo(pilih.selectedIndex - 1);
document.getElementById("sesudah").onclick = () => tampilkanLogo(pilih.selectedIndex + 1);
panggung.onkeydown = event => {
  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    event.preventDefault();
    tampilkanLogo(pilih.selectedIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
};
let sentuhan;
panggung.addEventListener("touchstart", event => {
  sentuhan = event.touches.length === 1 ? [event.touches[0].clientX, event.touches[0].clientY] : null;
}, {passive: true});
panggung.addEventListener("touchcancel", () => { sentuhan = null; }, {passive: true});
panggung.addEventListener("touchend", event => {
  if (!sentuhan || event.touches.length) { sentuhan = null; return; }
  const dx = event.changedTouches[0].clientX - sentuhan[0];
  const dy = event.changedTouches[0].clientY - sentuhan[1];
  sentuhan = null;
  if (Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) tampilkanLogo(pilih.selectedIndex + (dx < 0 ? 1 : -1));
}, {passive: true});

const album = Array.from(document.querySelectorAll(".foto-mini a"));
const dialog = document.getElementById("lihat-foto");
let fotoAktif = 0;
function tampilkanFoto(nomor) {
  fotoAktif = (nomor + album.length) % album.length;
  const tautan = album[fotoAktif];
  const gambar = document.getElementById("foto-besar");
  gambar.src = tautan.href;
  gambar.alt = tautan.querySelector("img").alt;
  document.getElementById("nomor-foto").textContent = "Foto " + (fotoAktif + 1) + " dari " + album.length;
  document.getElementById("nama-foto").textContent = tautan.closest("figure").querySelector("figcaption").textContent;
}
if (typeof dialog.showModal === "function") {
  album.forEach((tautan, index) => {
    tautan.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      tampilkanFoto(index);
      dialog.showModal();
    });
  });
  document.getElementById("tutup-foto").onclick = () => dialog.close();
  document.getElementById("foto-mundur").onclick = () => tampilkanFoto(fotoAktif - 1);
  document.getElementById("foto-maju").onclick = () => tampilkanFoto(fotoAktif + 1);
  dialog.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      tampilkanFoto(fotoAktif + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
}
document.querySelector(".nav-ringkas nav").addEventListener("click", event => {
  if (event.target.closest("a")) document.querySelector(".nav-ringkas").open = false;
});
if (Date.now() >= Date.parse("2026-12-04T00:00:00+07:00")) {
  document.getElementById("kirim-karya").hidden = true;
  document.getElementById("status-karya").hidden = false;
}
