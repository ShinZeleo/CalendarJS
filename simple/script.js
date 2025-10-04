
// Konstanta dasar
const tahunAwal = 2024;
const tahunAkhir = 2026;

const namaBulan = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];
const namaHari = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];

// Contoh libur nasional minimal. Lengkapi sendiri jika perlu
// Format key: "YYYY-MM-DD" nilai: judul libur
const liburNasional = {
  // 2024
  "2024-01-01": "Tahun Baru 2024 Masehi",
  "2024-02-08": "Isra Mikraj Nabi Muhammad SAW",
  "2024-02-10": "Tahun Baru Imlek 2575 Kongzili",
  "2024-03-11": "Hari Suci Nyepi Tahun Baru Saka 1946",
  "2024-03-29": "Wafat Isa Al Masih",
  "2024-03-31": "Hari Paskah",
  "2024-04-10": "Idul Fitri 1445 Hijriah",
  "2024-04-11": "Idul Fitri 1445 Hijriah",
  "2024-05-01": "Hari Buruh Internasional",
  "2024-05-09": "Kenaikan Isa Al Masih",
  "2024-05-23": "Hari Raya Waisak 2568 BE",
  "2024-06-01": "Hari Lahir Pancasila",
  "2024-06-17": "Idul Adha 1445 Hijriah",
  "2024-07-07": "Tahun Baru Islam 1446 Hijriah",
  "2024-08-17": "Hari Kemerdekaan Republik Indonesia",
  "2024-09-16": "Maulid Nabi Muhammad SAW",
  "2024-12-25": "Hari Raya Natal",

  // 2025
  "2025-01-01": "Tahun Baru 2025 Masehi",
  "2025-01-27": "Isra Mikraj Nabi Muhammad SAW",
  "2025-01-29": "Tahun Baru Imlek 2576 Kongzili",
  "2025-03-29": "Hari Suci Nyepi Tahun Baru Saka 1947",
  "2025-03-31": "Idul Fitri 1446 Hijriah",
  "2025-04-01": "Idul Fitri 1446 Hijriah",
  "2025-04-18": "Wafat Yesus Kristus",
  "2025-04-20": "Kebangkitan Yesus Kristus",
  "2025-05-01": "Hari Buruh Internasional",
  "2025-05-12": "Hari Raya Waisak 2569 BE",
  "2025-05-29": "Kenaikan Yesus Kristus",
  "2025-06-01": "Hari Lahir Pancasila",
  "2025-06-06": "Idul Adha 1446 Hijriah",
  "2025-06-27": "1 Muharam Tahun Baru Islam 1447 Hijriah",
  "2025-08-17": "Proklamasi Kemerdekaan",
  "2025-09-05": "Maulid Nabi Muhammad SAW",
  "2025-12-25": "Kelahiran Yesus Kristus",

  // 2026
  "2026-01-01": "Tahun Baru 2026 Masehi",
  "2026-01-16": "Isra Mikraj Nabi Muhammad SAW",
  "2026-02-17": "Tahun Baru Imlek 2577 Kongzili",
  "2026-03-19": "Hari Suci Nyepi Tahun Baru Saka 1948",
  "2026-03-21": "Idul Fitri 1447 Hijriah",
  "2026-03-22": "Idul Fitri 1447 Hijriah",
  "2026-04-03": "Wafat Yesus Kristus",
  "2026-04-05": "Kebangkitan Yesus Kristus",
  "2026-05-01": "Hari Buruh Internasional",
  "2026-05-14": "Kenaikan Yesus Kristus",
  "2026-05-27": "Idul Adha 1447 Hijriah",
  "2026-05-31": "Hari Raya Waisak 2570 BE",
  "2026-06-01": "Hari Lahir Pancasila",
  "2026-06-16": "1 Muharam Tahun Baru Islam 1448 Hijriah",
  "2026-08-17": "Proklamasi Kemerdekaan",
  "2026-08-25": "Maulid Nabi Muhammad SAW",
  "2026-12-25": "Kelahiran Yesus Kristus"
};


