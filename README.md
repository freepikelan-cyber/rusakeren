# 🦌 rusakeren - Game Akreditasi RSAU dr. Esnawan Antariksa

Media edukasi dan gamifikasi interaktif **Akreditasi Rumah Sakit (Standar STARKES Kemenkes RI)** di **RSAU dr. Esnawan Antariksa** berbasis HTML5 Canvas 2D Physics Platformer & Tailwind CSS dengan karakter utama **Kapten RUSA ERIK (Duta Mutu Akreditasi)**.

---

## 🌟 Fitur Utama

### 1. 🎮 Sistem Permainan Multi-Genre per MAP (Karakter Kapten Erik Tetap Dipertahankan)
Setiap MAP memiliki genre mini game unik yang disesuaikan dengan tema Pokja, sambil mempertahankan 100% identitas karakter **Kapten RUSA ERIK**:
- **MAP 1: POKJA TKRS ➔ FLAPPY GLIDER DIRGANTARA**:
  - Kapten Erik mengenakan sayap glider titanium-cyan, kacamata goggle penerbang, syal dirgantara berkibar, dan *dual micro jet thrusters*.
  - Mekanik terbang ala *Flappy Bird*: tap layar atau tekan Spasi untuk mengepak sayap melewati 9 pilar regulasi HBL/Corporate Bylaws dan menerobos 9 **Radar Accreditation Gateways**.
- **MAP 2: POKJA PMKP ➔ MOTO PATROL RUNNER**:
  - Kapten Erik mengendarai **Motor Patroli Medis RSAU** lengkap dengan helm keselamatan berslot tanduk emas, lampu sorot depan, knalpot berasap, dan sirine darurat P3K.
  - Mekanik *high-speed obstacle runner*: melompati genangan tumpahan B3/IKP (`☣`), kerucut lalu lintas K3, dan barikade proyek K3, serta memasuki 8 **Drive-Thru Checkpoint Gantries SI IMUT**.
- **MAP 3 - 16: POKJA LAINNYA ➔ CLASSIC 2D PLATFORMER**:
  - Telusur koridor dan ruangan rumah sakit, tangga medis, jembatan skybridge, dan tantangan Benteng Takeshi saat remedial.

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
