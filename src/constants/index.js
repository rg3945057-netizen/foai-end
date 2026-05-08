// API Endpoints
export const ISS_API = {
  POSITION: 'https://api.wheretheiss.at/v1/satellites/25544',
  ASTRONAUTS: 'http://api.open-notify.org/astros.json',
};

export const NEWS_API = {
  BASE: 'https://newsapi.org/v2',
  TOP_HEADLINES: 'https://newsapi.org/v2/top-headlines',
  EVERYTHING: 'https://newsapi.org/v2/everything',
};

export const AI_API = {
  BASE: 'https://api-inference.huggingface.co/models',
  MODEL: 'mistralai/Mistral-7B-Instruct-v0.2',
};

export const NOMINATIM_API = 'https://nominatim.openstreetmap.org/reverse';

// Refresh Intervals
export const ISS_REFRESH_INTERVAL = 15000; // 15 seconds
export const NEWS_CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes

// Chart
export const MAX_SPEED_READINGS = 30;
export const MAX_POSITIONS = 15;

// Chat
export const MAX_CHAT_MESSAGES = 30;

// News Categories
export const NEWS_CATEGORIES = [
  { id: 'general', label: 'General' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'health', label: 'Health' },
  { id: 'sports', label: 'Sports' },
  { id: 'business', label: 'Business' },
  { id: 'entertainment', label: 'Entertainment' },
];

// Sort Options
export const SORT_OPTIONS = [
  { id: 'publishedAt', label: 'Newest First' },
  { id: 'source', label: 'By Source' },
  { id: 'title', label: 'By Title' },
];

// localStorage Keys
export const LS_KEYS = {
  THEME: 'iss-dashboard-theme',
  NEWS_CACHE: 'iss-dashboard-news-cache',
  CHAT_MESSAGES: 'iss-dashboard-chat-messages',
  ISS_POSITIONS: 'iss-dashboard-positions',
  ISS_SPEEDS: 'iss-dashboard-speeds',
};

// Map tile layers
export const MAP_TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  darkAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
  lightAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};
