
(function () {
  'use strict';

  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.matchMedia('(max-width: 900px)').matches) {
          nav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || navToggle.contains(e.target)) return;
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var form = document.querySelector('.contact-form');
  if (form) {
    var note = form.querySelector('.form-note');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (note) { note.textContent = ''; note.className = 'form-note'; }

      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var phone = (data.get('phone') || '').toString().trim();
      var address = (data.get('address') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      var missing = [];
      if (!name) missing.push('Name');
      if (!email) missing.push('Email Address');
      if (!phone) missing.push('Contact Number');
      if (!address) missing.push('Address');
      if (!message) missing.push('Message');

      if (missing.length) {
        if (note) {
          note.classList.add('is-error');
          note.textContent = 'Please fill in: ' + missing.join(', ');
        }
        return;
      }

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        if (note) {
          note.classList.add('is-error');
          note.textContent = 'Please enter a valid email address.';
        }
        return;
      }

      var subject = 'Website enquiry from ' + name;
      var body = [
        'Name: ' + name,
        'Contact: ' + phone,
        'Address: ' + address,
        'Email: ' + email,
        '',
        'Message:',
        message,
        '',
        '---',
        'This message was sent via the contact form on the Tekno Paints website.'
      ].join('\n');

      var mailto = 'mailto:teknopaintspc@gmail.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(body);

      if (note) {
        note.classList.add('is-success');
        note.textContent = 'Opening your email client…';
      }

      window.location.href = mailto;
      form.reset();
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

})();
