# 🛸 ISS Orbit Intelligence Dashboard

A **production-grade**, futuristic React + Vite dashboard for real-time ISS tracking, space news, and AI-powered assistance.

![ISS Dashboard](https://images.unsplash.com/photo-1614728263952-84ea256f9d1d?w=1200&h=400&fit=crop&q=80)

---

## ✨ Features

### 🛸 ISS Live Tracking
- Real-time ISS position updated every **15 seconds**
- Live latitude, longitude, altitude display
- Speed calculation using **Haversine formula** (km/h)
- Last 15 positions tracked with **trajectory polyline** on map
- Nearest region/ocean name via reverse geocoding
- Manual refresh + last-updated timestamp
- People currently in space list

### 📰 News Dashboard
- Fetches latest articles from **NewsAPI**
- Category filters (General, Tech, Science, Health, Sports, Business)
- Debounced search (300ms)
- Sort by date, source, or title
- **15-minute localStorage cache** with auto-invalidation
- Source distribution **doughnut chart**

### 🤖 AI Chatbot
- Powered by **Mistral-7B-Instruct** via HuggingFace Inference API
- **Strictly context-bound**: only answers based on current dashboard data
- Floating action button with open/close animation
- Typing indicator, auto-scroll, Markdown rendering
- Last 30 messages persisted in localStorage
- Clear chat button

### 🎨 UI/UX
- **Glassmorphism** cards with glow effects
- **Dark / Light mode** toggle (persisted in localStorage)
- Smooth **Framer Motion** animations throughout
- Responsive: sidebar on desktop, bottom nav on mobile
- Loading skeletons, error states, empty states
- Toast notifications via React Hot Toast

---

## 🗂️ Project Structure

```
src/
├── api/          # Axios API clients (ISS, News, AI)
├── assets/       # Static assets
├── components/
│   ├── chatbot/  # ChatFAB, ChatWindow, ChatMessage
│   ├── iss/      # ISSMap, ISSStats, SpeedChart, AstronautList
│   ├── layout/   # Navbar, Sidebar, BottomNav
│   ├── news/     # NewsCard, NewsGrid, NewsFilters, NewsChart
│   └── ui/       # Card, Badge, Button, Skeleton, ErrorState, EmptyState, ErrorBoundary
├── constants/    # API endpoints, intervals, localStorage keys
├── context/      # ThemeContext, ISSContext, NewsContext, ChatContext
├── hooks/        # useISSData, useNews, useTheme, useLocalStorage, useCachedFetch, useChatbot
├── pages/        # HomePage, ISSPage, NewsPage, NotFoundPage
├── styles/       # globals.css (Tailwind + custom)
└── utils/        # haversine.js, geoName.js, cache.js, dateFormat.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone or enter the project directory
cd foai-end

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env
```

### Environment Variables

Edit `.env` with your API keys:

```env
# Free at https://newsapi.org/register
VITE_NEWS_API_KEY=your_newsapi_key_here

# Free at https://huggingface.co/settings/tokens
VITE_AI_TOKEN=your_huggingface_token_here
```

> **Note:** ISS tracking works with **no API key** — it uses `wheretheiss.at` which is free and CORS-enabled.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview  # preview the built app
```

---

## 🔑 API Setup

### NewsAPI (Free)
1. Go to [newsapi.org](https://newsapi.org/register)
2. Create a free account
3. Copy your API key to `VITE_NEWS_API_KEY`
4. **Note:** The free tier only works on `localhost`. For production, you'll need a paid plan or a proxy.

### HuggingFace Inference API (Free)
1. Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Create a new **Read** token
3. Copy it to `VITE_AI_TOKEN`
4. The app uses `mistralai/Mistral-7B-Instruct-v0.2` — no separate model access needed

### ISS API (No Key Required)
- Position: `https://api.wheretheiss.at/v1/satellites/25544`
- Astronauts: `http://api.open-notify.org/astros.json`

---

## ☁️ Deployment (Vercel)

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: Vercel Dashboard
1. Push to GitHub
2. Import your repo at [vercel.com/new](https://vercel.com/new)
3. Add your environment variables in the Vercel dashboard
4. Deploy!

The `vercel.json` SPA rewrite config is included automatically.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│           React + Vite SPA          │
├──────────────┬──────────────────────┤
│   Context    │  ISSContext (polling) │
│   Providers  │  NewsContext (cache)  │
│              │  ChatContext (AI)     │
│              │  ThemeContext         │
├──────────────┼──────────────────────┤
│   API Layer  │  issApi → wheretheiss │
│              │  newsApi → NewsAPI    │
│              │  aiApi  → HuggingFace │
├──────────────┼──────────────────────┤
│  Data Flow   │  ISS polls every 15s  │
│              │  News cached 15min    │
│              │  Chat stored 30 msgs  │
├──────────────┼──────────────────────┤
│  Map         │  Leaflet + react-     │
│              │  leaflet, dark tiles  │
├──────────────┼──────────────────────┤
│  Charts      │  Recharts AreaChart   │
│              │  + PieChart           │
└──────────────┴──────────────────────┘
```

---

## 📸 Screenshots

| Home Dashboard | ISS Tracker | News | Chatbot |
|---|---|---|---|
| Overview + live map | Full map + charts | News grid + filters | AI assistant |

---

## 🛡️ Security Notes
- API keys stored only in `.env` (never hardcoded)
- `.env` is git-ignored automatically by Vite
- Chatbot has a hard guardrail: only answers from dashboard context

---

## 📄 License

MIT © ISS Orbit Intelligence Dashboard
