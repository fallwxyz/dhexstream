# Panduan Setup Windows 🪟

Panduan ini akan membantu Anda melakukan instalasi dan konfigurasi proyek **DHEXStream** di sistem operasi Windows menggunakan XAMPP dan Node.js.

## 📋 Prasyarat (Prerequisites)

Sebelum memulai, pastikan Anda telah memiliki software berikut:
- **Node.js**: Versi LTS terbaru (minimal v18.x)
- **XAMPP**: Versi terbaru (dengan PHP 8.x)
- **Web Browser**: Google Chrome, Edge, atau Firefox
- **Text Editor**: VS Code (sangat disarankan)

## 🔗 Link Download Tools

1. **Node.js**: [https://nodejs.org/](https://nodejs.org/) (Pilih versi **LTS**)
2. **XAMPP**: [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
3. **Git for Windows**: [https://gitforwindows.org/](https://gitforwindows.org/) (Untuk clone project)

---

## 🚀 Langkah-langkah Instalasi

### 1. Instalasi Node.js & XAMPP
- Jalankan installer Node.js yang sudah didownload, klik **Next** sampai selesai.
- Jalankan installer XAMPP. Saat pemilihan komponen, pastikan **Apache** dan **MySQL** tercentang.
- Selesaikan instalasi XAMPP (biasanya di `C:\xampp`).

### 2. Persiapan Folder Project
Agar script PHP berjalan, project harus diletakkan di dalam folder `htdocs` XAMPP.
- Buka Terminal (PowerShell atau CMD).
- Masuk ke direktori htdocs:
  ```bash
  cd C:\xampp\htdocs
  ```
- Clone project ini:
  ```bash
  git clone https://github.com/fallwxyz/dhexstream.git
  ```
- Masuk ke folder project:
  ```bash
  cd dhexstream
  ```

### 3. Install Dependencies
Jalankan perintah berikut di terminal untuk menginstall semua library yang dibutuhkan:
```bash
npm install
```

### 4. Konfigurasi Environment (.env)
- Cari file `.env.example` di root folder.
- Copy dan rename menjadi `.env`.
- Sesuaikan konfigurasi database jika diperlukan (default XAMPP biasanya root tanpa password).

---

## 🛠️ Menjalankan Aplikasi

### 1. Jalankan XAMPP Control Panel
- Buka **XAMPP Control Panel**.
- Klik tombol **Start** pada modul **Apache** dan **MySQL**.
- Pastikan indikator berubah menjadi warna hijau ✅.

### 2. Jalankan Mode Development
Buka terminal di dalam folder project, lalu jalankan:
```bash
npm run dev
```
Terminal akan memberikan URL (biasanya `http://localhost:5173`).

### 3. Akses di Browser
Buka browser Anda dan akses URL berikut:
- **Frontend (Vite)**: `http://localhost:5173`
- **Backend/API (XAMPP)**: `http://localhost/dhexstream/`

---

## ❓ Troubleshooting (Masalah Umum)

- **Port 80 Error di XAMPP**: Biasanya karena digunakan oleh Skype atau services lain. Ubah port di `httpd.conf` atau matikan aplikasi yang bentrok.
- **npm command not found**: Pastikan Anda sudah restart terminal setelah install Node.js.
- **Database Connection Error**: Pastikan MySQL di XAMPP sudah status **Running**.
- **CORS Error**: Pastikan akses API melalui domain localhost yang sama.

> [!TIP]
> Gunakan VS Code terminal agar lebih mudah berpindah antar command tanpa menutup folder project.
