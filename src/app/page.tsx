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
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item: any) => item && typeof item === 'object')
      .filter(
        (item: any) =>
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
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    if (typeof parsed === 'string' && parsed.trim()) {
      return { city: parsed.trim() };
    }

    if (parsed && typeof parsed === 'object' && 'city' in parsed) {
      return {
        city: parsed.city,
        country: parsed.country,
        lat: parsed.lat,
        lon: parsed.lon,
      };
    }
  } catch {
    if (raw.trim()) return { city: raw.trim() };
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
    } catch {}
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
      } catch {}

      return updated;
    });
  }, []);

  const fetchWeatherData = useCallback(async (search: StoredSearchLocation) => {
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

      const weatherResult = await weatherRes.json();
      const forecastResult = await forecastRes.json();

      if (!weatherRes.ok || !weatherResult.success) throw new Error(weatherResult.error);
      if (!forecastRes.ok || !forecastResult.success) throw new Error(forecastResult.error);

      const resolvedWeather = weatherResult.data;
      const resolvedForecast = forecastResult.data;

      setWeather(resolvedWeather);
      setForecast(resolvedForecast);

      const resolvedSearch = {
        city: resolvedWeather.name,
        country: resolvedWeather.sys.country,
        lat: resolvedWeather.coord.lat,
        lon: resolvedWeather.coord.lon,
      };

      persistLastSearch(resolvedSearch);
      saveToRecentSearches(resolvedWeather);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [persistLastSearch, saveToRecentSearches]);

  useEffect(() => {
    setRecentSearches(parseRecentSearches(localStorage.getItem(RECENT_SEARCHES_KEY)));

    const savedLastSearch =
      parseLastSearch(localStorage.getItem(LAST_SEARCH_KEY)) ??
      parseLastSearch(localStorage.getItem(LEGACY_LAST_CITY_KEY));

    if (savedLastSearch) {
      fetchWeatherData(savedLastSearch);
    }
  }, [fetchWeatherData]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const hasLastSearch =
      localStorage.getItem(LAST_SEARCH_KEY) ||
      localStorage.getItem(LEGACY_LAST_CITY_KEY);

    if (hasLastSearch) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeatherData({
        city: "Current Location",
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, [fetchWeatherData]);

  const handleSearch = (city: string, lat?: number, lon?: number) => {
    fetchWeatherData({ city, lat, lon });
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 bg-gradient-to-br
      ${
        weather?.weather?.[0]?.main === "Rain"
          ? "from-blue-900 via-gray-900 to-black"
          : weather?.weather?.[0]?.main === "Clear"
          ? "from-yellow-400 via-orange-500 to-pink-500"
          : weather?.weather?.[0]?.main === "Clouds"
          ? "from-gray-700 via-gray-900 to-black"
          : "from-gray-900 via-blue-900/50 to-gray-900"
      }`}
    >
      {/* Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 blur-3xl animate-pulse" />
      </div>

      <Navbar onSearch={handleSearch} isLoading={isLoading} />

      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : weather && forecast ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* LEFT SIDE */}
              <div className="lg:col-span-2 space-y-6">
                <WeatherCard weather={weather} />
                <ForecastSection forecast={forecast} />
                <RecentSearches searches={recentSearches} onSelect={handleSearch} />
              </div>

              {/* RIGHT SIDE 🔥 */}
              <div>
                <SidePanel weather={weather} forecast={forecast} />
              </div>
            </motion.div>
          ) : (
            <WelcomeScreen />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
