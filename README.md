# 📝 bloghoctap

> **học mọi điều từ cuộc sống** — một blog tĩnh nhỏ nhắn nhưng "ngầu" về công nghệ.

Blog được build bằng **Hugo (Extended)** + **Tailwind CSS** (chạy trực tiếp qua Hugo Pipes), tìm kiếm không-JavaScript-server bằng **Pagefind**, triển khai tự động bằng **GitHub Actions → GitHub Pages**.

---

## ✨ Vì sao "ngầu"?

- 💨 **Tĩnh & cực nhanh**: No database, no CMS, HTML/CSS/JS thuần khiết deploy lên GitHub Pages.
- 🔍 **Tìm kiếm toàn trang** với **Pagefind** — index ngay tại client, không cần backend, gõ `Ctrl/⌘ + K`.
- 🎨 **Tailwind CSS** qua Hugo Pipes: just-in-time build ngay lúc `hugo --minify`, không cần build step riêng.
- 🌗 **Dark mode** đẹp mắt, tự theo hệ thống, kháng FOUC nhờ script inline trong `<head>`.
- 🤖 **Layout 3 cột thông minh**: 
  - Sidebar **trái**: widget **"Gợi ý 📚"** — đề xuất bài đọc dựa trên nội dung hiện tại (recommendations).
  - Sidebar **phải**: widget **thống kê** — đếm lượt xem, bài "nóng nhất/ít xem nhất" trong `localStorage`, cập nhật realtime qua `storage` event.
- 🧭 **Navigation dạng pill** nền `/sky-100`, active là `bg-blue-600` — dễ thương, nhìn là thích.
- ⚡ **Zero-JS runtime** cho đến khi bạn bấm: mọi widget chỉ load khi cần.
- 🚀 **CI/CD trọn gói**: push lên `main` là GitHub Actions tự `hugo build` + `pagefind index` + deploy.

---

## 🛠️ Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Static Site Generator | **Hugo (Extended)** `v0.163.*` |
| CSS | **Tailwind CSS** `3.4.x` + `@tailwindcss/typography` (qua Hugo Pipes + PostCSS) |
| Tìm kiếm | **Pagefind** (index tĩnh, chạy client-side) |
| Font | Hệ thống (`ui-sans-serif, system-ui`) — zero font request |
| Icons | Inline SVG / SVG sprite |
| Triển khai | **GitHub Actions** + **GitHub Pages** |
| Fontend JS | Vanilla JS, zero dependency ngoài pagefind |

---

## 🚀 Quickstart

```bash
# 1. Cài dependencies
npm install

# 2. Chạy local dev server (hot reload) tại http://localhost:1313
npm run dev
```

Muốn có cả tìm kiếm hoạt động ở local? Chạy build đầy đủ trước:

```bash
npm run full:build     # build site + sinh index Pagefind
npm run search:dev     # tìm kiếm kèm preview
```

---

## 🧩 Cấu trúc thư mục

```
bloghoctap/
├── .github/workflows/deploy.yml   # CI/CD: Hugo build → Pagefind → GitHub Pages
├── archetypes/default.md          # Mẫu frontmatter
├── assets/
│   ├── css/main.css               # Tailwind directives + custom components
│   └── js/                        # theme-init (chống FOUC), script.js (tìm kiếm, dark mode)
├── content/posts/                 # Tất cả bài viết (Markdown)
├── data/recommendations.yaml      # Dữ liệu widget "Gợi ý 📚" sidebar trái
├── layouts/
│   ├── _default/
│   │   ├── baseof.html            # Khung 3 cột (sidebar trái + nội dung + sidebar phải)
│   │   ├── single.html            # Trang bài viết (typography prose)
│   │   ├── list.html              # Section / taxonomy term
│   │   └── terms.html             # /categories/ /tags/
│   ├── partials/                  # head, header, footer, card, pagination, sidebar-*
│   ├── index.html                 # Trang chủ
│   └── 404.html
├── static/                        # favicon, robots.txt, fonts local
├── hugo.toml                      # Cấu hình Hugo + SEO + taxonomy
└── tailwindcss.config.js
```

---

## ✍️ Viết bài mới

```bash
hugo new posts/tieu-de-bai-viet.md
```

Sửa frontmatter (`title`, `description`, `tags`, `categories`), viết nội dung với Markdown thuần, rồi:

```bash
npm run full:build   # verify build local + sinh index tìm kiếm
```

Commit & push lên `main` → **GitHub Actions lo phần còn lại** 🚀.

---

## 📸 Deploy (GitHub Pages)

- **baseURL**: `https://duynguyen9988.github.io/bloghoctap/`
- **Source**: GitHub Actions (Settings → Pages → Source).
- Mặc định dark mode theo hệ thống; bấm nút 🌙/☀️ ở navbar để đổi.
- Tìm kiếm: `Ctrl/⌘ + K` (hoặc nút 🔍).

---

## ⚙️ Ghi chú kỹ thuật

- **Tailwind chạy qua Hugo Pipes** (`postCSS`): chỉnh class → build lại là chỉnh cả, không cần `npx tailwindcss` riêng.
- **Pagefind chạy SAU Hugo build** (làm việc trên `public/`), vì vậy bước này nằm trong workflow GH Actions.
- Với `hugo server` thuần, tìm kiếm chỉ hoạt động nếu bạn đã chạy `npm run full:build` để sinh `pagefind/` trước đó.

---

## 📄 Nội dung

Blog hiện có các bài như: **PNR là gì & vì sao trên vé máy bay luôn có mã 6 ký tự**, **Cơ chế thanh toán Visa/Mastercard & vì sao bị trừ tiền không có OTP**, **Hwang Jung-min: Dispatch & vụ bị stalk**... — tất cả là tổng hợp kiến thức **có nguồn**, trích dẫn rõ ràng.

---

**Make small changes, learn a lot from life. 🚀**