---
title: "Hugo + Tailwind CSS + Pagefind: bắt đầu blog tĩnh siêu nhẹ"
slug: hugo-tailwind-pagefind-blog-tinh-sieu-nhe
date: 2026-09-06T10:00:00+07:00
description: "Hướng dẫn sơ lược stack mà bloghoctap đang dùng: Hugo Extended, Tailwind CSS qua Hugo Pipes, tìm kiếm Pagefind và deploy GitHub Pages bằng GitHub Actions."
tags:
  - hugo
  - tailwindcss
  - pagefind
  - github-pages
categories:
  - lap-trinh
---

Blog này của bạn đang được đọc ngay bây giờ chạy trên một "cỗ máy" rất gọn: không server, không cơ sở dữ liệu, không nền tảng quản trị nặng nề. Toàn bộ chỉ là các file HTML tĩnh.

## Bốn mảnh ghép

**Hugo (Extended)** là bộ máy sinh tĩnh — đọc các file Markdown trong thư mục `content/` và xuất ra thư mục `public/` chỉ trong vài giây, kể cả với hàng nghìn bài viết.

**Tailwind CSS** được nạp trực tiếp qua Hugo Pipes: file `assets/css/main.css` chứa `@tailwind base/components/utilities`, Hugo gọi PostCSS để biên dịch, rồi tự động minify và thêm fingerprint trong bản production.

**Pagefind** là thư viện tìm kiếm client-side: sau khi `hugo` build xong, chạy `npx pagefind --site public` để tạo chỉ mục, và người đọc tìm kiếm ngay trên trình duyệt mà không cần bất kỳ server nào.

**GitHub Actions** đảm nhiệm toàn bộ pipeline: mỗi lần push lên nhánh `main`, workflow cài Node + Hugo, chạy `hugo --minify` rồi `pagefind`, cuối cùng deploy lên GitHub Pages qua artifact.

## Lệnh vận hành mỗi ngày

```bash
npm install          # lần đầu
npm run dev          # chạy server phát triển ở localhost:1313
npm run full:build   # build + tạo chỉ mục tìm kiếm
```

Nếu bạn muốn biết chi tiết cách dựng toàn bộ stack này từ con số 0, nó chính là nguồn giúp mình viết chuỗi ghi chú học tập trên blog này. Hãy bắt đầu từ [bài đầu tiên](/posts/chao-mung-den-voi-bloghoctap/).