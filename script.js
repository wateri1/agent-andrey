/**
 * ====================================================================
 * TASTE-SKILL LOGIC: СПЕЦОПЕРАЦИЯ «АГЕНТ АНДРЕЙ»
 * Интерактивная перфокарта, ретро-компиляция, золотой салют
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const config = window.GREETING_CONFIG || {};

  // ------------------------------------------------------------------
  // 1. АУДИОСИСТЕМА (Web Audio API)
  // ------------------------------------------------------------------
  class ExecutiveAudio {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.isMusicActive = false;
      this.themeInterval = null;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTactileKey() {
      if (this.isMuted) return;
      this.init();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
      } catch (e) {}
    }

    // Звук механического перфоратора перфокарт (Punch)
    playMechanicalPunch() {
      if (this.isMuted) return;
      this.init();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {}
    }

    playUnlockChime() {
      if (this.isMuted) return;
      this.init();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.6);
          } catch (e) {}
        }, idx * 110);
      });
    }

    playPop() {
      if (this.isMuted) return;
      this.init();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, this.ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
      } catch (e) {}
    }

    toggleTheme() {
      this.init();
      if (this.isMusicActive) {
        clearInterval(this.themeInterval);
        this.isMusicActive = false;
        return false;
      }
      this.isMusicActive = true;
      const themeNotes = [
        { f: 164.81, d: 350 },
        { f: 174.61, d: 350 },
        { f: 185.00, d: 350 },
        { f: 174.61, d: 350 },
        { f: 164.81, d: 350 },
        { f: 164.81, d: 180 }, { f: 164.81, d: 180 },
        { f: 196.00, d: 350 },
        { f: 185.00, d: 500 }
      ];
      let i = 0;
      const tick = () => {
        if (!this.isMusicActive || this.isMuted) return;
        const cur = themeNotes[i];
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(cur.f, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.045, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + cur.d / 1000);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + cur.d / 1000);
        } catch (e) {}
        i = (i + 1) % themeNotes.length;
        this.themeInterval = setTimeout(tick, cur.d + 40);
      };
      tick();
      return true;
    }
  }

  const audio = new ExecutiveAudio();

  // Кнопка звука
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      const active = audio.toggleTheme();
      const label = soundBtn.querySelector('.sound-btn-text');
      if (label) label.textContent = active ? 'САУНДТРЕК: ВКЛ' : 'САУНДТРЕК: ВЫКЛ';
    });
  }

  // ------------------------------------------------------------------
  // 2. РАДАРНЫЙ СВЕТ И ЧАСТИЦЫ
  // ------------------------------------------------------------------
  const radarCanvas = document.getElementById('radar-canvas');
  if (radarCanvas) {
    const ctx = radarCanvas.getContext('2d');
    let w = (radarCanvas.width = window.innerWidth);
    let h = (radarCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = radarCanvas.width = window.innerWidth;
      h = radarCanvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.6 + 0.8,
      speedY: Math.random() * -0.35 - 0.1,
      alpha: Math.random() * 0.4 + 0.15
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.y += p.speedY;
        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.6)';
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ------------------------------------------------------------------
  // 3. ЗОЛОТОЕ КОНФЕТТИ
  // ------------------------------------------------------------------
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let foilPieces = [];

  function resizeConfetti() {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeConfetti);
  resizeConfetti();

  function triggerGoldConfetti(amount = 75) {
    if (!cCtx) return;
    const goldPalette = ['#d4af37', '#f3e5ab', '#ffffff', '#aa820a', '#e2e8f0'];
    for (let i = 0; i < amount; i++) {
      foilPieces.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 320,
        y: window.innerHeight * 0.35,
        vx: (Math.random() - 0.5) * 15,
        vy: Math.random() * -17 - 4,
        size: Math.random() * 8 + 5,
        color: goldPalette[Math.floor(Math.random() * goldPalette.length)],
        rot: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        alpha: 1
      });
    }
  }

  function updateConfetti() {
    if (foilPieces.length > 0 && cCtx) {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      foilPieces.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.42;
        p.vx *= 0.98;
        p.rot += p.vRot;
        if (p.y > window.innerHeight - 80) p.alpha -= 0.02;

        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate((p.rot * Math.PI) / 180);
        cCtx.fillStyle = p.color;
        cCtx.globalAlpha = Math.max(0, p.alpha);
        cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        cCtx.restore();

        if (p.alpha <= 0 || p.y > window.innerHeight + 60) {
          foilPieces.splice(idx, 1);
        }
      });
    }
    requestAnimationFrame(updateConfetti);
  }
  updateConfetti();

  // ------------------------------------------------------------------
  // 4. УПРАВЛЕНИЕ ШАГАМИ МИССИИ
  // ------------------------------------------------------------------
  const state = {
    step: 0,
    enteredPin: '',
    collectedCount: 0,
    targetCount: 5,
    punchedSlots: 0,
    punchedTarget: 3
  };

  const sections = {
    0: document.getElementById('view-hero'),
    1: document.getElementById('view-protocol-1'),
    2: document.getElementById('view-protocol-2'),
    3: document.getElementById('view-protocol-3'),
    4: document.getElementById('view-protocol-4')
  };

  const pills = {
    1: document.getElementById('nav-pill-1'),
    2: document.getElementById('nav-pill-2'),
    3: document.getElementById('nav-pill-3'),
    4: document.getElementById('nav-pill-4')
  };

  function transitionToStep(targetStep) {
    audio.init();
    state.step = targetStep;

    Object.values(sections).forEach((s) => s && s.classList.add('hidden'));
    if (sections[targetStep]) {
      sections[targetStep].classList.remove('hidden');
      sections[targetStep].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    for (let i = 1; i <= 4; i++) {
      if (!pills[i]) continue;
      pills[i].classList.remove('active', 'done');
      if (i < targetStep) pills[i].classList.add('done');
      else if (i === targetStep) pills[i].classList.add('active');
    }

    if (targetStep === 2) initRadarChamber();
    if (targetStep === 4) displayClassifiedDossier();
  }

  // Hero CTA
  const heroCta = document.getElementById('hero-init-btn');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      audio.playTactileKey();
      transitionToStep(1);
    });
  }

  // ------------------------------------------------------------------
  // ПРОТОКОЛ 01: ТЕРМИНАЛ ШИФРА 1979
  // ------------------------------------------------------------------
  const pinSlotsContainer = document.getElementById('digit-slots');
  const termStatus = document.getElementById('term-status-line');
  const keypad = document.getElementById('console-keypad');
  const autofillKey = document.getElementById('keycard-autofill');
  const codeHintBox = document.getElementById('code-hint-box');

  if (codeHintBox && config.codeHint) {
    codeHintBox.textContent = config.codeHint;
  }

  function renderPinSlots() {
    if (!pinSlotsContainer) return;
    pinSlotsContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const slot = document.createElement('div');
      slot.className = 'code-digit-slot' + (i < state.enteredPin.length ? ' filled' : '');
      pinSlotsContainer.appendChild(slot);
    }
  }
  renderPinSlots();

  if (keypad) {
    keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.console-key');
      if (!btn) return;
      audio.playTactileKey();
      const val = btn.getAttribute('data-val');

      if (val === 'clear') {
        state.enteredPin = '';
        termStatus.textContent = 'ОЖИДАНИЕ ВВОДА КОДА АВТОРИЗАЦИИ';
        termStatus.className = 'mono-font text-xs text-slate-400 mt-2 min-h-[1.25rem]';
        renderPinSlots();
        return;
      }
      if (val === 'ok') {
        verifyPin();
        return;
      }

      if (state.enteredPin.length < 4) {
        state.enteredPin += val;
        renderPinSlots();
        if (state.enteredPin.length === 4) {
          setTimeout(verifyPin, 180);
        }
      }
    });
  }

  function verifyPin() {
    const correctPin = config.secretCode || '1979';
    if (state.enteredPin === correctPin) {
      audio.playUnlockChime();
      termStatus.textContent = 'ДОСТУП РАЗРЕШЕН. ПЕРЕХОД К ПРОТОКОЛУ 02';
      termStatus.className = 'mono-font text-xs text-emerald-400 font-bold mt-2 min-h-[1.25rem] tracking-wider';
      triggerGoldConfetti(35);
      setTimeout(() => transitionToStep(2), 900);
    } else {
      termStatus.textContent = 'ОШИБКА: НЕВЕРНЫЙ КОД ДОСТУПА';
      termStatus.className = 'mono-font text-xs text-rose-400 font-bold mt-2 min-h-[1.25rem] tracking-wider';
      setTimeout(() => {
        state.enteredPin = '';
        renderPinSlots();
      }, 700);
    }
  }

  if (autofillKey) {
    autofillKey.addEventListener('click', () => {
      audio.playTactileKey();
      state.enteredPin = (config.secretCode || '1979').toString();
      renderPinSlots();
      setTimeout(verifyPin, 200);
    });
  }

  // ------------------------------------------------------------------
  // ПРОТОКОЛ 02: ПЕРЕХВАТ ДАННЫХ НА РАДАРЕ
  // ------------------------------------------------------------------
  const chamber = document.getElementById('radar-chamber');
  const countDisplay = document.getElementById('collected-count-num');
  const toProtocol3Btn = document.getElementById('to-protocol-3-btn');
  let spawnInterval = null;

  const svgIcons = [
    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="12.01"/></svg>`,
    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><path d="M10 12h4"/><path d="M2 10l2 2"/><path d="M22 10l-2 2"/></svg>`,
    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 14 14"/><path d="M12 2v3"/><path d="M12 19v3"/></svg>`,
    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 2l-2 2m-1.5 1.5L14 9l-3-3L3.5 13.5a5 5 0 1 0 7 7L18 13l3-3-1.5-1.5z"/></svg>`,
    `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  ];

  function initRadarChamber() {
    if (!chamber) return;
    chamber.innerHTML = '';
    state.collectedCount = 0;
    if (countDisplay) countDisplay.textContent = '0';
    if (toProtocol3Btn) toProtocol3Btn.classList.add('hidden');

    function spawnTargetNode() {
      if (state.step !== 2) return;
      const node = document.createElement('div');
      node.className = 'intel-target-node';
      node.innerHTML = svgIcons[Math.floor(Math.random() * svgIcons.length)];

      const chamberWidth = chamber.clientWidth - 75;
      const startX = Math.random() * Math.max(10, chamberWidth) + 15;
      node.style.left = `${startX}px`;

      let posY = -70;
      const speed = Math.random() * 1.5 + 1.2;

      function ascend() {
        if (!node.parentElement) return;
        posY += speed;
        node.style.bottom = `${posY}px`;
        if (posY > chamber.clientHeight + 70) {
          node.remove();
        } else {
          requestAnimationFrame(ascend);
        }
      }

      node.addEventListener('pointerdown', (ev) => {
        ev.stopPropagation();
        harvestNode(node);
      });

      chamber.appendChild(node);
      requestAnimationFrame(ascend);
    }

    if (spawnInterval) clearInterval(spawnInterval);
    for (let i = 0; i < 3; i++) setTimeout(spawnTargetNode, i * 400);
    spawnInterval = setInterval(spawnTargetNode, 1100);
  }

  function harvestNode(nodeEl) {
    audio.playPop();
    state.collectedCount++;
    if (countDisplay) countDisplay.textContent = state.collectedCount;

    nodeEl.style.transform = 'scale(1.4)';
    nodeEl.style.opacity = '0';
    setTimeout(() => nodeEl.remove(), 150);

    const compliments = config.compliments || [
      { title: "ХАРИЗМА", desc: "Безупречный стиль и авторитет." },
      { title: "НАДЕЖНОСТЬ", desc: "100% уверенность в любых ситуациях." }
    ];
    const item = compliments[(state.collectedCount - 1) % compliments.length];
    showIntelBrief(item.title, item.desc);

    triggerGoldConfetti(15);

    if (state.collectedCount >= state.targetCount) {
      if (spawnInterval) clearInterval(spawnInterval);
      audio.playUnlockChime();
      if (toProtocol3Btn) {
        toProtocol3Btn.classList.remove('hidden');
      }
    }
  }

  function showIntelBrief(title, desc) {
    const existing = document.querySelector('.intel-brief-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'intel-brief-toast';
    toast.innerHTML = `
      <div class="mono-font text-xs text-amber-400 font-bold tracking-widest">${title}</div>
      <div class="text-xs text-slate-200 mt-0.5">${desc}</div>
    `;
    chamber.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) toast.remove(); }, 2400);
  }

  if (toProtocol3Btn) {
    toProtocol3Btn.addEventListener('click', () => {
      audio.playTactileKey();
      transitionToStep(3);
    });
  }

  // ------------------------------------------------------------------
  // ПРОТОКОЛ 03: ВИНТАЖНАЯ ПЕРФОКАРТА АГЕНТА АНДРЕЯ
  // ------------------------------------------------------------------
  const punchSlots = document.querySelectorAll('.punch-interactive-slot');
  const punchCounter = document.getElementById('punch-counter-num');
  const punchStatus = document.getElementById('punch-status-line');

  punchSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
      if (slot.classList.contains('punched')) return;

      audio.playMechanicalPunch();
      slot.classList.add('punched');
      state.punchedSlots++;

      if (punchCounter) {
        punchCounter.textContent = `${state.punchedSlots} / ${state.punchedTarget}`;
      }

      triggerGoldConfetti(12);

      if (state.punchedSlots >= state.punchedTarget) {
        audio.playUnlockChime();
        if (punchStatus) {
          punchStatus.textContent = 'ПЕРФОКАРТА КОМПИЛИРОВАНА. КОД АГЕНТА АНДРЕЯ АКТИВИРОВАН!';
          punchStatus.className = 'mono-font text-emerald-400 font-bold text-sm tracking-wider';
        }
        setTimeout(() => transitionToStep(4), 1100);
      }
    });
  });

  // ------------------------------------------------------------------
  // ПРОТОКОЛ 04: РАССЕКРЕЧЕННОЕ ДОСЬЕ
  // ------------------------------------------------------------------
  function displayClassifiedDossier() {
    audio.playUnlockChime();
    triggerGoldConfetti(120);
    setTimeout(() => triggerGoldConfetti(70), 400);

    const ordersBox = document.getElementById('dossier-orders-content');
    if (ordersBox && config.wishesText) {
      ordersBox.innerHTML = '';
      config.wishesText.forEach((pText) => {
        const p = document.createElement('p');
        p.className = 'text-slate-300 text-sm sm:text-base leading-relaxed mb-3.5';
        p.textContent = pText;
        ordersBox.appendChild(p);
      });
    }

    const sig = document.getElementById('dossier-signature-text');
    if (sig && config.signature) {
      sig.textContent = config.signature;
    }
  }

  // Кнопки финала
  const saluteBtn = document.getElementById('btn-salute-burst');
  if (saluteBtn) {
    saluteBtn.addEventListener('click', () => {
      audio.playMechanicalPunch();
      triggerGoldConfetti(85);
    });
  }

  const restartBtn = document.getElementById('btn-restart-protocol');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      audio.playTactileKey();
      state.enteredPin = '';
      state.punchedSlots = 0;
      punchSlots.forEach((s) => s.classList.remove('punched'));
      if (punchCounter) punchCounter.textContent = `0 / ${state.punchedTarget}`;
      renderPinSlots();
      transitionToStep(0);
    });
  }
});
