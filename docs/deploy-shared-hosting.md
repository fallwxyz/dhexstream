# 🚀 Tutorial Deploy DHEXStream ke Shared Hosting

> **Panduan lengkap deploy project DHEXStream dari awal sampai akhir ke shared hosting yang kamu beli**

---

## 📋 Daftar Isi

1. [Persiapan Awal](#-persiapan-awal)
2. [Build Project](#-build-project)
3. [Persiapan File Upload](#-persiapan-file-upload)
4. [Upload ke Hosting](#-upload-ke-hosting)
5. [Konfigurasi di Hosting](#-konfigurasi-di-hosting)
6. [Testing dan Troubleshooting](#-testing-dan-troubleshooting)
7. [Tips Optimasi](#-tips-optimasi)

---

## 🎯 Persiapan Awal

### Yang Kamu Butuhkan:

- ✅ **Shared hosting** yang sudah kamu beli (contoh: Hostinger, Niagahoster, DomaiNesia, dll)
- ✅ **Akses cPanel** atau File Manager
- ✅ **FTP Client** (opsional, tapi recommended) - download [FileZilla](https://filezilla-project.org/)
- ✅ **Node.js** terinstall di komputer kamu (untuk build)
- ✅ **Domain atau subdomain** yang sudah aktif

### Cek Spesifikasi Hosting

Pastikan hosting kamu punya:
- **PHP 7.4+** (cek di cPanel > Select PHP Version)
- **mod_rewrite** enabled (biasanya sudah aktif di shared hosting)
- **Minimal 100MB** storage (untuk project ini)

> [!TIP]
> Kalau hosting kamu pakai cPanel, biasanya semua requirement di atas sudah otomatis terpenuhi. Tapi tetep cek aja ya!

---

## 🔨 Build Project

Sebelum upload ke hosting, kamu harus build dulu project React-nya biar jadi static files.

### Langkah 1: Buka Terminal/CMD

```bash
# Masuk ke folder project
cd /home/boba/lampp/htdocs/dhexstream
```

### Langkah 2: Update Konfigurasi untuk Production

Edit file `vite.config.js`, ubah bagian `base`:

```javascript
// Ganti dari ini:
base: command === 'serve' ? '/dhexstream/' : '/',

// Jadi ini (sesuaikan dengan folder/domain kamu):
base: '/',  // Kalau deploy ke root domain (contoh: animestream.com)
// ATAU
base: '/dhexstream/',  // Kalau deploy ke subfolder (contoh: domain.com/dhexstream)
```

> [!IMPORTANT]
> `base: '/'` = deploy ke root domain (animestream.com)  
> `base: '/nama-folder/'` = deploy ke subfolder (domain.com/nama-folder)

### Langkah 3: Build Project

```bash
# Install dependencies (kalau belum)
npm install

# Build production
npm run build
```

Tunggu prosesnya selesai. Nanti akan muncul folder `dist` yang isinya file-file production-ready.

> [!NOTE]
> Proses build biasanya makan waktu 30 detik - 2 menit tergantung spek komputer kamu.

**Output yang sukses kira-kira begini:**

```
✓ 1547 modules transformed.
✓ built in 45.23s
dist/index.html                    1.34 kB
dist/assets/index-BwC4xR7Q.css    125.45 kB
dist/assets/index-D7GhR2L1.js     287.93 kB
```

---

## 📦 Persiapan File Upload

### Struktur File yang Harus Diupload

Kamu **TIDAK** perlu upload semua file. Yang dibutuhkan cuma:

```
Struktur Upload:
📁 public_html/ (atau htdocs/)
├── 📁 api/                    ← Upload semua isi folder api/
│   ├── 📁 core/
│   ├── 📁 data/
│   └── 📄 index.php
│
├── 📁 assets/                 ← Upload semua isi folder assets/
│   └── 📁 image/
│
├── 📁 dist/                   ← Upload semua isi folder dist/ (hasil npm run build)
│   ├── 📁 assets/
│   └── 📄 index.html
│
├── 📁 manajerial/            ← Upload kalau kamu pakai admin panel
│
├── 📄 .htaccess              ← PENTING! Upload file ini
├── 📄 dhex.php               ← Upload file ini
└── 📄 .dhex                  ← Upload dan konfigurasi file ini
```

### File yang TIDAK Perlu Diupload:

❌ `node_modules/` - folder ini besar banget dan gak diperlukan  
❌ `src/` - ini source code, udah di-compile ke dist/  
❌ `.git/` - git history gak perlu  
❌ `package.json`, `package-lock.json` - cuma buat development  
❌ `vite.config.js`, `tailwind.config.js` - cuma buat build  
❌ `.env.example` - ini cuma contoh  
❌ `README.md`, `LICENSE` - opsional  

> [!WARNING]
> Jangan upload `node_modules/`! Folder ini bisa 200MB+. Shared hosting terbatas storage-nya!

---

## ⬆️ Upload ke Hosting

Ada 2 cara upload: pakai **File Manager** (lebih gampang) atau **FTP** (lebih cepat untuk file banyak).

### Opsi A: Upload via cPanel File Manager (Recommended untuk Pemula)

#### Step 1: Login ke cPanel
- Buka `namadomain.com/cpanel` atau `namadomain.com:2083`
- Login pakai username & password yang dikasih hosting

#### Step 2: Buka File Manager
- Di cPanel, cari menu **"File Manager"**
- Pilih **"public_html"** atau **"htdocs"** (tergantung hosting)

#### Step 3: Upload Files

**Cara paling efisien:**

1. **Compress dulu di komputer lokal**
   - Buat file ZIP dari folder-folder yang dibutuhkan
   - Pisahkan jadi beberapa ZIP kalau terlalu besar:
     - `api.zip` (isi folder api/)
     - `assets.zip` (isi folder assets/)
     - `dist.zip` (isi folder dist/)
     - `root-files.zip` (file .htaccess, dhex.php, .dhex, dll)

2. **Upload ZIP**
   - Klik tombol **"Upload"** di File Manager
   - Drag & drop file ZIP kamu
   - Tunggu sampai progress bar selesai

3. **Extract ZIP**
   - Klik kanan pada file ZIP → **"Extract"**
   - Pilih extract ke **current directory**
   - Hapus file ZIP setelah selesai extract

> [!TIP]
> Upload dalam bentuk ZIP jauh lebih cepat daripada upload file satu-satu. File 1000+ kalau diupload satu-satu bisa berjam-jam!

#### Step 4: Atur Struktur Folder

Pastikan struktur akhirnya seperti ini:

```
public_html/
├── api/
├── assets/
├── dist/
├── manajerial/ (kalau ada)
├── .htaccess
├── dhex.php
└── .dhex
```

**ATAU kalau kamu mau deploy ke subfolder (misalnya `/dhexstream`):**

```
public_html/
└── dhexstream/
    ├── api/
    ├── assets/
    ├── dist/
    ├── .htaccess
    ├── dhex.php
    └── .dhex
```

---

### Opsi B: Upload via FTP (Recommended untuk File Banyak)

#### Step 1: Download & Install FileZilla
- Download dari [filezilla-project.org](https://filezilla-project.org/)
- Install seperti biasa

#### Step 2: Koneksi ke Hosting

Buka FileZilla, masukkan detail FTP (cek email hosting atau cPanel):

```
Host:     ftp.namadomain.com (atau IP hosting)
Username: username@namadomain.com
Password: password FTP kamu
Port:     21 (atau 22 kalau pakai SFTP)
```

Klik **"Quickconnect"**

#### Step 3: Upload Files

- **Panel kiri** = komputer kamu
- **Panel kanan** = server hosting

1. Di panel kanan, masuk ke folder `public_html/` atau `htdocs/`
2. Di panel kiri, buka folder project dhexstream kamu
3. **Drag & drop** folder-folder ini dari kiri ke kanan:
   - `api/`
   - `assets/`
   - `dist/`
   - `manajerial/` (kalau ada)
4. Upload juga file-file ini:
   - `.htaccess`
   - `dhex.php`
   - `.dhex`

Tunggu sampai semua file keupload (progress bar di bawah akan menunjukkan).

> [!NOTE]
> Upload via FTP biasanya lebih stable dan bisa di-resume kalau koneksi putus. Perfect buat file banyak!

---

## ⚙️ Konfigurasi di Hosting

Setelah semua file keupload, ada beberapa konfigurasi yang perlu disesuaikan.

### 1. Edit File `.dhex`

File `.dhex` itu konfigurasi utama aplikasi. Edit via File Manager:

1. Buka File Manager → cari file `.dhex`
2. Klik kanan → **"Edit"** atau **"Code Editor"**
3. Update konfigurasi:

```env
# Sesuaikan dengan domain/folder kamu
app_url=dhexstream           # Ganti sesuai folder atau kosongkan kalau di root
hostname=namadomain.com      # Ganti dengan domain kamu
```

**Contoh konfigurasi:**

```env
# Kalau deploy ke root (https://animestream.com)
app_url=
hostname=animestream.com

# Kalau deploy ke subfolder (https://domain.com/dhexstream)
app_url=dhexstream
hostname=domain.com
```

4. **Save** (Ctrl+S atau tombol Save)

### 2. Cek File `.htaccess`

File `.htaccess` yang sudah ada di project harusnya sudah OK. Tapi pastikan isinya seperti ini:

```apache
RewriteEngine On
RewriteCond %{THE_REQUEST} \s/dhex\.php[\s?] [NC]
RewriteRule ^dhex\.php$ - [F,L]

DirectoryIndex dhex.php

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/dhexstream/dist/
RewriteRule ^(.*)$ dhex.php?page=$1 [L,QSA]

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/pdf "access plus 1 month"
  ExpiresByType text/x-javascript "access plus 1 month"
  ExpiresByType application/x-shockwave-flash "access plus 1 month"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresDefault "access plus 2 days"
</IfModule>
```

> [!IMPORTANT]
> Kalau kamu deploy ke **root domain** (bukan subfolder), edit baris ini:
> ```apache
> RewriteCond %{REQUEST_URI} !^/dhexstream/dist/
> # Ganti jadi:
> RewriteCond %{REQUEST_URI} !^/dist/
> ```

### 3. Set PHP Version (Optional tapi Recommended)

Di cPanel:

1. Cari **"Select PHP Version"** atau **"MultiPHP Manager"**
2. Pilih **PHP 7.4** atau lebih tinggi (8.0, 8.1 recommended)
3. **Apply**

### 4. Set File Permissions

Beberapa folder perlu permission khusus agar PHP bisa write:

Di File Manager:
1. Klik kanan folder `api/data/` → **"Change Permissions"**
2. Set ke **755** atau **775**
3. Klik **"Change Permissions"**

Ulangi untuk folder-folder ini (kalau ada):
- `api/data/` → **755**
- `api/core/cache/` → **755** (kalau ada)
- `manajerial/` → **755**

> [!NOTE]
> Permission 755 = Owner bisa read/write/execute, others cuma read/execute. Ini safe untuk shared hosting.

---

## 🧪 Testing dan Troubleshooting

### Test Apakah Berhasil

Buka browser, akses domain kamu:

```
https://namadomain.com              # Kalau deploy ke root
https://namadomain.com/dhexstream   # Kalau deploy ke subfolder
```

**Yang harus muncul:**
- ✅ Homepage DHEXStream load dengan benar
- ✅ Gambar/logo muncul
- ✅ Bisa klik menu navigasi
- ✅ Bisa search anime
- ✅ Bisa buka halaman anime

### Masalah Umum & Solusinya

#### ❌ Error 500 Internal Server Error

**Penyebab:**
- File `.htaccess` bermasalah
- PHP version terlalu rendah
- File permission salah

**Solusi:**
1. Cek error log di cPanel → **"Errors"** atau **"Error Log"**
2. Rename `.htaccess` jadi `htaccess.bak` sementara, test lagi
3. Pastikan PHP version minimal 7.4
4. Cek permission folder `api/data/` harus 755

---

#### ❌ Halaman Blank/Putih

**Penyebab:**
- Frontend belum ke-build dengan benar
- Path salah di `vite.config.js`

**Solusi:**
1. Cek apakah folder `dist/` ada dan berisi file
2. Buka `dist/index.html` di browser langsung: `domain.com/dist/index.html`
3. Kalau muncul tapi rusak, berarti masalah path. Cek lagi `base` di `vite.config.js`, build ulang

---

#### ❌ CSS/JavaScript Tidak Load (404 Not Found)

**Penyebab:**
- Setting `base` di `vite.config.js` salah
- File di folder `dist/assets/` tidak terupload

**Solusi:**
1. Buka browser console (F12), lihat file mana yang 404
2. Pastikan semua file di `dist/assets/` keupload
3. Cek `base` setting di `vite.config.js`:
   - Root domain = `base: '/'`
   - Subfolder = `base: '/nama-folder/'`
4. Build ulang: `npm run build`, upload ulang folder `dist/`

---

#### ❌ API Tidak Jalan (Error Fetch Data)

**Penyebab:**
- Folder `api/` tidak terupload lengkap
- File `.dhex` konfigurasi salah
- Permission folder bermasalah

**Solusi:**
1. Cek apakah file `api/index.php` ada
2. Test akses langsung: `domain.com/api/index.php` - harusnya muncul response JSON atau error message
3. Cek file `.dhex`, pastikan `hostname` dan `app_url` benar
4. Cek permission folder `api/` dan `api/data/` = 755

---

#### ❌ Routing Tidak Jalan (404 saat Refresh Page)

**Penyebab:**
- File `.htaccess` tidak kedetect atau mod_rewrite off

**Solusi:**
1. Pastikan file `.htaccess` ada di folder root (sejajar dengan `dhex.php`)
2. Rename `.htaccess` jadi `htaccess.txt`, tunggu 5 detik, rename lagi jadi `.htaccess`
3. Kontak support hosting, minta enable `mod_rewrite`

---

#### ❌ Gambar/Logo Tidak Muncul

**Penyebab:**
- Folder `assets/` atau `public/` tidak terupload
- Path gambar salah

**Solusi:**
1. Pastikan folder `assets/image/` keupload lengkap
2. Cek konsol browser (F12), lihat error path mana yang salah
3. Pastikan folder `public/` juga keupload (kalau ada file favicon, dll)

---

## 💡 Tips Optimasi

### 1. Enable GZIP Compression

`.htaccess` yang ada sudah include GZIP, tapi kalau mau lebih agresif, tambahkan di atas file `.htaccess`:

```apache
# GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript application/javascript application/x-javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>
```

### 2. Enable Browser Caching

`.htaccess` yang ada juga sudah include caching. Tapi kalau perlu tweak:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  
  # Images
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  
  # CSS & JavaScript
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  
  # Fonts
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
  
  # Default
  ExpiresDefault "access plus 2 days"
</IfModule>
```

### 3. Setup CloudFlare (Free CDN)

Kalau mau website makin cepat:

1. Daftar [CloudFlare](https://cloudflare.com) (gratis)
2. Tambahkan domain kamu
3. Ubah nameserver domain ke CloudFlare
4. Enable **Auto Minify** (CSS, JS, HTML)
5. Enable **Brotli compression**
6. Set **Browser Cache TTL** = 4 hours

> [!TIP]
> CloudFlare free tier udah cukup banget buat bikin website kamu 2-3x lebih cepat!

### 4. Optimize Images

Kalau website lambat karena gambar besar:

1. Compress semua gambar di folder `assets/image/` pakai [TinyPNG](https://tinypng.com)
2. Gunakan format WebP kalau bisa (lebih kecil dari PNG/JPG)
3. Upload ulang gambar yang sudah dicompress

### 5. Monitor Performance

Test kecepatan website:
- [GTmetrix](https://gtmetrix.com)
- [PageSpeed Insights](https://pagespeed.web.dev)
- [Pingdom](https://tools.pingdom.com)

Target bagus:
- **Loading time** < 3 detik
- **PageSpeed score** > 80
- **Fully loaded size** < 2MB

---

## 🎉 Selesai!

Sekarang website DHEXStream kamu sudah live di shared hosting! 

### Checklist Final:

- ✅ Build project dengan `npm run build`
- ✅ Upload folder `api/`, `assets/`, `dist/`, dan file `.htaccess`, `dhex.php`, `.dhex`
- ✅ Edit file `.dhex` sesuai domain
- ✅ Set PHP version ke 7.4+
- ✅ Set file permission yang benar
- ✅ Test semua fitur website
- ✅ Setup CloudFlare (opsional)
- ✅ Optimize images dan enable caching

---

## 🆘 Butuh Bantuan?

Kalau masih stuck atau ada error yang gak ke-cover di sini:

1. **Cek error log** di cPanel → Error Log
2. **Screenshot** error yang muncul
3. **Check browser console** (F12 → Console tab)
4. Googling error message-nya
5. Tanya di forum hosting kamu atau komunitas web dev

---

## 📚 Resource Tambahan

- [Documentation lengkap project](../README.md)
- [File konfigurasi .htaccess](../.htaccess)
- [Vite deployment guide](https://vitejs.dev/guide/static-deploy.html)

---

**Happy Streaming! 🍿🎬**

---

> *Tutorial ini dibuat untuk project DHEXStream v1.0.0*  
> *Last updated: 2026-02-10*
