document.addEventListener('DOMContentLoaded', () => {
  // 1. Confetti Burst on page load
  initConfetti();

  // 2. Scroll-triggered fade-in
  initIntersectionObserver();

  // 3. Lightbox for Gallery
  initLightbox();

  // 4. Active Nav Link Highlighting
  highlightActiveNav();

  // 5. Balloon & Sparkle Randomizer
  randomizeBackgroundDecorations();
  
  // 6. Days Alive Calculator (if the stats element exists on the page)
  updateDaysAliveStats();

  // 7. Wordle Game
  initWordle();

  // 7.5 Alka Memory Game & Chai Guessing Game
  initAlkaMemoryGame();
  initChaiGuessingGame();
  initGratitudeJar();

  // 8. Secret Nav Link to Memory Game
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.style.cursor = 'pointer';
    navLogo.addEventListener('click', () => {
      window.location.href = 'memory.html';
    });
  }

  // 9. Party Mode Toggle (Cake Emoji)
  const cakeBtn = document.getElementById('party-mode-btn');
  if (cakeBtn) {
    cakeBtn.addEventListener('click', () => {
      document.body.classList.toggle('party-mode');
    });
  }

  // 10. Modified Konami Code (Up, Up, Down, Down, Left, Right)
  const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  let codePosition = 0;
  
  document.addEventListener('keydown', (e) => {
    if (e.key === secretCode[codePosition]) {
      codePosition++;
      if (codePosition === secretCode.length) {
        document.body.classList.toggle('disco-mode');
        initConfetti();
        codePosition = 0;
      }
    } else {
      codePosition = 0;
    }
  });

  // 11. Shake to Celebrate (phone shake → confetti cannon)
  initShakeToConfetti();

  // 12. Time Capsule Messages (double-tap circular photos on home page)
  initTimeCapsule();

  // 13. Gravity Balloons (device tilt)
  initGravityBalloons();

  // 14. Golden Theme Unlock (tap Ajit → Alka → Family photo)
  initGoldenTheme();

});

/**
 * Creates a beautiful confetti burst on page load.
 * Stops generating new confetti after 3 seconds.
 */
function initConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  // Handle resize
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let particles = [];
  const colors = ['#fbbf24', '#fb7185', '#38bdf8', '#34d399', '#f8fafc', '#f472b6', '#a78bfa'];

  // Initialize particles from the center bottom
  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height,
      r: Math.random() * 6 + 3,
      dx: Math.random() * 14 - 7,
      dy: Math.random() * -18 - 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: (Math.random() * 0.07) + 0.05
    });
  }

  let startTime = Date.now();
  let animationId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allFinished = true;
    
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleInc;
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.25; // gravity
      
      // Stop checking if it falls below the screen
      if (p.y < canvas.height + 50) {
        allFinished = false;
        
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
      }
    });

    if (Date.now() - startTime < 3500 || !allFinished) { 
       animationId = requestAnimationFrame(draw);
    } else {
       canvas.remove(); // Cleanup after confetti is done
       window.removeEventListener('resize', resizeCanvas);
    }
  }
  
  // Small delay before bursting
  setTimeout(() => {
    draw();
  }, 200);
}

/**
 * Fades in elements as they scroll into view
 */
function initIntersectionObserver() {
  const elements = document.querySelectorAll('.fade-in');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

/**
 * Simple Lightbox implementation for photo placeholders
 */
function initLightbox() {
  // Create lightbox HTML structure
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  
  const content = document.createElement('div');
  content.className = 'lightbox-content glass-card';
  
  const closeBtn = document.createElement('div');
  closeBtn.className = 'lightbox-close';
  closeBtn.innerHTML = '&times;';
  
  lightbox.appendChild(content);
  lightbox.appendChild(closeBtn);
  document.body.appendChild(lightbox);

  // Attach to gallery items
  const galleryItems = document.querySelectorAll('.gallery .photo-placeholder, .photo-strip .photo-placeholder');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // For the placeholder phase, we just duplicate the placeholder into the lightbox
      content.innerHTML = item.innerHTML; 
      content.style.background = getComputedStyle(item).background;
      content.style.width = '400px';
      content.style.height = '400px';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.style.justifyContent = 'center';
      content.style.alignItems = 'center';
      
      lightbox.classList.add('active');
    });
  });

  // Close functionality
  const closeLightbox = () => lightbox.classList.remove('active');
  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/**
 * Highlights the current page in the navigation
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
}

/**
 * Randomizes balloons and sparkles in the background
 */
