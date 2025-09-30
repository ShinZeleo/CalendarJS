// Data dasar
const namaBulan = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

const tahunAwal = 2024;
const tahunAkhir = 2026;

// Elemen DOM
const pilihTahun = document.getElementById("pilihTahun");
const pilihBulan = document.getElementById("pilihBulan");
const kontainerTanggal = document.getElementById("kontainerTanggal");
const teksJudulBulan = document.getElementById("teksJudulBulan");
const tombolSebelumnya = document.getElementById("tombolSebelumnya");
const tombolBerikutnya = document.getElementById("tombolBerikutnya");

// Status kalender yang sedang ditampilkan
let tahunDipilih;
let bulanDipilih;

// Inisialisasi tahun dan nilai awal
function isiPilihanTahun() {
  for (let t = tahunAwal; t <= tahunAkhir; t++) {
    const opsi = document.createElement("option");
    opsi.value = t;
    opsi.textContent = t;
    pilihTahun.appendChild(opsi);
  }
}

// Ambil bulan dan tahun default. Jika di luar rentang, gunakan 2024 Januari
(function tentukanTanggalAwal() {
  const hariIni = new Date();
  const t = hariIni.getFullYear();
  const b = hariIni.getMonth();

  if (t < tahunAwal || t > tahunAkhir) {
    tahunDipilih = tahunAwal;
    bulanDipilih = 0;
  } else {
    tahunDipilih = t;
    bulanDipilih = b;
  }
})();

function perbaruiJudul() {
  teksJudulBulan.textContent = `${namaBulan[bulanDipilih]} ${tahunDipilih}`;
  pilihBulan.value = String(bulanDipilih);
  pilihTahun.value = String(tahunDipilih);
}

// Hitung jumlah hari pada bulan
function jumlahHariDalamBulan(tahun, bulanIndex0) {
  // Trik. Hari ke 0 pada bulan berikutnya berarti hari terakhir pada bulan sekarang
  return new Date(tahun, bulanIndex0 + 1, 0).getDate();
}

// Konversi getDay() bawaan ke indeks Senin sebagai 0
// getDay() JS. 0 Minggu 1 Senin 2 Selasa 3 Rabu 4 Kamis 5 Jumat 6 Sabtu
// Kita ingin. 0 Senin 1 Selasa 2 Rabu 3 Kamis 4 Jumat 5 Sabtu 6 Minggu
function indeksSeninKeMinggu(getDayJS) {
  return (getDayJS + 6) % 7;
}

// Render kotak tanggal untuk satu bulan
function renderKalender() {
  kontainerTanggal.innerHTML = "";

  const jumlahHari = jumlahHariDalamBulan(tahunDipilih, bulanDipilih);
  const hariPertamaJS = new Date(tahunDipilih, bulanDipilih, 1).getDay();
  const offsetAwal = indeksSeninKeMinggu(hariPertamaJS); 

  // Tambah sel kosong sebelum tanggal 1
  for (let i = 0; i < offsetAwal; i++) {
    const selKosong = document.createElement("div");
    selKosong.className = "aspect-square rounded-xl border border-transparent";
    kontainerTanggal.appendChild(selKosong);
  }

  // Tambah sel tanggal 1 sampai akhir
  for (let d = 1; d <= jumlahHari; d++) {
    const tanggalSekarang = new Date(tahunDipilih, bulanDipilih, d);
    const adalahHariIni = apakahHariIni(tanggalSekarang);

    const tombolTanggal = document.createElement("button");
    tombolTanggal.type = "button";
    tombolTanggal.className =
      "aspect-square w-full rounded-xl border text-sm sm:text-base " +
      "hover:bg-gray-100 active:scale-95 transition " +
      (adalahHariIni
        ? "border-indigo-500 ring-2 ring-indigo-200 font-semibold"
        : "border-gray-200");

    tombolTanggal.setAttribute("aria-label", `Tanggal ${d} ${namaBulan[bulanDipilih]} ${tahunDipilih}`);
    tombolTanggal.textContent = d;

    kontainerTanggal.appendChild(tombolTanggal);
  }

  perbaruiJudul();
}

// Cek apakah sebuah tanggal adalah hari ini
function apakahHariIni(tanggalObj) {
  const t = new Date();
  return (
    tanggalObj.getFullYear() === t.getFullYear() &&
    tanggalObj.getMonth() === t.getMonth() &&
    tanggalObj.getDate() === t.getDate()
  );
}

// Navigasi bulan
function keBulanSebelumnya() {
  if (tahunDipilih === tahunAwal && bulanDipilih === 0) return;
  if (bulanDipilih === 0) {
    bulanDipilih = 11;
    tahunDipilih -= 1;
  } else {
    bulanDipilih -= 1;
  }
  renderKalender();
}

function keBulanBerikutnya() {
  if (tahunDipilih === tahunAkhir && bulanDipilih === 11) return;
  if (bulanDipilih === 11) {
    bulanDipilih = 0;
    tahunDipilih += 1;
  } else {
    bulanDipilih += 1;
  }
  renderKalender();
}

// Event listener
tombolSebelumnya.addEventListener("click", keBulanSebelumnya);
tombolBerikutnya.addEventListener("click", keBulanBerikutnya);

pilihBulan.addEventListener("change", () => {
  bulanDipilih = Number(pilihBulan.value);
  renderKalender();
});

pilihTahun.addEventListener("change", () => {
  tahunDipilih = Number(pilihTahun.value);
  renderKalender();
});

// Navigasi keyboard. Panah kiri dan kanan
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") keBulanSebelumnya();
  if (e.key === "ArrowRight") keBulanBerikutnya();
});

// Jalankan
isiPilihanTahun();
perbaruiJudul();
renderKalender();
