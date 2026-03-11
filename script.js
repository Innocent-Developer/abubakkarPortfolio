/**
 * Abubakkar Sajid Portfolio - Vanilla JS
 * Theme, scroll animations (IntersectionObserver), form, typing, nav
 */

(function () {
  'use strict';

  const THEME_KEY = 'portfolio-theme';
  const DEFAULT_THEME = 'dark';

  // ----- Theme (dark by default, localStorage) -----
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    } catch (_) {
      return DEFAULT_THEME;
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }

  function initTheme() {
    setTheme(getStoredTheme());
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    }
  }

  // ----- Smooth scroll + close mobile menu (handles #id and page.html#id on same page) -----
  function initSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var hashIndex = href.indexOf('#');
      var path = hashIndex > 0 ? href.substring(0, hashIndex) : '';
      var hash = hashIndex >= 0 ? href.substring(hashIndex) : '';
      if (!hash || hash === '#') return;
      var locPath = window.location.pathname.replace(/^\//, '');
      var isSamePage = !path || path === '' || path === locPath || path === window.location.pathname || (path === 'index.html' && (locPath === '' || locPath === 'index.html'));
      if (!isSamePage) return;
      var target = document.querySelector(hash);
      if (!target) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        var nav = document.getElementById('nav-links');
        var ham = document.getElementById('hamburger');
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          if (ham) ham.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // ----- Mobile nav -----
  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
      hamburger.setAttribute('aria-label', navLinks.classList.contains('open') ? 'Close menu' : 'Open menu');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
  }

  // ----- Sticky header + active nav link (avoids forced reflow via rAF + cached positions) -----
  function initHeader() {
    var header = document.querySelector('.header');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');
    var sectionRects = [];
    var rafId = null;

    function updateSectionRects() {
      sectionRects = [];
      sections.forEach(function (section) {
        var r = section.getBoundingClientRect();
        sectionRects.push({ id: section.id, top: r.top + window.scrollY, height: r.height });
      });
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        rafId = null;
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);

        var scrollY = window.scrollY + 120;
        var current = '';
        for (var i = 0; i < sectionRects.length; i++) {
          var r = sectionRects[i];
          if (scrollY >= r.top && scrollY < r.top + r.height) { current = r.id; break; }
        }
        if (sections.length > 0) {
          navLinks.forEach(function (link) {
            var href = link.getAttribute('href') || '';
            var hash = href.indexOf('#') >= 0 ? href.substring(href.indexOf('#')) : href;
            link.classList.toggle('active', hash === '#' + current);
          });
        }
      });
    }

    updateSectionRects();
    window.addEventListener('resize', updateSectionRects);
    window.addEventListener('load', updateSectionRects);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- Typing effect (hero) -----
  function initTyping() {
    var el = document.getElementById('typing-text');
    if (!el) return;

    var name = 'Abubakkar Sajid';
    var speed = 120;
    var delayStart = 400;
    var i = 0;

    function type() {
      if (i <= name.length) {
        el.textContent = name.slice(0, i);
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(function () {
          i = 0;
          setTimeout(type, speed * 2);
        }, 2000);
      }
    }

    setTimeout(type, delayStart);
  }

  // ----- IntersectionObserver: reveal + stagger (data-delay) + skill bars -----
  function initReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    var skillItems = document.querySelectorAll('.skill-item, .skill-card');
    var sections = document.querySelectorAll('section[id].section');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.classList.add('visible');
          var delay = parseInt(el.getAttribute('data-delay'), 10);
          if (!isNaN(delay)) el.style.transitionDelay = delay + 'ms';

          if (el.classList.contains('skill-item') || el.classList.contains('skill-card')) {
            var fill = el.querySelector('.skill-fill');
            var pct = el.querySelector('.skill-pct');
            if (fill) {
              var w = fill.getAttribute('data-width') || '0';
              el.style.setProperty('--fill-width', w + '%');
            }
            if (pct) {
              var targetPct = parseInt(pct.getAttribute('data-pct'), 10) || 0;
              animateNumber(pct, 0, targetPct, 1000);
            }
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.08 }
    );

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('scroll-in');
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
    skillItems.forEach(function (el) { observer.observe(el); });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // ----- Scroll progress bar (hidden when reduced motion) -----
  function initScrollProgress() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function update() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var pct = h <= 0 ? 0 : (window.scrollY / h) * 100;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('load', update);
    update();
  }

  // ----- Subtle hero parallax (respects reduced motion) -----
  function initHeroParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var heroInner = document.querySelector('.hero .hero-inner');
    if (!heroInner) return;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var rate = Math.min(y * 0.12, 60);
      heroInner.style.transform = 'translateY(' + rate + 'px)';
    }, { passive: true });
  }

  function animateNumber(el, from, to, duration) {
    var start = performance.now();
    function step(now) {
      var t = Math.min((now - start) / duration, 1);
      var v = Math.round(from + (to - from) * t);
      el.textContent = v + '%';
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ----- Project filter -----
  function initProjectFilter() {
    var btns = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.project-card');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.getAttribute('data-filter');
        var delay = 0;
        cards.forEach(function (card) {
          var cat = card.getAttribute('data-category');
          var show = filter === 'all' || cat === filter;
          if (show) {
            card.classList.remove('hide');
            card.style.transitionDelay = delay * 55 + 'ms';
            delay++;
          } else {
            card.classList.add('hide');
            card.style.transitionDelay = '0ms';
            delay = 0;
          }
        });
      });
    });
  }

  // ----- Contact form: validation + Web3Forms -----
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var nameEl = form.querySelector('#name');
    var emailEl = form.querySelector('#email');
    var subjectEl = form.querySelector('#subject');
    var messageEl = form.querySelector('#message');
    var submitBtn = document.getElementById('submit-btn');
    var resultEl = document.getElementById('form-result');

    function showError(id, msg) {
      var err = document.getElementById(id + '-error');
      if (err) {
        err.textContent = msg || '';
        err.style.display = msg ? 'block' : 'none';
      }
      var field = form.querySelector('#' + id);
      if (field) field.classList.toggle('invalid', !!msg);
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validate() {
      var valid = true;
      if (!nameEl.value.trim()) {
        showError('name', 'Name is required');
        valid = false;
      } else showError('name', '');
      if (!emailEl.value.trim()) {
        showError('email', 'Email is required');
        valid = false;
      } else if (!validateEmail(emailEl.value)) {
        showError('email', 'Please enter a valid email');
        valid = false;
      } else showError('email', '');
      if (!subjectEl.value.trim()) {
        showError('subject', 'Subject is required');
        valid = false;
      } else showError('subject', '');
      if (!messageEl.value.trim()) {
        showError('message', 'Message is required');
        valid = false;
      } else showError('message', '');
      return valid;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (resultEl) resultEl.textContent = '';
      if (!validate()) return;

      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      var formData = new FormData(form);
      var obj = {};
      formData.forEach(function (v, k) {
        obj[k] = v;
      });
      if (obj.botcheck) return;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(obj),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (resultEl) {
            resultEl.textContent = data.message || (data.success ? 'Message sent successfully.' : 'Something went wrong.');
            resultEl.className = 'form-result ' + (data.success ? 'success' : 'error');
          }
          if (data.success) form.reset();
        })
        .catch(function () {
          if (resultEl) {
            resultEl.textContent = 'Failed to send. Please try again or email directly.';
            resultEl.className = 'form-result error';
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
          }
        });
    });
  }

  // ----- Back to top -----
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener(
      'scroll',
      function () {
        btn.classList.toggle('visible', window.scrollY > 400);
      },
      { passive: true }
    );
  }

  // ----- Footer year -----
  function setFooterYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  // ----- Lazy load images (optional enhancement) -----
  function initLazyImages() {
    if ('loading' in HTMLImageElement.prototype) return;
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    if (typeof IntersectionObserver === 'undefined') return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        img.classList.add('loaded');
        io.unobserve(img);
      });
    });
    imgs.forEach(function (img) {
      io.observe(img);
    });
  }

  // ----- Run on DOM ready -----
  function init() {
    initTheme();
    initSmoothScroll();
    initMobileNav();
    initHeader();
    initTyping();
    initReveal();
    initScrollProgress();
    initHeroParallax();
    initProjectFilter();
    initContactForm();
    initBackToTop();
    setFooterYear();
    initLazyImages();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
