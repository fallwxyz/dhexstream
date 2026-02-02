# Panduan Setup Linux (Ubuntu/Debian) 🐧

Panduan ini ditujukan untuk pengguna Linux (berbasis Ubuntu/Debian) untuk melakukan setup environment pengembangan **DHEXStream**.

## 📋 Prasyarat & Instalasi Tools

Buka terminal Anda dan ikuti langkah-langkah berikut:

### 1. Update Package Manager
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js & npm (via NVM)
Disarankan menggunakan **NVM** (Node Version Manager) agar mudah mengatur versi Node.js:
```bash
# Download & install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Aktifkan NVM (atau restart terminal)
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
```

### 3. Install LAMP Stack (Apache, MySQL, PHP)
Atau Anda bisa menggunakan **XAMPP for Linux (LAMPP)**. Jika menggunakan package manager bawaan:
```bash
sudo apt install apache2 mysql-server php libapache2-mod-php php-mysql -y
```

---

## 🚀 Setup Project

### 1. Persiapan Folder & Permission
Folder default Apache berada di `/var/www/html/`. Namun, jika Anda menggunakan XAMPP (LAMPP), lokasinya di `/opt/lampp/htdocs/`.

**Jika menggunakan XAMPP:**
```bash
cd /opt/lampp/htdocs
sudo git clone https://github.com/fallwxyz/dhexstream.git
sudo chown -R $USER:$USER dhexstream
cd dhexstream
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment
```bash
cp .env.example .env
nano .env # Simpan dengan Ctrl+O, Keluar dengan Ctrl+X
```

---

## 🛠️ Menjalankan Services

### Start Apache & MySQL
**Jika menggunakan XAMPP:**
```bash
sudo /opt/lampp/lampp start
```

**Jika menggunakan Native LAMP:**
```bash
sudo systemctl start apache2
sudo systemctl start mysql
```

### Menjalankan Mode Development
```bash
npm run dev
```

---

## ❓ Troubleshooting

- **Permission Denied**: Selalu pastikan folder project memiliki permission yang benar untuk user Anda. Gunakan `sudo chown -R $USER:$USER .`.
- **Port Conflict**: Jika Apache tidak mau jalan, cek apakah ada service lain di port 80 dengan `sudo lsof -i :80`.
- **MySQL Password**: Pada instalasi baru `mysql-server`, gunakan `sudo mysql` untuk masuk tanpa password pertama kali.

> [!IMPORTANT]
> Pastikan modul `mod_rewrite` di Apache sudah aktif jika Anda menggunakan `.htaccess`.
> `sudo a2enmod rewrite && sudo systemctl restart apache2`
