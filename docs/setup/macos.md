# Panduan Setup macOS 🍎

Panduan ini menjelaskan cara setup environment **DHEXStream** di macOS menggunakan Homebrew dan Node.js.

## 📋 Prasyarat (Homebrew)

macOS sangat dipermudah dengan adanya **Homebrew**. Jika belum punya, install dengan perintah ini di Terminal:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## 🔗 Instalasi Tools

### 1. Install Node.js
```bash
brew install node
```

### 2. Install Database & Web Server
Anda bisa memilih menggunakan **XAMPP/MAMP** untuk kemudahan GUI, atau menggunakan PHP & MySQL via Brew:
- **XAMPP Mac**: [Download di sini](https://www.apachefriends.org/download.html)
- **MAMP**: [Download di sini](https://www.mamp.info/)

Atau via Terminal:
```bash
brew install mysql
brew services start mysql
```

---

## 🚀 Setup Project

### 1. Clone Project
Arahkan ke folder web server Anda (misal `Applications/XAMPP/htdocs/`):
```bash
cd /Applications/XAMPP/htdocs/
git clone https://github.com/fallwxyz/dhexstream.git
cd dhexstream
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

---

## 🛠️ Menjalankan Aplikasi

1. **Start Services**: Nyalakan Apache dan MySQL melalui panel XAMPP atau MAMP.
2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
3. **Akses Browser**: Buka `http://localhost:5173`.

---

## ❓ Troubleshooting

- **EACCES Error**: Biasanya masalah permission pada folder `node_modules` atau `htdocs`. Gunakan `sudo chown -R $(whoami) .`.
- **Command Not Found**: Pastikan Path Brew sudah terdaftar di `.zshrc` atau `.bash_profile`.
- **MySQL Socket Error**: Pastikan service MySQL sudah benar-benar running sebelum menjalankan aplikasi.

> [!NOTE]
> Pengguna Mac dengan Apple Silicon (M1/M2/M3) mungkin memerlukan instalasi Rosetta 2 untuk beberapa tool lama, namun Node.js terbaru sudah mendukung native ARM.
