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
import Particles from "@/components/Particles";
import CompareCities from '@/components/CompareCities';

const RECENT_SEARCHES_KEY = 'weather-vue-recent-searches';
const LAST_SEARCH_KEY = 'weather-vue-last-search';
const LEGACY_LAST_CITY_KEY = 'weather-vue-last-city';

function hasCoordinates(
  search: StoredSearchLocation
): search is StoredSearchLocation & { lat: number; lon: number } {
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

  /* 🔥 NEW STATES */
  const [dark, setDark] = useState(true);
  const [time, setTime] = useState(new Date());

  /* 🔥 THEME SAVE */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  /* 🔥 LIVE TIME */
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  /* 🔥 DYNAMIC BG */
  const getBackground = () => {
    if (!weather) return dark ? "bg-slate-900" : "bg-gray-100";

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("rain"))
      return "bg-gradient-to-br from-gray-800 via-blue-900 to-black";
    if (condition.includes("cloud"))
      return "bg-gradient-to-br from-gray-600 to-gray-900";
    if (condition.includes("clear"))
      return "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500";

    return dark ? "bg-slate-900" : "bg-gray-100";
  };

  /* 🔥 SMART SUGGESTION */
  const getSuggestion = () => {
    if (!weather) return "";

    const temp = weather.main.temp;

    if (temp > 35) return "🔥 Stay hydrated bro!";
    if (temp < 15) return "🧥 Wear a jacket!";
    return "😎 Perfect weather!";
  };

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
        (item) =>
          !(
            item.city.toLowerCase() === search.city.toLowerCase() &&
            item.country === search.country
          )
      );

      const updated = [search, ...filtered].slice(0, 10);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
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

        const weatherResult = await weatherRes.json();
        const forecastResult = await forecastRes.json();

        if (!weatherRes.ok || !weatherResult.success)
          throw new Error(weatherResult.error);
        if (!forecastRes.ok || !forecastResult.success)
          throw new Error(forecastResult.error);

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
    },
    [saveToRecentSearches, persistLastSearch]
  );

  useEffect(() => {
    setRecentSearches(
      parseRecentSearches(localStorage.getItem(RECENT_SEARCHES_KEY))
    );

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
    <div className={`${getBackground()} min-h-screen transition-all duration-500`}>

      <Particles />

      {/* 🔥 TOGGLE */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-5 right-5 z-50 px-4 py-2 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg"
      >
        {dark ? "🌙" : "☀️"}
      </button>

      <div className="relative z-10">
        <Navbar onSearch={handleSearch} isLoading={isLoading} />

        <main className="pt-24 px-4 max-w-7xl mx-auto">

          {/* 🔥 TIME */}
          <p className="text-center mb-4 text-sm opacity-80">
            {time.toLocaleTimeString()} | {time.toDateString()}
          </p>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : weather && forecast ? (
              <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                  <WeatherCard weather={weather} />

                  <CompareCities 
                    baseCity={weather.name} 
                    baseTemp={weather.main.temp} 
                  />

                  {/* 🔥 SUGGESTION */}
                  <p className="text-center text-blue-300 text-lg">
                    {getSuggestion()}
                  </p>

                  <ForecastSection forecast={forecast} />

                  <RecentSearches
                    searches={recentSearches}
                    onSelect={(search) =>
                      handleSearch(search.city, search.lat, search.lon)
                    }
                    onClear={handleClearRecentSearches}
                  />
                </div>

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
    </div>
  );
}
