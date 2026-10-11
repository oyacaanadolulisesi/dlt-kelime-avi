# DLT Kelime Avı · DLT Word Hunt

**TR:** Divanü Lügati't-Türk'teki (1072) yazılışlarıyla kelimelerin arandığı, ortaokul seviyesinde bir kelime avı oyunu. Örneğin tabloda `KULKAK`, `TİŞ`, `KÖZ` aranır; kelime bulunca günümüzdeki karşılığı (kulak, diş, göz) listede görünür. Karanlık mod varsayılandır, telefonda ve bilgisayarda çalışır.
**EN:** A middle-school-level word search where the hidden words appear in their *Diwan Lughat al-Turk* (1072) forms, e.g. `KULKAK`, `TİŞ`, `KÖZ`. When you find one, its modern Turkish counterpart (kulak, diş, göz) is revealed in the list. Dark mode by default; works on phones and desktops.

---

## Özellikler / Features

- 12×12 tablo, her oyunda rastgele 8 kelime (252 kelimelik havuz) / 12×12 grid, 8 random words per game (252-word pool)
- Kelimeler DLT yazılışıyla; bulununca günümüz karşılığı görünür / Words in DLT forms; modern form revealed when found
- Yatay ekranda ve bilgisayarda kelime listesi sağda, dikey ekranda altta / Word list on the right in landscape & desktop, below in portrait
- Kolay (→ ↓ ↘) ve Zor (8 yön) seviyeleri / Easy and Hard (8 directions) levels
- Dokunmatik ve fare ile sürükleyerek seçim / Drag selection with touch or mouse
- Rumuzla giriş ve skor tablosu (Kolay / Zor ayrı) / Nickname login and leaderboard (separate Easy / Hard)
- Süre, en iyi süre (tarayıcıda saklanır), ipucu (+10 sn) / Timer, best time (stored in browser), hint (+10 s)
- Sunucu gerektirmez: sadece statik dosyalar / No backend: static files only

## GitHub Pages ile yayınlama / Deploying with GitHub Pages (ücretsiz / free)

1. https://github.com/new adresinde `Dlt-kelime-avi` adlı **public** bir repo oluşturun. / Create a **public** repo named `Dlt-kelime-avi`.
2. Repo sayfasında **uploading an existing file** bağlantısına tıklayıp bu klasörün **içindeki** dosyaları sürükleyin → **Commit changes**. / Click **uploading an existing file**, drag the files **inside** this folder, then **Commit changes**.
   (Komut satırı için / For the command line:)
   ```bash
   git init -b main
   git add .
   git commit -m "İlk sürüm"
   git remote add origin https://github.com/<kullanıcı-adınız>/Dlt-kelime-avi.git
   git push -u origin main
   ```
3. Repo → **Settings → Pages** → *Source:* `Deploy from a branch`, *Branch:* `main` / `/ (root)` → **Save**.
4. 1–2 dakika sonra oyun şu adreste yayında olur / Live in 1–2 minutes at: `https://<kullanıcı-adınız>.github.io/Dlt-kelime-avi/`

## Rumuz ve skor tablosu / Nickname & leaderboard

**TR:** Oyuna ilk girişte bir rumuz seçilir (2–16 karakter; gerçek ad gerekmez), tarayıcıda saklanır ve "değiştir" ile değişir. Süre (ipucu cezası dahil) en kısa olan üstte olacak şekilde, her seviye için ayrı bir Top 10 tablosu tutulur; her rumuz tabloda en iyi süresiyle görünür. `config.js` boşsa skorlar sadece o cihazda tutulur. Herkesin gördüğü **ortak tablo** için aşağıdaki kurulum gerekir.
**EN:** On first visit the player picks a nickname (2–16 chars, no real name needed), stored in the browser and changeable. A Top 10 board is kept per level, ranked by time (hint penalty included), one best time per nickname. If `config.js` is empty, scores stay on that device only. For a **shared board** do the setup below.

### Ortak skor tablosu (Supabase, ücretsiz) / Shared leaderboard (Supabase, free)

1. https://supabase.com → **Start your project** → GitHub ile giriş / sign in → **New project** (isim: `dlt-kelime-avi`, bir veritabanı parolası belirleyin, bölge: Frankfurt). / Create a project.
2. Sol menü **SQL Editor** → **New query** → `supabase-setup.sql` dosyasının içeriğini yapıştırıp **Run**. / Paste the contents of `supabase-setup.sql` and **Run**.
3. **Project Settings → API** sayfasından **Project URL** ve **anon / publishable key** değerlerini kopyalayın. / Copy the Project URL and the anon/publishable key.
4. `config.js` dosyasını açıp ikisini yapıştırın, GitHub'a yükleyin. / Paste both into `config.js` and upload it to GitHub:
   ```js
   window.KA_CONFIG = {
     SUPABASE_URL: "https://xxxx.supabase.co",
     SUPABASE_ANON_KEY: "eyJ..."
   };
   ```
5. Birkaç dakika sonra sayfayı yenileyin; skor tablosunun üstünde "Herkesin en iyi süreleri" yazmalı. / Reload; the board should say "Herkesin en iyi süreleri".

**Güvenlik notu / Security note:** `anon` anahtarı herkese açık tasarlanmıştır (tarayıcıda görünür); veritabanı kuralları yalnızca skor **okumaya ve eklemeye** izin verir, silmeye/değiştirmeye izin vermez. Süre 10 sn–1 saat dışındaysa kayıt reddedilir. Yine de skor göndermek isteyen biri sahte kayıt ekleyebilir; uygunsuz bir rumuz görürseniz Supabase → **Table Editor → scores** sayfasından satırı silebilirsiniz.
The anon key is public by design; the rules only allow reading and inserting rows. Fake entries are still possible; delete offensive rows in Supabase → Table Editor → scores.

## Kelime listesi / Word list

Kelimeler Kaşgarlı Mahmud'un *Divanü Lügat-it Türk* eserinin dizininden alınmıştır; her kelime bu dizindeki bir maddeyle eşleştirilmiş ve günümüz karşılığı (kulkak → kulak, köz → göz, tağ → dağ) kaynaktaki açıklamadan doğrulanmıştır. Dizin metni taranmış olduğundan bozuk harfler (ı/i, ğ/g) bugünkü alfabeye göre düzeltilmiştir. `words.js` içinde her satır `["DLT biçimi","günümüz Türkçesi","Kategori"]` şeklindedir; ekleyip silebilirsiniz.
Words come from the index of Kaşgarlı Mahmud's *Diwan Lughat al-Turk*; each entry was matched against an index entry and its modern counterpart verified against the gloss. Because the index text is a scan, garbled letters (ı/i, ğ/g) were corrected to the modern alphabet. Each line in `words.js` is `["DLT form","modern Turkish","Category"]`; add or remove freely.

## Yerelde çalıştırma / Run locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```
