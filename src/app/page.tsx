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
  const requestIdRef = useRef(0);

  const persistLastSearch = useCallback((search: StoredSearchLocation) => {
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

      saveToRecentSearches(resolvedWeather);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [saveToRecentSearches, persistLastSearch]);

  useEffect(() => {
    setRecentSearches(parseRecentSearches(localStorage.getItem(RECENT_SEARCHES_KEY)));

    const savedLast =
      parseLastSearch(localStorage.getItem(LAST_SEARCH_KEY)) ??
      parseLastSearch(localStorage.getItem(LEGACY_LAST_CITY_KEY));

    if (savedLast) fetchWeatherData(savedLast);
  }, [fetchWeatherData]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const hasLast =
      localStorage.getItem(LAST_SEARCH_KEY) ||
      localStorage.getItem(LEGACY_LAST_CITY_KEY);

    if (hasLast) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      fetchWeatherData({
        city: 'Current Location',
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      });
    });
  }, [fetchWeatherData]);

  const handleSearch = (city: string, lat?: number, lon?: number) => {
    fetchWeatherData({ city, lat, lon });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/50 to-gray-900">
      <Navbar onSearch={handleSearch} isLoading={isLoading} />

      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : weather && forecast ? (
            <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-6">
                <WeatherCard weather={weather} />
                <ForecastSection forecast={forecast} />

                {/* ✅ FIXED ERROR HERE */}
                <RecentSearches
                  searches={recentSearches}
                  onSelect={(search) =>
                    handleSearch(search.city, search.lat, search.lon)
                  }
                />
              </div>

              {/* RIGHT */}
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
