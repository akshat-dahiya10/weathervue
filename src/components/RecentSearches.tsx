'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import type { RecentSearch } from '@/lib/types';

interface RecentSearchesProps {
  searches: RecentSearch[];
  onSelect: (search: RecentSearch) => void;
  onClear: () => void;
}

export default function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0) {
    return (
      <div className="w-full">
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
        >
          <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
          Recent Searches
        </motion.h3>
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No recent searches</p>
          <p className="text-xs mt-1">Your search history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between mb-4"
      >
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
          Recent Searches
        </h3>
        <button
          onClick={onClear}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
          title="Clear all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </motion.div>
      <div className="space-y-2">
        <AnimatePresence>
          {searches.map((search, index) => (
            <motion.button
              key={search.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(search)}
              className="w-full group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-4 h-4 text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium truncate">{search.city}</p>
                <p className="text-xs text-gray-400">{search.country}</p>
              </div>
              <span className="text-xs text-gray-500 shrink-0">
                {formatTimeAgo(search.timestamp)}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
