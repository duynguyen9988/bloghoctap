(function () {
  'use strict';

  // ---------- Theme toggle ----------
  var toggle = document.getElementById('theme-toggle');
  var sunIcon = document.getElementById('theme-sun');
  var moonIcon = document.getElementById('theme-moon');
  var current = localStorage.getItem('theme');
  var isDark = current ? current === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;

  function apply(dark) {
    document.documentElement.classList.toggle('dark', dark);
    if (sunIcon && moonIcon) {
      sunIcon.classList.toggle('hidden', !dark);
      moonIcon.classList.toggle('hidden', dark);
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      apply(!document.documentElement.classList.contains('dark'));
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
  }
  apply(isDark);

  // ---------- Search dialog ----------
  var searchDialog = document.getElementById('search-dialog');

  window.toggleSearch = function (open) {
    if (!searchDialog) return;
    searchDialog.classList.toggle('hidden', !open);
    document.body.classList.toggle('overflow-hidden', open);
    if (open) {
      var btn = document.getElementById('search-open');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      setTimeout(function () {
        var input = searchDialog.querySelector('input');
        if (input) input.focus();
      }, 50);
    } else {
      var closeBtn = document.getElementById('search-open');
      if (closeBtn) closeBtn.setAttribute('aria-expanded', 'false');
    }
  };

  if (searchDialog) {
    searchDialog.addEventListener('click', function (e) {
      if (e.target === searchDialog || e.target.closest('[data-search-close]')) {
        window.toggleSearch(false);
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.toggleSearch(false);
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      window.toggleSearch(!(searchDialog && !searchDialog.classList.contains('hidden')));
    }
  });

  if (window.PagefindUI) {
    new window.PagefindUI({
      element: '#search',
      showSubResults: false,
      showImages: false,
      resetStyles: false,
      translations: {
        placeholder: 'Tìm kiếm bài viết…',
        zero_results: 'Không tìm thấy kết quả cho [SEARCH_TERM]',
        many_results: '[COUNT] kết quả cho [SEARCH_TERM]',
        one_result: '[COUNT] kết quả cho [SEARCH_TERM]',
        search: 'Tìm kiếm',
        load_more: 'Xem thêm kết quả',
        search_label: 'Tìm kiếm bài viết'
      }
    });
  }
})();