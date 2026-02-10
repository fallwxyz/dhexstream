# Perbaikan Error Hosting (MIME Type & Loading Script)

Dokumen ini menjelaskan penyebab dan solusi untuk error yang terjadi saat aplikasi di-hosting.

## Masalah
Saat membuka website di hosting, muncul error di Console:
1.  `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream".`
2.  Error 404 pada aset atau favicon.

## Penyebab

### 1. Tidak Ada `manifest.json` (Penyebab Utama)
Aplikasi ini menggunakan integrasi Hybrid (Frontend React + Backend PHP/Apache). File `dhex.php` bertugas memanggil file frontend.
- **Masalah**: Skrip PHP mencoba membaca `dist/.vite/manifest.json` untuk mengetahui nama file `.js` dan `.css` yang dihasilkan oleh build (yang namanya acak, misal `index-XyZ123.js`).
- **Dampak**: Karena `manifest: true` belum diaktifkan di `vite.config.js`, file manifest tidak terbentuk. Akibatnya, PHP gagal meload script yang benar, atau mencoba meload path default yang salah.

### 2. Konfigurasi MIME Type Server (Strict MIME Checking)
Browser modern sangat ketat soal keamanan "Module Scripts" (`<script type="module">`).
- **Masalah**: Server hosting (Apache) kadang tidak secara otomatis mengenali file `.js` atau `.mjs` sebagai Javascript, melainkan mengirimnya sebagai `text/plain` atau `application/octet-stream`.
- **Dampak**: Browser menolak mengeksekusi script tersebut karena MIME type tidak sesuai standar keamanan (`application/javascript`).

---

## Solusi

Solusi ini sudah diterapkan pada kode lokal Anda.

### 1. Konfigurasi Vite (`vite.config.js`)
Kami menambahkan `manifest: true` agar Vite membuat peta file aset saat build.

```javascript
// vite.config.js
export default defineConfig({
  // ...
  build: {
    manifest: true, // <--- Baris Penting
    outDir: 'dist',
    // ...
  }
})
```

### 2. Konfigurasi Server (`.htaccess`)
Kami menambahkan aturan agar Apache memaksa file `.js` dikirim dengan MIME type yang benar.

```apache
# .htaccess
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/javascript .mjs
</IfModule>
```

### 3. Proses Build
Dilakukan `npm run build` ulang. Ini menghasilkan folder `dist/.vite/` yang berisi `manifest.json`.

---

## Langkah Deployment (PENTING)

Agar perbaikan ini berjalan di hosting, Anda harus:

1.  **Hapus folder `dist` lama** di hosting Anda (opsional, tapi disarankan agar bersih).
2.  **Upload folder `dist` baru** dari komputer lokal ke hosting. Pastikan folder tersembunyi `dist/.vite` dan isinya (`manifest.json`) **IKUT TERUPLOAD**.
3.  **Upload file `.htaccess` baru** ke root direktori hosting Anda.
4.  **Clear Cache** browser Anda atau buka di Incognito Mode untuk melihat hasilnya.
