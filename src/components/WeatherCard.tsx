'use client';

import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  Eye,
  Cloud,
  Sun,
  Sunset
} from 'lucide-react';
import type { Weather } from '@/lib/types';
import { getAIInsight, getOutfitSuggestion } from "@/lib/aiWeather";

export default function WeatherCard({ weather }: { weather: Weather }) {

  // ✅ ADD KIYA (logic)
  const insight = getAIInsight(weather);
  const outfit = getOutfitSuggestion(weather);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative max-w-5xl mx-auto overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] backdrop-blur-3xl shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
    >
      {/* Glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative p-8 md:p-10 text-white">

        {/* Location */}
        <div className="mb-8">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight">
            {weather.name}
          </h2>

          <p className="text-slate-400 text-lg mt-2">
            {weather.sys.country}
          </p>
        </div>

        {/* Temperature */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

          <div>
            <div className="text-8xl md:text-9xl font-black leading-none">
              {Math.round(weather.main.temp)}°
            </div>

            <p className="text-2xl text-slate-300 capitalize mt-4">
              {weather.weather[0].description}
            </p>

            <div className="flex gap-4 mt-5 text-slate-400">
              <span>
                H: {Math.round(weather.main.temp_max)}°
              </span>

              <span>
                L: {Math.round(weather.main.temp_min)}°
              </span>
            </div>
          </div>

          {/* Weather Icon */}
          <motion.div
            animate={{
              y: [0, -10, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="text-[120px]">
              ☁️
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Droplets />
            <p className="text-xl font-bold">
              {weather.main.humidity}%
            </p>
            <span>Humidity</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Wind />
            <p className="text-xl font-bold">
              {weather.wind.speed} m/s
            </p>
            <span>Wind</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Gauge />
            <p className="text-xl font-bold">
              {weather.main.pressure} hPa
            </p>
            <span>Pressure</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Thermometer />
            <p className="text-xl font-bold">
              {Math.round(weather.main.feels_like)}°
            </p>
            <span>Feels Like</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Eye />
            <p className="text-xl font-bold">
              {(weather.visibility / 1000).toFixed(1)} km
            </p>
            <span>Visibility</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Cloud />
            <p className="text-xl font-bold">
              {weather.clouds?.all ?? 0}%
            </p>
            <span>Cloud Cover</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Sun />
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp_max)}°
            </p>
            <span>Max Temp</span>
          </motion.div>

          <motion.div
            whileHover={{ y: -6 }}
            className="glass-card"
          >
            <Sunset />
            <p className="text-xl font-bold">
              {Math.round(weather.main.temp_min)}°
            </p>
            <span>Min Temp</span>
          </motion.div>

        </div>

        {/* ✅ ADD KIYA (AI SECTION) */}
        <div className="glass-card mt-10 p-5">
          <h3 className="text-lg font-semibold">🧠 AI Insight</h3>
          <p className="text-white/80 mt-2">{insight}</p>

          <h3 className="text-lg font-semibold mt-4">👕 Outfit Suggestion</h3>
          <p className="text-white/80 mt-2">{outfit}</p>
        </div>

      </div>
    </motion.div>
  );
}
