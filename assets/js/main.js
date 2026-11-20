// Amaga Corp — interaksi landing page
(function () {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const links = menu.querySelectorAll('a[href^="#"]');

  // Navbar berubah saat scroll
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu mobile
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // Highlight menu aktif sesuai section
  const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => spy.observe(s));

  // Animasi muncul + counter angka
  const animateCount = el => {
    const target = +el.dataset.target, dur = 1400, start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('show');
      e.target.querySelectorAll('.count').forEach(animateCount);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Pemutar lagu perusahaan
  const player = document.getElementById('songPlayer');
  const audio = document.getElementById('songAudio');
  const btn = document.getElementById('songBtn');
  const seek = document.getElementById('songSeek');
  const time = document.getElementById('songTime');
  const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
  const setState = playing => {
    player.classList.toggle('playing', playing);
    btn.setAttribute('aria-label', playing ? 'Jeda lagu' : 'Putar lagu');
  };
  const toggleSong = () => audio.paused ? audio.play().catch(() => {}) : audio.pause();
  btn.addEventListener('click', toggleSong);
  audio.addEventListener('play', () => setState(true));
  audio.addEventListener('pause', () => setState(false));
  audio.addEventListener('ended', () => { audio.currentTime = 0; setState(false); });
  audio.addEventListener('loadedmetadata', () => { time.textContent = fmt(audio.duration); });
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    seek.value = audio.currentTime / audio.duration * 100;
    time.textContent = fmt(audio.currentTime);
  });
  seek.addEventListener('input', () => {
    if (audio.duration) audio.currentTime = seek.value / 100 * audio.duration;
  });
  // Tombol di hero: scroll ke section lagu sekaligus memutar
  document.getElementById('heroSongBtn').addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => {});
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
