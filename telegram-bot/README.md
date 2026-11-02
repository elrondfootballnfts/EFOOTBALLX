# 🤖 EFOOTBALLX Telegram Community Bot (@ElrondFootball_bot)

Hivatalos Telegram közösségkezelő, moderációs és gamifikációs bot az **EFOOTBALLX** projekthez!

---

## 🚀 Főbb Funkciók

### 1. 🛡️ Automata Csoportkezelés & Anti-Spam Védelem
* **Üdvözlő kártya:** Minden új belépőt egyedi üdvözlő üzenettel és azonnali interaktív gombokkal köszönt (Játék, Ranglista, $EFOO vétel, X követés).
* **Tiszta chat:** Automatikusan törli a régi üdvözlő üzenetet az új belépésekor, így nem árasztja el a csoportot.
* **Anti-Spam Shield:** Automatikusan kiszűri és törli a phishing linkeket, csaló airdrop üzeneteket, magáncsoport-meghívókat.
* **Sárga / Piros lap rendszer (`/warn`):**
  * 1. figyelmeztetés: 🟨 Sárga lap.
  * 2. figyelmeztetés: 🟥 Piros lap (24 órás némítás vagy kitiltás).
* **Admin parancsok:**
  * `/pin` – Üzenet rögzítése értesítéssel (válaszként).
  * `/mute <percek>` – Renitens felhasználó elnémítása (pl. `/mute 60`).
  * `/ban` – Spammer azonnali kitiltása.

### 2. ⚡ Élet a Csoportban & Élő Adatok (Gamifikáció)
* `/top` vagy `/leaderboard` – Valós időben lekérdezi a Firebase adatbázisból a Top 5 játékost (pontszám, szint, [SOL] vagy [MVX] címkék).
* `/vault` vagy `/jackpot` – Kiírja a Stadium Vault aktuális egyenlegét (25,400,000 $EFOO) és a heti 1. (65%), 2. (25%), 3. (10%) nyereményfelosztást.
* `/ca` vagy `/token` – Hivatalos MultiversX (`EFOO-8fe2d4`) és Solana SPL szerződések, DexScreener és Explorer linkek.
* `/streak` – A napi széria (1% Vault on-chain nyeremény) magyarázata.
* `/play` vagy `/game` – Közvetlen link és kedvcsináló az azonnali játékhoz.
* `/penalty` vagy `/shoot` – **Interaktív büntetőpárbaj a chatben!** Telegramos animált focilabdát dob (`⚽`), és kiszámolja, hogy GÓL lett-e (felső sarok!), vagy kivédte az AI kapus!

### 3. 🐦 X (Twitter) Posztok Automata & Kézi Megosztása
* **Kézi admin posztolás:** Bármely admin beírja a csoportban vagy a botnak privátban:
  ```text
  /postx https://x.com/EFootball_X/status/1234567890
  ```
  A bot automatikusan lekéri a tweet szövegét, képét, like-jait, és egy gyönyörű formázott kártyaként, *"🚀 Megtekintés & Retweet az X-en"* gombbal közzéteszi a csoportban!
* **Automatizált Webhook (Zapier / IFTTT / Make.com):**
  A bot beépített HTTP szervert futtat a `3030`-as porton. Amikor új tweet jelenik meg `@EFootball_X`-en, a webhook automatikusan posztolja a csoportba:
  ```http
  POST http://localhost:3030/api/tweet
  Content-Type: application/json

  { "url": "https://x.com/EFootball_X/status/..." }
  ```

---

## 🛠️ Telepítés és Indítás

A bot **100%-ban natív Node.js**, nulla külső csomagfüggőséggel fut!

```bash
cd telegram-bot
node bot.js
```

### Futtatás a háttérben (24/7):
Ha szerveren (VPS / Linux / Windows) futtatod:
```bash
# PM2 használatával:
npm install -g pm2
pm2 start bot.js --name "efoo-telegram-bot"
pm2 save
pm2 startup
```

---

## ⚙️ Beállítás a Telegramban (Fontos!)

Ahhoz, hogy a bot törölni tudja a spameket, ki tudja tenni a tweeteket, és fogadni tudja az új tagokat:

1. Nyisd meg a Telegram csoportodat (**@elrondfootball**).
2. Keresd meg a botot: **@ElrondFootball_bot**.
3. Add hozzá a csoporthoz, majd állítsd be **Adminisztrátornak** (Administrator) az alábbi jogokkal:
   * ✅ *Delete messages* (Spam törlés)
   * ✅ *Ban users* (Csalók kitiltása)
   * ✅ *Pin messages* (Hirdetmények kitűzése)
   * ✅ *Invite users via link*

---

## 📁 Fájlstruktúra

* `bot.js` – A bot fő logikája, parancskezelő, üdvözlő modul és polling motor.
* `config.js` – Hivatalos linkek, token címek, admin felhasználónevek.
* `services/firebase.js` – Élő ranglista és Stadium Vault kapcsolat.
* `services/twitter.js` – FxTwitter tweet lekérdező és formázó motor.
* `services/moderation.js` – Anti-spam kulcsszavak és sárgalap-nyilvántartás.
* `.env` – Titkos Telegram Bot Token és port beállítások.
