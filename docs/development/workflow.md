# Alur Kerja Pengembangan (Development Workflow) 🛠️

Dokumen ini menjelaskan prosedur standar dalam melakukan pengembangan pada proyek **DHEXStream**. Harap ikuti langkah-langkah ini untuk memastikan perubahan kode Anda terdeteksi dengan benar.

## 🔄 Workflow Normal

1. **Persiapan**: Pastikan XAMPP (Apache & MySQL) sudah dalam keadaan **Running**.
2. **Jalankan Terminal**: Buka terminal di folder project.
3. **Mode Dev**: Jalankan perintah perintah development:
   ```bash
   npm run dev
   ```
4. **Browsing**: Akses aplikasi melalui URL yang diberikan oleh Vite (biasanya `http://localhost:5173`).

---

## ⚠️ PENTING: Prosedur Update Kode (CRITICAL)

Karena struktur proyek ini menggabungkan Vite dengan lingkungan PHP/Server, maka setiap kali ada perubahan pada file source (terutama CSS/Assets/Logic React), **Anda harus melakukan kompilasi ulang** agar perubahan terlihat secara lokal.

**Langkah-langkah wajib setiap ada perubahan:**

1. **Stop Server**: Tekan `Ctrl + C` di terminal yang sedang menjalankan `npm run dev`.
2. **Rebuild**: Jalankan perintah build untuk mengcompile perubahan terbaru:
   ```bash
   npm run build
   ```
3. **Restart Dev**: Jalankan kembali server development:
   ```bash
   npm run dev
   ```
4. **Refresh Browser**: Refresh halaman browser Anda (gunakan `Ctrl + F5` untuk hard refresh agar cache bersih).

---

## 💡 Best Practices

### Kapan Harus Menjalankan `npm run build`?
- Saat mengubah konfigurasi `tailwind.config.js`.
- Saat menambahkan asset gambar baru di folder `src/assets`.
- Jika perubahan UI tidak muncul meski sudah di-save.

### Cara Membersihkan Cache Browser
Kadang browser menyimpan versi lama dari file CSS/JS.
- **Chrome/Edge**: `Ctrl + Shift + R` atau `Ctrl + F5`.
- **Developer Tools**: Tekan `F12` > Klik kanan tombol refresh > Pilih **"Empty Cache and Hard Reload"**.

### Cek Error
- **Console Log**: Selalu buka Inspect Element (`F12`) tab **Console** untuk melihat error JavaScript.
- **Network Tab**: Cek tab **Network** jika API dari PHP tidak merespon atau return 404/500.

---

## 📦 Perintah Utama (Common Commands)

```bash
npm run dev      # Menjalankan mode pengembangan (Hot Reloading terbatas)
npm run build    # Mengkompilasi source code untuk production / update lokal
npm run preview  # Melihat hasil build secara lokal sebelum di-deploy
```

## 🌿 Git Workflow

Jika bekerja dalam tim, gunakan alur berikut:
1. `git checkout -b nama-fitur` (Buat branch baru)
2. Lakukan perubahan kode.
3. `git add .`
4. `git commit -m "feat: deskripsi perubahan"`
5. `git push origin nama-fitur`

---

> [!WARNING]
> Jangan pernah mengedit file di dalam folder `dist/` secara langsung. Folder tersebut adalah hasil otomatis dari `npm run build` dan akan terhapus/tertimpa setiap kali Anda menjalankan perintah build.