// Elemen DOM
const pilihTahun = document.getElementById("pilihTahun");
const pilihBulan = document.getElementById("pilihBulan");
const gridTanggal = document.getElementById("gridTanggal");
const teksBulanTahun = document.getElementById("teksBulanTahun");
const tombolSebelumnya = document.getElementById("tombolSebelumnya");
const tombolBerikutnya = document.getElementById("tombolBerikutnya");
const tombolHariIni = document.getElementById("tombolHariIni");
const tombolTerapkan = document.getElementById("tombolTerapkan");

const judulTanggalAktif = document.getElementById("judulTanggalAktif");
const formAgenda = document.getElementById("formAgenda");
const inputAgenda = document.getElementById("inputAgenda");
const daftarAgenda = document.getElementById("daftarAgenda");
const daftarLiburBulan = document.getElementById("daftarLiburBulan");

// Status
let tahunDipilih;
let bulanDipilih;
let tanggalTerpilih; // Date object untuk panel agenda

// Utilitas tanggal
function jumlahHariDalamBulan(tahun, bulanIdx0){
  return new Date(tahun, bulanIdx0 + 1, 0).getDate();
}
// Ubah getDay JS ke indeks Senin awal pekan
function indeksSeninKeMinggu(jsGetDay){
  // JS. 0 Min 1 Sen 2 Sel 3 Rab 4 Kam 5 Jum 6 Sab
  // Kita ingin. 0 Sen 1 Sel 2 Rab 3 Kam 4 Jum 5 Sab 6 Min
  return (jsGetDay + 6) % 7;
}
function formatTanggalKey(tahun, bulanIdx0, tanggal){
  const m = String(bulanIdx0 + 1).padStart(2, "0");
  const d = String(tanggal).padStart(2, "0");
  return `${tahun}-${m}-${d}`;
}
function adalahHariIni(objDate){
  const t = new Date();
  return objDate.getFullYear() === t.getFullYear() &&
         objDate.getMonth() === t.getMonth() &&
         objDate.getDate() === t.getDate();
}

// Agenda di localStorage
function ambilAgendaSemua(){
  try{
    return JSON.parse(localStorage.getItem("agendaKalender")) || {};
  }catch{
    return {};
  }
}
function simpanAgendaSemua(data){
  localStorage.setItem("agendaKalender", JSON.stringify(data));
}
function ambilAgendaTanggal(keyTanggal){
  const semua = ambilAgendaSemua();
  return semua[keyTanggal] || [];
}
function tambahAgenda(keyTanggal, teks){
  const semua = ambilAgendaSemua();
  if(!semua[keyTanggal]) semua[keyTanggal] = [];
  semua[keyTanggal].push({ teks, dibuat: Date.now() });
  simpanAgendaSemua(semua);
}
function hapusAgenda(keyTanggal, index){
  const semua = ambilAgendaSemua();
  if(!semua[keyTanggal]) return;
  semua[keyTanggal].splice(index, 1);
  if(semua[keyTanggal].length === 0) delete semua[keyTanggal];
  simpanAgendaSemua(semua);
}

// Inisialisasi pilihan tahun
function isiPilihanTahun(){
  pilihTahun.innerHTML = "";
  for(let t = tahunAwal; t <= tahunAkhir; t++){
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    pilihTahun.appendChild(opt);
  }
}

// Render daftar libur bulan berjalan
function renderLiburBulan(){
  daftarLiburBulan.innerHTML = "";
  const daftar = [];
  const jml = jumlahHariDalamBulan(tahunDipilih, bulanDipilih);
  for(let d=1; d<=jml; d++){
    const key = formatTanggalKey(tahunDipilih, bulanDipilih, d);
    if(liburNasional[key]){
      daftar.push({ d, judul: liburNasional[key] });
    }
  }
  if(daftar.length === 0){
    daftarLiburBulan.innerHTML = `<div class="text-slate-500">Tidak ada data libur pada daftar contoh</div>`;
    return;
  }
  daftar.forEach(item=>{
    const baris = document.createElement("div");
    baris.className = "flex items-center justify-between bg-rose-50 border border-rose-100 rounded-lg px-3 py-2";
    baris.innerHTML = `<span class="font-medium text-rose-700">${item.judul}</span><span class="text-slate-600">${item.d} ${namaBulan[bulanDipilih]} ${tahunDipilih}</span>`;
    daftarLiburBulan.appendChild(baris);
  });
}

