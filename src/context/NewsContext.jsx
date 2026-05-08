import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { fetchTopHeadlines } from '@/api/newsApi';
import { getCacheItem, setCacheItem } from '@/utils/cache';
import { LS_KEYS, NEWS_CACHE_EXPIRY } from '@/constants';

const NewsContext = createContext(null);

export function NewsProvider({ children }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [lastUpdated, setLastUpdated] = useState(null);

  const abortRef = useRef(null);

  const fetchNews = useCallback(async ({ cat = category, q = query, force = false } = {}) => {
    const cacheKey = `${LS_KEYS.NEWS_CACHE}-${cat}-${q}`;

    if (!force) {
      const cached = getCacheItem(cacheKey);
      if (cached) {
        setArticles(cached);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchTopHeadlines({ category: cat, query: q, pageSize: 20 });
      setArticles(data);
      setLastUpdated(new Date().toISOString());
      setCacheItem(cacheKey, data, NEWS_CACHE_EXPIRY);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [category, query]);

  const refresh = useCallback(() => {
    fetchNews({ cat: category, q: query, force: true });
  }, [fetchNews, category, query]);

  const changeCategory = useCallback((cat) => {
    setCategory(cat);
    fetchNews({ cat, q: query });
  }, [fetchNews, query]);

  const search = useCallback((q) => {
    setQuery(q);
    fetchNews({ cat: category, q });
  }, [fetchNews, category]);

  // Filtered & sorted articles
  const processedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'publishedAt') return new Date(b.publishedAt) - new Date(a.publishedAt);
    if (sortBy === 'source') return (a.source?.name || '').localeCompare(b.source?.name || '');
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  return (
    <NewsContext.Provider
      value={{
        articles: processedArticles,
        rawArticles: articles,
        loading,
        error,
        category,
        query,
        sortBy,
        lastUpdated,
        fetchNews,
        refresh,
        changeCategory,
        search,
        setSortBy,
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNewsContext() {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error('useNewsContext must be used within NewsProvider');
  return ctx;
}
