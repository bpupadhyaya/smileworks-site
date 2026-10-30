(function () {
  'use strict';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hero phone follows the pointer
  var stage = document.querySelector('.stage3d'), ph = document.querySelector('.stage3d .phone3d');
  if (stage && ph && !reduce) {
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      ph.style.setProperty('--ry', (-16 + x * 30) + 'deg'); ph.style.setProperty('--rx', (6 - y * 22) + 'deg');
    });
    stage.addEventListener('pointerleave', function () { ph.style.setProperty('--ry', '-16deg'); ph.style.setProperty('--rx', '6deg'); });
  }
  // decor
  var d = document.querySelector('.decor');
  if (d) {
    var cols = ['#f2b632', '#e4572e', '#2a9d8f', '#8e4a7a', '#fbf1dc'], n = 16;
    for (var i = 0; i < n; i++) {
      var el = document.createElement('i'), s = 14 + Math.random() * 30;
      el.style.setProperty('--x', (Math.random() * 100) + '%'); el.style.setProperty('--s', s + 'px');
      el.style.setProperty('--d', (9 + Math.random() * 10) + 's'); el.style.setProperty('--dl', (-Math.random() * 14) + 's');
      el.style.setProperty('--pc', cols[i % cols.length]); d.appendChild(el);
    }
  }
  // 3D coverflow
  var cf = document.querySelector('.cf'); if (!cf) return;
  var items = [].slice.call(cf.querySelectorAll('.cf-item')), dots = [].slice.call(document.querySelectorAll('.cf-dots b')), cur = 0, timer;
  function paint() {
    var half = cf.clientWidth < 700 ? 150 : 215;
    items.forEach(function (it, i) {
      var o = i - cur, a = Math.abs(o);
      it.style.transform = 'translateX(' + (o * half) + 'px) translateZ(' + (-a * 130) + 'px) rotateY(' + (o === 0 ? 0 : o > 0 ? -42 : 42) + 'deg) scale(' + (o === 0 ? 1.06 : 0.94) + ')';
      it.style.zIndex = 10 - a; it.style.opacity = a > 2 ? 0 : 1; it.style.filter = o === 0 ? 'none' : 'brightness(.82) saturate(.9)';
    });
    dots.forEach(function (b, i) { b.classList.toggle('on', i === cur); });
  }
  function go(i) { cur = (i + items.length) % items.length; paint(); }
  items.forEach(function (it, i) { it.addEventListener('click', function () { go(i); }); });
  var p = document.querySelector('.cf-prev'), nx = document.querySelector('.cf-next');
  if (p) p.addEventListener('click', function () { go(cur - 1); stop(); }); if (nx) nx.addEventListener('click', function () { go(cur + 1); stop(); });
  var sx = null; cf.addEventListener('pointerdown', function (e) { sx = e.clientX; });
  addEventListener('pointerup', function (e) { if (sx !== null) { var dx = e.clientX - sx; if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); stop(); } sx = null; } });
  function stop() { clearInterval(timer); }
  if (!reduce) timer = setInterval(function () { go(cur + 1); }, 3200);
  addEventListener('resize', paint); paint();
})();
