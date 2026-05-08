import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NEWS_CATEGORIES, SORT_OPTIONS } from '@/constants';

export function NewsFilters({ category, query, sortBy, onCategoryChange, onSearch, onSortChange, onRefresh, loading, totalCount }) {
  const [localQuery, setLocalQuery] = useState(query);
  const debounceRef = useRef(null);

  // Debounced search
  const handleQueryChange = useCallback((e) => {
    const val = e.target.value;
    setLocalQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(val);
    }, 400);
  }, [onSearch]);

  const clearSearch = () => {
    setLocalQuery('');
    onSearch('');
  };

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className="space-y-3">
      {/* Search + Refresh row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={localQuery}
            onChange={handleQueryChange}
            placeholder="Search articles..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            aria-label="Search news articles"
          />
          {localQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <Button variant="ghost" size="md" icon={RefreshCw} onClick={onRefresh} loading={loading}>
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Category pills + Sort */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              category === cat.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-sm'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
            aria-pressed={category === cat.id}
          >
            {cat.label}
          </button>
        ))}

        <div className="flex-shrink-0 ml-auto flex items-center gap-1.5">
          <SlidersHorizontal size={12} className="text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs bg-transparent border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 cursor-pointer"
            aria-label="Sort articles"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {totalCount > 0 && (
        <p className="text-xs text-gray-400">
          Showing <span className="text-cyan-400 font-medium">{totalCount}</span> articles
        </p>
      )}
    </div>
  );
}
