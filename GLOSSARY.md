# Domain Glossary: Wisata Jelajah Indonesia

Kamus istilah domain untuk sistem informasi dan reservasi tiket wisata digital nusantara.

---

## 1. Actor Roles (Hak Akses & Pengguna)

### Customer (`customer`)
Wisatawan atau pengunjung umum. Memiliki akses untuk mengeksplorasi destinasi wisata, membeli tiket, mendapatkan e-tiket digital ber-QR Code, menyimpan destinasi favorit (wishlist), serta meninjau riwayat transaksi di Customer Dashboard (`/dashboard`).

### Admin (`admin`)
Pengelola operasional destinasi wisata (khususnya destinasi Tasikmalaya dan destinasi nasional rekanan). Memiliki hak untuk mengelola katalog destinasi (tambah, perbarui, arsipkan destinasi), memantau jam operasional & harga tiket, serta memvalidasi check-in tiket pengunjung melalui loket scanner tiket di Admin Panel (`/admin`).

### Super Admin (`super_admin`)
Pemilik atau pengelola utama platform *Wisata Jelajah Indonesia*. Memiliki wewenang tertinggi: mengelola seluruh akun pengguna, memutasikan hak akses pengguna (mengangkat/menurunkan peran antara Customer, Admin, dan Super Admin), menginspeksi metrik omset & komisi platform, serta meninjau catatan audit sistem di Super Admin Master Dashboard (`/super-admin`).

---

## 2. Ticketing & Booking Domain

### Destination (`destinasi`)
Entitas objek wisata yang terdaftar dalam platform (misal: *Gunung Galunggung*, *TeeJay Waterpark Plaza Asia*, *Kampung Naga*). Memiliki atribut nama, lokasi, kategori, harga tiket masuk, jam operasional, fasilitas, dan galeri foto.

### Booking (`pemesanan`)
Transaksi pemesanan tiket yang dibuat oleh *Customer*. Mencakup tanggal kunjungan, kuantitas tiket, total pembayaran, status pembayaran (`paid`, `pending`, `cancelled`), serta kode unik booking.

### E-Ticket (`e-tiket`)
Tiket digital resmi berformat QR Code yang diterbitkan setelah pemesanan berstatus lunas. E-tiket dapat diunduh, dicetak, atau dipindai langsung di pintu masuk wisata.

### Ticket Validation (`validasi tiket / check-in`)
Proses verifikasi e-tiket oleh *Admin* di loket masuk wisata melalui pemindaian QR Code atau pencocokan kode booking untuk mencegah tiket ganda (*re-use*).

### Platform Commission (`komisi platform`)
Bagian pendapatan platform dari setiap transaksi tiket yang berhasil (secara bawaan 5%), dipantau langsung pada panel keuangan *Super Admin*.