function randomizeBackgroundDecorations() {
  // Balloons
  const balloonContainer = document.querySelector('.balloon-container');
  if (balloonContainer) {
    const balloonCount = parseInt(balloonContainer.dataset.count) || 8;
    const colors = ['var(--color-coral)', 'var(--color-gold)', 'var(--color-blue)', 'var(--color-green)'];
    
    let balloonsPopped = 0;

    for (let i = 0; i < balloonCount; i++) {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.left = `${Math.random() * 90 + 5}%`;
      b.style.animationDelay = `${Math.random() * 15}s`;
      b.style.animationDuration = `${12 + Math.random() * 10}s`;
      b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Make some balloons slightly smaller/larger
      const scale = 0.8 + Math.random() * 0.5;
      b.style.transform = `scale(${scale})`;
      
      // Add pop interaction
      b.addEventListener('pointerdown', (e) => {
        if (b.classList.contains('popped')) return;
        b.classList.add('popped');
        balloonsPopped++;
        
        // Pop 5 balloons to unlock golden theme
        if (balloonsPopped === 5) {
          const isGolden = document.body.classList.toggle('golden-theme');
          if (typeof showGoldenToast === 'function') {
            showGoldenToast(isGolden ? '👑 Royal Gold Mode Unlocked!' : '🔵 Back to Normal');
          }
          // Reset count so it can be toggled again
          balloonsPopped = 0;
        }
      });
      
      balloonContainer.appendChild(b);
    }
  }

  // Sparkles
  const sparklesContainer = document.querySelector('.sparkles-container');
  if (sparklesContainer) {
    const sparkleCount = parseInt(sparklesContainer.dataset.count) || 20;
    
    for (let i = 0; i < sparkleCount; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left = `${Math.random() * 100}%`;
      s.style.top = `${Math.random() * 100}%`;
      s.style.animationDelay = `${Math.random() * 3}s`;
      s.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      sparklesContainer.appendChild(s);
    }
  }
}

/**
 * Calculates days alive and populates the fun facts section
 */
