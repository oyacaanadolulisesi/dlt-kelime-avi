/* Skor tablosu: Supabase (ortak) ya da tarayıcı (bu cihaz) */
const Scores = (() => {
  const cfg = (typeof window !== "undefined" && window.KA_CONFIG) || {};
  const url = String(cfg.SUPABASE_URL || "").replace(/\/$/, "");
  const key = String(cfg.SUPABASE_ANON_KEY || "");
  const remote = !!(url && key);
  const LOCAL = "ka_scores";
  const NICK_RE = /^[A-Za-z0-9ÇçĞğİıÖöŞşÜü _.\-]{2,16}$/;

  const cleanNick = (s) => String(s || "").trim().replace(/\s+/g, " ");
  const validNick = (s) => NICK_RE.test(cleanNick(s));

  function readLocal() { try { return JSON.parse(localStorage.getItem(LOCAL)) || []; } catch (e) { return []; } }
  function writeLocal(a) { try { localStorage.setItem(LOCAL, JSON.stringify(a.slice(-300))); } catch (e) {} }

  // Her rumuz için en iyi süre; en iyiden başlayarak n kayıt
  function bestPerNick(rows, n) {
    const seen = new Map();
    for (const r of rows.slice().sort((a, b) => a.seconds - b.seconds)) {
      const k = r.nick.toLocaleLowerCase("tr-TR");
      if (!seen.has(k)) seen.set(k, r);
    }
    return [...seen.values()].slice(0, n);
  }

  const headers = () => ({ apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json" });

  async function submit(nick, level, seconds) {
    nick = cleanNick(nick);
    const local = readLocal();
    local.push({ nick, level, seconds, ts: Date.now() });
    writeLocal(local);
    if (!remote) return { ok: true, shared: false };
    try {
      const res = await fetch(url + "/rest/v1/scores", {
        method: "POST",
        headers: { ...headers(), Prefer: "return=minimal" },
        body: JSON.stringify({ nickname: nick, level, seconds })
      });
      return { ok: res.ok, shared: res.ok };
    } catch (e) { return { ok: false, shared: false }; }
  }

  async function top(level, n = 10) {
    if (remote) {
      try {
        const q = `${url}/rest/v1/scores?select=nickname,seconds&level=eq.${encodeURIComponent(level)}&order=seconds.asc&limit=200`;
        const res = await fetch(q, { headers: headers() });
        if (res.ok) {
          const rows = (await res.json()).map((r) => ({ nick: String(r.nickname), seconds: +r.seconds }));
          return { rows: bestPerNick(rows, n), shared: true };
        }
      } catch (e) {}
    }
    return { rows: bestPerNick(readLocal().filter((r) => r.level === level), n), shared: false };
  }

  return { remote, validNick, cleanNick, submit, top, bestPerNick };
})();

if (typeof module !== "undefined") module.exports = { Scores };
