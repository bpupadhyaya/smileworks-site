/* smileworks site: mascot, floating tiles, shapes, gallery and a small playable Snug taster. */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COLORS = ['blue', 'red', 'yellow', 'green', 'orange'];
  var ALL = ['blue', 'red', 'yellow', 'green', 'orange', 'indigo', 'pink', 'teal'];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- mascot ---------- */
  var MASCOT = '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
    '<ellipse cx="100" cy="188" rx="58" ry="8" fill="rgba(0,0,0,.2)"/>' +
    '<g class="arms"><ellipse cx="22" cy="118" rx="16" ry="11" fill="#f472b6" transform="rotate(-28 22 118)"/><ellipse cx="178" cy="118" rx="16" ry="11" fill="#f472b6" transform="rotate(28 178 118)"/></g>' +
    '<circle cx="48" cy="52" r="26" fill="#f472b6"/><circle cx="152" cy="52" r="26" fill="#f472b6"/>' +
    '<circle cx="48" cy="52" r="14" fill="#ffc2de"/><circle cx="152" cy="52" r="14" fill="#ffc2de"/>' +
    '<circle cx="100" cy="112" r="76" fill="#f472b6"/>' +
    '<ellipse cx="100" cy="132" rx="38" ry="30" fill="#fff1e4"/>' +
    '<circle cx="62" cy="122" r="12" fill="#ff8fc0" opacity=".85"/><circle cx="138" cy="122" r="12" fill="#ff8fc0" opacity=".85"/>' +
    '<g class="blink"><circle cx="72" cy="98" r="11" fill="#2a1f4d"/><circle cx="128" cy="98" r="11" fill="#2a1f4d"/>' +
    '<circle class="pupil" cx="75" cy="94" r="4.2" fill="#fff"/><circle class="pupil" cx="131" cy="94" r="4.2" fill="#fff"/></g>' +
    '<ellipse cx="100" cy="118" rx="9" ry="6.5" fill="#2a1f4d"/>' +
    '<path class="mouth-smile" d="M82 134 Q100 156 118 134 Q100 142 82 134Z" fill="#2a1f4d" stroke="#2a1f4d" stroke-width="4" stroke-linejoin="round"/>' +
    '<path class="mouth-o" d="M84 134 Q100 168 116 134Z" fill="#2a1f4d"/><ellipse class="mouth-o" cx="100" cy="148" rx="8" ry="5" fill="#ff7aa8"/>' +
    '</svg>';
  var mascots = [].slice.call(document.querySelectorAll('[data-snuggle]'));
  mascots.forEach(function (m) { m.classList.add('snuggle'); m.innerHTML = MASCOT; });
  function cheer(el, ms) { el.classList.add('cheer'); setTimeout(function () { el.classList.remove('cheer'); }, ms || 1100); }
  $('#bigMascot').addEventListener('click', function () { cheer(this, 1500); burst(innerWidth / 2, innerHeight / 2, ALL, 40); beep(3); });
  document.addEventListener('pointermove', function (e) {
    mascots.forEach(function (m) {
      var r = m.getBoundingClientRect();
      if (!r.width) return;
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var d = Math.max(1, Math.hypot(dx, dy)), k = Math.min(1, d / 200) * 5;
      var s = 'translate(' + (dx / d * k).toFixed(1) + 'px,' + (dy / d * k).toFixed(1) + 'px)';
      [].forEach.call(m.querySelectorAll('.pupil'), function (p) { p.style.transform = s; });
    });
  }, { passive: true });

  /* ---------- wordmark ---------- */
  var wm = $('#wordmark');
  'smileworks'.split('').forEach(function (ch, i) {
    var s = document.createElement('span');
    s.textContent = ch; s.style.setProperty('--i', i);
    s.style.setProperty('--c', 'var(--' + ALL[i % ALL.length] + ')');
    wm.appendChild(s);
  });

  /* ---------- nav + reveal ---------- */
  var nav = $('#nav');
  function onScroll() { nav.classList.toggle('solid', scrollY > 40); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  [].forEach.call(document.querySelectorAll('.reveal'), function (el) { io ? io.observe(el) : el.classList.add('in'); });

  /* ---------- confetti ---------- */
  var cv = $('#confetti'), cx = cv.getContext('2d'), parts = [], raf = 0;
  function fit() { cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio; }
  addEventListener('resize', fit); fit();
  var HEX = { blue: '#3b82f6', red: '#ef4b4b', yellow: '#fbbf24', green: '#34b36a', orange: '#fb923c', indigo: '#6366f1', pink: '#f472b6', teal: '#14b8a6' };
  function burst(x, y, cols, n) {
    if (reduce) return;
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, v = 3 + Math.random() * 7;
      parts.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, r: 4 + Math.random() * 5, c: HEX[cols[i % cols.length]] || '#fff', life: 70 + Math.random() * 30, rot: Math.random() * 6, vr: Math.random() * 0.3 - 0.15 });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    var d = devicePixelRatio;
    parts = parts.filter(function (p) { return p.life-- > 0; });
    parts.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.vx *= 0.99; p.rot += p.vr;
      cx.save(); cx.translate(p.x * d, p.y * d); cx.rotate(p.rot); cx.globalAlpha = Math.min(1, p.life / 25); cx.fillStyle = p.c;
      cx.fillRect(-p.r * d, -p.r * d * 0.6, p.r * 2 * d, p.r * 1.2 * d); cx.restore();
    });
    raf = parts.length ? requestAnimationFrame(tick) : 0;
    if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
  }

  /* ---------- sound ---------- */
  var ac = null, soundOn = store('sw-sound') !== '0', PENTA = [0, 2, 4, 7, 9];
  function beep(i, dur) {
    if (!soundOn) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var o = ac.createOscillator(), g = ac.createGain(), f = 392 * Math.pow(2, (PENTA[i % 5] + 12 * Math.floor(i / 5)) / 12);
      o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, ac.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + (dur || 0.28));
      o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + (dur || 0.28) + 0.02);
    } catch (e) { /* audio unavailable */ }
  }
  var snd = $('#snd');
  function paintSnd() { snd.classList.toggle('off', !soundOn); var l = snd.querySelector('span'); if (l) l.textContent = soundOn ? 'Sound' : 'Muted'; }
  snd.addEventListener('click', function () { soundOn = !soundOn; store('sw-sound', soundOn ? '1' : '0'); paintSnd(); beep(2); }); paintSnd();

  /* ---------- smile counter + floating tiles ---------- */
  var smiles = 0, smileEl = $('#smileCount');
  function addSmile(n) { smiles += n; smileEl.textContent = smiles; }
  var ft = $('#floatTiles');
  function scatter(t) {
    t.style.setProperty('--x', (Math.random() * 92).toFixed(1) + '%');
    t.style.setProperty('--y', (6 + Math.random() * 78).toFixed(1) + '%');
    t.style.setProperty('--size', (28 + Math.random() * 46).toFixed(0) + 'px');
    t.style.setProperty('--rot', (Math.random() * 50 - 25).toFixed(0) + 'deg');
    t.style.setProperty('--depth', (0.4 + Math.random() * 1.4).toFixed(2));
    t.style.setProperty('--dur', (5 + Math.random() * 5).toFixed(1) + 's');
    t.style.setProperty('--delay', (-Math.random() * 6).toFixed(1) + 's');
  }
  for (var i = 0; i < 18; i++) {
    var t = document.createElement('span');
    t.className = 'tile t-' + ALL[i % ALL.length]; scatter(t);
    t.addEventListener('click', function (e) {
      var el = e.currentTarget, r = el.getBoundingClientRect();
      if (el.classList.contains('pop')) return;
      el.classList.add('pop'); burst(r.left + r.width / 2, r.top + r.height / 2, [el.className.split('t-')[1].split(' ')[0], 'yellow', 'pink'], 18);
      addSmile(1); beep(Math.floor(Math.random() * 8));
      setTimeout(function () { scatter(el); el.classList.remove('pop'); }, 1800);
    });
    ft.appendChild(t);
  }
  if (!reduce) document.addEventListener('pointermove', function (e) {
    ft.style.setProperty('--px', ((e.clientX / innerWidth - 0.5) * -30).toFixed(1));
    ft.style.setProperty('--py', ((e.clientY / innerHeight - 0.5) * -30).toFixed(1));
  }, { passive: true });
  /* sparkle trail on the hero */
  var lastSp = 0, hero = $('.hero');
  if (!reduce) hero.addEventListener('pointermove', function (e) {
    var n = Date.now(); if (n - lastSp < 45) return; lastSp = n;
    var s = document.createElement('i'); s.className = 'sparkle'; s.style.left = e.clientX - 6 + 'px'; s.style.top = e.clientY - 6 + 'px';
    document.body.appendChild(s); setTimeout(function () { s.remove(); }, 700);
  });

  /* ---------- gallery: 3D coverflow ---------- */
  var rail = $('#rail'), dotsEl = $('#dots'), shots = [], cur = 0, userTouched = false;
  for (var g = 1; g <= 8; g++) {
    var im = new Image(); im.src = 'assets/shot-' + g + '.jpg'; im.alt = 'Snug gameplay screenshot ' + g + ' of 8';
    im.width = 540; im.height = 960; im.loading = g < 4 ? 'eager' : 'lazy'; im.decoding = 'async';
    var f = document.createElement('div'); f.className = 'shot'; f.appendChild(im); rail.appendChild(f); shots.push(f);
    var d = document.createElement('i'); d.dataset.i = g - 1; dotsEl.appendChild(d);
  }
  var dots = [].slice.call(dotsEl.children);
  function step() { return shots[0].offsetWidth + 26; }
  function goTo(i) { cur = Math.max(0, Math.min(shots.length - 1, i)); rail.scrollTo({ left: cur * step(), behavior: reduce ? 'auto' : 'smooth' }); }
  function layout() {
    var mid = rail.scrollLeft + parseFloat(getComputedStyle(rail).paddingLeft) + shots[0].offsetWidth / 2, best = 0, bd = 1e9;
    shots.forEach(function (s, i) {
      var off = (s.offsetLeft + s.offsetWidth / 2 - mid) / (s.offsetWidth + 26), a = Math.max(-2.5, Math.min(2.5, off)), ab = Math.min(1, Math.abs(a));
      s.style.transform = reduce ? '' : 'perspective(1100px) translateZ(' + (-ab * 90) + 'px) rotateY(' + (-a * 22).toFixed(1) + 'deg) scale(' + (1 - ab * 0.1).toFixed(3) + ')';
      s.style.opacity = (1 - Math.min(1, Math.abs(a)) * 0.35).toFixed(2); s.style.zIndex = 10 - Math.round(Math.abs(a) * 3);
      if (Math.abs(off) < bd) { bd = Math.abs(off); best = i; }
    });
    cur = best; dots.forEach(function (d, i) { d.classList.toggle('on', i === best); });
  }
  var ticking = false;
  rail.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; layout(); }); } }, { passive: true });
  addEventListener('resize', layout);
  shots.forEach(function (s, i) { s.addEventListener('click', function () { userTouched = true; goTo(i); }); });
  dots.forEach(function (d, i) { d.addEventListener('click', function () { userTouched = true; goTo(i); }); });
  $('#next').onclick = function () { userTouched = true; goTo(cur + 1); };
  $('#prev').onclick = function () { userTouched = true; goTo(cur - 1); };
  ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(function (ev) { rail.addEventListener(ev, function () { userTouched = true; }, { passive: true }); });
  rail.tabIndex = 0; rail.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') goTo(cur + 1); if (e.key === 'ArrowLeft') goTo(cur - 1); });
  layout();
  var inView = false;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: 0.4 }).observe(rail);
  if (!reduce) setInterval(function () { if (inView && !userTouched) goTo(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 6 ? 0 : cur + 1); }, 3600);

  /* ---------- signature shapes ---------- */
  var SIG = [
    ['blue', 'Square', 'Blue loves a square', ['XX', 'XX']],
    ['red', 'Line', 'Red likes it straight', ['XXX']],
    ['yellow', 'Corner', 'Yellow turns a corner', ['XX', 'X.']],
    ['green', 'Tee', 'Green is a tidy T', ['XXX', '.X.']],
    ['orange', 'Plus', 'Orange adds it up', ['.X.', 'XXX', '.X.']],
    ['indigo', 'Zigzag', 'Indigo zigs and zags', ['.XX', 'XX.']],
    ['pink', 'Ring', 'Pink goes around', ['XXX', 'X.X', 'XXX']],
    ['teal', 'Big square', 'Teal thinks big', ['XXX', 'XXX', 'XXX']]
  ];
  var sh = $('#shapes');
  SIG.forEach(function (s, idx) {
    var d = document.createElement('div'); d.className = 'shape reveal'; d.style.transitionDelay = idx * 50 + 'ms';
    var w = s[3][0].length, grid = '<div class="grid" style="grid-template-columns:repeat(' + w + ',24px)">';
    s[3].forEach(function (row) { row.split('').forEach(function (c) { grid += c === 'X' ? '<span class="tile t-' + s[0] + '"></span>' : '<i></i>'; }); });
    d.innerHTML = grid + '</div><b>' + s[1] + '</b><span>' + s[2] + '</span>';
    sh.appendChild(d); io ? io.observe(d) : d.classList.add('in');
  });

  /* ---------- Snug taster ---------- */
  var N = 8, board = $('#board'), tray = $('#tray'), scoreEl = $('#score'), bestEl = $('#best'), bubble = $('#bubble'), gm = $('#gameMascot'), over = $('#over');
  var DEFS = ['X', 'X', 'XX', 'X/X', 'XX', 'X/X', 'XXX', 'X/X/X', 'XX/XX', 'XX/XX', 'XX/X.', '.X/XX', 'X./XX', 'XX/.X', 'XXX/.X.', 'X./X./XX', 'XXXX', 'X/X/X/X', '.XX/XX.', 'XX./.XX', 'XXX/X..', 'XXX/XXX'];
  var SHAPES = DEFS.map(function (d) {
    var rows = d.split('/'), cells = [];
    rows.forEach(function (r, y) { r.split('').forEach(function (c, x) { if (c === 'X') cells.push([y, x]); }); });
    return { cells: cells, h: rows.length, w: rows[0].length };
  });
  var grid, pieces, score, best = +store('sw-best') || 0, combo, selected = -1, busy = false, cellEls = [], gLines = 0, todayLines = 0, LVL_NAMES = ['Warm up', 'Getting snug', 'Big corners', 'Long and tee', 'Square one', 'Full bloom', 'Tidy tiles', 'Pop party'];
  bestEl.textContent = best;
  for (var k = 0; k < N * N; k++) { var c = document.createElement('div'); c.className = 'cell'; c.dataset.i = k; board.appendChild(c); cellEls.push(c); }

  function say(t, ms) { bubble.textContent = t; bubble.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(function () { bubble.classList.remove('show'); }, ms || 1500); }
  function render() {
    for (var i = 0; i < N * N; i++) {
      var v = grid[(i / N) | 0][i % N], el = cellEls[i], has = el.firstChild;
      if (v < 0 && has) el.removeChild(has);
      if (v >= 0 && !has) { var t = document.createElement('span'); t.className = 'tile t-' + COLORS[v]; el.appendChild(t); }
      if (v >= 0 && has) has.className = 'tile t-' + COLORS[v];
    }
    scoreEl.textContent = score; updateHud();
  }
  function updateHud() {
    var lvl = 1 + Math.floor(gLines / 4), set = function (id, fn) { var e = $(id); if (e) fn(e); };
    set('#lvl', function (e) { e.textContent = lvl; }); set('#comboN', function (e) { e.textContent = combo || 0; });
    set('#lvlName', function (e) { e.textContent = 'Level ' + lvl + ': ' + LVL_NAMES[(lvl - 1) % LVL_NAMES.length]; });
    set('#meter', function (e) { e.style.width = (6 + (gLines % 4) / 4 * 94).toFixed(0) + '%'; });
    set('#today', function (e) { e.textContent = Math.min(8, todayLines); }); set('#meter2', function (e) { e.style.width = (Math.min(8, todayLines) / 8 * 100) + '%'; });
  }
  function newPiece() { var s = SHAPES[(Math.random() * SHAPES.length) | 0]; return { cells: s.cells, w: s.w, h: s.h, color: (Math.random() * COLORS.length) | 0 }; }
  function drawTray() {
    tray.innerHTML = '';
    pieces.forEach(function (p, i) {
      var slot = document.createElement('div'); slot.className = 'slot' + (p ? '' : ' empty') + (selected === i ? ' sel' : ''); slot.dataset.i = i;
      if (p) {
        var el = document.createElement('div'); el.className = 'piece'; el.style.gridTemplateColumns = 'repeat(' + p.w + ',var(--ps))';
        for (var y = 0; y < p.h; y++) for (var x = 0; x < p.w; x++) {
          var on = p.cells.some(function (c) { return c[0] === y && c[1] === x; });
          if (on) { var t = document.createElement('span'); t.className = 'tile t-' + COLORS[p.color]; el.appendChild(t); } else el.appendChild(document.createElement('i'));
        }
        slot.appendChild(el);
      }
      slot.addEventListener('pointerdown', startDrag); tray.appendChild(slot);
    });
  }
  function fits(p, r, c) {
    return p.cells.every(function (q) { var y = r + q[0], x = c + q[1]; return y >= 0 && y < N && x >= 0 && x < N && grid[y][x] < 0; });
  }
  function anyFits(p) { for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) if (fits(p, r, c)) return [r, c]; return null; }
  function reset() {
    grid = []; for (var r = 0; r < N; r++) { grid.push([]); for (var c = 0; c < N; c++) grid[r].push(-1); }
    score = 0; combo = 0; gLines = 0; selected = -1; busy = false; over.classList.remove('show');
    pieces = [newPiece(), newPiece(), newPiece()]; render(); drawTray(); say('Hi! Fit the shapes.', 2200);
  }
  function clearGhost() { cellEls.forEach(function (e) { e.classList.remove('ghost', 'bad', 'preview-line'); e.style.removeProperty('--gc'); }); }
  function showGhost(p, r, c) {
    clearGhost(); var ok = fits(p, r, c);
    p.cells.forEach(function (q) { var y = r + q[0], x = c + q[1]; if (y >= 0 && y < N && x >= 0 && x < N) { var e = cellEls[y * N + x]; e.classList.add('ghost'); if (!ok) e.classList.add('bad'); e.style.setProperty('--gc', HEX[COLORS[p.color]]); } });
    return ok;
  }
  function cellSize() { return board.getBoundingClientRect().width / N; }

  var drag = null;
  function startDrag(e) {
    if (busy) return; var i = +this.dataset.i, p = pieces[i]; if (!p) return;
    e.preventDefault(); selected = i; drawTray();
    var cs = cellSize(), el = document.createElement('div'); el.className = 'drag'; el.style.gridTemplateColumns = 'repeat(' + p.w + ',' + cs + 'px)';
    el.style.setProperty('--cell', cs + 'px');
    for (var y = 0; y < p.h; y++) for (var x = 0; x < p.w; x++) {
      var on = p.cells.some(function (c) { return c[0] === y && c[1] === x; });
      if (on) { var t = document.createElement('span'); t.className = 'tile t-' + COLORS[p.color]; el.appendChild(t); } else el.appendChild(document.createElement('i'));
    }
    document.body.appendChild(el);
    drag = { i: i, p: p, el: el, cs: cs, lift: e.pointerType === 'mouse' ? 14 : 70, moved: false, sx: e.clientX, sy: e.clientY, ok: false, r: 0, c: 0 };
    moveDrag(e);
    addEventListener('pointermove', moveDrag); addEventListener('pointerup', endDrag); addEventListener('pointercancel', cancelDrag);
  }
  function moveDrag(e) {
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) drag.moved = true;
    var left = e.clientX - drag.p.w * drag.cs / 2, top = e.clientY - drag.p.h * drag.cs / 2 - drag.lift;
    drag.el.style.left = left + 'px'; drag.el.style.top = top + 'px';
    var br = board.getBoundingClientRect();
    drag.c = Math.round((left - br.left) / drag.cs); drag.r = Math.round((top - br.top) / drag.cs);
    drag.ok = showGhost(drag.p, drag.r, drag.c);
  }
  function endDrag() {
    if (!drag) return; var d = drag; stopDrag();
    if (d.moved) { if (d.ok) place(d.i, d.r, d.c); else { board.classList.remove('shake'); void board.offsetWidth; if (!reduce) board.classList.add('shake'); beep(0, 0.12); } }
    else { selected = d.i; drawTray(); say('Now tap the board', 1400); }
  }
  function cancelDrag() { stopDrag(); }
  function stopDrag() { removeEventListener('pointermove', moveDrag); removeEventListener('pointerup', endDrag); removeEventListener('pointercancel', cancelDrag); if (drag) drag.el.remove(); drag = null; clearGhost(); }

  /* tap-to-place: tap a piece, then tap a board cell (piece top-left lands there, nudged to fit) */
  board.addEventListener('click', function (e) {
    if (busy || selected < 0 || !pieces[selected]) return;
    var t = e.target.closest('.cell'); if (!t) return; var i = +t.dataset.i, r = (i / N) | 0, c = i % N, p = pieces[selected];
    r = Math.min(r, N - p.h); c = Math.min(c, N - p.w);
    if (fits(p, r, c)) place(selected, r, c); else { beep(0, 0.12); say('Does not fit there', 1100); }
  });

  function popText(txt, x, y) { var s = document.createElement('div'); s.className = 'float-pop'; s.textContent = txt; s.style.left = x - 20 + 'px'; s.style.top = y - 10 + 'px'; document.body.appendChild(s); setTimeout(function () { s.remove(); }, 1000); }

  function place(i, r, c) {
    var p = pieces[i]; busy = true; clearGhost();
    p.cells.forEach(function (q) { grid[r + q[0]][c + q[1]] = p.color; });
    pieces[i] = null; selected = -1; score += p.cells.length; beep(p.cells.length % 5);
    render();
    var rows = [], cols = [];
    for (var y = 0; y < N; y++) if (grid[y].every(function (v) { return v >= 0; })) rows.push(y);
    for (var x = 0; x < N; x++) { var full = true; for (var yy = 0; yy < N; yy++) if (grid[yy][x] < 0) { full = false; break; } if (full) cols.push(x); }
    var lines = rows.length + cols.length, br = board.getBoundingClientRect(), cs = br.width / N;
    if (lines) {
      combo++; gLines += lines; todayLines += lines; var gain = lines * lines * 10 + (combo - 1) * 10, cols2 = [];
      var kill = {}; rows.forEach(function (y) { for (var x = 0; x < N; x++) kill[y * N + x] = 1; }); cols.forEach(function (x) { for (var y = 0; y < N; y++) kill[y * N + x] = 1; });
      Object.keys(kill).forEach(function (k) { var v = grid[(k / N) | 0][k % N]; cols2.push(COLORS[v]); cellEls[k].classList.add('clearing'); });
      for (var n = 0; n < lines + 2; n++) setTimeout(beep.bind(null, n + 1, 0.22), n * 70);
      burst(br.left + br.width / 2, br.top + br.height / 2, cols2, 20 + lines * 16);
      popText('+' + gain, br.left + br.width / 2, br.top + br.height / 2); addSmile(lines);
      score += gain; cheer(gm, 1200);
      say(lines > 1 ? 'Combo x' + lines + '!' : (combo > 1 ? 'Streak x' + combo + '!' : ['Snug!', 'Pop!', 'Lovely!'][(Math.random() * 3) | 0]), 1500);
      setTimeout(function () { Object.keys(kill).forEach(function (k) { grid[(k / N) | 0][k % N] = -1; cellEls[k].classList.remove('clearing'); }); render(); next(); }, 390);
    } else { combo = 0; next(); }
  }
  function next() {
    busy = false;
    if (pieces.every(function (p) { return !p; })) pieces = [newPiece(), newPiece(), newPiece()];
    drawTray();
    var live = pieces.filter(Boolean);
    if (live.every(function (p) { return !anyFits(p); })) return gameOver();
    var filled = 0; grid.forEach(function (r) { r.forEach(function (v) { if (v >= 0) filled++; }); });
    if (filled > 44 && Math.random() < 0.25) say('Getting snug in here...', 1500);
    if (score > best) { best = score; bestEl.textContent = best; store('sw-best', String(best)); }
  }
  function gameOver() {
    if (score > best) { best = score; store('sw-best', String(best)); bestEl.textContent = best; }
    $('#overMsg').textContent = 'Score ' + score + (score >= best && score > 0 ? ' · new best!' : '') + '. Want another go?';
    over.classList.add('show'); cheer(over.querySelector('.snuggle'), 2000); burst(innerWidth / 2, innerHeight / 2, ALL, 30); beep(7, 0.5);
  }
  $('#hint').onclick = function () {
    if (busy) return;
    for (var i = 0; i < 3; i++) { var p = pieces[i]; if (!p) continue; var pos = anyFits(p); if (pos) { showGhost(p, pos[0], pos[1]); selected = i; drawTray(); say('Try this one here', 1600); setTimeout(clearGhost, 1600); return; } }
  };
  $('#restart').onclick = reset; $('#shuffle').onclick = function () { if (busy) return; pieces = pieces.map(function () { return newPiece(); }); selected = -1; drawTray(); say('Fresh shapes!', 1200); if (pieces.every(function (p) { return !anyFits(p); })) gameOver(); };
  $('#again').onclick = reset;

  /* ---------- 3D: hero phone, card tilt, fab, counters ---------- */
  var p3 = $('#phone3d'), lastMove = 0, t0 = performance.now();
  var ptr = { x: 0, y: 0 };
  document.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; lastMove = performance.now(); ptr.x = e.clientX / innerWidth - 0.5; ptr.y = e.clientY / innerHeight - 0.5; }, { passive: true });
  (function sway(now) {
    if (!reduce) {
      var idle = now - lastMove > 2500, x, y;
      if (idle) { x = Math.sin((now - t0) / 1500) * 0.5; y = Math.cos((now - t0) / 1900) * 0.3; } else { x = ptr.x; y = ptr.y; }
      p3.style.setProperty('--ry', (-16 + x * 36).toFixed(1) + 'deg'); p3.style.setProperty('--rx', (8 - y * 26).toFixed(1) + 'deg');
    }
    requestAnimationFrame(sway);
  })(performance.now());

  [].forEach.call(document.querySelectorAll('.game-card,.shape,.feat,.step,.final-img'), function (el) { el.setAttribute('data-tilt', ''); });
  [].forEach.call(document.querySelectorAll('[data-tilt]'), function (el) {
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--try', ((x - 0.5) * 14).toFixed(1) + 'deg'); el.style.setProperty('--trx', ((0.5 - y) * 14).toFixed(1) + 'deg');
      el.style.setProperty('--gx', (x * 100).toFixed(0) + '%'); el.style.setProperty('--gy', (y * 100).toFixed(0) + '%'); el.classList.add('hot');
    });
    el.addEventListener('pointerleave', function () { el.style.setProperty('--try', '0deg'); el.style.setProperty('--trx', '0deg'); el.classList.remove('hot'); });
  });

  var fab = $('#fab'), away = { play: false, get: false };
  function fabUpdate() { fab.classList.toggle('show', scrollY > 600 && !away.play && !away.get); }
  if (io) {
    var fio = new IntersectionObserver(function (es) { es.forEach(function (e) { away[e.target.id === 'play' ? 'play' : 'get'] = e.isIntersecting; }); fabUpdate(); }, { threshold: 0.15 });
    fio.observe($('#play')); fio.observe($('#get'));
  }
  addEventListener('scroll', fabUpdate, { passive: true });
  [].forEach.call(document.querySelectorAll('[data-count]'), function (el) {
    var to = +el.dataset.count, seen = false;
    new IntersectionObserver(function (es, ob) { if (es[0].isIntersecting && !seen) { seen = true; ob.disconnect(); if (reduce) return; var st = performance.now(); (function f(n) { var k = Math.min(1, (n - st) / 900); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(st); } }, { threshold: 0.6 }).observe(el);
  });
  reset();
})();
