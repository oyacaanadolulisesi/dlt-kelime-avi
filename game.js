/* Kelime Avı — Divanü Lügati't-Türk edition */
const TR_ALPHABET = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ";
const SIZE = 12;
const WORD_COUNT = 8;
const DIRS_EASY = [[0, 1], [1, 0], [1, 1]];
const DIRS_HARD = [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, -1]];

const up = (s) => s.toLocaleUpperCase("tr-TR");
const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** Izgara üretir. Returns { grid, placed:[{word,cat,cells:[[r,c]..]}] } or null. */
function generate(pool, level) {
  const dirs = level === "hard" ? DIRS_HARD : DIRS_EASY;
  for (let attempt = 0; attempt < 200; attempt++) {
    // Çeşitlilik için her kategoriden en çok 3 kelime; kelimeler birbirinin içinde geçmesin
    const picks = [];
    const perCat = {};
    for (const w of shuffle(pool)) {
      if (w[0].length < 3 || w[0].length > SIZE - 2) continue;
      if ((perCat[w[2]] || 0) >= 3) continue;
      const u = up(w[0]), r = [...u].reverse().join("");
      if (picks.some((p) => { const q = up(p[0]); return q.includes(u) || u.includes(q) || q.includes(r) || r.includes(q); })) continue;
      picks.push(w); perCat[w[2]] = (perCat[w[2]] || 0) + 1;
      if (picks.length === WORD_COUNT) break;
    }
    if (picks.length < WORD_COUNT) continue;
    // uzun kelimeleri önce yerleştir
    picks.sort((a, b) => b[0].length - a[0].length);
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));
    const placed = [];
    let ok = true;
    for (const [raw, modern, cat] of picks) {
      const word = up(raw);
      let done = false;
      for (let t = 0; t < 300 && !done; t++) {
        const [dr, dc] = dirs[rnd(dirs.length)];
        const r0 = rnd(SIZE), c0 = rnd(SIZE);
        const r1 = r0 + dr * (word.length - 1), c1 = c0 + dc * (word.length - 1);
        if (r1 < 0 || r1 >= SIZE || c1 < 0 || c1 >= SIZE) continue;
        const cells = [];
        let fits = true;
        for (let i = 0; i < word.length; i++) {
          const r = r0 + dr * i, c = c0 + dc * i;
          if (grid[r][c] && grid[r][c] !== word[i]) { fits = false; break; }
          cells.push([r, c]);
        }
        if (!fits) continue;
        cells.forEach(([r, c], i) => (grid[r][c] = word[i]));
        placed.push({ word, modern, cat, cells });
        done = true;
      }
      if (!done) { ok = false; break; }
    }
    if (!ok || placed.length < WORD_COUNT) continue;
    const letters = [...TR_ALPHABET];
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) if (!grid[r][c]) grid[r][c] = letters[rnd(letters.length)];
    return { grid, placed };
  }
  return null;
}

if (typeof module !== "undefined") module.exports = { generate, SIZE, WORD_COUNT, up };

