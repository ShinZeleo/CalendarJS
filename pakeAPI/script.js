// ====== Data dasar ======
const namaBulan = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];
const batasTahun = { min: 2024, max: 2026 };
const msSepekan = 7 * 24 * 60 * 60 * 1000;

// cache libur di localStorage
const kunciCacheLibur = tahun => `libur_ID_${tahun}`;

// fallback inti jika API gagal
const fallbackLibur = {
  2024: [
    { date: "2024-01-01", localName: "Tahun Baru" },
    { date: "2024-03-11", localName: "Isra Miraj" },
    { date: "2024-03-29", localName: "Wafat Isa Almasih" },
    { date: "2024-04-10", localName: "Idulfitri" },
    { date: "2024-05-01", localName: "Hari Buruh" },
    { date: "2024-05-09", localName: "Kenaikan Isa Almasih" },
    { date: "2024-05-23", localName: "Waisak" },
    { date: "2024-06-01", localName: "Hari Lahir Pancasila" },
    { date: "2024-06-17", localName: "Iduladha" },
    { date: "2024-08-17", localName: "Hari Kemerdekaan" },
    { date: "2024-12-25", localName: "Natal" }
  ],
  2025: [
    { date: "2025-01-01", localName: "Tahun Baru" },
    { date: "2025-01-29", localName: "Isra Miraj" },
    { date: "2025-03-31", localName: "Nyepi" },
    { date: "2025-03-14", localName: "Wafat Isa Almasih" },
    { date: "2025-05-01", localName: "Hari Buruh" },
    { date: "2025-05-29", localName: "Kenaikan Isa Almasih" },
    { date: "2025-06-01", localName: "Hari Lahir Pancasila" },
    { date: "2025-06-07", localName: "Waisak" },
    { date: "2025-08-17", localName: "Hari Kemerdekaan" },
    { date: "2025-12-25", localName: "Natal" }
  ],
  2026: [
    { date: "2026-01-01", localName: "Tahun Baru" },
    { date: "2026-03-20", localName: "Hari Raya Nyepi" },
    { date: "2026-04-03", localName: "Wafat Isa Almasih" },
    { date: "2026-05-01", localName: "Hari Buruh" },
    { date: "2026-05-14", localName: "Kenaikan Isa Almasih" },
    { date: "2026-05-26", localName: "Waisak" },
    { date: "2026-06-01", localName: "Hari Lahir Pancasila" },
    { date: "2026-08-17", localName: "Hari Kemerdekaan" },
    { date: "2026-12-25", localName: "Natal" }
  ]
};

// ====== State aplikasi ======
let tahunAktif = 2025;
let bulanAktif = 3; // April default
let tanggalDipilih = null;
let petaLiburTahun = {}; // { "YYYY-MM-DD": "Nama Libur" }

// ====== Elemen DOM ======
const teksBulanTahun = document.getElementById("teksBulanTahun");
const gridTanggal = document.getElementById("gridTanggal");
const tombolSebelumnya = document.getElementById("tombolSebelumnya");
const tombolBerikutnya = document.getElementById("tombolBerikutnya");
const pilihTahun = document.getElementById("pilihTahun");
const pilihBulan = document.getElementById("pilihBulan");
const tombolTerapkan = document.getElementById("tombolTerapkan");
const judulTanggalAktif = document.getElementById("judulTanggalAktif");
const formAgenda = document.getElementById("formAgenda");
const inputAgenda = document.getElementById("inputAgenda");
const daftarAgenda = document.getElementById("daftarAgenda");
const daftarLiburBulan = document.getElementById("daftarLiburBulan");

// ====== Agenda di localStorage ======
function kunciAgenda(tanggalISO){ return `agenda_${tanggalISO}`; }

function ambilAgenda(tanggalISO){
  const data = localStorage.getItem(kunciAgenda(tanggalISO));
  return data ? JSON.parse(data) : [];
}

function simpanAgenda(tanggalISO, teks){
  const daftar = ambilAgenda(tanggalISO);
  daftar.push({ teks, dibuat: Date.now() });
  localStorage.setItem(kunciAgenda(tanggalISO), JSON.stringify(daftar));
}

function hapusAgenda(tanggalISO, indeks){
  const daftar = ambilAgenda(tanggalISO);
  daftar.splice(indeks, 1);
  localStorage.setItem(kunciAgenda(tanggalISO), JSON.stringify(daftar));
}

// ====== Libur nasional ======
async function muatLiburTahun(tahun){
  // cek cache
  const kunci = kunciCacheLibur(tahun);
  const cache = localStorage.getItem(kunci);
  if (cache){
    const { waktuSimpan, data } = JSON.parse(cache);
    if (Date.now() - waktuSimpan < 4 * msSepekan){
      petaLiburTahun = buatPetaLibur(data);
      return;
    }
  }
  try{
    const url = `https://date.nager.at/api/v3/PublicHolidays/${tahun}/ID`;
    const res = await fetch(url);
    if(!res.ok) throw new Error("gagal fetch");
    const data = await res.json();
    localStorage.setItem(kunci, JSON.stringify({ waktuSimpan: Date.now(), data }));
    petaLiburTahun = buatPetaLibur(data);
  }catch(e){
    const data = fallbackLibur[tahun] || [];
    petaLiburTahun = buatPetaLibur(data);
  }
}

function buatPetaLibur(daftar){
  const peta = {};
  daftar.forEach(x => { peta[x.date] = x.localName || x.name; });
  return peta;
}

