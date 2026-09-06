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

  // ---------- Lịch sử cập nhật (GitHub Actions runs) ----------
  var runsList = document.getElementById('github-runs-list');
  var runsFallback = document.getElementById('github-runs-fallback');
  var runsPager = document.getElementById('github-runs-pager');
  var runsPrev = document.getElementById('github-runs-prev');
  var runsNext = document.getElementById('github-runs-next');
  var runsPage = 1;
  var runsTotal = 0;
  var RUNS_PER_PAGE = 3;

  function runsStatusDot(status, conclusion) {
    if (status !== 'completed') return 'bg-amber-400 dark:bg-amber-500';
    if (conclusion === 'success') return 'bg-emerald-500';
    if (conclusion === 'failure' || conclusion === 'cancelled' || conclusion === 'timed_out') return 'bg-red-500';
    return 'bg-slate-400 dark:bg-slate-500';
  }

  function runsStatusText(status, conclusion) {
    if (status !== 'completed') return 'Đang chạy';
    if (conclusion === 'success') return 'Thành công';
    if (conclusion === 'failure') return 'Thất bại';
    if (conclusion === 'cancelled') return 'Đã hủy';
    if (conclusion === 'timed_out') return 'Quá thời gian';
    return conclusion || status;
  }

  function runsTime(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function runsRender(runs) {
    if (!runsList) return;
    runsList.innerHTML = '';
    runs.forEach(function (run) {
      var li = document.createElement('li');
      li.className = 'flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-2.5 dark:border-slate-800';

      var dot = document.createElement('span');
      dot.className = 'h-2.5 w-2.5 shrink-0 rounded-full ' + runsStatusDot(run.status, run.conclusion);
      dot.title = runsStatusText(run.status, run.conclusion);
      dot.setAttribute('aria-hidden', 'true');

      var a = document.createElement('a');
      a.href = run.html_url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'min-w-0 flex-1 truncate text-sm font-medium text-slate-700 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400';
      a.textContent = (run.head_commit && run.head_commit.message ? run.head_commit.message.split('\n')[0] : (run.display_title || run.name || 'Run #' + run.run_number)).slice(0, 90);

      var meta = document.createElement('span');
      meta.className = 'shrink-0 text-xs text-slate-400 dark:text-slate-500';
      meta.textContent = '#' + run.run_number + ' · ' + runsTime(run.created_at);

      li.appendChild(dot);
      li.appendChild(a);
      li.appendChild(meta);
      runsList.appendChild(li);
    });
  }

  function runsUpdatePager() {
    if (!runsPager) return;
    var hasMore = runsTotal > RUNS_PER_PAGE;
    runsPager.classList.toggle('hidden', !hasMore);
    if (runsPrev) runsPrev.disabled = runsPage <= 1;
    if (runsNext) runsNext.disabled = runsPage * RUNS_PER_PAGE >= runsTotal;
  }

  function runsLoad(page) {
    if (!runsList) return;
    fetch('https://api.github.com/repos/duynguyen9988/bloghoctap/actions/runs?per_page=' + RUNS_PER_PAGE + '&page=' + page)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        runsTotal = data.total_count || 0;
        runsPage = page;
        runsRender(data.workflow_runs || []);
        runsUpdatePager();
        if (runsFallback) runsFallback.classList.add('hidden');
      })
      .catch(function () {
        if (runsFallback) runsFallback.classList.remove('hidden');
        if (runsPager) runsPager.classList.add('hidden');
      });
  }

  if (runsPrev) runsPrev.addEventListener('click', function () {
    if (runsPage > 1) runsLoad(runsPage - 1);
  });
  if (runsNext) runsNext.addEventListener('click', function () {
    if (runsPage * RUNS_PER_PAGE < runsTotal) runsLoad(runsPage + 1);
  });

  runsLoad(1);

  // ---------- Lịch sử cập nhật bài viết trên blog ----------
  var historyList = document.getElementById('blog-history-list');
  var historyFallback = document.getElementById('blog-history-fallback');

  function historyEmoji(msg) {
    var m = (msg || '').toLowerCase();
    if (/feat|thêm|bài mới|bài viết mới/.test(m)) return '✨';
    if (/fix|sửa|cải thiện/.test(m)) return '🔧';
    if (/readme|docs|tài liệu/.test(m)) return '📚';
    if (/bỏ|xóa|remove/.test(m)) return '🧹';
    if (/deploy|triển khai/.test(m)) return '🚀';
    return '📝';
  }

  function historyDot(emoji) {
    var colors = {
      '✨': 'bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300',
      '🔧': 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
      '📚': 'bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300',
      '🧹': 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
      '🚀': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
      '📝': 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
    };
    return colors[emoji] || colors['📝'];
  }

  function historyTime(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function historyRender(commits) {
    if (!historyList) return;
    historyList.innerHTML = '';
    commits.forEach(function (c) {
      var msg = (c.commit && ((c.commit.message || '').split('\n')[0])) || 'Cập nhật';
      var emoji = historyEmoji(msg);

      var li = document.createElement('li');
      li.className = 'relative flex items-start gap-3';

      var dot = document.createElement('span');
      dot.className = 'relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base shadow-sm ring-4 ring-white dark:ring-slate-900 ' + historyDot(emoji);
      dot.textContent = emoji;
      dot.setAttribute('aria-hidden', 'true');

      var card = document.createElement('div');
      card.className = 'min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-800';

      var row = document.createElement('div');
      row.className = 'flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1';

      var title = document.createElement('span');
      title.className = 'min-w-0 flex-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200';
      title.textContent = msg.slice(0, 80);
      title.title = msg;

      var meta = document.createElement('span');
      meta.className = 'shrink-0 text-xs text-slate-400 dark:text-slate-500';
      meta.textContent = historyTime(c.commit && c.commit.committer && c.commit.committer.date);

      row.appendChild(title);
      row.appendChild(meta);

      var sha = document.createElement('div');
      sha.className = 'mt-0.5 text-xs text-blue-600 dark:text-blue-400';
      sha.textContent = (c.sha || '').slice(0, 7);

      card.appendChild(row);
      card.appendChild(sha);
      li.appendChild(dot);
      li.appendChild(card);
      historyList.appendChild(li);
    });
  }

  function historyLoad() {
    if (!historyList) return;
    fetch('https://api.github.com/repos/duynguyen9988/bloghoctap/commits?path=content/posts&per_page=8')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!Array.isArray(data)) throw new Error('Invalid payload');
        historyRender(data);
        if (historyFallback) historyFallback.classList.add('hidden');
      })
      .catch(function () {
        if (historyFallback) historyFallback.classList.remove('hidden');
      });
  }

  historyLoad();
})();