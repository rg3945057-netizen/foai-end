import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Clock } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsFilters } from '@/components/news/NewsFilters';
import { NewsChart } from '@/components/news/NewsChart';
import { timeAgo } from '@/utils/dateFormat';
import toast from 'react-hot-toast';

export default function NewsPage() {
  const {
    articles,
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
  } = useNews();

  useEffect(() => {
    document.title = 'News — ISS Orbit Intelligence';
    if (!articles.length) fetchNews();
  }, []);

  useEffect(() => {
    if (error) toast.error('News fetch failed. Check your API key.', { id: 'news-err' });
  }, [error]);

  const handleRefresh = () => {
    refresh();
    toast.success('Refreshing news...', { id: 'news-refresh' });
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-3"
      >
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Newspaper size={22} className="text-cyan-400" />
            News Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
            <Clock size={12} />
            {lastUpdated ? `Last updated ${timeAgo(lastUpdated)}` : 'Cached for 15 minutes'}
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <NewsFilters
          category={category}
          query={query}
          sortBy={sortBy}
          onCategoryChange={changeCategory}
          onSearch={search}
          onSortChange={setSortBy}
          onRefresh={handleRefresh}
          loading={loading}
          totalCount={articles.length}
        />
      </motion.div>

      {/* Chart + Grid layout */}
      <div className="space-y-5">
        {/* Source distribution chart (only when we have data) */}
        {articles.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xs"
          >
            <NewsChart articles={articles} />
          </motion.div>
        )}

        {/* Articles grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <NewsGrid
            articles={articles}
            loading={loading}
            error={error}
            onRetry={handleRefresh}
          />
        </motion.div>
      </div>
    </div>
  );
}
