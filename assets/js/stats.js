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

  var now = new Date();
  var today = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0');

  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  var stats = load();
  stats.total += 1;
  stats.days[today] = (stats.days[today] || 0) + 1;
  stats.pages[path] = (stats.pages[path] || 0) + 1;
  save(stats);

  setText('stats-total', format(stats.total));
  setText('stats-today', format(stats.days[today] || 0));

  // Bài xem nhiều / ít nhất (chỉ tính các trang thuộc nội dung bài viết)
  var entries = [];
  for (var k in stats.pages) {
    if (stats.pages.hasOwnProperty(k) && posts[k] !== undefined) {
      entries.push({ title: posts[k], n: stats.pages[k] });
    }
  }

  if (entries.length) {
    entries.sort(function (a, b) { return b.n - a.n; });
    var top = entries[0];
    var bottom = entries[entries.length - 1];
    var topEl = document.getElementById('stats-top');
    var bottomEl = document.getElementById('stats-bottom');
    if (topEl) {
      topEl.textContent = top.title;
      topEl.title = top.title + ' — ' + format(top.n) + ' lượt xem';
    }
    if (bottomEl) {
      bottomEl.textContent = bottom.title;
      bottomEl.title = bottom.title + ' — ' + format(bottom.n) + ' lượt xem';
    }
  }
})();