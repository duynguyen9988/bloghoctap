# bloghoctap

> học mọi điều từ cuộc sống

Blog tĩnh siêu nhẹ — **Hugo (Extended)** + **Tailwind CSS** + **Pagefind** + **GitHub Pages (GitHub Actions)**.

## Cấu trúc thư mục

```
bloghoctap/
├── .github/workflows/deploy.yml   # CI/CD: build + deploy lên GitHub Pages
├── archetypes/default.md          # Mẫu frontmatter khi tạo bài mới
├── assets/
│   ├── css/main.css               # Tailwind directives + lớp component tùy biến
│   └── js/
│       ├── theme-init.js          # Chống FOUC cho dark mode (inline trong <head>)
│       └── script.js              # Theme toggle, search dialog, khởi tạo Pagefind
├── content/
│   ├── posts/                     # Tất cả bài viết (Markdown)
│   └── (categories, tags)         # Tự sinh từ frontmatter
├── layouts/
│   ├── _default/
│   │   ├── baseof.html            # Khung chính
│   │   ├── single.html            # Trang bài viết chi tiết (typography prose)
│   │   ├── list.html              # Trang section / taxonomy term
│   │   └── terms.html             # Trang /categories/ /tags/
│   ├── partials/                  # head, header, footer, card, pagination, search
│   ├── index.html                 # Trang chủ
│   ├── 404.html
│   └── robots.txt
├── static/favicon.svg
├── hugo.toml                      # Cấu hình Hugo + SEO + taxonomy
├── tailwind.config.js             # content globs, darkMode: class, typography plugin
├── postcss.config.js
└── package.json
```

## Lệnh

| Lệnh | Mô tả |
|------|-------|
| `npm install` | Cài dependencies (lần đầu) |
| `npm run dev` | Server phát triển tại `http://localhost:1313` |
| `npm run build` | `hugo --gc --minify` → xuất ra `public/` |
| `npm run search` | Tạo chỉ mục Pagefind trong `public/pagefind/` |
| `npm run full:build` | Build + tạo chỉ mục tìm kiếm |

## Tạo bài viết mới

```bash
hugo new posts/tieu-de-bai-viet.md
```

Sau đó sửa frontmatter (`description`, `tags`, `categories`), viết nội dung, rồi:

```bash
npm run full:build   # kiểm tra build local
```

Push lên `main` → GitHub Actions tự build + deploy.

## GitHub Pages

- baseURL: `https://duynguyen9988.github.io/bloghoctap/`
- Trong repo: **Settings → Pages → Source: GitHub Actions**
- Dark mode: nút ở góc phải navbar (lưu vào `localStorage`), mặc định theo hệ thống.
- Tìm kiếm: nút 🔍 hoặc phím `Ctrl/⌘ + K`.

## Ghi chú

- **Tailwind chạy qua Hugo Pipes** (`postCSS`), mọi thay đổi class chỉ cần build lại, không cần lệnh `npx tailwindcss` riêng.
- **Pagefind chạy SAU khi Hugo build** (vì index trên `public/`), do đó trong GH workflow có bước `npx pagefind --site public`.
- Khi dùng `hugo server` để phát triển, tìm kiếm chỉ hoạt động nếu bạn đã chạy ít nhất một lần `npm run full:build` để sinh `pagefind/`.