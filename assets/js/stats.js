(function () {
  'use strict';

  // ---------- Bộ đếm truy cập tự build (localStorage, không server) ----------
  var panel = document.getElementById('stats-panel');
  if (!panel) return;

  var STORE_KEY = 'bloghoctap_stats_v1';

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return { total: 0, days: {}, pages: {} };
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.total !== 'number') return { total: 0, days: {}, pages: {} };
      return parsed;
    } catch (e) {
      return { total: 0, days: {}, pages: {} };
    }
  }

  function save(stats) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(stats));
    } catch (e) {
      // Quota/privacy mode — bỏ qua lặng lẽ
    }
  }

  function format(n) {
    return n ? n.toLocaleString('vi-VN') : '0';
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  var posts = {};
  try {
    posts = JSON.parse(panel.getAttribute('data-posts') || '{}') || {};
  } catch (e) {
    posts = {};
  }

  function todayKey() {
    var now = new Date();
    return now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
  }

  function pathKey() {
    return window.location.pathname.replace(/\/+$/, '') || '/';
  }

  function render(stats) {
    setText('stats-total', format(stats.total));
    setText('stats-today', format(stats.days[todayKey()] || 0));

    // Bài xem nhiều / ít nhất (chỉ tính các trang thuộc nội dung bài viết)
    var entries = [];
    for (var k in stats.pages) {
      if (stats.pages.hasOwnProperty(k) && posts[k] !== undefined) {
        entries.push({ title: posts[k], n: stats.pages[k] });
      }
    }
    entries.sort(function (a, b) { return b.n - a.n; });

    var topEl = document.getElementById('stats-top');
    var bottomEl = document.getElementById('stats-bottom');
    if (!entries.length) {
      if (topEl) topEl.textContent = '—';
      if (bottomEl) bottomEl.textContent = '—';
      return;
    }

    var top = entries[0];
    var bottom = entries[entries.length - 1];
    if (topEl) {
      topEl.textContent = top.title;
      topEl.title = top.title + ' — ' + format(top.n) + ' lượt xem';
    }
    if (bottomEl) {
      bottomEl.textContent = bottom.title;
      bottomEl.title = bottom.title + ' — ' + format(bottom.n) + ' lượt xem';
    }
  }

  function recordVisit() {
    var stats = load();
    stats.total += 1;
    stats.days[todayKey()] = (stats.days[todayKey()] || 0) + 1;
    stats.pages[pathKey()] = (stats.pages[pathKey()] || 0) + 1;
    save(stats);
    render(stats);
  }

  // Tải trang mới (kể cả bấm F5 / chuyển trang): đếm 1 lượt + render
  recordVisit();

  // Back/forward cache: trang được trình duyệt restore nguyên trạng, script
  // không tự chạy lại — re-render để số nhảy theo lượt thực, không đếm kép.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      render(load());
    }
  });

  // Đồng bộ giữa các tab cùng trình duyệt: tab khác đếm xong, tab này cập nhật ngay.
  window.addEventListener('storage', function (e) {
    if (e.key === STORE_KEY || e.key === null) {
      render(load());
    }
  });
})();