function calculateDaysAlive(birthdateString) {
  const birthdate = new Date(birthdateString);
  const today = new Date();
  const diffTime = Math.abs(today - birthdate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
}

function updateDaysAliveStats() {
  const statsContainer = document.getElementById('fun-facts-stats');
  if (!statsContainer) return;
  
  const birthdate = statsContainer.dataset.birthdate;
  if (!birthdate) return;
  
  const days = calculateDaysAlive(birthdate);
  const sunrises = days;
  const heartbeats = days * 100000;
  
  // Chai counting from October 12, 2002
  const chaiStartDate = new Date('2002-10-12');
  const today = new Date();
  const chaiDays = Math.ceil(Math.abs(today - chaiStartDate) / (1000 * 60 * 60 * 24));
  const chai = chaiDays * 2;
  
  statsContainer.innerHTML = `
    <p style="font-size: 1.2rem; margin-bottom: 1rem;">Ajit has brightened the world for <strong>${days.toLocaleString()}</strong> days and counting! 🌟</p>
    <ul style="list-style: none; padding: 0; font-size: 1.1rem; line-height: 1.8;">
      <li>🌅 That's <strong>${sunrises.toLocaleString()}</strong> sunrises</li>
      <li>❤️ <strong>${heartbeats.toLocaleString()}</strong> heartbeats (approx)</li>
      <li>☕ <strong>${chai.toLocaleString()}</strong> cups of chai (since Oct 12, 2002)</li>
    </ul>
  `;
}


/**
 * Wordle Game Implementation
 */
function initWordle() {
  const grid = document.getElementById('wordle-grid');
  const keyboard = document.getElementById('wordle-keyboard');
  if (!grid || !keyboard) return;

  const targetWord = "PADRE";
  const maxGuesses = 6;
  const wordLength = 5;
  let currentGuess = "";
  let guesses = [];
  let isGameOver = false;

  // Build grid
  for (let i = 0; i < maxGuesses; i++) {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = `repeat(${wordLength}, 1fr)`;
    row.style.gap = '8px';
    
    for (let j = 0; j < wordLength; j++) {
      const tile = document.createElement('div');
      tile.className = 'wordle-tile';
      tile.id = `tile-${i}-${j}`;
      tile.style.border = '2px solid rgba(255, 255, 255, 0.2)';
      tile.style.display = 'flex';
      tile.style.justifyContent = 'center';
      tile.style.alignItems = 'center';
      tile.style.fontSize = '2rem';
      tile.style.fontWeight = 'bold';
      tile.style.textTransform = 'uppercase';
      tile.style.height = '60px';
      tile.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
      row.appendChild(tile);
    }
    grid.appendChild(row);
  }

  // Build keyboard
  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  keys.forEach(rowKeys => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'center';
    row.style.gap = '6px';
    
    rowKeys.forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = key;
      btn.id = `key-${key}`;
      btn.style.padding = key === 'ENTER' || key === 'DEL' ? '12px 10px' : '12px 0';
      btn.style.flex = key === 'ENTER' || key === 'DEL' ? '1.5' : '1';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
      btn.style.color = 'white';
      btn.style.fontWeight = 'bold';
      btn.style.cursor = 'pointer';
      
      btn.addEventListener('click', () => handleKeyPress(key));
      row.appendChild(btn);
    });
    keyboard.appendChild(row);
  });

  // Handle physical keyboard
  document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    const key = e.key.toUpperCase();
    if (key === 'ENTER') {
      handleKeyPress('ENTER');
    } else if (key === 'BACKSPACE') {
      handleKeyPress('DEL');
    } else if (/^[A-Z]$/.test(key)) {
      handleKeyPress(key);
    }
  });

  function handleKeyPress(key) {
    if (isGameOver) return;
    
    const msg = document.getElementById('wordle-message');
    msg.textContent = '';

    if (key === 'DEL') {
      if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateGrid();
      }
    } else if (key === 'ENTER') {
      if (currentGuess.length < wordLength) {
        msg.textContent = 'Not enough letters';
      } else {
        submitGuess();
      }
    } else {
      if (currentGuess.length < wordLength) {
        currentGuess += key;
        updateGrid();
      }
    }
  }

  function updateGrid() {
    const rowIdx = guesses.length;
    for (let i = 0; i < wordLength; i++) {
      const tile = document.getElementById(`tile-${rowIdx}-${i}`);
      tile.textContent = currentGuess[i] || '';
      if (currentGuess[i]) {
        tile.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      } else {
        tile.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    }
  }

  function submitGuess() {
    const rowIdx = guesses.length;
    const guessArr = currentGuess.split('');
    const targetArr = targetWord.split('');
    
    // First pass: find exact matches (green)
    let exactMatches = 0;
    guessArr.forEach((char, i) => {
      const tile = document.getElementById(`tile-${rowIdx}-${i}`);
      const keyBtn = document.getElementById(`key-${char}`);
      
      if (char === targetArr[i]) {
        tile.style.backgroundColor = '#22c55e'; // Green
        tile.style.borderColor = '#22c55e';
        keyBtn.style.backgroundColor = '#22c55e';
        targetArr[i] = null; // Consume the letter
        guessArr[i] = null;
        exactMatches++;
      }
    });

    // Second pass: find partial matches (yellow) and misses (gray)
    guessArr.forEach((char, i) => {
      if (char === null) return; // already green
      
      const tile = document.getElementById(`tile-${rowIdx}-${i}`);
      const keyBtn = document.getElementById(`key-${char}`);
      const targetIdx = targetArr.indexOf(char);
      
      if (targetIdx > -1) {
        tile.style.backgroundColor = '#eab308'; // Yellow
        tile.style.borderColor = '#eab308';
        if (keyBtn.style.backgroundColor !== 'rgb(34, 197, 94)') { // Not already green
          keyBtn.style.backgroundColor = '#eab308';
        }
        targetArr[targetIdx] = null; // Consume the letter
      } else {
        tile.style.backgroundColor = '#475569'; // Gray
        tile.style.borderColor = '#475569';
        if (keyBtn.style.backgroundColor !== 'rgb(34, 197, 94)' && keyBtn.style.backgroundColor !== 'rgb(234, 179, 8)') {
          keyBtn.style.backgroundColor = '#475569';
        }
      }
    });

    guesses.push(currentGuess);
    
    if (exactMatches === wordLength) {
      gameWon();
    } else if (guesses.length === maxGuesses) {
      document.getElementById('wordle-message').textContent = `The word was ${targetWord}. But we'll let you in anyway!`;
      setTimeout(gameWon, 2000);
    }
    
    currentGuess = "";
  }

  function gameWon() {
    isGameOver = true;
    document.getElementById('wordle-message').textContent = 'Magnificent! Unlocking letter...';
    
    // Confetti effect
    initConfetti();

    setTimeout(() => {
      document.getElementById('wordle-container').style.display = 'none';
      document.getElementById('wordle-instructions').style.display = 'none';
      
      const letter = document.getElementById('letter-content');
      letter.style.display = 'block';
      
      // Scroll to letter smoothly
      letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1500);
  }
}

/**
 * Memory Game Implementation for Alka's 49th Birthday
 */
function initAlkaMemoryGame() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;

  const emojis = ['☕', '❤️', '🌸', '☕', '❤️', '🌸'];
  // Shuffle array
  emojis.sort(() => Math.random() - 0.5);

  let flippedCards = [];
  let matchedPairs = 0;

  emojis.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.emoji = emoji;
    card.style.height = '80px';
    card.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    card.style.border = '2px solid rgba(251, 113, 133, 0.4)';
    card.style.borderRadius = '8px';
    card.style.display = 'flex';
    card.style.justifyContent = 'center';
    card.style.alignItems = 'center';
    card.style.fontSize = '2.5rem';
    card.style.cursor = 'pointer';
    card.style.transition = 'transform 0.3s, background-color 0.3s';
    
    card.addEventListener('click', () => {
      if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
        card.textContent = emoji;
        card.classList.add('flipped');
        card.style.backgroundColor = 'rgba(251, 113, 133, 0.2)';
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          setTimeout(checkMatch, 800);
        }
      }
    });

    grid.appendChild(card);
  });

  function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.emoji === card2.dataset.emoji) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      card1.style.backgroundColor = 'rgba(251, 113, 133, 0.5)';
      card2.style.backgroundColor = 'rgba(251, 113, 133, 0.5)';
      card1.style.borderColor = 'rgba(251, 113, 133, 0.8)';
      card2.style.borderColor = 'rgba(251, 113, 133, 0.8)';
      matchedPairs++;
      
      if (matchedPairs === 3) {
        document.getElementById('memory-message').textContent = 'Perfect match! Unlocking letter...';
        initConfetti();
        setTimeout(() => {
          document.getElementById('memory-container').style.display = 'none';
          document.getElementById('memory-instructions').style.display = 'none';
          const letter = document.getElementById('letter-content');
          letter.style.display = 'block';
          letter.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
      }
    } else {
      card1.textContent = '';
      card2.textContent = '';
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      card1.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      card2.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
    flippedCards = [];
  }
}

