'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import WeatherCard from '@/components/WeatherCard';
import SidePanel from '@/components/SidePanel';
import RecentSearches from '@/components/RecentSearches';
import ForecastSection from '@/components/ForecastSection';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import WelcomeScreen from '@/components/WelcomeScreen';
import type { Forecast, RecentSearch, StoredSearchLocation, Weather } from '@/lib/types';

const RECENT_SEARCHES_KEY = 'weather-vue-recent-searches';
const LAST_SEARCH_KEY = 'weather-vue-last-search';
const LEGACY_LAST_CITY_KEY = 'weather-vue-last-city';

function hasCoordinates(search: StoredSearchLocation): search is StoredSearchLocation & { lat: number; lon: number } {
  return typeof search.lat === 'number' && typeof search.lon === 'number';
}

function parseRecentSearches(raw: string | null): RecentSearch[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is Partial<RecentSearch> => typeof item === 'object' && item !== null)
      .filter(
        (item): item is RecentSearch =>
          typeof item.id === 'string' &&
          typeof item.city === 'string' &&
          typeof item.country === 'string' &&
          typeof item.lat === 'number' &&
          typeof item.lon === 'number' &&
          typeof item.timestamp === 'number'
      )
      .slice(0, 10);
  } catch {
    return [];
  }
}

function parseLastSearch(raw: string | null): StoredSearchLocation | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (typeof parsed === 'string' && parsed.trim()) {
      return { city: parsed.trim() };
    }

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'city' in parsed &&
      typeof parsed.city === 'string'
    ) {
      const candidate = parsed as Partial<StoredSearchLocation> & { city: string };
      return {
        city: candidate.city.trim(),
        country: typeof candidate.country === 'string' ? candidate.country : undefined,
        lat: typeof candidate.lat === 'number' ? candidate.lat : undefined,
        lon: typeof candidate.lon === 'number' ? candidate.lon : undefined,
      };
    }
  } catch {
    if (raw.trim()) {
      return { city: raw.trim() };
    }
  }

  return null;
}

export default function Home() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [lastSearch, setLastSearch] = useState<StoredSearchLocation | null>(null);
  const requestIdRef = useRef(0);

  const persistLastSearch = useCallback((search: StoredSearchLocation) => {
    setLastSearch(search);

    try {
      localStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(search));
      localStorage.removeItem(LEGACY_LAST_CITY_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  const saveToRecentSearches = useCallback((weatherData: Weather) => {
    const search: RecentSearch = {
      id: `${weatherData.id}-${Date.now()}`,
      city: weatherData.name,
      country: weatherData.sys.country,
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
      timestamp: Date.now(),
    };

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => !(item.city.toLowerCase() === search.city.toLowerCase() && item.country === search.country)
      );
      const updated = [search, ...filtered].slice(0, 10);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // localStorage not available
      }

      return updated;
    });
  }, []);

  const fetchWeatherData = useCallback(
    async (search: StoredSearchLocation) => {
      const requestId = ++requestIdRef.current;
      setIsLoading(true);
      setError(null);
      persistLastSearch(search);

      try {
        const queryParams = hasCoordinates(search)
          ? `lat=${search.lat}&lon=${search.lon}`
          : `city=${encodeURIComponent(search.city)}`;

        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`/api/weather?${queryParams}`, { cache: 'no-store' }),
          fetch(`/api/forecast?${queryParams}`, { cache: 'no-store' }),
        ]);

        const [weatherResult, forecastResult] = await Promise.all([
          weatherRes.json(),
          forecastRes.json(),
        ]);

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (!weatherRes.ok || !weatherResult.success) {
          throw new Error(weatherResult.error || 'Failed to fetch weather data');
        }

        if (!forecastRes.ok || !forecastResult.success) {
          throw new Error(forecastResult.error || 'Failed to fetch forecast data');
        }

        const resolvedWeather = weatherResult.data as Weather;
        const resolvedForecast = forecastResult.data as Forecast;

        setWeather(resolvedWeather);
        setForecast(resolvedForecast);

        const resolvedSearch: StoredSearchLocation = {
          city: resolvedWeather.name,
          country: resolvedWeather.sys.country,
          lat: resolvedWeather.coord.lat,
          lon: resolvedWeather.coord.lon,
        };

        persistLastSearch(resolvedSearch);
        saveToRecentSearches(resolvedWeather);
      } catch (err) {
        if (requestId === requestIdRef.current) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [persistLastSearch, saveToRecentSearches]
  );

  useEffect(() => {
    setRecentSearches(parseRecentSearches(localStorage.getItem(RECENT_SEARCHES_KEY)));

    const savedLastSearch =
      parseLastSearch(localStorage.getItem(LAST_SEARCH_KEY)) ??
      parseLastSearch(localStorage.getItem(LEGACY_LAST_CITY_KEY));

    if (savedLastSearch) {
      void fetchWeatherData(savedLastSearch);
    }
  }, [fetchWeatherData]);

  const handleSearch = useCallback(
    (city: string, lat?: number, lon?: number) => {
      void fetchWeatherData({ city, lat, lon });
    },
    [fetchWeatherData]
  );

  const handleRecentSearchSelect = useCallback(
    (search: RecentSearch) => {
      void fetchWeatherData({
        city: search.city,
        country: search.country,
        lat: search.lat,
        lon: search.lon,
      });
    },
    [fetchWeatherData]
  );

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // localStorage not available
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/50 to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar onSearch={handleSearch} isLoading={isLoading} />

        {/* Main Content */}
        <main className="pt-24 pb-12 px-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorMessage
                  message={error}
                  onRetry={lastSearch ? () => void fetchWeatherData(lastSearch) : undefined}
                />
              </motion.div>
            ) : weather && forecast ? (
              <motion.div
                key="weather"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto"
              >
                {/* Three Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Panel - Recent Searches */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hidden lg:block lg:col-span-3 sticky top-24"
                  >
                    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                      <RecentSearches
                        searches={recentSearches}
                        onSelect={handleRecentSearchSelect}
                        onClear={handleClearRecentSearches}
                      />
                    </div>
                  </motion.div>

                  {/* Center - Main Weather Card */}
                  <div className="col-span-1 lg:col-span-6">
                    <WeatherCard weather={weather} />
                  </div>

                  {/* Right Panel - Weather Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="hidden lg:block lg:col-span-3 sticky top-24"
                  >
                    <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                      <SidePanel weather={weather} />
                    </div>
                  </motion.div>
                </div>

                {/* Mobile Panels */}
                <div className="lg:hidden mt-8 space-y-6">
                  {/* Mobile Recent Searches */}
                  <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                    <RecentSearches
                      searches={recentSearches}
                      onSelect={handleRecentSearchSelect}
                      onClear={handleClearRecentSearches}
                    />
                  </div>

                  {/* Mobile Weather Details */}
                  <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
                    <SidePanel weather={weather} />
                  </div>
                </div>

                {/* 5-Day Forecast */}
                <ForecastSection forecast={forecast} />
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WelcomeScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center text-gray-500 text-sm border-t border-white/5">
          <p>Powered by OpenWeatherMap API</p>
        </footer>
      </div>
    </div>
  );
}
