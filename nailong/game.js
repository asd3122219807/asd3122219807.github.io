/* =========================================================
   奶龙消消乐 — 纯前端三消
   ========================================================= */
(function () {
  'use strict';

  const COLS = 8;
  const ROWS = 8;
  const TYPES = ['dragon', 'milk', 'star', 'heart', 'candy', 'cloud'];
  const CELL_PCT = 100 / COLS;

  const TYPE_COLOR = {
    dragon: '#FFC93C',
    milk: '#7FD0F5',
    star: '#FF9A2E',
    heart: '#FF6FA5',
    candy: '#A97CF5',
    cloud: '#6FC8F0'
  };

  const EASE = 'cubic-bezier(.3,.75,.35,1)';

  /* ---------------- 美术：全部为手绘 SVG，无外部图片 ---------------- */

  const FACE = (x, y, s = 1) => `
    <circle cx="${x - 7 * s}" cy="${y}" r="${3.1 * s}" fill="#4A3018"/>
    <circle cx="${x + 7 * s}" cy="${y}" r="${3.1 * s}" fill="#4A3018"/>
    <circle cx="${x - 7.9 * s}" cy="${y - 1.2 * s}" r="${1.1 * s}" fill="#fff"/>
    <circle cx="${x + 6.1 * s}" cy="${y - 1.2 * s}" r="${1.1 * s}" fill="#fff"/>
    <path d="M${x - 4.4 * s} ${y + 5.6 * s} q${4.4 * s} ${4.2 * s} ${8.8 * s} 0"
          stroke="#4A3018" stroke-width="${2.2 * s}" fill="none" stroke-linecap="round"/>`;

  const ART = {
    dragon: `
      <path d="M33 33c-7-9-1-16 7-9l6 7z" fill="#F2B33A"/>
      <path d="M67 33c7-9 1-16-7-9l-6 7z" fill="#F2B33A"/>
      <ellipse cx="50" cy="58" rx="33" ry="30" fill="#FFD645"/>
      <ellipse cx="50" cy="64" rx="23" ry="21" fill="#FFE68F"/>
      <circle cx="38" cy="53" r="8.2" fill="#fff"/>
      <circle cx="62" cy="53" r="8.2" fill="#fff"/>
      <circle cx="38.4" cy="54.4" r="4.3" fill="#3F2A12"/>
      <circle cx="61.6" cy="54.4" r="4.3" fill="#3F2A12"/>
      <circle cx="36.9" cy="52.6" r="1.5" fill="#fff"/>
      <circle cx="60.1" cy="52.6" r="1.5" fill="#fff"/>
      <ellipse cx="50" cy="67" rx="15" ry="10.5" fill="#FFF3B8"/>
      <ellipse cx="46" cy="63.6" rx="2" ry="1.5" fill="#C08A38" opacity=".55"/>
      <ellipse cx="54" cy="63.6" rx="2" ry="1.5" fill="#C08A38" opacity=".55"/>
      <path d="M44.5 69.5q5.5 5 11 0" stroke="#4A3018" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <circle cx="26.5" cy="63" r="4.6" fill="#FF9DBB" opacity=".62"/>
      <circle cx="73.5" cy="63" r="4.6" fill="#FF9DBB" opacity=".62"/>
    `,
    milk: `
      <rect x="38.5" y="12" width="23" height="9.5" rx="4.4" fill="#63C5F2"/>
      <rect x="42" y="21.5" width="16" height="5" fill="#A8DDF7"/>
      <path d="M41 26h18v7c9 4.2 13 13 13 23v21.5a9 9 0 0 1-9 9H37a9 9 0 0 1-9-9V56c0-10 4-18.8 13-23z"
            fill="#FFFDF6" stroke="#E6D8BC" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M31 60h38v17.5a9 9 0 0 1-9 9H40a9 9 0 0 1-9-9z" fill="#E2F2FF"/>
      <path d="M36 64h28" stroke="#BFE2FA" stroke-width="2.5" stroke-linecap="round"/>
      ${FACE(50, 50, .82)}
    `,
    star: `
      <path d="M50 11.5l10.4 22 24.1 3.2-17.6 16.8 4.4 24L50 66.2 28.7 77.5l4.4-24L15.5 36.7l24.1-3.2z"
            fill="#FFA53D" stroke="#EE8517" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M50 20.5l6.6 14 15.3 2-11.2 10.7 2.8 15.2L50 55.9l-13.5 6.5 2.8-15.2-11.2-10.7 15.3-2z"
            fill="#FFBE6B" opacity=".85"/>
      ${FACE(50, 45, .95)}
    `,
    heart: `
      <path d="M50 82C20.5 62.2 12 46.4 19.6 33.4 26.6 21.4 42.6 21.6 50 35.2c7.4-13.6 23.4-13.8 30.4-1.8C88 46.4 79.5 62.2 50 82z"
            fill="#FF7FAE" stroke="#F0508E" stroke-width="2.8" stroke-linejoin="round"/>
      <path d="M28 37c2-5 7-7 11-6" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>
      ${FACE(50, 50, .95)}
    `,
    candy: `
      <path d="M24 38l-13-9v42l13-9z" fill="#CBA8FF" stroke="#9A6BE8" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M76 38l13-9v42l-13-9z" fill="#CBA8FF" stroke="#9A6BE8" stroke-width="2.4" stroke-linejoin="round"/>
      <circle cx="50" cy="52" r="25.5" fill="#B98BFF" stroke="#9A6BE8" stroke-width="2.6"/>
      <path d="M35 44c6-9 24-9 30 0" stroke="#fff" stroke-width="4.2" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M65 60c-6 9-24 9-30 0" stroke="#fff" stroke-width="4.2" fill="none" stroke-linecap="round" opacity=".7"/>
      ${FACE(50, 52, .9)}
    `,
    cloud: `
      <g fill="#8FD6F8">
        <circle cx="31" cy="55" r="17"/>
        <circle cx="50" cy="43" r="20.5"/>
        <circle cx="69" cy="55" r="16"/>
        <rect x="26" y="42" width="48" height="30" rx="15"/>
      </g>
      <rect x="16" y="59" width="68" height="27" rx="13.5" fill="#B6E7FF"/>
      <path d="M27 61c2-6 7-9 13-9" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".65"/>
      ${FACE(50, 48, .9)}
    `
  };

  const MASCOT = `
    <svg viewBox="0 0 120 120">
      <ellipse cx="60" cy="108" rx="32" ry="6" fill="#E9C08A" opacity=".28"/>
      <path d="M40 37c-8-11-1-19 8-11l7 8z" fill="#F2B33A"/>
      <path d="M80 37c8-11 1-19-8-11l-7 8z" fill="#F2B33A"/>
      <ellipse cx="60" cy="70" rx="40" ry="36" fill="#FFD645"/>
      <ellipse cx="60" cy="77" rx="28" ry="25" fill="#FFE68F"/>
      <circle cx="45" cy="64" r="10" fill="#fff"/>
      <circle cx="75" cy="64" r="10" fill="#fff"/>
      <circle cx="45.5" cy="65.5" r="5.3" fill="#3F2A12"/>
      <circle cx="74.5" cy="65.5" r="5.3" fill="#3F2A12"/>
      <circle cx="43.6" cy="63.4" r="1.8" fill="#fff"/>
      <circle cx="72.6" cy="63.4" r="1.8" fill="#fff"/>
      <ellipse cx="60" cy="81" rx="18" ry="13" fill="#FFF3B8"/>
      <ellipse cx="55" cy="77" rx="2.4" ry="1.8" fill="#C08A38" opacity=".55"/>
      <ellipse cx="65" cy="77" rx="2.4" ry="1.8" fill="#C08A38" opacity=".55"/>
      <path d="M53 84q7 6 14 0" stroke="#4A3018" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="31" cy="76" r="5.6" fill="#FF9DBB" opacity=".6"/>
      <circle cx="89" cy="76" r="5.6" fill="#FF9DBB" opacity=".6"/>
    </svg>`;

  let artSeq = 0;

  function rainbowSVG() {
    const id = 'rb' + (++artSeq);
    return `<defs>
        <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FFD84D"/>
          <stop offset=".34" stop-color="#FF8FB1"/>
          <stop offset=".68" stop-color="#9E8CFF"/>
          <stop offset="1" stop-color="#5FD3FF"/>
        </linearGradient>
      </defs>
      <circle cx="50" cy="52" r="35" fill="url(#${id})"/>
      <circle cx="50" cy="52" r="25" fill="#fff" opacity=".22"/>
      <circle cx="50" cy="52" r="35" fill="none" stroke="#fff" stroke-width="2.6" opacity=".7"/>
      <path d="M50 27l5.7 11.4 12.6 1.8-9.1 8.9 2.1 12.6L50 55.8l-11.3 5.9 2.1-12.6-9.1-8.9 12.6-1.8z"
            fill="#fff" opacity=".95"/>`;
  }

  function overlaySVG(kind) {
    if (kind === 'row' || kind === 'col') {
      const rot = kind === 'col' ? ' rotate(90 50 50)' : '';
      return `<g transform="${rot}">
          <rect x="8" y="45" width="84" height="11" rx="5.5" fill="#fff" opacity=".55"/>
          <path d="M5 50.5l13-8v16z" fill="#fff" stroke="#FF7A2F" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M95 50.5l-13-8v16z" fill="#fff" stroke="#FF7A2F" stroke-width="2.4" stroke-linejoin="round"/>
        </g>`;
    }
    if (kind === 'bomb') {
      return `<circle cx="50" cy="52" r="40" fill="none" stroke="#FF7A45" stroke-width="4.5" stroke-dasharray="9 7" opacity=".92"/>
        <circle cx="50" cy="52" r="40" fill="none" stroke="#fff" stroke-width="4.5" stroke-dasharray="9 7" stroke-dashoffset="8" opacity=".6"/>
        <g fill="#FF7A45" stroke="#fff" stroke-width="1.6">
          <circle cx="50" cy="9" r="4.2"/>
          <circle cx="93" cy="52" r="4.2"/>
          <circle cx="50" cy="95" r="4.2"/>
          <circle cx="7" cy="52" r="4.2"/>
        </g>`;
    }
    return '';
  }

  function tileSVG(type, special) {
    if (special === 'rainbow') return `<svg viewBox="0 0 100 100">${rainbowSVG()}</svg>`;
    return `<svg viewBox="0 0 100 100">${ART[type] || ''}${special ? overlaySVG(special) : ''}</svg>`;
  }

  /* ---------------- 状态 ---------------- */

  const $ = (id) => document.getElementById(id);
  const boardEl = $('board');
  const scoreEl = $('score');
  const targetEl = $('target');
  const movesEl = $('moves');
  const barFill = $('barFill');
  const lvlEl = $('lvl');
  const comboEl = $('combo');
  const toastEl = $('toast');

  let grid = [];
  let tileId = 0;
  let pending = null;      // 拖拽状态
  let hintTimer = null;
  let hintEls = [];
  let toastTimer = null;

  const state = {
    level: 1,
    score: 0,
    target: 1200,
    moves: 22,
    busy: true,
    started: false,
    over: false,
    sound: true
  };

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const key = (r, c) => r * COLS + c;
  const rc = (k) => [Math.floor(k / COLS), k % COLS];

  function randType() {
    return TYPES[(Math.random() * TYPES.length) | 0];
  }

  /* ---------------- 棋盘构建 ---------------- */

  function createTile(type, r, c, special = null) {
    const el = document.createElement('div');
    el.className = 'tile' + (special ? ' special' : '');
    el.innerHTML = tileSVG(type, special);
    el.style.transform = `translate(${c * 100}%, ${r * 100}%)`;
    el.style.transition = 'none';
    boardEl.appendChild(el);
    return { id: ++tileId, type, special, r, c, el };
  }

  function wouldMatchAt(type, r, c) {
    let n = 1;
    for (let x = c - 1; x >= 0 && grid[r][x] && grid[r][x].type === type; x--) n++;
    for (let x = c + 1; x < COLS && grid[r][x] && grid[r][x].type === type; x++) n++;
    if (n >= 3) return true;
    n = 1;
    for (let y = r - 1; y >= 0 && grid[y][c] && grid[y][c].type === type; y--) n++;
    for (let y = r + 1; y < ROWS && grid[y][c] && grid[y][c].type === type; y++) n++;
    return n >= 3;
  }

  function buildGrid(animated) {
    boardEl.innerHTML = '';
    hintEls = [];
    grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        let type;
        for (let guard = 0; guard < 60; guard++) {
          type = randType();
          if (!wouldMatchAt(type, r, c)) break;
        }
        const t = createTile(type, r, c);
        grid[r][c] = t;
        if (animated) {
          t.el.style.transform = `translate(${c * 100}%, ${(r - ROWS) * 100}%)`;
          t.el.style.transition = `transform 420ms ${EASE} ${(c * 22 + 80)}ms`;
          requestAnimationFrame(() => {
            t.el.style.transform = `translate(${c * 100}%, ${r * 100}%)`;
          });
        }
      }
    }

    // 保证有可行的一步
    if (animated) void boardEl.offsetHeight;

    let guard = 0;
    while (!findMove() && guard++ < 30) {
      const r = (Math.random() * ROWS) | 0;
      const c = (Math.random() * COLS) | 0;
      const t = grid[r][c];
      const old = t.type;
      for (let k = 0; k < 20; k++) {
        const nt = randType();
        if (nt === old) continue;
        t.type = nt;
        if (!wouldMatchAt(nt, r, c)) break;
        t.type = old;
      }
      if (t.type !== old) {
        t.el.innerHTML = tileSVG(t.type, t.special);
        t.el.classList.toggle('special', !!t.special);
      }
    }
  }

  /* ---------------- 布局 ---------------- */

  function fitBoard() {
    const wrap = document.querySelector('.board-wrap');
    const frame = document.querySelector('.board-frame');
    const cs = getComputedStyle(frame);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const availW = wrap.clientWidth - padX;
    const availH = wrap.clientHeight - padY;
    const size = Math.max(180, Math.floor(Math.min(availW, availH, 468)));
    boardEl.style.width = size + 'px';
    boardEl.style.height = size + 'px';
  }

  function cellAt(clientX, clientY) {
    const rect = boardEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
    return {
      c: Math.min(COLS - 1, Math.floor(x / (rect.width / COLS))),
      r: Math.min(ROWS - 1, Math.floor(y / (rect.height / ROWS)))
    };
  }

  /* ---------------- 位置动画 ---------------- */

  function setPos(t, r, c, animate = true, dur = 180) {
    if (!t || !t.el) return;
    t.el.style.transition = animate ? `transform ${dur}ms ${EASE}` : 'none';
    t.el.style.transform = `translate(${c * 100}%, ${r * 100}%)`;
  }

  /* ---------------- 匹配 ---------------- */

  const usable = (t) => !!t && t.special !== 'rainbow';

  function findRuns() {
    const runs = [];
    for (let r = 0; r < ROWS; r++) {
      let c = 0;
      while (c < COLS) {
        const t = grid[r][c];
        if (!usable(t)) { c++; continue; }
        let e = c;
        while (e + 1 < COLS) {
          const n = grid[r][e + 1];
          if (!usable(n) || n.type !== t.type) break;
          e++;
        }
        if (e - c + 1 >= 3) {
          const cells = [];
          for (let x = c; x <= e; x++) cells.push(key(r, x));
          runs.push({ dir: 'h', len: e - c + 1, cells, type: t.type });
        }
        c = e + 1;
      }
    }
    for (let c = 0; c < COLS; c++) {
      let r = 0;
      while (r < ROWS) {
        const t = grid[r][c];
        if (!usable(t)) { r++; continue; }
        let e = r;
        while (e + 1 < ROWS) {
          const n = grid[e + 1][c];
          if (!usable(n) || n.type !== t.type) break;
          e++;
        }
        if (e - r + 1 >= 3) {
          const cells = [];
          for (let y = r; y <= e; y++) cells.push(key(y, c));
          runs.push({ dir: 'v', len: e - r + 1, cells, type: t.type });
        }
        r = e + 1;
      }
    }
    return runs;
  }

  function findGroups() {
    const runs = findRuns();
    if (!runs.length) return [];
    const parent = runs.map((_, i) => i);
    const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
    const union = (a, b) => {
      a = find(a); b = find(b);
      if (a !== b) parent[b] = a;
    };
    const seen = new Map();
    runs.forEach((run, i) => {
      run.cells.forEach((k) => {
        if (seen.has(k)) union(seen.get(k), i);
        else seen.set(k, i);
      });
    });
    const map = new Map();
    runs.forEach((run, i) => {
      const root = find(i);
      if (!map.has(root)) map.set(root, { runs: [], cells: new Set(), type: run.type });
      const g = map.get(root);
      g.runs.push(run);
      run.cells.forEach((k) => g.cells.add(k));
    });
    return Array.from(map.values());
  }

  function findMove() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = grid[r][c];
        if (!t) continue;
        if (c + 1 < COLS) {
          const n = grid[r][c + 1];
          if (n && (t.special === 'rainbow' || n.special === 'rainbow')) return { a: { r, c }, b: { r, c: c + 1 } };
          if (n && testSwap(r, c, r, c + 1)) return { a: { r, c }, b: { r, c: c + 1 } };
        }
        if (r + 1 < ROWS) {
          const n = grid[r + 1][c];
          if (n && testSwap(r, c, r + 1, c)) return { a: { r, c }, b: { r: r + 1, c } };
        }
      }
    }
    return null;
  }

  function testSwap(r1, c1, r2, c2) {
    const a = grid[r1][c1];
    const b = grid[r2][c2];
    if (!a || !b) return false;
    if (a.special === 'rainbow' || b.special === 'rainbow') return true;
    grid[r1][c1] = b; grid[r2][c2] = a;
    const ok = findRuns().length > 0;
    grid[r1][c1] = a; grid[r2][c2] = b;
    return ok;
  }

  function specialFor(g) {
    const maxH = Math.max(0, ...g.runs.filter((x) => x.dir === 'h').map((x) => x.len));
    const maxV = Math.max(0, ...g.runs.filter((x) => x.dir === 'v').map((x) => x.len));
    if (maxH >= 5 || maxV >= 5) return 'rainbow';
    if (maxH >= 3 && maxV >= 3) return 'bomb';
    if (maxH === 4) return 'row';
    if (maxV === 4) return 'col';
    return null;
  }

  function pickCell(g, preferred) {
    const list = Array.isArray(preferred) ? preferred : (preferred ? [preferred] : []);
    for (const p of list) {
      if (p && g.cells.has(key(p.r, p.c))) return key(p.r, p.c);
    }
    const vKeys = new Set();
    g.runs.forEach((run) => { if (run.dir === 'v') run.cells.forEach((k) => vKeys.add(k)); });
    for (const run of g.runs) {
      if (run.dir !== 'h') continue;
      for (const k of run.cells) if (vKeys.has(k)) return k;
    }
    let longest = g.runs[0];
    for (const run of g.runs) if (run.len > longest.len) longest = run;
    return longest.cells[Math.floor(longest.cells.length / 2)];
  }

  function mostCommonColor() {
    const count = {};
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const t = grid[r][c];
        if (t && t.type && t.special !== 'rainbow') count[t.type] = (count[t.type] || 0) + 1;
      }
    }
    let best = null;
    let max = 0;
    for (const k in count) if (count[k] > max) { max = count[k]; best = k; }
    return best;
  }

  /* ---------------- 消除 ---------------- */

  function expandClears(start, protect) {
    const clear = new Set();
    const queue = [];
    const fired = new Set();

    const add = (k) => {
      if (clear.has(k) || protect.has(k)) return;
      const [r, c] = rc(k);
      if (!grid[r] || !grid[r][c]) return;
      clear.add(k);
      queue.push(k);
    };

    start.forEach(add);

    while (queue.length) {
      const k = queue.pop();
      const [r, c] = rc(k);
      const t = grid[r][c];
      if (!t || !t.special || fired.has(t.id)) continue;
      fired.add(t.id);

      if (t.special === 'rainbow') {
        const color = mostCommonColor();
        if (color) {
          for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
              const o = grid[y][x];
              if (o && o.type === color && o.special !== 'rainbow') add(key(y, x));
            }
          }
        }
      } else if (t.special === 'row') {
        for (let x = 0; x < COLS; x++) add(key(r, x));
      } else if (t.special === 'col') {
        for (let y = 0; y < ROWS; y++) add(key(y, c));
      } else if (t.special === 'bomb') {
        for (let y = r - 1; y <= r + 1; y++) {
          for (let x = c - 1; x <= c + 1; x++) {
            if (y >= 0 && y < ROWS && x >= 0 && x < COLS) add(key(y, x));
          }
        }
      }
    }
    return clear;
  }

  async function doClear(cells, cascade, news) {
    news = news || [];
    if (cells.size) {
      const touched = [];
      let sr = 0, sc = 0, n = 0;
      for (const k of cells) {
        const [r, c] = rc(k);
        const t = grid[r][c];
        if (!t) continue;
        touched.push(t);
        sr += r; sc += c; n++;
        burst(r, c, t.type);
        t.el.classList.add('pop');
      }
      if (n) {
        const gain = n * 20 * cascade + news.length * 80;
        state.score += gain;
        updateHUD();
        floatText(sr / n, sc / n, '+' + gain, false);
        sfx('match', cascade);
      }
      await wait(245);
      for (const t of touched) {
        t.el.remove();
        if (grid[t.r] && grid[t.r][t.c] === t) grid[t.r][t.c] = null;
      }
    } else if (news.length) {
      state.score += news.length * 80;
      updateHUD();
    }

    for (const item of news) {
      const [r, c] = rc(item.k);
      const t = grid[r][c];
      if (!t) continue;
      t.special = item.sp;
      t.el.innerHTML = tileSVG(t.type, t.special);
      t.el.classList.add('special');
      t.el.classList.remove('upgrade');
      void t.el.offsetWidth;
      t.el.classList.add('upgrade');
      setTimeout(() => { if (t.el) t.el.classList.remove('upgrade'); }, 430);
      floatText(r, c, item.sp === 'rainbow' ? '彩虹球!' : item.sp === 'bomb' ? '炸弹!' : '火箭!', true);
      sfx('special');
    }
  }

  async function settle() {
    await collapseAndRefill();
    await wait(40);
  }

  function collapseAndRefill() {
    const anim = [];

    for (let c = 0; c < COLS; c++) {
      let write = ROWS - 1;
      for (let r = ROWS - 1; r >= 0; r--) {
        const t = grid[r][c];
        if (!t) continue;
        if (write !== r) {
          grid[write][c] = t;
          grid[r][c] = null;
          anim.push({ t, from: r });
          t.r = write;
        }
        write--;
      }
      const count = write + 1;
      for (let i = 0; i < count; i++) {
        const r = write - i;
        const t = createTile(randType(), r, c);
        grid[r][c] = t;
        anim.push({ t, from: r - count });
      }
    }

    if (!anim.length) return Promise.resolve();

    for (const a of anim) setPos(a.t, a.from, a.t.c, false);
    void boardEl.offsetHeight;

    let maxDist = 1;
    for (const a of anim) maxDist = Math.max(maxDist, a.t.r - a.from);
    const dur = Math.min(380, 140 + maxDist * 22);
    for (const a of anim) setPos(a.t, a.t.r, a.t.c, true, dur);

    return wait(dur + 40);
  }

  async function resolveAll(initialClear, preferred) {
    let cascade = 0;

    if (initialClear && initialClear.size) {
      cascade = 1;
      const set = expandClears(initialClear, new Set());
      await doClear(set, cascade, []);
      await settle();
    }

    let guard = 0;
    while (guard++ < 60) {
      const groups = findGroups();
      if (!groups.length) break;

      cascade++;
      const base = new Set();
      const protect = new Set();
      const news = [];

      for (const g of groups) {
        g.cells.forEach((k) => base.add(k));
        const sp = specialFor(g);
        if (sp) {
          const k = pickCell(g, preferred);
          if (k !== null && !protect.has(k)) {
            protect.add(k);
            news.push({ k, sp, type: g.type });
          }
        }
      }

      preferred = null;
      const set = expandClears(base, protect);
      for (const k of protect) set.delete(k);

      if (cascade >= 2) showCombo(cascade);
      await doClear(set, cascade, news);
      await settle();
    }
  }

  /* ---------------- 反馈特效 ---------------- */

  function burst(r, c, type) {
    if (Math.random() > 0.72) return;
    const color = TYPE_COLOR[type] || '#FFD645';
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('i');
      p.className = 'spark';
      p.style.background = color;
      p.style.left = ((c + 0.5) * CELL_PCT) + '%';
      p.style.top = ((r + 0.5) * CELL_PCT) + '%';
      const a = Math.random() * Math.PI * 2;
      const d = 16 + Math.random() * 30;
      p.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
      p.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
      boardEl.appendChild(p);
      setTimeout(() => p.remove(), 540);
    }
  }

  function floatText(r, c, text, special) {
    if (r == null || c == null) return;
    const el = document.createElement('div');
    el.className = 'float' + (special ? ' special' : '');
    el.textContent = text;
    el.style.left = ((c + 0.5) * CELL_PCT) + '%';
    el.style.top = ((r + 0.5) * CELL_PCT) + '%';
    boardEl.appendChild(el);
    setTimeout(() => el.remove(), 820);
  }

  function showCombo(n) {
    comboEl.textContent = n >= 4 ? '超强连击 ×' + n : '连击 ×' + n;
    comboEl.classList.remove('show');
    void comboEl.offsetWidth;
    comboEl.classList.add('show');
    sfx('combo', n);
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1900);
  }

  /* ---------------- HUD ---------------- */

  function updateHUD() {
    scoreEl.textContent = state.score;
    targetEl.textContent = state.target;
    movesEl.textContent = state.moves;
    lvlEl.textContent = state.level;
    barFill.style.width = Math.min(100, (state.score / state.target) * 100) + '%';
    $('movesPill').classList.toggle('low', state.moves <= 5);
    scoreEl.classList.remove('bump');
    void scoreEl.offsetWidth;
    scoreEl.classList.add('bump');
  }

  /* ---------------- 选择 / 交换 ---------------- */

  let sel = null;
  let selEl = null;

  function clearSelection() {
    if (selEl) selEl.classList.remove('sel');
    selEl = null;
    sel = null;
  }

  function selectCell(cell) {
    clearSelection();
    const t = grid[cell.r] && grid[cell.r][cell.c];
    if (!t) return;
    sel = { r: cell.r, c: cell.c };
    selEl = t.el;
    selEl.classList.add('sel');
  }

  const adjacent = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;

  function swapTiles(a, b) {
    grid[a.r][a.c] = b;
    grid[b.r][b.c] = a;
    const ar = a.r, ac = a.c;
    a.r = b.r; a.c = b.c;
    b.r = ar; b.c = ac;
    setPos(a, a.r, a.c, true, 175);
    setPos(b, b.r, b.c, true, 175);
  }

  async function animateSwap(a, b) {
    swapTiles(a, b);
    await wait(185);
  }

  function rainbowClear(ta, tb) {
    const set = new Set();
    const aR = ta.special === 'rainbow';
    const bR = tb.special === 'rainbow';

    if (aR && bR) {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) if (grid[r][c]) set.add(key(r, c));
      }
      return set;
    }

    const rb = aR ? ta : tb;
    const other = aR ? tb : ta;
    if (other.type) {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const t = grid[r][c];
          if (t && t.type === other.type) set.add(key(r, c));
        }
      }
    }
    set.add(key(rb.r, rb.c));
    return set;
  }

  async function performSwap(a, b) {
    if (state.busy || state.over || !state.started) return;
    const ta = grid[a.r] && grid[a.r][a.c];
    const tb = grid[b.r] && grid[b.r][b.c];
    if (!ta || !tb) return;

    state.busy = true;
    clearSelection();
    clearHint();
    await animateSwap(ta, tb);

    const rainbow = ta.special === 'rainbow' || tb.special === 'rainbow';
    const groups = findGroups();

    if (!groups.length && !rainbow) {
      await animateSwap(ta, tb);
      sfx('nope');
      state.busy = false;
      armHint();
      return;
    }

    state.moves = Math.max(0, state.moves - 1);
    updateHUD();
    sfx('swap');

    let initial = null;
    if (rainbow) {
      initial = rainbowClear(ta, tb);
      if (ta.special === 'rainbow' && tb.special === 'rainbow') toast('彩虹球合体！全屏消除！');
    }

    await resolveAll(initial, [{ r: ta.r, c: ta.c }, { r: tb.r, c: tb.c }]);
    state.busy = false;

    if (checkEnd()) return;
    await ensurePlayable();
  }

  /* ---------------- 死活判断 ---------------- */

  async function ensurePlayable() {
    if (state.over || !state.started) return;
    if (findMove()) { armHint(); return; }

    toast('没有可消除的组合，重新洗牌～');
    state.busy = true;
    boardEl.classList.add('fade');
    await wait(300);
    buildGrid(false);
    boardEl.classList.remove('fade');
    state.busy = false;
    armHint();
  }

  function checkEnd() {
    if (state.score >= state.target) { win(); return true; }
    if (state.moves <= 0) { lose(); return true; }
    return false;
  }

  async function win() {
    if (state.over) return;
    state.over = true;
    const left = state.moves;
    if (left > 0) {
      const bonus = left * 50;
      state.score += bonus;
      updateHUD();
      toast('剩余 ' + left + ' 步，奖励 ' + bonus + ' 分！');
      await wait(700);
    }
    const ratio = state.score / state.target;
    showResult(true, ratio >= 1.6 ? 3 : ratio >= 1.2 ? 2 : 1);
    sfx('win');
    save('level', state.level + 1);
  }

  function lose() {
    if (state.over) return;
    state.over = true;
    state.busy = false;
    showResult(false, 0);
    sfx('lose');
  }

  let lastWon = false;

  function showResult(won, stars) {
    lastWon = won;
    const rowEl = $('resultStars');
    rowEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('span');
      s.textContent = '★';
      s.className = i < stars ? 'on' : 'off';
      s.style.animationDelay = (i * 0.14) + 's';
      rowEl.appendChild(s);
    }
    $('resultTitle').textContent = won ? '通关啦！' : '再试一次吧';
    $('resultSub').textContent = won
      ? '第 ' + state.level + ' 关 · 总得分 ' + state.score
      : '还差 ' + Math.max(0, state.target - state.score) + ' 分';
    $('btnNext').textContent = won ? '下一关' : '重新挑战';
    $('btnRetry').style.display = won ? 'block' : 'none';
    $('resultScreen').classList.remove('hidden');
  }

  /* ---------------- 关卡 ---------------- */

  const levelTarget = (n) => 1000 + (n - 1) * 600;

  function startLevel(n) {
    state.level = n;
    state.target = levelTarget(n);
    state.moves = 22;
    state.score = 0;
    state.over = false;
    state.started = true;
    state.busy = false;
    clearSelection();
    clearHint();
    $('resultScreen').classList.add('hidden');
    buildGrid(true);
    updateHUD();
    save('level', Math.max(n, parseInt(load('level', '1'), 10) || 1));
    armHint();
  }

  /* ---------------- 提示 ---------------- */

  function armHint() {
    clearTimeout(hintTimer);
    hintTimer = setTimeout(showHint, 9000);
  }

  function clearHint() {
    clearTimeout(hintTimer);
    for (const el of hintEls) el.classList.remove('hint');
    hintEls = [];
  }

  function showHint() {
    if (state.busy || state.over || !state.started) return;
    for (const el of hintEls) el.classList.remove('hint');
    hintEls = [];
    const mv = findMove();
    if (!mv) return;
    const a = grid[mv.a.r][mv.a.c];
    const b = grid[mv.b.r][mv.b.c];
    if (a) { a.el.classList.add('hint'); hintEls.push(a.el); }
    if (b) { b.el.classList.add('hint'); hintEls.push(b.el); }
    hintTimer = setTimeout(() => {
      for (const el of hintEls) el.classList.remove('hint');
      hintEls = [];
      armHint();
    }, 2600);
  }

  /* ---------------- 输入 ---------------- */

  let press = null;

  boardEl.addEventListener('pointerdown', (e) => {
    if (state.busy || state.over || !state.started) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    e.preventDefault();
    initAudio();
    press = { cell, x: e.clientX, y: e.clientY, moved: false };
    clearHint();
  });

  window.addEventListener('pointermove', (e) => {
    if (!press || press.moved) return;
    const dx = e.clientX - press.x;
    const dy = e.clientY - press.y;
    const thresh = Math.max(9, (boardEl.clientWidth / COLS) * 0.32);
    if (Math.sqrt(dx * dx + dy * dy) < thresh) return;

    press.moved = true;
    const start = press.cell;
    press = null;

    const target = Math.abs(dx) > Math.abs(dy)
      ? { r: start.r, c: start.c + (dx > 0 ? 1 : -1) }
      : { r: start.r + (dy > 0 ? 1 : -1), c: start.c };

    if (target.r < 0 || target.r >= ROWS || target.c < 0 || target.c >= COLS) {
      armHint();
      return;
    }
    performSwap(start, target);
  }, { passive: true });

  window.addEventListener('pointerup', (e) => {
    if (!press) return;
    const p = press;
    press = null;
    if (p.moved || state.busy || state.over || !state.started) return;

    const cell = cellAt(e.clientX, e.clientY) || p.cell;

    if (sel) {
      if (sel.r === cell.r && sel.c === cell.c) {
        clearSelection();
        armHint();
        return;
      }
      if (adjacent(sel, cell)) {
        performSwap(sel, cell);
        return;
      }
    }
    selectCell(cell);
    armHint();
  });

  window.addEventListener('pointercancel', () => { press = null; });

  /* ---------------- 音效 ---------------- */

  let ac = null;

  function initAudio() {
    try {
      if (!ac) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) ac = new AC();
      }
      if (ac && ac.state === 'suspended') ac.resume();
    } catch (err) {
      ac = null;
    }
  }

  function beep(freq, dur, type, vol, delay) {
    if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol || 0.05, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.04);
  }

  function sfx(kind, n) {
    if (!state.sound || !ac || ac.state !== 'running') return;

    if (kind === 'swap') {
      beep(560, 0.07, 'triangle', 0.03);
      beep(760, 0.08, 'triangle', 0.03, 0.05);
    } else if (kind === 'nope') {
      beep(210, 0.13, 'sawtooth', 0.022);
      beep(165, 0.16, 'sawtooth', 0.022, 0.07);
    } else if (kind === 'match') {
      const scale = [523, 587, 659, 784, 880, 1047];
      const f = scale[Math.min(scale.length - 1, Math.max(0, (n || 1) - 1))];
      beep(f, 0.13, 'sine', 0.045);
      beep(f * 2, 0.09, 'sine', 0.016, 0.02);
    } else if (kind === 'special') {
      beep(880, 0.12, 'sine', 0.04);
      beep(1175, 0.12, 'sine', 0.032, 0.06);
      beep(1568, 0.16, 'sine', 0.026, 0.12);
    } else if (kind === 'combo') {
      beep(680 + Math.min(6, n || 2) * 80, 0.12, 'triangle', 0.038);
    } else if (kind === 'win') {
      [523, 659, 784, 1047].forEach((f, i) => beep(f, 0.24, 'triangle', 0.05, i * 0.12));
    } else if (kind === 'lose') {
      [440, 392, 330, 262].forEach((f, i) => beep(f, 0.24, 'triangle', 0.045, i * 0.13));
    }
  }

  /* ---------------- 存档 ---------------- */

  function save(k, v) {
    try { localStorage.setItem('nailong_' + k, String(v)); } catch (e) { /* ignore */ }
  }
  function load(k, def) {
    try {
      const v = localStorage.getItem('nailong_' + k);
      return v === null ? def : v;
    } catch (e) {
      return def;
    }
  }

  /* ---------------- 初始化 ---------------- */

  function boot() {
    $('mascot').innerHTML = MASCOT;

    state.sound = load('sound', '1') !== '0';
    $('soundIcon').textContent = state.sound ? '🔊' : '🔇';

    fitBoard();
    buildGrid(false);
    updateHUD();

    const saved = Math.max(1, parseInt(load('level', '1'), 10) || 1);
    if (saved > 1) $('btnStart').textContent = '继续第 ' + saved + ' 关';

    if (window.ResizeObserver) {
      new ResizeObserver(() => fitBoard()).observe(document.querySelector('.board-wrap'));
    }
    window.addEventListener('resize', fitBoard);
    window.addEventListener('orientationchange', () => setTimeout(fitBoard, 150));
    setTimeout(fitBoard, 60);

    $('btnStart').addEventListener('click', () => {
      initAudio();
      sfx('swap');
      $('startScreen').classList.add('hidden');
      startLevel(saved);
    });

    $('btnNext').addEventListener('click', () => {
      initAudio();
      $('resultScreen').classList.add('hidden');
      startLevel(state.level + (lastWon ? 1 : 0));
    });

    $('btnRetry').addEventListener('click', () => {
      initAudio();
      $('resultScreen').classList.add('hidden');
      startLevel(state.level);
    });

    $('btnRestart').addEventListener('click', () => {
      if (state.busy) { toast('等这一波消完～'); return; }
      if (!state.started) { toast('先点开始游戏吧'); return; }
      startLevel(state.level);
      toast('重玩第 ' + state.level + ' 关');
    });

    $('btnHint').addEventListener('click', () => {
      if (state.busy || !state.started || state.over) return;
      initAudio();
      clearHint();
      showHint();
    });

    $('btnSound').addEventListener('click', () => {
      state.sound = !state.sound;
      $('soundIcon').textContent = state.sound ? '🔊' : '🔇';
      save('sound', state.sound ? '1' : '0');
      initAudio();
      sfx('swap');
    });

    document.addEventListener('gesturestart', (e) => e.preventDefault());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 调试出口（自动化测试用）
  window.__nailong = {
    state,
    getGrid: () => grid,
    findMove,
    findRuns,
    tileSVG,
    play: (m) => performSwap(m.a, m.b),
    size: { ROWS, COLS }
  };

})();