/**
 * Chai Guessing Game Implementation
 */
function initChaiGuessingGame() {
  const submitBtn = document.getElementById('chai-submit');
  const guessInput = document.getElementById('chai-guess');
  const messageEl = document.getElementById('chai-message');
  
  if (!submitBtn || !guessInput || !messageEl) return;
  
  submitBtn.addEventListener('click', () => {
    const guess = parseInt(guessInput.value, 10);
    if (isNaN(guess)) {
      messageEl.textContent = 'Please enter a valid number!';
      return;
    }
    
    // Target is ~37,438. Accurate to 2 sig figs -> 37,000 range.
    if (guess >= 36500 && guess <= 37499) {
      messageEl.textContent = `Spot on! You've had roughly ${guess.toLocaleString()} cups of chai! ☕🎉`;
      initConfetti();
    } else if (guess < 36500) {
      if (guess < 10000) messageEl.textContent = 'Way too low! Think bigger!';
      else messageEl.textContent = 'Too low! Add some more cups to that number.';
    } else {
      if (guess > 100000) messageEl.textContent = 'Whoa, not quite that much! Too high.';
      else messageEl.textContent = 'Too high! A bit less.';
    }
  });
}


/* ============================================
   EASTER EGG 11: SHAKE TO CELEBRATE
   Uses DeviceMotionEvent — shows iOS permission button
   ============================================ */
