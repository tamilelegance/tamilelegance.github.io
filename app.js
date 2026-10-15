// ============================================================================
// WORLD OF NANO & FRIENDS — Interactive Book, Games & Bonus Clubhouse (app.js)
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- VECTOR DRAWING HELPERS (ZERO EMOJI FONT DEPENDENCY) ---
  function drawVectorStar(ctx, cx, cy, rOuter, fillCol = '#f59e0b', strokeCol = '#b45309') {
    const rInner = rOuter * 0.42;
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const ang = -Math.PI / 2 + i * (Math.PI / 5);
      const r = i % 2 === 0 ? rOuter : rInner;
      const x = cx + r * Math.cos(ang);
      const y = cy + r * Math.sin(ang);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = fillCol;
    ctx.fill();
    if (strokeCol) {
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawVectorBerry(ctx, cx, cy, r) {
    ctx.save();
    // Golden-orange honey-berry body
    ctx.beginPath();
    ctx.arc(cx, cy + 2, r, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Specular shine
    ctx.beginPath();
    ctx.arc(cx - r * 0.32, cy - r * 0.2, r * 0.26, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();

    // Green leaf crown at top
    ctx.beginPath();
    ctx.ellipse(cx - 4, cy - r + 1, 6, 3.5, -0.4, 0, Math.PI * 2);
    ctx.ellipse(cx + 4, cy - r + 1, 6, 3.5, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.restore();
  }

  function drawVectorTreehouse(ctx, cx, cy, size) {
    const hs = size * 0.42;
    ctx.save();
    // Wooden cabin walls
    ctx.fillStyle = '#fde68a';
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2.5;
    ctx.fillRect(cx - hs * 0.8, cy - hs * 0.2, hs * 1.6, hs * 1.1);
    ctx.strokeRect(cx - hs * 0.8, cy - hs * 0.2, hs * 1.6, hs * 1.1);

    // Pitched red-brown roof
    ctx.beginPath();
    ctx.moveTo(cx - hs * 1.05, cy - hs * 0.2);
    ctx.lineTo(cx, cy - hs * 1.05);
    ctx.lineTo(cx + hs * 1.05, cy - hs * 0.2);
    ctx.closePath();
    ctx.fillStyle = '#ea580c';
    ctx.fill();
    ctx.stroke();

    // Door
    ctx.fillStyle = '#78350f';
    ctx.fillRect(cx - hs * 0.28, cy + hs * 0.2, hs * 0.56, hs * 0.7);
    ctx.restore();
  }

  function drawVectorPinecone(ctx, cx, cy, r) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, r * 0.78, r * 1.05, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Crosshatch scales
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.5, cy - r * 0.3);
    ctx.lineTo(cx + r * 0.5, cy + r * 0.3);
    ctx.moveTo(cx + r * 0.5, cy - r * 0.3);
    ctx.lineTo(cx - r * 0.5, cy + r * 0.3);
    ctx.strokeStyle = '#b45309';
    ctx.stroke();
    ctx.restore();
  }

  // --- SAFE STORAGE HELPERS (PRIVACY-SAFE & ERROR-PROOF) ---
  function safeGetStorage(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function safeSetStorage(key, val) {
    try {
      localStorage.setItem(key, String(val));
    } catch (_) {}
  }

  // --- EXPLORER STARS PERSISTENT COUNTER ---
  const starDisplay = document.getElementById('star-count-display');
  let explorerStars = parseInt(safeGetStorage('nano_explorer_stars', '5'), 10) || 5;
  function updateStars(add = 0) {
    explorerStars += add;
    safeSetStorage('nano_explorer_stars', explorerStars);
    if (starDisplay) starDisplay.textContent = String(explorerStars);
  }
  updateStars(0);

  // Gentle WebAudio chime
  function playChime(freqs = [523.25, 659.25, 783.99]) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.24);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.25);
      });
    } catch (_) {}
  }

  // 1. NIGHT MODE TOGGLE
  const modeBtn = document.getElementById('mode-toggle-btn');
  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      document.body.classList.toggle('night-mode');
      const isNight = document.body.classList.contains('night-mode');
      modeBtn.textContent = isNight ? 'Sunny Mode' : 'Night Mode';
      playChime();
    });
  }

  // 2. GAME TABS SWITCHER
  document.querySelectorAll('.game-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.game-tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.game-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(btn.dataset.tab);
      if (panel) panel.classList.add('active');
      if (btn.dataset.tab === 'game-catcher' && !catcherRunning) {
        startCatcherGame();
      }
      playChime([587.33, 783.99]);
    });
  });

  // ==========================================================================
  // GAME 1: NANO & FRIENDS MEMORY MATCH (INFINITE SHUFFLED BOARDS)
  // ==========================================================================
  const memGrid = document.getElementById('memory-grid');
  const memMovesEl = document.getElementById('mem-moves');
  const memMatchesEl = document.getElementById('mem-matches');
  const memBestEl = document.getElementById('mem-best');
  const memWinBanner = document.getElementById('mem-win-banner');

  const cardDeckItems = [
    { id: 'nano', img: 'assets/characters/nano_token.png', label: 'Nano' },
    { id: 'kuttu', img: 'assets/characters/kuttu_token.png', label: 'Kuttu' },
    { id: 'mj', img: 'assets/characters/mj_token.png', label: 'MJ' },
    { id: 'oreo', img: 'assets/characters/oreo_token.png', label: 'Oreo' },
    { id: 'mickey', img: 'assets/characters/mickey_token.png', label: 'Mickey' },
    { id: 'book', img: 'assets/covers/story_vol1_front.jpg', label: 'Storybook' }
  ];

  let memFirst = null;
  let memSecond = null;
  let memLock = false;
  let memMoves = 0;
  let memMatches = 0;

  const savedBest = safeGetStorage('nano_mem_best', null);
  if (savedBest && memBestEl) memBestEl.textContent = `${savedBest} moves`;

  function initMemoryGame() {
    if (!memGrid) return;
    memGrid.textContent = '';
    memFirst = null;
    memSecond = null;
    memLock = false;
    memMoves = 0;
    memMatches = 0;
    memMovesEl.textContent = '0';
    memMatchesEl.textContent = '0 / 6';
    memWinBanner.style.display = 'none';

    const deck = [...cardDeckItems, ...cardDeckItems].sort(() => Math.random() - 0.5);
    deck.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'mem-card';
      card.dataset.id = item.id;

      const backSpan = document.createElement('span');
      backSpan.className = 'mem-back-label';
      backSpan.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/></svg><span>FLIP</span>';

      const imgEl = document.createElement('img');
      imgEl.src = item.img;
      imgEl.alt = item.label;

      card.appendChild(backSpan);
      card.appendChild(imgEl);
      card.addEventListener('click', () => flipMemCard(card));
      memGrid.appendChild(card);
    });
  }

  function flipMemCard(card) {
    if (memLock || card === memFirst || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    playChime([659.25]);

    if (!memFirst) {
      memFirst = card;
      return;
    }
    memSecond = card;
    memMoves++;
    memMovesEl.textContent = String(memMoves);

    if (memFirst.dataset.id === memSecond.dataset.id) {
      memFirst.classList.add('matched');
      memSecond.classList.add('matched');
      memFirst = null;
      memSecond = null;
      memMatches++;
      memMatchesEl.textContent = `${memMatches} / 6`;
      playChime([523.25, 659.25, 1046.5]);

      if (memMatches === 6) {
        updateStars(5);
        memWinBanner.style.display = 'block';
        const prevBest = parseInt(safeGetStorage('nano_mem_best', '999'), 10) || 999;
        if (memMoves < prevBest) {
          safeSetStorage('nano_mem_best', memMoves);
          memBestEl.textContent = `${memMoves} moves`;
        }
      }
    } else {
      memLock = true;
      setTimeout(() => {
        memFirst.classList.remove('flipped');
        memSecond.classList.remove('flipped');
        memFirst = null;
        memSecond = null;
        memLock = false;
      }, 700);
    }
  }

  document.getElementById('mem-restart-btn')?.addEventListener('click', initMemoryGame);
  initMemoryGame();

  // ==========================================================================
  // GAME 2: ENDLESS WHISPERING WOODS TREASURE MAZE (VECTOR BERRIES & TREEHOUSE)
  // ==========================================================================
  const mazeCanvas = document.getElementById('maze-canvas');
  const mCtx = mazeCanvas.getContext('2d');
  const mazeBerriesEl = document.getElementById('maze-berries');
  const mazeStatusEl = document.getElementById('maze-status-msg');

  const COLS = 9;
  const ROWS = 9;
  let wallsH = [];
  let wallsV = [];
  let player = { r: 0, c: 0 };
  let berries = [];
  let collectedCount = 0;
  let mazeWon = false;

  const nanoTokenImg = new Image();
  nanoTokenImg.src = 'assets/characters/nano_token.png';
  nanoTokenImg.onload = () => drawMaze();

  function generateMaze() {
    wallsH = Array.from({ length: ROWS + 1 }, () => Array(COLS).fill(true));
    wallsV = Array.from({ length: ROWS }, () => Array(COLS + 1).fill(true));
    const visited = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

    function carve(r, c) {
      visited[r][c] = true;
      const dirs = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
      ].sort(() => Math.random() - 0.5);

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !visited[nr][nc]) {
          if (dr === 1) wallsH[r + 1][c] = false;
          else if (dr === -1) wallsH[r][c] = false;
          else if (dc === 1) wallsV[r][c + 1] = false;
          else if (dc === -1) wallsV[r][c] = false;
          carve(nr, nc);
        }
      }
    }
    carve(0, 0);

    player = { r: 0, c: 0 };
    collectedCount = 0;
    mazeWon = false;
    mazeBerriesEl.textContent = '0 / 3';
    mazeStatusEl.textContent = 'Collect all 3 Golden Berries, then enter the Treehouse!';

    berries = [];
    while (berries.length < 3) {
      const br = Math.floor(Math.random() * ROWS);
      const bc = Math.floor(Math.random() * COLS);
      if ((br === 0 && bc === 0) || (br === ROWS - 1 && bc === COLS - 1)) continue;
      if (!berries.some((b) => b.r === br && b.c === bc)) {
        berries.push({ r: br, c: bc, taken: false });
      }
    }
    drawMaze();
  }

  function drawMaze() {
    if (!mCtx) return;
    const W = mazeCanvas.width;
    const H = mazeCanvas.height;
    const pad = 22;
    const cellW = (W - pad * 2) / COLS;

    mCtx.fillStyle = '#fffdf7';
    mCtx.fillRect(0, 0, W, H);

    // Goal cell (bottom-right) with vector Treehouse
    const gx = pad + (COLS - 1) * cellW;
    const gy = pad + (ROWS - 1) * cellW;
    mCtx.fillStyle = '#fef3c7';
    mCtx.fillRect(gx + 3, gy + 3, cellW - 6, cellW - 6);
    drawVectorTreehouse(mCtx, gx + cellW / 2, gy + cellW / 2, cellW);

    // Vector Golden Berries
    berries.forEach((b) => {
      if (!b.taken) {
        const bx = pad + b.c * cellW + cellW / 2;
        const by = pad + b.r * cellW + cellW / 2;
        drawVectorBerry(mCtx, bx, by, cellW * 0.25);
      }
    });

    // Nano player token
    const px = pad + player.c * cellW + cellW / 2;
    const py = pad + player.r * cellW + cellW / 2;
    const pRadius = cellW * 0.4;
    if (nanoTokenImg.complete) {
      mCtx.drawImage(nanoTokenImg, px - pRadius, py - pRadius, pRadius * 2, pRadius * 2);
    } else {
      mCtx.fillStyle = '#ea580c';
      mCtx.beginPath();
      mCtx.arc(px, py, pRadius, 0, Math.PI * 2);
      mCtx.fill();
    }

    // Maze Walls
    mCtx.strokeStyle = '#5b2c6f';
    mCtx.lineWidth = 4;
    mCtx.lineCap = 'round';

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (wallsH[r][c]) {
          mCtx.beginPath();
          mCtx.moveTo(pad + c * cellW, pad + r * cellW);
          mCtx.lineTo(pad + (c + 1) * cellW, pad + r * cellW);
          mCtx.stroke();
        }
      }
    }
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        if (wallsV[r][c]) {
          mCtx.beginPath();
          mCtx.moveTo(pad + c * cellW, pad + r * cellW);
          mCtx.lineTo(pad + c * cellW, pad + (r + 1) * cellW);
          mCtx.stroke();
        }
      }
    }
  }

  function isTypingInInput() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName ? el.tagName.toUpperCase() : '';
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  function canStepMaze(r, c, dir) {
    if (dir === 'up') return r > 0 && !wallsH[r][c];
    if (dir === 'down') return r < ROWS - 1 && !wallsH[r + 1][c];
    if (dir === 'left') return c > 0 && !wallsV[r][c];
    if (dir === 'right') return c < COLS - 1 && !wallsV[r][c + 1];
    return false;
  }

  function movePlayer(dir) {
    if (mazeWon) return false;
    const { r, c } = player;
    if (!canStepMaze(r, c, dir)) return false;

    if (dir === 'up') player.r--;
    else if (dir === 'down') player.r++;
    else if (dir === 'left') player.c--;
    else if (dir === 'right') player.c++;

    berries.forEach((b) => {
      if (!b.taken && b.r === player.r && b.c === player.c) {
        b.taken = true;
        collectedCount++;
        mazeBerriesEl.textContent = `${collectedCount} / 3`;
        playChime([659.25, 880]);
      }
    });

    if (player.r === ROWS - 1 && player.c === COLS - 1) {
      if (collectedCount === 3) {
        mazeWon = true;
        updateStars(5);
        mazeStatusEl.textContent = 'HURRAY! Nano reached the Treehouse with all 3 Berries! (+5 Stars!)';
        playChime([523.25, 659.25, 783.99, 1046.5]);
      } else {
        mazeStatusEl.textContent = `Almost there! Collect the remaining ${3 - collectedCount} berry(ies) first!`;
      }
    }
    drawMaze();
    return true;
  }

  // BFS Shortest Path Finder so touching/dragging on the Maze Canvas guides Nano smoothly!
  let autoWalkTimer = null;
  function stopAutoWalk() {
    if (autoWalkTimer) {
      clearInterval(autoWalkTimer);
      autoWalkTimer = null;
    }
  }

  function findMazePath(sr, sc, tr, tc) {
    if (sr === tr && sc === tc) return [];
    const queue = [[sr, sc, []]];
    const seen = Array.from({ length: ROWS }, () => Array(COLS).fill(false));
    seen[sr][sc] = true;
    const dirs = [
      ['up', -1, 0],
      ['down', 1, 0],
      ['left', 0, -1],
      ['right', 0, 1]
    ];
    while (queue.length > 0) {
      const [r, c, path] = queue.shift();
      if (r === tr && c === tc) return path;
      for (const [dName, dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !seen[nr][nc] && canStepMaze(r, c, dName)) {
          seen[nr][nc] = true;
          queue.push([nr, nc, [...path, dName]]);
        }
      }
    }
    return [];
  }

  function getMazeCellFromClientXY(clientX, clientY) {
    const rect = mazeCanvas.getBoundingClientRect();
    const scaleX = ((clientX - rect.left) / rect.width) * mazeCanvas.width;
    const scaleY = ((clientY - rect.top) / rect.height) * mazeCanvas.height;
    const pad = 22;
    const cellW = (mazeCanvas.width - pad * 2) / COLS;
    const c = Math.max(0, Math.min(COLS - 1, Math.floor((scaleX - pad) / cellW)));
    const r = Math.max(0, Math.min(ROWS - 1, Math.floor((scaleY - pad) / cellW)));
    return { r, c };
  }

  let mazePointerDown = false;
  function guideNanoTowardCell(targetR, targetC, isDragMove) {
    if (mazeWon) return;
    const path = findMazePath(player.r, player.c, targetR, targetC);
    if (path.length === 0) return;

    // If dragging finger into an adjacent or close cell, step immediately for responsive finger-follow
    if (path.length === 1) {
      stopAutoWalk();
      movePlayer(path[0]);
      return;
    }

    if (isDragMove && path.length <= 4) {
      stopAutoWalk();
      movePlayer(path[0]);
      return;
    }

    // If the user tapped a cell along the path (up to 10 steps away), walk Nano smoothly along the path!
    if (!isDragMove && path.length <= 12) {
      stopAutoWalk();
      let idx = 0;
      movePlayer(path[idx++]);
      autoWalkTimer = setInterval(() => {
        if (idx >= path.length || mazeWon) {
          stopAutoWalk();
          return;
        }
        movePlayer(path[idx++]);
      }, 95);
    }
  }

  mazeCanvas.addEventListener('mousedown', (e) => {
    mazePointerDown = true;
    const cell = getMazeCellFromClientXY(e.clientX, e.clientY);
    guideNanoTowardCell(cell.r, cell.c, false);
  });
  mazeCanvas.addEventListener('mousemove', (e) => {
    if (!mazePointerDown) return;
    const cell = getMazeCellFromClientXY(e.clientX, e.clientY);
    guideNanoTowardCell(cell.r, cell.c, true);
  });
  window.addEventListener('mouseup', () => {
    mazePointerDown = false;
  });

  mazeCanvas.addEventListener(
    'touchstart',
    (e) => {
      e.preventDefault();
      mazePointerDown = true;
      if (e.touches[0]) {
        const cell = getMazeCellFromClientXY(e.touches[0].clientX, e.touches[0].clientY);
        guideNanoTowardCell(cell.r, cell.c, false);
      }
    },
    { passive: false }
  );
  mazeCanvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      if (!mazePointerDown || !e.touches[0]) return;
      const cell = getMazeCellFromClientXY(e.touches[0].clientX, e.touches[0].clientY);
      guideNanoTowardCell(cell.r, cell.c, true);
    },
    { passive: false }
  );
  window.addEventListener('touchend', () => {
    mazePointerDown = false;
  });

  // D-Pad Tap + Hold-to-Walk continuous movement on Mobile & Desktop
  let dpadHoldTimer = null;
  function stopDpadHold() {
    if (dpadHoldTimer) {
      clearInterval(dpadHoldTimer);
      dpadHoldTimer = null;
    }
  }

  document.querySelectorAll('.dpad-btn[data-dir]').forEach((btn) => {
    const dir = btn.dataset.dir;
    const startHold = (e) => {
      e.preventDefault();
      stopAutoWalk();
      stopDpadHold();
      movePlayer(dir);
      dpadHoldTimer = setInterval(() => movePlayer(dir), 155);
    };
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('mouseup', stopDpadHold);
    btn.addEventListener('mouseleave', stopDpadHold);
    btn.addEventListener('touchend', stopDpadHold);
    btn.addEventListener('touchcancel', stopDpadHold);
  });

  window.addEventListener('keydown', (e) => {
    if (isTypingInInput()) return;
    const mazePanel = document.getElementById('game-maze');
    if (mazePanel && mazePanel.classList.contains('active')) {
      const keyMap = {
        ArrowUp: 'up',
        KeyW: 'up',
        ArrowDown: 'down',
        KeyS: 'down',
        ArrowLeft: 'left',
        KeyA: 'left',
        ArrowRight: 'right',
        KeyD: 'right'
      };
      if (keyMap[e.code]) {
        e.preventDefault();
        stopAutoWalk();
        movePlayer(keyMap[e.code]);
      }
    }
  });

  document.getElementById('maze-new-btn')?.addEventListener('click', () => {
    stopAutoWalk();
    generateMaze();
  });
  generateMaze();

  // ==========================================================================
  // GAME 3: ENDLESS GOLDEN HONEY-BERRY & STAR CATCHER!
  // ==========================================================================
  const catcherCanvas = document.getElementById('catcher-canvas');
  const kCtx = catcherCanvas.getContext('2d');
  const catcherScoreEl = document.getElementById('catcher-score');
  const catcherLivesEl = document.getElementById('catcher-lives');
  const catcherBestEl = document.getElementById('catcher-best');
  const catcherStatusEl = document.getElementById('catcher-status-msg');

  let catcherScore = 0;
  let catcherLives = 3;
  let catcherBest = parseInt(safeGetStorage('nano_catcher_best', '0'), 10) || 0;
  if (catcherBestEl) catcherBestEl.textContent = String(catcherBest);

  let basketX = 260;
  const basketW = 104;
  const basketH = 34;
  let fallingItems = [];
  let catcherRunning = false;
  let catcherAnimId = null;
  let spawnCounter = 0;

  function spawnFallingItem() {
    const W = catcherCanvas.width;
    const r = Math.random();
    let type = 'berry'; // 62% golden berry (+10), 18% gold star (+25), 20% pinecone (-1 life)
    if (r > 0.80) type = 'pinecone';
    else if (r > 0.62) type = 'star';

    fallingItems.push({
      x: 36 + Math.random() * (W - 72),
      y: -24,
      vy: 2.3 + Math.random() * 2.2 + Math.min(2.5, catcherScore / 220),
      type,
      radius: type === 'star' ? 18 : 15
    });
  }

  function startCatcherGame() {
    catcherScore = 0;
    catcherLives = 3;
    fallingItems = [];
    spawnCounter = 0;
    catcherRunning = true;
    catcherScoreEl.textContent = '0';
    catcherLivesEl.textContent = '3';
    catcherStatusEl.textContent = 'Catch Golden Berries (+10) & Stars (+25)! Dodge brown Pinecones!';
    if (catcherAnimId) cancelAnimationFrame(catcherAnimId);
    catcherLoop();
  }

  function drawCatcherScene() {
    const W = catcherCanvas.width;
    const H = catcherCanvas.height;

    // Sky & meadow backdrop
    const grad = kCtx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.82, '#fef9c3');
    grad.addColorStop(0.83, '#bbf7d0');
    grad.addColorStop(1, '#86efac');
    kCtx.fillStyle = grad;
    kCtx.fillRect(0, 0, W, H);

    // Singing Tree canopy silhouette at top
    kCtx.fillStyle = '#15803d';
    for (let i = 0; i < 6; i++) {
      kCtx.beginPath();
      kCtx.arc(45 + i * 88, 6, 48, 0, Math.PI * 2);
      kCtx.fill();
    }

    // Draw falling items
    fallingItems.forEach((it) => {
      if (it.type === 'berry') {
        drawVectorBerry(kCtx, it.x, it.y, it.radius);
      } else if (it.type === 'star') {
        drawVectorStar(kCtx, it.x, it.y, it.radius, '#fde047', '#ca8a04');
      } else {
        drawVectorPinecone(kCtx, it.x, it.y, it.radius);
      }
    });

    // Draw Nano token & Woven Picnic Basket
    const by = H - 62;
    if (nanoTokenImg.complete) {
      kCtx.drawImage(nanoTokenImg, basketX - 30, by - 46, 60, 60);
    }

    kCtx.save();
    kCtx.fillStyle = '#d97706';
    kCtx.strokeStyle = '#78350f';
    kCtx.lineWidth = 3;
    kCtx.beginPath();
    kCtx.roundRect(basketX - basketW / 2, by, basketW, basketH, 10);
    kCtx.fill();
    kCtx.stroke();

    // Basket weave lines
    kCtx.strokeStyle = '#fef3c7';
    kCtx.lineWidth = 2;
    kCtx.beginPath();
    kCtx.moveTo(basketX - basketW / 2 + 12, by + 12);
    kCtx.lineTo(basketX + basketW / 2 - 12, by + 12);
    kCtx.moveTo(basketX - basketW / 2 + 12, by + 22);
    kCtx.lineTo(basketX + basketW / 2 - 12, by + 22);
    kCtx.stroke();
    kCtx.restore();

    // Game Over banner if lives == 0
    if (!catcherRunning && catcherLives <= 0) {
      kCtx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      kCtx.fillRect(0, 0, W, H);
      kCtx.fillStyle = '#fef08a';
      kCtx.font = 'bold 34px Georgia, serif';
      kCtx.textAlign = 'center';
      kCtx.fillText('Great Catching, Explorer!', W / 2, H / 2 - 25);
      kCtx.fillStyle = '#ffffff';
      kCtx.font = 'bold 22px sans-serif';
      kCtx.fillText(`Final Score: ${catcherScore} pts`, W / 2, H / 2 + 18);
      kCtx.font = '18px sans-serif';
      kCtx.fillText('Click "Start / Restart Game" to play again!', W / 2, H / 2 + 54);
    }
  }

  function catcherLoop() {
    if (!catcherRunning) {
      drawCatcherScene();
      return;
    }

    const W = catcherCanvas.width;
    const H = catcherCanvas.height;
    const by = H - 62;

    spawnCounter++;
    if (spawnCounter >= 38) {
      spawnCounter = 0;
      spawnFallingItem();
    }

    for (let i = fallingItems.length - 1; i >= 0; i--) {
      const it = fallingItems[i];
      it.y += it.vy;

      // Check collision with basket
      const hitX = Math.abs(it.x - basketX) < basketW / 2 + it.radius * 0.6;
      const hitY = it.y + it.radius >= by - 8 && it.y - it.radius <= by + basketH;

      if (hitX && hitY) {
        if (it.type === 'berry') {
          const prevHundreds = Math.floor(catcherScore / 100);
          catcherScore += 10;
          if (Math.floor(catcherScore / 100) > prevHundreds) updateStars(3);
          playChime([659.25]);
        } else if (it.type === 'star') {
          const prevHundreds = Math.floor(catcherScore / 100);
          catcherScore += 25;
          if (Math.floor(catcherScore / 100) > prevHundreds) updateStars(3);
          playChime([523.25, 783.99, 1046.5]);
        } else {
          catcherLives--;
          catcherLivesEl.textContent = String(catcherLives);
          playChime([220, 196]);
        }

        catcherScoreEl.textContent = String(catcherScore);
        if (catcherScore > catcherBest) {
          catcherBest = catcherScore;
          safeSetStorage('nano_catcher_best', catcherBest);
          catcherBestEl.textContent = String(catcherBest);
        }

        fallingItems.splice(i, 1);
        if (catcherLives <= 0) {
          catcherRunning = false;
          catcherStatusEl.textContent = `Game Over! You scored ${catcherScore} points! Click Start to play again!`;
        }
        continue;
      }

      if (it.y > H + 30) {
        fallingItems.splice(i, 1);
      }
    }

    drawCatcherScene();
    if (catcherRunning) {
      catcherAnimId = requestAnimationFrame(catcherLoop);
    }
  }

  // Pointer/Touch movement for Catcher Basket
  function moveBasketToClientX(clientX) {
    const rect = catcherCanvas.getBoundingClientRect();
    const relX = ((clientX - rect.left) / rect.width) * catcherCanvas.width;
    basketX = Math.max(basketW / 2 + 8, Math.min(catcherCanvas.width - basketW / 2 - 8, relX));
    if (!catcherRunning) drawCatcherScene();
  }

  catcherCanvas.addEventListener('mousemove', (e) => moveBasketToClientX(e.clientX));
  catcherCanvas.addEventListener(
    'touchmove',
    (e) => {
      e.preventDefault();
      if (e.touches[0]) moveBasketToClientX(e.touches[0].clientX);
    },
    { passive: false }
  );

  document.getElementById('catcher-left-btn')?.addEventListener('click', () => {
    basketX = Math.max(basketW / 2 + 8, basketX - 48);
    if (!catcherRunning) drawCatcherScene();
  });
  document.getElementById('catcher-right-btn')?.addEventListener('click', () => {
    basketX = Math.min(catcherCanvas.width - basketW / 2 - 8, basketX + 48);
    if (!catcherRunning) drawCatcherScene();
  });

  window.addEventListener('keydown', (e) => {
    if (isTypingInInput()) return;
    const catcherPanel = document.getElementById('game-catcher');
    if (catcherPanel && catcherPanel.classList.contains('active')) {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        basketX = Math.max(basketW / 2 + 8, basketX - 38);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        basketX = Math.min(catcherCanvas.width - basketW / 2 - 8, basketX + 38);
      }
    }
  });

  document.getElementById('catcher-start-btn')?.addEventListener('click', startCatcherGame);
  drawCatcherScene();

  // ==========================================================================
  // 2B. INTERACTIVE BOOK CAROUSELS (HERO & BOOKS SECTION)
  // ==========================================================================
  function setupBookCarousel(trackId) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const cards = Array.from(track.children);
    if (cards.length === 0) return;

    const dotsWrap = document.querySelector(`.carousel-dots[data-target="${trackId}"]`);
    const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('.carousel-dot')) : [];
    const prevBtn = document.querySelector(`.carousel-prev[data-target="${trackId}"]`);
    const nextBtn = document.querySelector(`.carousel-next[data-target="${trackId}"]`);
    let activeIdx = 0;

    function highlightBook(idx, scrollTrack = true) {
      activeIdx = (idx + cards.length) % cards.length;
      cards.forEach((c, i) => c.classList.toggle('carousel-active', i === activeIdx));
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));

      if (scrollTrack && track.scrollWidth > track.clientWidth + 10) {
        const targetCard = cards[activeIdx];
        const scrollLeft =
          targetCard.offsetLeft - (track.clientWidth - targetCard.clientWidth) / 2;
        track.scrollTo({ left: Math.max(0, scrollLeft), behavior: 'smooth' });
      }
    }

    prevBtn?.addEventListener('click', () => {
      highlightBook(activeIdx - 1, true);
      playChime([523.25]);
    });
    nextBtn?.addEventListener('click', () => {
      highlightBook(activeIdx + 1, true);
      playChime([659.25]);
    });
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        highlightBook(idx, true);
        playChime([587.33]);
      });
    });

    // Update active dot automatically when swiping on mobile
    let scrollTimeout = null;
    track.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let closestIdx = 0;
        let minDiff = Infinity;
        cards.forEach((c, idx) => {
          const cardCenter = c.offsetLeft + c.clientWidth / 2;
          const diff = Math.abs(center - cardCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = idx;
          }
        });
        highlightBook(closestIdx, false);
      }, 90);
    });

    highlightBook(0, false);
  }

  setupBookCarousel('hero-book-shelf');
  setupBookCarousel('books-grid-carousel');

  // ==========================================================================
  // 3. FRONT / BACK COVER TOGGLE ON BOOK CARDS
  // ==========================================================================
  document.querySelectorAll('.cover-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetImg = document.getElementById(btn.dataset.target);
      if (targetImg) targetImg.src = btn.dataset.img;
      const parent = btn.closest('.cover-toggle-bar');
      parent.querySelectorAll('.cover-toggle-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ==========================================================================
  // 4. PEEK INSIDE PAGE-FLIPPER MODAL (BOOKS + BONUS STORY XI)
  // ==========================================================================
  const bookPreviews = {
    bonus_story: {
      title: 'Web-Exclusive Bonus Story (Book XI): The Secret Treehouse Lantern Night',
      pages: [
        'assets/previews/bonus_story_p1.jpg',
        'assets/previews/bonus_story_p2.jpg',
        'assets/previews/bonus_story_p3.jpg',
        'assets/previews/bonus_story_p4.jpg',
        'assets/previews/bonus_story_p5.jpg'
      ]
    },
    bonus_coloring: {
      title: '5 Exclusive Bonus Coloring & Puzzle Pages (Web Bonus Pack)',
      pages: [
        'assets/previews/bonus_color_p1.jpg',
        'assets/previews/bonus_color_p2.jpg',
        'assets/previews/bonus_color_p3.jpg',
        'assets/previews/bonus_color_p4.jpg',
        'assets/previews/bonus_color_p5.jpg'
      ]
    },
    craft_bookmarks: {
      title: 'Cut-Out Character Bookmarks Sheet (Free Printable PDF)',
      pages: [
        'assets/previews/craft_bookmarks_prev.jpg'
      ]
    },
    craft_puppets: {
      title: '3D Paper Finger Puppets & Reading Log (Free Printable PDF)',
      pages: [
        'assets/previews/craft_puppets_prev.jpg'
      ]
    },
    draw: {
      title: 'The Ultimate Drawing & Activity Book: Vol. 1 (58 Pages)',
      pages: [
        'assets/covers/drawing_vol1_front.jpg',
        'assets/previews/draw_prev_1.jpg',
        'assets/previews/draw_prev_2.jpg',
        'assets/previews/draw_prev_3.jpg',
        'assets/previews/draw_prev_4.jpg'
      ]
    },
    vol1: {
      title: 'Adventures of Nano & Friends - Volume 1 (Books I-V | 82 Pages)',
      pages: [
        'assets/covers/story_vol1_front.jpg',
        'assets/previews/vol1_prev_1.jpg',
        'assets/previews/vol1_prev_2.jpg',
        'assets/previews/vol1_prev_3.jpg',
        'assets/previews/vol1_prev_4.jpg',
        'assets/covers/story_vol1_back.jpg'
      ]
    },
    vol2: {
      title: 'Adventures of Nano & Friends - Volume 2 (Books VI-X | 82 Pages)',
      pages: [
        'assets/covers/story_vol2_front.jpg',
        'assets/previews/vol2_prev_1.jpg',
        'assets/previews/vol2_prev_2.jpg',
        'assets/previews/vol2_prev_3.jpg',
        'assets/previews/vol2_prev_4.jpg',
        'assets/covers/story_vol2_back.jpg'
      ]
    }
  };

  const modal = document.getElementById('peek-modal');
  const modalTitle = document.getElementById('modal-book-title');
  const modalImg = document.getElementById('modal-page-img');
  const modalCounter = document.getElementById('modal-page-counter');
  let currentBookKey = 'vol1';
  let currentPageIdx = 0;

  function updateModalPage() {
    const data = bookPreviews[currentBookKey];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalImg.src = data.pages[currentPageIdx];
    modalCounter.textContent = `Page ${currentPageIdx + 1} of ${data.pages.length}`;
  }

  document.querySelectorAll('.open-peek-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentBookKey = btn.dataset.book;
      currentPageIdx = 0;
      updateModalPage();
      modal.classList.add('open');
      playChime();
    });
  });

  document.getElementById('modal-prev-btn').addEventListener('click', () => {
    const data = bookPreviews[currentBookKey];
    if (!data) return;
    currentPageIdx = (currentPageIdx - 1 + data.pages.length) % data.pages.length;
    updateModalPage();
  });

  document.getElementById('modal-next-btn').addEventListener('click', () => {
    const data = bookPreviews[currentBookKey];
    if (!data) return;
    currentPageIdx = (currentPageIdx + 1) % data.pages.length;
    updateModalPage();
  });

  document.getElementById('modal-close-btn').addEventListener('click', () => {
    modal.classList.remove('open');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // --- RELIABLE CANVAS PNG DOWNLOAD HELPER (WORKS ON BOTH file:// AND https://) ---
  function triggerCanvasPngDownload(canvasEl, fileName, btnEl, doneLabel) {
    const origText = btnEl ? btnEl.textContent : '';
    const fireLink = (hrefUrl, isObjectUrl) => {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = hrefUrl;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        if (isObjectUrl) URL.revokeObjectURL(hrefUrl);
      }, 250);
      if (btnEl && doneLabel) {
        btnEl.textContent = doneLabel;
        setTimeout(() => {
          btnEl.textContent = origText;
        }, 2400);
      }
    };

    try {
      if (canvasEl.toBlob) {
        canvasEl.toBlob((blob) => {
          if (blob) {
            fireLink(URL.createObjectURL(blob), true);
          } else {
            fireLink(canvasEl.toDataURL('image/png'), false);
          }
        }, 'image/png');
      } else {
        fireLink(canvasEl.toDataURL('image/png'), false);
      }
    } catch (_) {
      try {
        fireLink(canvasEl.toDataURL('image/png'), false);
      } catch (err) {
        console.error('Canvas download error:', err);
      }
    }
  }

  // ==========================================================================
  // 5. INTERACTIVE ON-SCREEN BONUS COLORING STUDIO
  // ==========================================================================
  const paintCanvas = document.getElementById('paint-canvas');
  const pCtx = paintCanvas.getContext('2d');
  const lineartOverlay = document.getElementById('lineart-overlay');
  const brushSizeInput = document.getElementById('brush-size');

  function getSafeColoringSrc(srcKey) {
    if (window.COLORING_DATA_URLS && window.COLORING_DATA_URLS[srcKey]) {
      return window.COLORING_DATA_URLS[srcKey];
    }
    return srcKey;
  }

  // Initialize with Base64 data URL so file:// never taints the canvas
  lineartOverlay.src = getSafeColoringSrc('assets/coloring/coloring_1.png');

  paintCanvas.width = 900;
  paintCanvas.height = 1200;
  pCtx.fillStyle = '#ffffff';
  pCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);

  let isDrawing = false;
  let brushColor = '#f59e0b';
  let lastX = 0;
  let lastY = 0;

  function getCanvasCoords(e) {
    const rect = paintCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * paintCanvas.width,
      y: ((clientY - rect.top) / rect.height) * paintCanvas.height
    };
  }

  function startPaint(e) {
    isDrawing = true;
    const pos = getCanvasCoords(e);
    lastX = pos.x;
    lastY = pos.y;
    drawStroke(e);
  }

  function drawStroke(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getCanvasCoords(e);
    pCtx.save();
    pCtx.lineCap = 'round';
    pCtx.lineJoin = 'round';
    pCtx.strokeStyle = brushColor;
    pCtx.lineWidth = parseFloat(brushSizeInput.value || '28');
    pCtx.beginPath();
    pCtx.moveTo(lastX, lastY);
    pCtx.lineTo(pos.x, pos.y);
    pCtx.stroke();
    pCtx.restore();
    lastX = pos.x;
    lastY = pos.y;
  }

  function stopPaint() {
    isDrawing = false;
  }

  paintCanvas.addEventListener('mousedown', startPaint);
  paintCanvas.addEventListener('mousemove', drawStroke);
  window.addEventListener('mouseup', stopPaint);
  paintCanvas.addEventListener('touchstart', startPaint, { passive: false });
  paintCanvas.addEventListener('touchmove', drawStroke, { passive: false });
  window.addEventListener('touchend', stopPaint);

  document.querySelectorAll('.crayon-swatch').forEach((sw) => {
    sw.addEventListener('click', () => {
      brushColor = sw.dataset.color;
      document.querySelectorAll('.crayon-swatch').forEach((s) => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });

  document.querySelectorAll('.page-thumb-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      lineartOverlay.src = getSafeColoringSrc(btn.dataset.src);
      pCtx.fillStyle = '#ffffff';
      pCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
      document.querySelectorAll('.page-thumb-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.getElementById('clear-canvas-btn').addEventListener('click', () => {
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
  });

  const saveArtworkBtn = document.getElementById('save-artwork-btn');
  saveArtworkBtn.addEventListener('click', () => {
    const outCanvas = document.createElement('canvas');
    outCanvas.width = paintCanvas.width;
    outCanvas.height = paintCanvas.height;
    const oCtx = outCanvas.getContext('2d');
    oCtx.fillStyle = '#ffffff';
    oCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
    oCtx.drawImage(paintCanvas, 0, 0);
    oCtx.globalCompositeOperation = 'multiply';
    oCtx.drawImage(lineartOverlay, 0, 0, outCanvas.width, outCanvas.height);

    triggerCanvasPngDownload(
      outCanvas,
      'My_Nano_And_Friends_Bonus_Coloring.png',
      saveArtworkBtn,
      'Saved Colored Page (PNG)!'
    );
    updateStars(3);
    playChime();
  });

  // ==========================================================================
  // 6. PROPORTIONAL 1400x990 CERTIFICATE GENERATOR (USES SAFE DATA URI BASE IMAGE)
  // ==========================================================================
  const certCanvas = document.getElementById('cert-canvas');
  const cCtx = certCanvas.getContext('2d');
  const childNameInput = document.getElementById('child-name-input');
  const certAwardSelect = document.getElementById('cert-award-select');
  const certCharSelect = document.getElementById('cert-char-select');

  function sanitizeChildName(raw) {
    return String(raw || '')
      .replace(/[<>"'`&/\\]/g, '')
      .slice(0, 26);
  }

  const certBaseImg = new Image();
  certBaseImg.onload = () => renderCertificate();
  certBaseImg.src = window.CERT_BG_DATA_URL || 'assets/certificate_template_bg.png';

  function renderCertificate() {
    const W = certCanvas.width; // 1400
    const H = certCanvas.height; // 990
    const cleanInput = sanitizeChildName(childNameInput.value);
    if (childNameInput.value !== cleanInput) {
      childNameInput.value = cleanInput;
    }
    const childName = cleanInput.trim() || 'Young Explorer';
    const awardTitle = certAwardSelect.value;
    const favChar = certCharSelect.value;

    cCtx.clearRect(0, 0, W, H);
    if (certBaseImg.complete && certBaseImg.naturalWidth > 0) {
      cCtx.drawImage(certBaseImg, 0, 0, W, H);
    } else {
      cCtx.fillStyle = '#fffdf5';
      cCtx.fillRect(0, 0, W, H);
    }

    cCtx.textAlign = 'center';
    cCtx.textBaseline = 'middle';

    // Award Title (Y = 198)
    cCtx.fillStyle = '#b45309';
    cCtx.font = 'bold 42px Georgia, serif';
    cCtx.fillText(awardTitle.toUpperCase(), W / 2, 198);

    // Child's Name (Y = 322)
    cCtx.fillStyle = '#ea580c';
    cCtx.font = 'bold 64px Georgia, serif';
    cCtx.fillText(childName, W / 2, 322);

    // Character Labels & Best Buddy Ring Highlight (Y = 572, labels at Y = 662)
    const slugs = ['nano', 'kuttu', 'mj', 'oreo', 'mickey'];
    const names = { nano: 'Nano', kuttu: 'Kuttu', mj: 'MJ', oreo: 'Oreo', mickey: 'Mickey' };
    slugs.forEach((slug, idx) => {
      const cx = 260 + idx * 220;
      const cy = 572;
      const isFav = slug === favChar;
      if (isFav) {
        cCtx.save();
        cCtx.strokeStyle = '#ea580c';
        cCtx.lineWidth = 6;
        cCtx.beginPath();
        cCtx.arc(cx, cy, 68, 0, Math.PI * 2);
        cCtx.stroke();
        cCtx.restore();
      }
      cCtx.fillStyle = isFav ? '#ea580c' : '#475569';
      cCtx.font = isFav ? 'bold 19px sans-serif' : 'bold 17px sans-serif';
      cCtx.fillText(isFav ? `${names[slug]} (Best Buddy)` : names[slug], cx, 662);
    });

    // Awarded Date (X = 320, Y = 780)
    const todayStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    cCtx.fillStyle = '#1e293b';
    cCtx.font = 'bold 26px Georgia, serif';
    cCtx.fillText(todayStr, 320, 780);
  }

  childNameInput.addEventListener('input', renderCertificate);
  certAwardSelect.addEventListener('change', renderCertificate);
  certCharSelect.addEventListener('change', renderCertificate);
  renderCertificate();

  const downloadCertBtn = document.getElementById('download-cert-btn');
  downloadCertBtn.addEventListener('click', () => {
    renderCertificate();
    const safeFileSlug = (sanitizeChildName(childNameInput.value).trim() || 'Explorer')
      .replace(/[^a-zA-Z0-9_-]+/g, '_');
    triggerCanvasPngDownload(
      certCanvas,
      `Nano_And_Friends_Certificate_${safeFileSlug}.png`,
      downloadCertBtn,
      'Certificate Downloaded (PNG)!'
    );
    updateStars(3);
    playChime();
  });
});
