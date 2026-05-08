import { motion } from 'framer-motion';
import { ExternalLink, Calendar, User, Newspaper } from 'lucide-react';
import { formatDate } from '@/utils/dateFormat';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1614728263952-84ea256f9d1d?w=400&h=220&fit=crop&q=80';

export function NewsCard({ article, index = 0 }) {
  const {
    title,
    description,
    urlToImage,
    url,
    source,
    author,
    publishedAt,
  } = article;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="glass-card overflow-hidden flex flex-col group hover:border-cyan-500/30 hover:shadow-glow-sm transition-all duration-300"
      aria-label={title}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-44 flex-shrink-0">
        <img
          src={urlToImage || FALLBACK_IMAGE}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {source?.name && (
          <span className="absolute top-2 left-2 badge-cyan text-[10px]">
            {source.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {author && (
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <User size={10} />
              {author.split(',')[0]}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto flex-shrink-0">
            <Calendar size={10} />
            {formatDate(publishedAt)}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
          {title}
        </h3>

        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        <div className="mt-auto pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
            aria-label={`Read more: ${title}`}
          >
            Read More <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