function initShakeToConfetti() {
  let lastX = null, lastY = null, lastZ = null;
  let lastShakeTime = 0;
  const SHAKE_THRESHOLD = 18;
  const COOLDOWN_MS = 3000;

  function handleMotion(e) {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const { x, y, z } = acc;
    if (lastX === null) { lastX = x; lastY = y; lastZ = z; return; }
    const delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
    lastX = x; lastY = y; lastZ = z;
    const now = Date.now();
    if (delta > SHAKE_THRESHOLD && now - lastShakeTime > COOLDOWN_MS) {
      lastShakeTime = now;
      initConfetti();
      setTimeout(initConfetti, 400);
      setTimeout(initConfetti, 800);
    }
  }

  function attachMotion() {
    window.addEventListener('devicemotion', handleMotion);
  }

  if (typeof DeviceMotionEvent === 'undefined') return; // not supported

  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    // iOS 13+ — must request from a real click. Show a small floating button.
    showMotionPermissionButton(attachMotion);
  } else {
    // Android / non-iOS — just attach directly
    attachMotion();
  }
}

/* ============================================
   EASTER EGG 12: TIME CAPSULE MESSAGES
   Double-tap (or click) circular photos on home page
   ============================================ */
function initTimeCapsule() {
  // Messages for each family member's circular photo
  const capsules = {
    'ajit-circle':  { icon: '👑', message: 'The OG. 51 years of pure greatness. We love you, Dad!' },
    'alka-circle':  { icon: '❤️', message: 'The heart of our family. Always there, always loving. We love you, Mom!' },
    'abhay-circle': { icon: '🌍', message: 'Exploring the world, one adventure at a time. Keep going!' },
    'akshay-circle':{ icon: '😈', message: 'YOU THOUGHT 😈' },
  };

  // Build the overlay once
  const overlay = document.createElement('div');
  overlay.className = 'time-capsule-overlay';
  overlay.innerHTML = `
    <div class="time-capsule-card">
      <button class="tc-close">&times;</button>
      <span class="tc-icon" id="tc-icon"></span>
      <div class="tc-message" id="tc-message"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  function openCapsule(id) {
    const data = capsules[id];
    if (!data) return;
    document.getElementById('tc-icon').textContent = data.icon;
    document.getElementById('tc-message').textContent = data.message;
    overlay.classList.add('active');
  }

  function closeCapsule() {
    overlay.classList.remove('active');
  }

  overlay.querySelector('.tc-close').addEventListener('click', closeCapsule);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeCapsule(); });

  // Attach listeners to each circle
  Object.keys(capsules).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    // Double-click for desktop
    el.addEventListener('dblclick', () => openCapsule(id));

    // Double-tap for mobile
    let lastTap = 0;
    el.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 350) {
        e.preventDefault();
        openCapsule(id);
      }
      lastTap = now;
    });
  });
}

/* ============================================
   EASTER EGG 13: GRAVITY BALLOONS
   Balloons drift based on device tilt (gyroscope)
   ============================================ */
function initGravityBalloons() {
  if (!window.DeviceOrientationEvent) return;

  let tiltX = 0, tiltY = 0;

  function handleOrientation(e) {
    tiltX = (e.gamma || 0) / 45; // left/right, normalized -1..1
    tiltY = (e.beta  || 0) / 90; // front/back, normalized -1..1
  }

  function applyTilt() {
    const balloons = document.querySelectorAll('.balloon');
    balloons.forEach((b, i) => {
      const factor = 0.8 + (i % 3) * 0.4;
      const shiftX = tiltX * 30 * factor;
      const shiftY = tiltY * 15 * factor;
      b.style.marginLeft = `${shiftX}px`;
      b.style.marginTop  = `${shiftY}px`;
    });
    requestAnimationFrame(applyTilt);
  }

  function attachOrientation() {
    window.addEventListener('deviceorientation', handleOrientation);
    applyTilt();
  }

  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ — reuse the same permission button as shake
    showMotionPermissionButton(attachOrientation);
  } else {
    attachOrientation();
  }
}

/**
 * Shows a small floating button to request iOS motion permission.
 * Calls onGranted() if the user approves. Button disappears afterwards.
 */
function showMotionPermissionButton(onGranted) {
  // Only show on iOS (has requestPermission)
  if (typeof DeviceMotionEvent === 'undefined' ||
      typeof DeviceMotionEvent.requestPermission !== 'function') {
    onGranted();
    return;
  }

  // Don't create duplicates
  if (document.getElementById('motion-permission-btn')) {
    document.getElementById('motion-permission-btn').__callbacks.push(onGranted);
    return;
  }

  const btn = document.createElement('button');
  btn.id = 'motion-permission-btn';
  btn.__callbacks = [onGranted];
  btn.textContent = '🎊 Enable Motion Effects';
  btn.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 16px;
    z-index: 9998;
    background: linear-gradient(135deg, #7c3aed, #a78bfa);
    color: white;
    border: none;
    border-radius: 999px;
    padding: 10px 18px;
    font-size: 0.85rem;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(124,58,237,0.5);
    font-family: var(--font-body);
  `;

  btn.addEventListener('click', () => {
    // Must be in a real click handler for iOS
    Promise.all([
      DeviceMotionEvent.requestPermission().catch(() => 'denied'),
      DeviceOrientationEvent.requestPermission().catch(() => 'denied')
    ]).then(([motionState, orientState]) => {
      btn.__callbacks.forEach(cb => cb());
      btn.remove();
    });
  });

  document.body.appendChild(btn);
}

