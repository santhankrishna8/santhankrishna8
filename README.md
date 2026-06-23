# ✨ Spotlight — Find the best around you

An AI-powered recommendation app that finds the **best hotels, restaurants, and
schools** near you, ranked by **real ratings & reviews**, with an AI concierge
that tells you exactly where to go — and what to order.

Built with **Next.js 16 + React 19**, **Tailwind CSS v4**, **Google Maps
Platform** (Maps + Places API), and the **OpenAI API**. Fully responsive,
installable as an app (PWA), with **dark / light** themes.

> 💡 The app runs with realistic **sample data out of the box**, so you can demo
> it immediately. Add your API keys to switch to live data — nothing breaks if a
> key isn't ready.

---

## ✨ Features

- 🔎 **Discover** hotels, restaurants & schools with one tap.
- ⭐ **Ratings-first ranking** (combines rating + number of reviews).
- 🗺️ **Interactive Google Map** with custom rating pins.
- 🤖 **Ask Spotlight AI** — "What should I eat tonight?", "Best family hotel" …
  Returns personalized picks with reasons + highlights them in the list.
- 📋 **Place details** — photos, reviews, an **AI review summary**, and
  **"What to eat"** dish suggestions for restaurants.
- 🌗 **Dark / light / system theme**, smooth animations, accessible, PWA-ready.

---

## 🚀 Run it locally (beginner-friendly)

You need **[Node.js](https://nodejs.org) 18+** installed.

```bash
# 1. Install dependencies
npm install

# 2. (Optional) add your API keys — see below. You can skip this and use demo data.
cp .env.example .env.local

# 3. Start the app
npm run dev
```

Open **http://localhost:3000** in your browser. Done! 🎉

---

## 🔑 Getting the API keys (for live data)

You can demo without these, but here's how to go live.

### 1. Google Maps + Places (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` & `GOOGLE_PLACES_API_KEY`)

1. Go to the **[Google Cloud Console](https://console.cloud.google.com/)** and
   create a project.
2. Enable **billing** (Google gives a generous free monthly credit).
3. In **APIs & Services → Library**, enable:
   - **Maps JavaScript API**
   - **Places API (New)**
4. In **APIs & Services → Credentials**, click **Create credentials → API key**.
5. Use the key for **both** variables (or create two keys):
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` → restrict by **HTTP referrer** (your
     site URL). This one is visible in the browser, so restricting it is
     important.
   - `GOOGLE_PLACES_API_KEY` → keep it **unrestricted by referrer** (it's only
     used server-side) but restrict it to the **Places API**.

### 2. OpenAI (`OPENAI_API_KEY`)

1. Go to **[platform.openai.com](https://platform.openai.com/)** → **API keys**.
2. Add billing credits, then **Create new secret key** and copy it.

Paste all keys into **`.env.local`** and restart `npm run dev`.

---

## ☁️ Deploy a live demo (Vercel — free)

1. Push this code to a **GitHub repository** (see below).
2. Go to **[vercel.com](https://vercel.com)** → **Add New → Project** → import
   your repo.
3. In **Environment Variables**, add the three keys from `.env.local`.
4. Click **Deploy**. You'll get a public `https://…vercel.app` link that works
   on any phone or laptop — perfect for the demo.

---

## 🗂️ Moving this code into your own private repo

This project currently lives on a branch of an existing repo. To put it in a
fresh **private** repository:

```bash
# Create a new EMPTY private repo on github.com first (no README), then:
git remote add spotlight https://github.com/<your-username>/<your-repo>.git
git push spotlight HEAD:main
```

---

## 🧱 Project structure

```
src/
  app/
    page.tsx              # Discover screen (search, tabs, map, list, AI)
    layout.tsx            # Theme, fonts, PWA metadata
    globals.css           # Design system (brand colors, glass, dark/light)
    api/
      places/nearby       # Google Places search (mock fallback)
      places/details      # Place details + reviews
      places/photo        # Photo proxy (keeps the API key server-side)
      ai/suggest          # OpenAI ranked recommendations
      ai/insights         # OpenAI review summary + "what to eat"
  components/              # UI: map, cards, detail sheet, AI panel, theme…
  lib/                     # types, Google + OpenAI clients, mock data, utils
```

Keys are **never exposed** to the browser except the referrer-restricted Maps
key; Places and OpenAI calls all run inside server route handlers.
