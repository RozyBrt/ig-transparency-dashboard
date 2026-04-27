# Developer Guide: Pengembangan IG Intelligence Dashboard 🛠️

Dokumen ini ditujukan untuk pengembang yang ingin berkontribusi atau memahami arsitektur teknis dari project ini.

## Arsitektur Data

Project ini menggunakan alur data satu arah (unidirectional data flow):
`Meta JSON` -> `Parser` -> `Zustand Store` -> `React Components` -> `Recharts`

### 1. Data Parsers (`src/lib/parsers/`)
Setiap modul memiliki parser spesifik yang bertugas mengubah struktur JSON Meta yang kompleks menjadi format yang siap digunakan oleh UI.
- **Prinsip**: Parser harus murni (pure functions) dan menangani error jika field JSON tidak ditemukan.
- **Tip**: Gunakan interface di `src/types/index.ts` sebagai kontrak data.

### 2. State Management (`src/lib/store.ts`)
Kami menggunakan Zustand karena ringan dan mudah diintegrasikan dengan logika client-side.
- Store menyimpan array objek hasil parsing.
- Memiliki fungsi `reset` untuk membersihkan memory saat user ingin memulai sesi baru.

### 3. Komponen Grafik (`src/components/charts/`)
Grafik dibangun menggunakan Recharts.
- **Hydration Issue**: Karena menggunakan Next.js, setiap chart harus menggunakan pola `isMounted` untuk menghindari error perbedaan render antara server dan client.
- **Responsive**: Selalu bungkus chart dengan `ResponsiveContainer`.

---

## Cara Menambah Fitur Baru

### Menambah Parser Baru
1. Definisikan tipe JSON mentah di `src/types/index.ts`.
2. Buat file parser baru di `src/lib/parsers/`.
3. Buat test file di `src/lib/parsers/__tests__/` (Opsional tapi disarankan).

### Menambah Grafik Baru
1. Buat komponen baru di `src/components/charts/`.
2. Daftarkan di `src/components/charts/index.ts` (barrel export).
3. Masukkan komponen ke dalam modul yang sesuai di `src/components/modules/`.

---

## Coding Standards
- **Styling**: Gunakan Tailwind CSS. Hindari inline styles kecuali untuk dynamic values (seperti warna grafik).
- **Icons**: Gunakan `lucide-react`.
- **TypeScript**: Hindari penggunaan `any` sebisa mungkin, kecuali untuk callback library eksternal (seperti Recharts Tooltip) yang memang membutuhkan fleksibilitas.

---

## Deployment
Project ini dioptimasi untuk **Vercel**.
1. Hubungkan repository GitHub ke Vercel.
2. Build command: `npm run build`.
3. Output directory: `.next`.

---

## Kontribusi
1. Fork repository ini.
2. Buat branch baru: `git checkout -b feature/nama-fitur`.
3. Commit perubahan: `git commit -m "feat: tambah fitur X"`.
4. Push ke branch: `git push origin feature/nama-fitur`.
5. Buat Pull Request.
