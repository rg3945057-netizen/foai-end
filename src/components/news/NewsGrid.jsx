import { NewsCard } from './NewsCard';
import { SkeletonNewsCard } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/Button';

export function NewsGrid({ articles, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonNewsCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load news"
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <EmptyState
        type="news"
        title="No articles found"
        message="Try a different category or search term."
        action={
          <Button variant="ghost" size="sm" onClick={onRetry}>
            Refresh
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {articles.map((article, index) => (
        <NewsCard
          key={`${article.url}-${index}`}
          article={article}
          index={index}
        />
      ))}
    </div>
  );
}
