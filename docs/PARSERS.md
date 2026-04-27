# Parser Documentation: Logika Transformasi Data 🧠

Dokumen ini merinci logika di balik setiap parser yang digunakan dalam project ini.

## 1. Ads Profiling Parser (`ads-profiling.ts`)

### `classifyCategory(label: string)`
**Tujuan**: Mengelompokkan ribuan label minat Meta ke dalam kategori manusiawi.
- **Logic**: Menggunakan kamus kata kunci (dictionary-based). 
- **Categories**: Platform Meta, Device & Platform, Demografi, Perilaku Belanja, Minat & Hobi, Lifestyle, dll.
- **Fallback**: Jika tidak ada keyword yang cocok, akan masuk ke kategori "Lainnya".

### `detectDataSource(sourceLabel: string)`
**Tujuan**: Mengetahui "Gimana" advertiser mendapatkan data kamu.
- **Logic**: Memetakan label metadata Meta ke tingkat keparahan privasi (Severity).
- **Severity**: 
  - `High`: Data sensitif (Email, Offline purchase).
  - `Medium`: Tracking (Website Pixel, App SDK).
  - `Low`: Interaksi (Likes, Comments).

---

## 2. Digital Footprint Parser (`digital-footprint.ts`)

### `parseLoginActivity(data: LoginActivityJSON)`
**Tujuan**: Mengekstrak informasi perangkat dari User Agent string.
- **Sub-Parser**:
  - `parseDevice()`: Mendeteksi iPhone, Android, PC, dll.
  - `parseBrowser()`: Mendeteksi Chrome, Safari, Instagram App, dll.
  - `parseOS()`: Mendeteksi versi iOS, Android, Windows.

### `parseLinkHistory(data: LinkHistoryJSON)`
**Tujuan**: Membersihkan URL menjadi domain yang rapi.
- **Logic**: Menggunakan `URL` API browser untuk mengambil `hostname`, lalu membersihkan prefix `www.`.

---

## 3. Social Audit Parser (`social.ts`)

### `isSuspiciousUsername(username: string)`
**Tujuan**: Mendeteksi potensi akun bot/spam.
- **Heuristic Patterns**:
  1. Rasio angka > 50% (contoh: `user123456`).
  2. Akhiran angka panjang (>= 5 digit).
  3. Mengandung keyword bot (contoh: `follower_boost`).
  4. Pola karakter acak (random strings).
  5. Penggunaan garis bawah berulang (`user____`).

### `analyzeSocialRelationships()`
**Tujuan**: Mencari ketidakkonsistenan hubungan.
- **Logic**: Operasi himpunan (Set operations) untuk mencari `Mutuals`, `Not Follow Back`, dan `Not Following Back`.
