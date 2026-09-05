# 🦌 rusakeren - Game Akreditasi RSAU dr. Esnawan Antariksa

Media edukasi dan gamifikasi interaktif **Akreditasi Rumah Sakit (Standar STARKES Kemenkes RI)** di **RSAU dr. Esnawan Antariksa** berbasis HTML5 Canvas 2D Physics Platformer & Tailwind CSS dengan karakter utama **Kapten RUSA ERIK (Duta Mutu Akreditasi)**.

---

## 🌟 Fitur Utama

### 1. 🗺️ Pemetaan 4 Dunia Pokja Akreditasi
- **MAP 1: POKJA TKRS (Tata Kelola Rumah Sakit)**:
  - Visi, Misi, Falsafah, dan Motto *"Melayani Dengan Ikhlas Tanpa Batas"*.
  - **Hospital Corporate Bylaws (HBL)**: Regulasi tata kelola antara Pemilik (Kasau / Kapuskesau) dengan Kepala RSAU dr. Esnawan Antariksa.
- **MAP 2: POKJA PMKP (Peningkatan Mutu & Keselamatan Pasien)**:
  - 5 Klasifikasi Insiden Keselamatan Pasien (KTD, KNC, KTC, KPC, Sentinel).
  - Alur Pelaporan SI IMUT (`https://imut.rsauesnawan.com/`), batas waktu pelaporan Kemenkes, dan Analisis Akar Masalah (RCA).
- **MAP 3: POKJA SKP (Sasaran Keselamatan Pasien)**:
  - Prosedur 2 parameter identifikasi pasien (Nama Lengkap & Tanggal Lahir).
  - 5 Warna Gelang Pasien (Biru Muda, Pink, Kuning Risiko Jatuh, Merah Alergi, Ungu DNR).
  - 7 Prinsip Benar Pemberian Obat & Site Marking Operasi checklist `(√)`.
- **MAP 4: POKJA MFK (Manajemen Fasilitas & Keselamatan)**:
  - 5 Titik Kumpul Evakuasi Resmi di RSAU dr. Esnawan Antariksa.
  - 8 Kode Warna Darurat (Red, Blue, Green, Orange, Black, Pink, Purple, Grey).

### 2. 🧯 Lab Simulator Proteksi Kebakaran (APAR & Hydrant)
- **Simulasi APAR Metode P.A.S.S.**:
  - `P` (Pull): Cabut pin pengaman tabung APAR.
  - `A` (Aim): Arahkan corong nozel ke dasar api.
  - `S` (Squeeze): Tekan tuas pegangan untuk melepaskan serbuk kimia.
  - `S` (Sweep): Sapukan semprotan merata ke kiri-kanan hingga api padam total.
- **Simulasi Hydrant Indoor & Outdoor**:
  - **Hydrant Indoor (Kotak Gedung / 3-4 Bar)**: Prosedur gelar selang 1.5", pasang nozel Machino, kuda-kuda satu kaki di depan, putar landing valve, dan uji semprotan air.
  - **Hydrant Outdoor (Pilar Halaman / 4.5-7 Bar)**: Kunci hydrant pembuka (*wrench*), selang kanvas 2.5", dan formasi **Two-Man Hold** (Kapten RUSA ERIK + Asisten K3) untuk menahan gaya tolak balik (*recoil*) tekanan tinggi.

### 3. 🏰 Tantangan Remedial: Arena Benteng Takeshi
Jika pemain salah memilih jawaban di terminal kuis, karakter memasuki arena tantangan fisik:
- **Batu Loncat Goyang (*Stepping Stones*)** di atas Kolam Lumpur elastis.
- **Gerbang 3 Pintu Bertingkat**: Cari pintu kertas krem `[KERTAS]` untuk dijebol sekali tabrak, atau serang pintu kayu `[KAYU]` 3 kali dengan kekuatan tanduk rusa!
- **Super Trampolin Emas**: Melontarkan Kapten RUSA ERIK kembali ke koridor rumah sakit dengan kunci edukasi regulasi terbuka.

---

## 🚀 Akses & Deployment di Vercel

Game ini siap di-deploy langsung ke Vercel tanpa perlu konfigurasi rumit (*zero-config static deployment*):

1. Buka [Vercel Dashboard](https://vercel.com/dashboard).
2. Klik **Add New...** ➔ **Project**.
3. Hubungkan repository GitHub: **`freepikelan-cyber/rusakeren`**.
4. Klik **Deploy**.
5. Game dapat langsung diakses melalui domain Vercel Anda (misal: `https://rusakeren.vercel.app/`).

File `vercel.json` telah dikonfigurasi otomatis agar URL root `/` langsung membuka halaman Game Akreditasi di `/akreditasi/index.html`.

---

## 💻 Menjalankan Secara Lokal

```bash
# Clone repository
git clone https://github.com/freepikelan-cyber/rusakeren.git
cd rusakeren

# Jalankan server lokal
python3 -m http.server 8089
```

Buka peramban di: `http://localhost:8089/akreditasi/index.html`

---
*Dikembangkan untuk mendukung sosialisasi dan edukasi Akreditasi Rumah Sakit RSAU dr. Esnawan Antariksa.*
