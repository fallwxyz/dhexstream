# 🛠️ Panduan Maintenance & Update DHEXStream

> **Cara update, backup, dan maintenance rutin untuk aplikasi DHEXStream di Shared Hosting**

---

## 📋 Daftar Isi

1. [Cara Update Aplikasi](#-cara-update-aplikasi)
2. [Cara Backup](#-cara-backup)
3. [Manajemen Cache & File Sampah](#-manajemen-cache--file-sampah)
4. [Reset Data](#-reset-data)
5. [Security Checklist](#-security-checklist)

---

## 🔄 Cara Update Aplikasi

Kalau ada versi baru dari DHEXStream (misal dari repo GitHub), ikuti langkah ini untuk update di hosting tanpa menghilangkan data kamu.

### Step 1: Backup Dulu!
Selalu backup file `api/data/` dan `.dhex` sebelum update.
1. Masuk ke File Manager
2. Compress folder `api/data/` jadi `data-backup.zip`
3. Download file `.dhex` ke komputer

### Step 2: Build Versi Baru
Di komputer lokal kamu:

```bash
# Pull update terbaru
git pull origin main

# Install dependencies baru (kalau ada)
npm install

# Build ulang
npm run build
```

### Step 3: Upload File Baru

**Upload & Replace folder/file ini:**
- 📁 `dist/` (Hapus yang lama di hosting, upload yang baru)
- 📁 `api/core/` (Hapus yang lama di hosting, upload yang baru)
- 📄 `dhex.php` (Kalau ada perubahan)

**JANGAN REPLACE folder ini:**
- ❌ `api/data/` (Ini isinya data anime, history, bookmark user kamu!)
- ❌ `.dhex` (Ini konfigurasi website kamu)
- ❌ `assets/image/` (Kecuali kalau emang mau ganti gambar)

> [!CAUTION]
> Hati-hati jangan sampai menimpa folder `api/data/`. Kalau ketimpa, data user hilang!

---

## 💾 Cara Backup

Lakukan backup rutin (minggu/bulan) biar aman kalau ada apa-apa.

### Apa yang Harus di-Backup?

1. **Folder `api/data/`**
   - Isinya: database JSON anime, history user, bookmark.
   - Cara: Compress folder ini jadi ZIP, download ke laptop.

2. **File `.dhex`**
   - Isinya: Config environment.
   - Cara: Download file ini.

3. **Folder `assets/image/`**
   - Isinya: Gambar-gambar custom kamu.
   - Cara: Compress & download.

### Otomatisasi Backup (Advanced)
Kalau hosting kamu support **Cron Job**, kamu bisa bikin script PHP sederhana buat zip data & kirim ke email (tapi manual download via File Manager udah cukup banget).

---

## 🧹 Manajemen Cache & File Sampah

DHEXStream pakai sistem caching file JSON biar cepat. Kadang cache ini perlu dibersihkan kalau ada data yang gak update.

### Lokasi Cache
Folder cache ada di: `api/core/cache/` (kalau diaktifkan)

### Cara Bersihkan Cache
1. Buka File Manager
2. Masuk ke `api/core/cache/`
3. **Select All** file di dalamnya
4. **Delete** (Skip Trash biar langsung bersih)

> [!TIP]
> Bersihkan cache kalau:
> - Abis update data anime tapi di web masih data lama
> - Abis ganti struktur API
> - Space hosting penuh

---

## ⚠️ Reset Data

Kalau mau mulai dari nol lagi (Hati-hati, data hilang permanen!):

1. **Reset History User**
   - Hapus file: `api/data/history.json`
   - Hapus file: `api/data/bookmark.json`

2. **Reset Data Anime**
   - Hapus file: `api/data/anime.json`
   - Hapus file: `api/data/genre.json`
   - Hapus file: `api/data/schedule.json`

Aplikasi akan otomatis buat file baru kosong pas diakses lagi.

---

## 🛡️ Security Checklist

Biar website kamu aman dari hacker:

1. **Permission File**
   - Folder: 755
   - File: 644
   - File Config (`.dhex`): 600 atau 644

2. **File `.dhex`**
   - Pastikan file ini TIDAK BISA diakses dari browser.
   - Coba buka: `namadomain.com/.dhex`
   - Kalau muncul "403 Forbidden" atau "404 Not Found" = **AMAN** ✅
   - Kalau ke-download atau muncul teks isinya = **BAHAYA** ❌ -> Cek `.htaccess`

3. **Update Rutin**
   - Rajin update script PHP & React kalau ada patch security.

---

## ❓ FAQ Maintenance

**Q: Website jadi lemot, kenapa?**
A: Cek folder `api/core/cache/`, kalau isinya ribuan file, hapus semua. Cek juga `error_log` di file manager, kalau ukurannya besar (MB/GB), hapus aja.

**Q: Saya salah update, web error semua!**
A: Restore dari backup `dist.zip` atau `api.zip` terakhir yang jalan. Kalau gak punya backup script, minta restore backup harian ke pihak hosting (biasanya mereka punya).

**Q: Mau ganti domain, gimana?**
A:
1. Point domain baru ke hosting
2. Edit file `.dhex`: update `hostname` dan `app_url`
3. Edit `vite.config.js`: update `base` URL
4. Build ulang & upload folder `dist` lagi

---

> *Panduan ini dibuat untuk DHEXStream v1.0.0*