// Render agenda panel untuk tanggalTerpilih
function renderAgendaPanel(){
  if(!tanggalTerpilih){
    judulTanggalAktif.textContent = "pilih tanggal";
    daftarAgenda.innerHTML = "";
    return;
  }
  const key = formatTanggalKey(tanggalTerpilih.getFullYear(), tanggalTerpilih.getMonth(), tanggalTerpilih.getDate());
  judulTanggalAktif.textContent = `${tanggalTerpilih.getDate()} ${namaBulan[tanggalTerpilih.getMonth()]} ${tanggalTerpilih.getFullYear()}`;

  const items = ambilAgendaTanggal(key);
  daftarAgenda.innerHTML = "";
  if(items.length === 0){
    daftarAgenda.innerHTML = `<li class="text-sm text-slate-500">Belum ada agenda</li>`;
    return;
  }
  items.forEach((it, idx)=>{
    const li = document.createElement("li");
    li.className = "group flex items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2";
    li.innerHTML = `
      <span class="text-slate-800">${it.teks}</span>
      <button class="hapus px-2 py-1 text-xs rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition" data-index="${idx}">Hapus</button>
    `;
    daftarAgenda.appendChild(li);
  });

  // Hapus agenda
  daftarAgenda.querySelectorAll("button.hapus").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const idx = Number(btn.dataset.index);
      hapusAgenda(key, idx);
      renderAgendaPanel();
      // perbarui indikator bulatan hijau pada kotak tanggal
      renderKalender();
    });
  });
}

// Render kalender satu bulan
function renderKalender(){
  gridTanggal.innerHTML = "";

  const jmlHari = jumlahHariDalamBulan(tahunDipilih, bulanDipilih);
  const hariPertamaJS = new Date(tahunDipilih, bulanDipilih, 1).getDay(); // 0 Min, 1 Sen, ...
  const offset = indeksSeninKeMinggu(hariPertamaJS); // 0 jika Sen

  // Tanggal pada bulan sebelumnya yang perlu ditampilkan agar grid penuh
  const bulanSebelum = bulanDipilih === 0 ? 11 : bulanDipilih - 1;
  const tahunSebelum = bulanDipilih === 0 ? tahunDipilih - 1 : tahunDipilih;
  const jmlHariBulanSebelum = jumlahHariDalamBulan(tahunSebelum, bulanSebelum);

  for(let i=0; i<offset; i++){
    const d = jmlHariBulanSebelum - offset + 1 + i;
    const cell = buatSelTanggal(tahunSebelum, bulanSebelum, d, true);
    gridTanggal.appendChild(cell);
  }

  // Tanggal bulan berjalan
  for(let d=1; d<=jmlHari; d++){
    const cell = buatSelTanggal(tahunDipilih, bulanDipilih, d, false);
    gridTanggal.appendChild(cell);
  }

  // Sisa sel untuk melengkapi baris terakhir
  const totalSel = offset + jmlHari;
  const sisanya = (7 - (totalSel % 7)) % 7;
  const bulanSesudah = bulanDipilih === 11 ? 0 : bulanDipilih + 1;
  const tahunSesudah = bulanDipilih === 11 ? tahunDipilih + 1 : tahunDipilih;

  for(let d=1; d<=sisanya; d++){
    const cell = buatSelTanggal(tahunSesudah, bulanSesudah, d, true);
    gridTanggal.appendChild(cell);
  }

  // Judul
  teksBulanTahun.textContent = `${namaBulan[bulanDipilih]} ${tahunDipilih}`;

  // Daftar libur panel kanan
  renderLiburBulan();
}

