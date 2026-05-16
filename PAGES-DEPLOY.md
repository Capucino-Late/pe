# Deploy ke Cloudflare Pages (Cloudflare Pages Functions)

Panduan singkat untuk deploy branch `pages-site` ke Cloudflare Pages.

Langkah-langkah:
1. Di dashboard Cloudflare -> Pages, buat project baru dan hubungkan ke repository `Capucino-Late/pe`.
2. Set "Production branch" ke `pages-site`.
3. Build settings: pilih "Framework preset: None (Static)". Build command kosong. Build output directory: `/`.
4. Tambahkan Environment variables & secrets (Settings -> Environment variables):
   - MOCK_MODE (string): "true" atau "false". Jika true, fungsi akan bekerja dengan data mock.
   - PROVIDER_API_URL (string): base URL provider (tanpa trailing slash), mis. https://provider.example/api
   - PROVIDER_API_KEY (string): API key jika provider butuh otentikasi

5. Deploy. Cloudflare Pages akan menyajikan file `index.html` dan Functions di `/api/*`.

Testing:
- Akses halaman utama: https://<your-pages>.pages.dev/
- Cek endpoint packages: https://<your-pages>.pages.dev/api/packages

Catatan keamanan:
- Jangan commit kredensial ke repo. Set secrets hanya melalui dashboard Pages.
- Jika Anda ingin fungsi meneruskan ke provider nyata, set MOCK_MODE=false dan isi PROVIDER_API_URL & PROVIDER_API_KEY.

Jika mau, saya bisa bantu menambahkan badge di README atau membuat GitHub Action untuk merilis, beri tahu saya fitur tambahan yang diinginkan.
