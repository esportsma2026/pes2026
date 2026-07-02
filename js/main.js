(function () {
  'use strict';

  /* =========================================
   * MOBILE NAV TOGGLE
   * ========================================= */
  var mobileToggle = document.getElementById('mobileToggle');
  var navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* =========================================
   * KEYBOARD SUPPORT FOR role="button" ELEMENTS
   * ========================================= */
  document.querySelectorAll('[role="button"]').forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* =========================================
   * LANGUAGE TOGGLE
   * ========================================= */
  var langToggle = document.getElementById('langToggle');
  if (langToggle && typeof EffotbaleLang !== 'undefined') {
    langToggle.addEventListener('click', function () {
      var current = EffotbaleLang.getLang();
      var next = current === 'en' ? 'ar' : 'en';
      EffotbaleLang.setLang(next);
    });
    EffotbaleLang.translatePage();
  }

  /* =========================================
   * NAV ACTIVE STATE
   * ========================================= */
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else if (currentPath === '' && href === 'index.html') {
      link.classList.add('active');
    }
  });

  /* =========================================
   * TABS
   * ========================================= */
  document.querySelectorAll('.tabs').forEach(function (tabGroup) {
    var btns = tabGroup.querySelectorAll('.tab-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');
        btns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var contents = tabGroup.parentElement.querySelectorAll('.tab-content');
        contents.forEach(function (c) { c.classList.remove('active'); });
        var targetEl = document.getElementById(target);
        if (targetEl) targetEl.classList.add('active');
      });
    });
  });

})();
