(function () {
  'use strict';

  /* 1. Scroll Reveal Animations */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function (el) { obs.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('revealed'); });
    }
  }

  /* 2. Ripple Effect on Buttons */
  function initRipple() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.btn, .draw-launch-btn, .group-to-ko-link, .contact-detail, .tab-btn, .group-nav-btn');
      if (!btn) return;
      var rect = btn.getBoundingClientRect();
      var r = document.createElement('span');
      r.className = 'ripple-effect';
      r.style.cssText =
        'position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);' +
        'width:60px;height:60px;left:' + (e.clientX - rect.left - 30) + 'px;' +
        'top:' + (e.clientY - rect.top - 30) + 'px;' +
        'animation:rippleAnim 0.6s ease-out forwards;pointer-events:none;z-index:5;';
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(r);
      setTimeout(function () { r.remove(); }, 700);
    });
  }

  /* 3. Scroll Progress Bar */
  function initScrollProgress() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    bar.style.cssText =
      'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--primary),var(--secondary));' +
      'z-index:10001;transition:width 0.1s linear;width:0%;';
    document.body.appendChild(bar);
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) { bar.style.width = '0%'; return; }
      var pct = (window.scrollY / h) * 100;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
  }

  /* 4. Animated Count-up for elements with data-count */
  function initCountUp() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { animateCount(el); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { obs.observe(el); });
  }
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    var current = 0;
    var step = Math.max(1, Math.floor(target / 40));
    var dur = Math.min(1500, Math.max(500, target * 8));
    var interval = Math.floor(dur / (target / step));
    el.textContent = '0';
    function tick() {
      current += step;
      if (current >= target) { el.textContent = target; return; }
      el.textContent = current;
      setTimeout(tick, interval);
    }
    tick();
  }

  /* 5. Cursor Glow (gaming trail) */
  function initCursorGlow() {
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    glow.style.cssText =
      'position:fixed;pointer-events:none;z-index:99999;' +
      'width:200px;height:200px;border-radius:50%;' +
      'background:radial-gradient(circle,rgba(108,60,225,0.06) 0%,transparent 70%);' +
      'transform:translate(-50%,-50%);transition:left 0.15s ease-out,top 0.15s ease-out;' +
      'display:none;';
    document.body.appendChild(glow);
    var timer;
    document.addEventListener('mousemove', function (e) {
      glow.style.display = 'block';
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      clearTimeout(timer);
      timer = setTimeout(function () { glow.style.display = 'none'; }, 3000);
    });
  }

  /* 6. Score Flash Animation - watch for score changes */
  function initScoreWatch() {
    document.addEventListener('effotbaleUpdate', function () {
      var scores = document.querySelectorAll('.score-num');
      scores.forEach(function (el) {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animation = 'scorePop 0.4s cubic-bezier(0.68,-0.55,0.27,1.55) both';
        setTimeout(function () { el.style.animation = ''; }, 500);
      });
    });
  }

  /* Init all */
  function init() {
    initScrollReveal();
    initRipple();
    initScrollProgress();
    initCountUp();
    initCursorGlow();
    initScoreWatch();
    /* Re-init on language change */
    document.addEventListener('languageChanged', function () {
      setTimeout(initScrollReveal, 100);
      setTimeout(initCountUp, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