// ====== Render kalender ======
function renderKalender(){
  teksBulanTahun.textContent = `${namaBulan[bulanAktif]} ${tahunAktif}`;
  gridTanggal.innerHTML = "";
  daftarLiburBulan.innerHTML = "";

  const awalBulan = new Date(tahunAktif, bulanAktif, 1);
  const hariAwal = awalBulan.getDay(); // Minggu 0
  const jumlahHariBulan = new Date(tahunAktif, bulanAktif + 1, 0).getDate();

  // tanggal dari bulan sebelumnya agar grid rapih
  const jumlahSel = 42; // 6 minggu
  for(let i = 0; i < jumlahSel; i++){
    const offset = i - hariAwal + 1;
    const tanggal = new Date(tahunAktif, bulanAktif, offset);
    const dalamBulan = tanggal.getMonth() === bulanAktif;

    const y = tanggal.getFullYear();
    const m = String(tanggal.getMonth() + 1).padStart(2, "0");
    const d = String(tanggal.getDate()).padStart(2, "0");
    const iso = `${y}-${m}-${d}`;

    const div = document.createElement("button");
    div.className = "kotak-tanggal bg-white shadow text-center relative";

    if(!dalamBulan) div.classList.add("bg-slate-100","text-slate-400");
    if(iso === tanggalDipilih) div.classList.add("ring-2","ring-indigo-300","bg-indigo-50");

    const label = document.createElement("div");
    label.textContent = tanggal.getDate();
    label.className = "font-bold";

    const labelLibur = petaLiburTahun[iso];
    const badge = document.createElement("div");
    if(labelLibur){
      div.classList.add("bg-rose-50");
      badge.className = "mt-1 text-[10px] px-1.5 py-0.5 rounded bg-rose-200";
      badge.textContent = "Libur";
    }

    const adaAgenda = ambilAgenda(iso).length > 0;
    const titik = document.createElement("div");
    if(adaAgenda){
      titik.className = "w-4 h-2 rounded-full bg-emerald-500 absolute left-5 bottom-12";
    }

    div.appendChild(label);
    if(labelLibur) div.appendChild(badge);
    if(adaAgenda) div.appendChild(titik);

    div.addEventListener("click", () => pilihTanggal(iso));
    gridTanggal.appendChild(div);
  }

  // daftar libur bulan aktif
  Object.entries(petaLiburTahun)
    .filter(([k]) => {
      const [yy, mm] = k.split("-").map(Number);
      return yy === tahunAktif && mm === bulanAktif + 1;
    })
    .sort(([a],[b]) => a.localeCompare(b))
    .forEach(([iso, nama]) => {
      const item = document.createElement("div");
      const tgl = Number(iso.slice(8,10));
      item.textContent = `${tgl} ${namaBulan[bulanAktif]} ${nama}`;
      daftarLiburBulan.appendChild(item);
    });
}

function pilihTanggal(iso){
  tanggalDipilih = iso;
  const [y,m,d] = iso.split("-");
  judulTanggalAktif.textContent = `${Number(d)} ${namaBulan[Number(m)-1]} ${y}`;
  inputAgenda.value = "";
  tampilkanAgenda(iso);
  renderKalender();
}

function tampilkanAgenda(iso){
  daftarAgenda.innerHTML = "";
  const daftar = ambilAgenda(iso);
  if(daftar.length === 0){
    daftarAgenda.innerHTML = `<li class="text-slate-500 text-sm">Belum ada agenda</li>`;
    return;
  }
  daftar.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "flex items-start justify-between gap-3 bg-slate-50 rounded-lg px-3 py-2";
    li.innerHTML = `<span>${item.teks}</span>`;
    const hapus = document.createElement("button");
    hapus.textContent = "Hapus";
    hapus.className = "text-red-600 text-sm hover:underline";
    hapus.addEventListener("click", () => {
      hapusAgenda(iso, i);
      tampilkanAgenda(iso);
      renderKalender();
    });
    li.appendChild(hapus);
    daftarAgenda.appendChild(li);
  });
}

// ====== Navigasi ======
async function setBulanTahunBaru(thn, bln){
  if(thn < batasTahun.min || thn > batasTahun.max) return;
  const perluMuatLibur = thn !== tahunAktif;
  tahunAktif = thn;
  bulanAktif = bln;
  pilihTahun.value = String(tahunAktif);
  pilihBulan.value = String(bulanAktif);
  if(perluMuatLibur) await muatLiburTahun(tahunAktif);
  renderKalender();
}

tombolSebelumnya.addEventListener("click", () => {
  let b = bulanAktif - 1;
  let t = tahunAktif;
  if(b < 0){ b = 11; t--; }
  setBulanTahunBaru(t, b);
});

tombolBerikutnya.addEventListener("click", () => {
  let b = bulanAktif + 1;
  let t = tahunAktif;
  if(b > 11){ b = 0; t++; }
  setBulanTahunBaru(t, b);
});

tombolTerapkan.addEventListener("click", () => {
  const t = Number(pilihTahun.value);
  const b = Number(pilihBulan.value);
  setBulanTahunBaru(t, b);
});

// ====== Form agenda ======
formAgenda.addEventListener("submit", e => {
  e.preventDefault();
  if(!tanggalDipilih) return alert("Pilih tanggal dahulu");
  const isi = inputAgenda.value.trim();
  if(!isi) return;
  simpanAgenda(tanggalDipilih, isi);
  inputAgenda.value = "";
  tampilkanAgenda(tanggalDipilih);
  renderKalender();
});

// ====== Inisialisasi ======
(async function mulai(){
  // set default ke bulan sekarang jika dalam rentang, jika tidak gunakan April 2025
  const kini = new Date();
  if(kini.getFullYear() >= batasTahun.min && kini.getFullYear() <= batasTahun.max){
    tahunAktif = kini.getFullYear();
    bulanAktif = kini.getMonth();
  }
  pilihTahun.value = String(tahunAktif);
  pilihBulan.value = String(bulanAktif);
  await muatLiburTahun(tahunAktif);
  renderKalender();
})();