// Buat satu kotak tanggal
function buatSelTanggal(tahun, bulanIdx0, tanggal, adalahBulanLain){
  const key = formatTanggalKey(tahun, bulanIdx0, tanggal);
  const adaAgenda = ambilAgendaTanggal(key).length > 0;

  const div = document.createElement("div");
  div.className = "kotak-tanggal select-none";

  // Status visual
  if(adalahBulanLain) div.classList.add("tanggal-bulan-lain");
  if(liburNasional[key]) div.classList.add("tanggal-libur");

  const objTanggal = new Date(tahun, bulanIdx0, tanggal);
  if(adalahHariIni(objTanggal)) div.classList.add("tanggal-hari-ini");

  if(tanggalTerpilih &&
     tanggalTerpilih.getFullYear() === tahun &&
     tanggalTerpilih.getMonth() === bulanIdx0 &&
     tanggalTerpilih.getDate() === tanggal){
    div.classList.add("tanggal-aktif");
  }

  // Isi
  div.setAttribute("role", "button");
  div.setAttribute("aria-label", `Tanggal ${tanggal} ${namaBulan[bulanIdx0]} ${tahun}`);
  div.textContent = tanggal;

  if(adaAgenda){
    const dot = document.createElement("span");
    dot.className = "indikator-agenda";
    div.appendChild(dot);
  }

  // Klik memilih tanggal
  div.addEventListener("click", ()=>{
    tanggalTerpilih = new Date(tahun, bulanIdx0, tanggal);
    renderKalender();
    renderAgendaPanel();
  });

  return div;
}

// Navigasi
function keBulanSebelumnya(){
  if(tahunDipilih === tahunAwal && bulanDipilih === 0) return;
  if(bulanDipilih === 0){
    bulanDipilih = 11;
    tahunDipilih -= 1;
  }else{
    bulanDipilih -= 1;
  }
  renderKalender();
}
function keBulanBerikutnya(){
  if(tahunDipilih === tahunAkhir && bulanDipilih === 11) return;
  if(bulanDipilih === 11){
    bulanDipilih = 0;
    tahunDipilih += 1;
  }else{
    bulanDipilih += 1;
  }
  renderKalender();
}
function lompatKe(tahun, bulanIdx0){
  tahunDipilih = Math.min(Math.max(tahun, tahunAwal), tahunAkhir);
  bulanDipilih = Math.min(Math.max(bulanIdx0, 0), 11);
  renderKalender();
}

// Event
tombolSebelumnya.addEventListener("click", keBulanSebelumnya);
tombolBerikutnya.addEventListener("click", keBulanBerikutnya);
tombolHariIni.addEventListener("click", ()=>{
  const t = new Date();
  lompatKe(t.getFullYear(), t.getMonth());
  tanggalTerpilih = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  renderAgendaPanel();
});
tombolTerapkan.addEventListener("click", ()=>{
  lompatKe(Number(pilihTahun.value), Number(pilihBulan.value));
});

// Keyboard
document.addEventListener("keydown", (e)=>{
  if(e.key === "ArrowLeft") keBulanSebelumnya();
  if(e.key === "ArrowRight") keBulanBerikutnya();
  if(e.key === "t" || e.key === "T") tombolHariIni.click();
});

// Form agenda
formAgenda.addEventListener("submit", (e)=>{
  e.preventDefault();
  if(!tanggalTerpilih){
    inputAgenda.focus();
    return;
  }
  const teks = inputAgenda.value.trim();
  if(!teks) return;

  const key = formatTanggalKey(tanggalTerpilih.getFullYear(), tanggalTerpilih.getMonth(), tanggalTerpilih.getDate());
  tambahAgenda(key, teks);
  inputAgenda.value = "";
  renderAgendaPanel();
  renderKalender(); // perbarui indikator hijau
});

// Inisialisasi
function inisialisasi(){
  // Tahun awal sesuai aturan
  isiPilihanTahun();

  // Tanggal default gunakan hari ini jika dalam rentang
  const hariIni = new Date();
  if(hariIni.getFullYear() < tahunAwal || hariIni.getFullYear() > tahunAkhir){
    tahunDipilih = tahunAwal;
    bulanDipilih = 0;
    tanggalTerpilih = null;
  }else{
    tahunDipilih = hariIni.getFullYear();
    bulanDipilih = hariIni.getMonth();
    tanggalTerpilih = new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate());
  }

  pilihTahun.value = String(tahunDipilih);
  pilihBulan.value = String(bulanDipilih);

  renderKalender();
  renderAgendaPanel();
}
inisialisasi();
