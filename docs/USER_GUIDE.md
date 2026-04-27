# User Guide: Cara Menggunakan IG Intelligence Dashboard 📖

Ikuti langkah-langkah di bawah ini untuk menganalisis data Instagram kamu secara aman dan lokal.

## Langkah 1: Request Data dari Meta (Instagram)

Sebelum menggunakan dashboard, kamu perlu mendapatkan data mentah kamu dari Meta:
1. Buka aplikasi Instagram di HP atau Web.
2. Pergi ke **Settings and Privacy** > **Accounts Center** > **Your Information and Permissions**.
3. Pilih **Download Your Information**.
4. Klik **Request a Download**.
5. Pilih akun Instagram kamu.
6. Pilih **Complete Copy** (atau pilih file spesifik jika ingin lebih cepat).
7. **PENTING**: Pilih Format **JSON** (bukan HTML).
8. Pilih Media Quality **Low** (untuk mempercepat proses download).
9. Klik **Submit Request**.
10. Tunggu email dari Meta (biasanya 1-3 hari). Setelah tersedia, download dan extract file ZIP tersebut di komputer kamu.

---

## Langkah 2: Membuka Dashboard

1. Jalankan aplikasi secara lokal (dengan `npm run dev`) atau buka link deployment (Vercel).
2. Kamu akan mendarat di tab **Overview**.

---

## Langkah 3: Meng-upload File

Di halaman **Overview**, kamu akan melihat kartu-kartu panduan file. Drag & drop file JSON yang sesuai ke area yang disediakan:

### 1. Modul Ads Profiling
Upload file dari folder: `ads_information/instagram_ads_and_businesses/`
- `ads_interests.json`
- `advertisers_using_your_activity_or_information.json`
- `advertisers_who_uploaded_a_contact_list_with_your_information.json`

### 2. Modul Digital Footprint
Upload file dari:
- `security_and_login_information/login_and_profile_creation/login_activity.json`
- `logged_information/ads_and_content/ads_clicked_history.json` (atau `link_history.json`)

### 3. Modul Social Audit
Upload file dari: `connections/followers_and_following/`
- `followers.json`
- `following.json`

---

## Langkah 4: Membaca Hasil Analisis

Setelah status file menjadi **Ready (Uploaded)**, pindah ke tab modul di sidebar kiri:

### 📊 Ads Profiling
- Lihat **Pie Chart** untuk tahu kategori apa yang paling dominan Meta berikan pada kamu.
- Lihat **Advertiser Source** untuk tahu bagaimana mereka mendapatkan data kamu.
- Gunakan fitur **Search** di tabel pengiklan untuk mencari brand tertentu.

### 🕐 Digital Footprint
- Cek **Heatmap** untuk melihat jam berapa kamu paling sering login. Jika ada login di jam yang tidak biasa (misal jam 3 pagi saat kamu tidur), periksa keamanan akun kamu.
- Cek **Top Domains** untuk melihat website apa yang paling menyedot waktu kamu.

### 👥 Social Audit
- Lihat siapa saja yang tidak follow balik.
- Periksa daftar akun yang dianggap **Suspicious** (mencurigakan/bot) berdasarkan pola username mereka.

---

## Tips Keamanan 🔐
- Karena aplikasi ini memproses data secara lokal, data kamu tidak akan tersimpan secara permanen. Jika kamu merefresh halaman, kamu perlu meng-upload file kembali.
- Jangan pernah membagikan file JSON mentah kamu kepada orang lain, karena file tersebut berisi data sensitif seperti IP Address dan riwayat aktivitas.

---

## Masalah Umum (Troubleshooting)
- **File tidak terdeteksi**: Pastikan kamu meng-upload file JSON yang asli dari folder Meta, bukan file yang sudah kamu edit atau rename.
- **Grafik tidak muncul**: Pastikan file yang kamu upload sudah benar. Beberapa grafik membutuhkan lebih dari satu file untuk bisa tampil sempurna.
