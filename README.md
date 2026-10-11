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

## Kelime listesi / Word list

Kelimeler Kaşgarlı Mahmud'un *Divanü Lügat-it Türk* eserinin dizininden alınmıştır; her kelime bu dizindeki bir maddeyle eşleştirilmiş ve günümüz karşılığı (kulkak → kulak, köz → göz, tağ → dağ) kaynaktaki açıklamadan doğrulanmıştır. Dizin metni taranmış olduğundan bozuk harfler (ı/i, ğ/g) bugünkü alfabeye göre düzeltilmiştir. `words.js` içinde her satır `["DLT biçimi","günümüz Türkçesi","Kategori"]` şeklindedir; ekleyip silebilirsiniz.
Words come from the index of Kaşgarlı Mahmud's *Diwan Lughat al-Turk*; each entry was matched against an index entry and its modern counterpart verified against the gloss. Because the index text is a scan, garbled letters (ı/i, ğ/g) were corrected to the modern alphabet. Each line in `words.js` is `["DLT form","modern Turkish","Category"]`; add or remove freely.

## Yerelde çalıştırma / Run locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```
