'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Loader2 } from 'lucide-react';

interface Suggestion {
  name: string;
  localName: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  displayName: string;
}

interface NavbarProps {
  onSearch: (city: string, lat?: number, lon?: number) => void;
  isLoading: boolean;
}

export default function Navbar({ onSearch, isLoading }: NavbarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const activeRequestRef = useRef(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const requestId = ++activeRequestRef.current;
    setIsSearching(true);

    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(searchQuery)}`, {
        cache: 'no-store',
      });
      const result = await response.json();

      if (requestId !== activeRequestRef.current) {
        return;
      }

      if (result.success) {
        setSuggestions(result.data);
        setShowSuggestions(result.data.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      if (requestId === activeRequestRef.current) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } finally {
      if (requestId === activeRequestRef.current) {
        setIsSearching(false);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onSearch(suggestion.name, suggestion.lat, suggestion.lon);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl">⛅</span>
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              WeatherVue
            </span>
          </motion.div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Search any city worldwide..."
                className="w-full pl-12 pr-20 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {(query || isLoading) && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 rounded-xl text-white transition-all duration-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Autocomplete Suggestions */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  ref={suggestionsRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                      type="button"
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">
                          {suggestion.name}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {suggestion.displayName}
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading indicator for autocomplete */}
            <AnimatePresence>
              {isSearching && query.length >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-center"
                >
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="ml-2 text-gray-400">Searching...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Right spacer for balance */}
          <div className="w-10 shrink-0 hidden sm:block" />
        </div>
      </div>
    </motion.nav>
  );
}