/* ============================================
   EASTER EGG 14: GOLDEN THEME UNLOCK
   Tap sequence: Ajit circle → Alka circle → Family hero photo
   ============================================ */
function initGoldenTheme() {
  const sequence = ['ajit-circle', 'alka-circle', 'hero-family-photo'];
  let step = 0;
  let resetTimer;

  function handleTap(id) {
    if (id !== sequence[step]) {
      step = 0;
      clearTimeout(resetTimer);
      // Don't return immediately — check if this IS the first step
      if (id !== sequence[0]) return;
      step = 0;
    }
    if (id === sequence[step]) {
      step++;
      clearTimeout(resetTimer);
      if (step === sequence.length) {
        step = 0;
        const isGolden = document.body.classList.toggle('golden-theme');
        showGoldenToast(isGolden ? '👑 Royal Gold Mode Unlocked!' : '🔵 Back to Normal');
      } else {
        resetTimer = setTimeout(() => { step = 0; }, 4000);
      }
    }
  }

  sequence.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click',      () => handleTap(id));
    el.addEventListener('touchend',   () => handleTap(id), { passive: true });
  });
}

function showGoldenToast(msg) {
  // Remove any existing toast
  const old = document.querySelector('.golden-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'golden-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}

/**
 * Interactive Gratitude Jar
 */
function initGratitudeJar() {
  const jar = document.getElementById('gratitude-jar');
  const slipContainer = document.getElementById('paper-slip-container');
  if (!jar || !slipContainer) return;

  const reasons = [
    "Your endless patience with us. ❤️",
    "Your amazing cooking that brings us all together. 🥘",
    "The way you always know exactly what to say. 💬",
    "Your warm hugs that make everything better. 🤗",
    "How you always put the family first. 👨‍👩‍👦‍👦",
    "Your beautiful smile that lights up the room. ✨",
    "The sacrifices you've made for our happiness. 🌟",
    "For being the best listener in the world. 👂",
    "Your contagious laugh. 😂",
    "For being the strongest person we know. 💪"
  ];

  let currentSlip = null;

  jar.addEventListener('click', () => {
    // Pick a random reason
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    
    // Animate jar bounce
    jar.style.transform = 'scale(0.9)';
    setTimeout(() => {
      jar.style.transform = '';
    }, 150);

    // If there's already a slip, fade it out first
    if (currentSlip) {
      const oldSlip = currentSlip;
      oldSlip.classList.add('fade-out');
      setTimeout(() => {
        oldSlip.remove();
      }, 400);
    }

    // Create new slip
    const slip = document.createElement('div');
    slip.className = 'paper-slip';
    slip.textContent = reason;
    
    // Give it a random slight rotation between -4deg and 4deg
    const rotate = (Math.random() * 8 - 4) + 'deg';
    slip.style.setProperty('--rotate', rotate);

    slipContainer.appendChild(slip);
    currentSlip = slip;
    
    // Add a tiny bit of confetti centered on the jar
    initMiniConfetti(jar.getBoundingClientRect());
  });
}

function initMiniConfetti(rect) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const colors = ['#fb7185', '#fda4af', '#fef08a'];

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top;

  for (let i = 0; i < 15; i++) {
    particles.push({
      x: centerX,
      y: centerY,
      r: Math.random() * 4 + 2,
      dx: Math.random() * 6 - 3,
      dy: Math.random() * -8 - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: (Math.random() * 0.07) + 0.05
    });
  }

  let startTime = Date.now();
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allFinished = true;
    
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleInc;
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.2; 
      
      if (p.y < canvas.height + 50) {
        allFinished = false;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
      }
    });

    if (Date.now() - startTime < 2000 && !allFinished) { 
       requestAnimationFrame(draw);
    } else {
       canvas.remove();
    }
  }
  draw();
}
