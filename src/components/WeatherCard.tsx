'use client';

import { motion } from 'framer-motion';
import type { Weather } from '@/lib/types';

interface WeatherCardProps {
  weather: Weather;
}

function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const weatherCondition = weather.weather[0];
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const sunrise = formatTime(weather.sys.sunrise, weather.timezone);
  const sunset = formatTime(weather.sys.sunset, weather.timezone);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold text-white mb-1"
            >
              {weather.name}, {weather.sys.country}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-sm"
            >
              {formatDate(weather.dt)}
            </motion.p>
          </div>

          {/* Weather Icon and Temperature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="flex items-center justify-center gap-4 mb-4"
          >
            <img
              src={getWeatherIconUrl(weatherCondition.icon)}
              alt={weatherCondition.description}
              className="w-32 h-32 drop-shadow-lg animate-float"
            />
            <div>
              <span className="text-8xl font-light text-white tracking-tighter">
                {temp}
              </span>
              <span className="text-4xl text-white/70">°C</span>
            </div>
          </motion.div>

          {/* Condition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-8"
          >
            <p className="text-xl text-white capitalize font-medium">
              {weatherCondition.description}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Feels like {feelsLike}°C
            </p>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

          {/* Sun Times */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-around"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl">🌅</span>
                <span className="text-sm text-gray-400">Sunrise</span>
              </div>
              <p className="text-white font-medium">{sunrise}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-2xl">🌇</span>
                <span className="text-sm text-gray-400">Sunset</span>
              </div>
              <p className="text-white font-medium">{sunset}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