/* ---------------- UI ---------------- */
if (typeof document !== "undefined") {
  const $ = (id) => document.getElementById(id);
  const gridEl = $("grid"), listEl = $("wordList");
  let game, found, startCell, curPath, timerId, t0, penalty, finished;
  let level = localStorage.getItem("ka_level") || "easy";
  $("level").value = level;

  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  const bestKey = () => "ka_best_" + level;
  const getBest = () => { const v = localStorage.getItem(bestKey()); return v ? +v : null; };
  const elapsed = () => Math.floor((Date.now() - t0) / 1000) + penalty;

  function newGame() {
    clearInterval(timerId);
    game = generate(WORDS, level);
    found = new Set(); penalty = 0; finished = false; startCell = null; curPath = [];
    gridEl.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;
    gridEl.innerHTML = "";
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        const d = document.createElement("div");
        d.className = "cell"; d.dataset.r = r; d.dataset.c = c; d.textContent = game.grid[r][c];
        gridEl.appendChild(d);
      }
    listEl.innerHTML = "";
    game.placed.slice().sort((a, b) => a.word.localeCompare(b.word, "tr")).forEach((p) => {
      const li = document.createElement("li");
      li.id = "w_" + p.word; li.innerHTML = `<span>${p.word}</span><small>${p.cat}</small>`;
      listEl.appendChild(li);
    });
    $("count").textContent = `0/${WORD_COUNT}`;
    const b = getBest(); $("best").textContent = b ? fmt(b) : "–";
    $("timer").textContent = "00:00";
    t0 = Date.now();
    timerId = setInterval(() => { if (!finished) $("timer").textContent = fmt(elapsed()); }, 500);
  }

  const cellEl = (r, c) => gridEl.children[r * SIZE + c];
  const clearSel = () => gridEl.querySelectorAll(".sel").forEach((e) => e.classList.remove("sel"));

  function cellAt(x, y) {
    const el = document.elementFromPoint(x, y);
    return el && el.dataset && el.dataset.r !== undefined ? { r: +el.dataset.r, c: +el.dataset.c } : null;
  }

  function pathTo(end) {
    const dr = end.r - startCell.r, dc = end.c - startCell.c;
    if (!dr && !dc) return [[startCell.r, startCell.c]];
    const step = Math.round(Math.atan2(dr, dc) / (Math.PI / 4));
    const sr = Math.round(Math.sin(step * Math.PI / 4)), sc = Math.round(Math.cos(step * Math.PI / 4));
    let len = Math.max(Math.abs(dr), Math.abs(dc));
    const cells = [];
    for (let i = 0; i <= len; i++) {
      const r = startCell.r + sr * i, c = startCell.c + sc * i;
      if (r < 0 || r >= SIZE || c < 0 || c >= SIZE) break;
      cells.push([r, c]);
    }
    return cells;
  }

  function paint(cells) { clearSel(); cells.forEach(([r, c]) => cellEl(r, c).classList.add("sel")); }

  gridEl.addEventListener("pointerdown", (e) => {
    if (finished) return;
    const c = cellAt(e.clientX, e.clientY); if (!c) return;
    gridEl.setPointerCapture(e.pointerId);
    startCell = c; curPath = [[c.r, c.c]]; paint(curPath);
  });
  gridEl.addEventListener("pointermove", (e) => {
    if (!startCell) return;
    const c = cellAt(e.clientX, e.clientY); if (!c) return;
    curPath = pathTo(c); paint(curPath);
  });
  const end = () => {
    if (!startCell) return;
    const text = curPath.map(([r, c]) => game.grid[r][c]).join("");
    const rev = [...text].reverse().join("");
    const hit = game.placed.find((p) => !found.has(p.word) && (p.word === text || p.word === rev));
    clearSel();
    if (hit) markFound(hit, curPath);
    startCell = null; curPath = [];
  };
  gridEl.addEventListener("pointerup", end);
  gridEl.addEventListener("pointercancel", () => { clearSel(); startCell = null; });

  function markFound(p, cells) {
    found.add(p.word);
    const hue = (found.size * 47) % 360;
    cells.forEach(([r, c]) => {
      const el = cellEl(r, c);
      el.classList.remove("hint"); el.classList.add("found");
      el.style.background = `hsl(${hue} 70% 62%)`;
    });
    const li = $("w_" + p.word);
    li.classList.add("done");
    li.querySelector("small").textContent = up(p.modern) !== p.word ? "→ " + p.modern : "✓";
    $("count").textContent = `${found.size}/${WORD_COUNT}`;
    if (found.size === WORD_COUNT) win();
  }

  async function win() {
    finished = true; clearInterval(timerId);
    const t = elapsed(), b = getBest();
    $("timer").textContent = fmt(t);
    let msg = `Tüm kelimeleri ${fmt(t)} sürede buldun.`;
    if (!b || t < b) { localStorage.setItem(bestKey(), t); $("best").textContent = fmt(t); msg += " Yeni rekor! 🏆"; }
    $("modalText").textContent = msg + " Skorun gönderiliyor…";
    $("modal").hidden = false;
    const res = await Scores.submit(nick, level, t);
    $("modalText").textContent = msg + (res.shared ? " Skorun ortak tabloya eklendi."
      : Scores.remote ? " Skor sunucuya gönderilemedi, bu cihazda kaydedildi."
      : " Skor bu cihazdaki tabloya kaydedildi.");
  }

  /* ---- Rumuz ---- */
  let nick = localStorage.getItem("ka_nick") || "";
  const setNickUI = () => { $("nick").textContent = nick || "—"; };

  function askNick() {
    return new Promise((resolve) => {
      const m = $("nickModal"), inp = $("nickInput"), err = $("nickErr"), cancel = $("nickCancel");
      inp.value = nick; err.textContent = ""; cancel.hidden = !nick; m.hidden = false;
      setTimeout(() => inp.focus(), 50);
      cancel.onclick = () => { m.hidden = true; resolve(nick); };
      $("nickForm").onsubmit = (e) => {
        e.preventDefault();
        const v = Scores.cleanNick(inp.value);
        if (!Scores.validNick(v)) { err.textContent = "2–16 karakter; harf, rakam, boşluk, _ . - kullanabilirsin."; return; }
        nick = v; localStorage.setItem("ka_nick", nick); setNickUI(); m.hidden = true; resolve(nick);
      };
    });
  }

  /* ---- Skor tablosu ---- */
  let scoreLevel = level;
  async function renderScores(lv) {
    scoreLevel = lv;
    document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b.dataset.lv === lv));
    const list = $("scoreList"); list.textContent = "";
    $("scoreNote").textContent = "Yükleniyor…";
    const { rows, shared } = await Scores.top(lv, 10);
    if (scoreLevel !== lv) return;
    $("scoreNote").textContent = shared ? "Herkesin en iyi süreleri"
      : Scores.remote ? "Sunucuya ulaşılamadı; bu cihazdaki skorlar" : "Bu cihazdaki skorlar";
    if (!rows.length) {
      const li = document.createElement("li"); li.className = "empty"; li.textContent = "Henüz skor yok. İlk sen ol!";
      list.appendChild(li); return;
    }
    const me = nick.toLocaleLowerCase("tr-TR");
    rows.forEach((r) => {
      const li = document.createElement("li");
      if (r.nick.toLocaleLowerCase("tr-TR") === me) li.className = "me";
      const a = document.createElement("span"); a.textContent = r.nick;   // textContent: rumuzlar güvenle gösterilir
      const b = document.createElement("b"); b.textContent = fmt(r.seconds);
      li.append(a, b); list.appendChild(li);
    });
  }
  const openScores = (lv) => { $("scoreModal").hidden = false; renderScores(lv || level); };

  $("hint").addEventListener("click", () => {
    if (finished || !game) return;
    const left = game.placed.filter((p) => !found.has(p.word)); if (!left.length) return;
    const p = left[rnd(left.length)]; penalty += 10;
    const [r, c] = p.cells[0]; const el = cellEl(r, c);
    el.classList.add("hint"); setTimeout(() => el.classList.remove("hint"), 2500);
  });
  $("new").addEventListener("click", newGame);
  $("again").addEventListener("click", () => { $("modal").hidden = true; newGame(); });
  $("level").addEventListener("change", (e) => { level = e.target.value; localStorage.setItem("ka_level", level); newGame(); });

  $("changeNick").addEventListener("click", () => askNick());
  $("showScores").addEventListener("click", () => openScores(level));
  $("winScores").addEventListener("click", () => openScores(level));
  $("closeScores").addEventListener("click", () => { $("scoreModal").hidden = true; });
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => renderScores(b.dataset.lv)));

  setNickUI();
  if (nick) newGame(); else askNick().then(newGame);
}
