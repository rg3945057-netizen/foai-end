import axios from 'axios';

const NEWSDATA_BASE = 'https://newsdata.io/api/1';

const newsClient = axios.create({
  baseURL: NEWSDATA_BASE,
  timeout: 10000,
});

// Map our category IDs to newsdata.io category names
const CATEGORY_MAP = {
  general: 'top',
  technology: 'technology',
  science: 'science',
  health: 'health',
  sports: 'sports',
  business: 'business',
  entertainment: 'entertainment',
};

/**
 * Fetch latest news from newsdata.io
 * @param {Object} options
 */
export async function fetchTopHeadlines({ category = 'general', query = '', pageSize = 20 } = {}) {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) throw new Error('VITE_NEWS_API_KEY is not set');

  const params = {
    apikey: apiKey,
    language: 'en',
    size: Math.min(pageSize, 10), // newsdata.io free tier max is 10
  };

  // Map category
  const mappedCategory = CATEGORY_MAP[category] || 'top';
  if (mappedCategory !== 'top') params.category = mappedCategory;

  if (query) params.q = query;

  const res = await newsClient.get('/news', { params });

  const raw = res.data?.results || [];

  // Normalize newsdata.io shape to match our app's expected shape
  return raw
    .filter((a) => a.title && a.title !== '[Removed]')
    .slice(0, pageSize)
    .map((a) => ({
      title: a.title,
      description: a.description || a.content || '',
      url: a.link,
      urlToImage: a.image_url || null,
      author: Array.isArray(a.creator) ? a.creator.join(', ') : a.creator || null,
      publishedAt: a.pubDate,
      source: { name: a.source_id || a.source_name || 'Unknown' },
      content: a.content || a.description || '',
    }));
}

/**
 * Alias kept for compatibility
 */
export async function fetchEverything({ query = 'space', pageSize = 10 } = {}) {
  return fetchTopHeadlines({ query, pageSize });
}
