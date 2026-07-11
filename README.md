# Risa Resa Cookies - Sistem Informasi Penjualan Kue

Proyek ini adalah Sistem Informasi Penjualan Kue berbasis website dengan arsitektur Client-Server.

## Teknologi yang Digunakan

- **Frontend:** React.js (Vite), Tailwind CSS, Axios, Lucide React
- **Backend:** Go (Golang), Gin Framework, GORM
- **Database:** MySQL
- **Autentikasi:** JWT (JSON Web Token)
**http://localhost:5173/:** jalankan frontend

## Struktur Proyek

- `/backend`: Server API menggunakan Golang (Gin Framework)
  - `/uploads/products`: Tempat penyimpanan foto produk (dinamis)
- `/frontend`: Client menggunakan React.js
  - `/src/assets`: Tempat penyimpanan logo atau aset statis website

## Persiapan & Cara Menjalankan

### 1. Backend
1. Pastikan Anda memiliki Go dan MySQL terinstal.
2. Buat database di MySQL dengan nama `risa_resa_cookies`.
3. Masuk ke folder backend: `cd backend`.
4. Sesuaikan konfigurasi database di file `.env`.
5. Pastikan folder `uploads/products` sudah dibuat secara manual jika belum ada.
5. Jalankan server: `go run main.go`.

### 2. Frontend
1. Pastikan Anda memiliki Node.js terinstal.
2. Masuk ke folder frontend: `cd frontend`.
3. Install dependensi: `npm install`.
4. Jalankan aplikasi: `npm run dev`.

## Verifikasi Gambar
Jika gambar tidak muncul, pastikan:
1. File ada di `backend/uploads/products/`.
2. **Verifikasi Database (MySQL):**
   - Buka `phpMyAdmin` -> database `risa_resa_cookies` -> tabel `products`.
   - Pastikan kolom `image` berisi path lengkap: `uploads/products/nama-file.jpg`.
   - Jika salah, klik 2x pada kolom tersebut dan perbaiki manual.
3. **Verifikasi Frontend:**
   - Pastikan kode memanggil URL lengkap: `http://localhost:8080/` + `path_dari_db`.

## Fitur
- **Beranda:** Menampilkan produk populer dan promo.
- **Katalog:** Daftar lengkap produk kue.
- **Keranjang:** Manajemen item belanja.
- **Checkout:** Proses pemesanan.
- **Auth:** Login dan Register pelanggan.
- **Admin Dashboard:** CRUD Produk dan Monitoring Pesanan.
