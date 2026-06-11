'use client';

import { motion } from 'framer-motion';
import type { Weather } from '@/lib/types';

export default function SidePanel({ weather, forecast }: any)
const rainChance =
  forecast?.list?.slice(0, 3).some((f: any) =>
    f.weather[0].main.toLowerCase().includes('rain')
  )
    ? 85
    : forecast?.list?.[0]?.clouds?.all > 70
    ? 60
    : weather.main.humidity > 70
    ? 50
    : 20;

const willRainSoon = rainChance > 60;


  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl space-y-6"
    >
      <h2 className="text-xl font-semibold text-white">Weather Details</h2>

      {/* 🌡️ Feels Like */}
      <div className="flex justify-between text-gray-300">
        <span>Feels Like</span>
        <span className="text-white font-medium">
          {Math.round(weather.main.feels_like)}°C
        </span>
      </div>

      {/* 💧 Humidity */}
      <div className="flex justify-between text-gray-300">
        <span>Humidity</span>
        <span className="text-white font-medium">
          {weather.main.humidity}%
        </span>
      </div>

      {/* 🌬 Wind */}
      <div className="flex justify-between text-gray-300">
        <span>Wind Speed</span>
        <span className="text-white font-medium">
          {weather.wind.speed} m/s
        </span>
      </div>

      {/* 🌡 Pressure */}
      <div className="flex justify-between text-gray-300">
        <span>Pressure</span>
        <span className="text-white font-medium">
          {weather.main.pressure} hPa
        </span>
      </div>

      {/* 👁 Visibility */}
      <div className="flex justify-between text-gray-300">
        <span>Visibility</span>
        <span className="text-white font-medium">
          {(weather.visibility / 1000).toFixed(1)} km
        </span>
      </div>

      {/* 🤖 AI Prediction */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10">
        <h3 className="text-white font-semibold mb-2">🤖 AI Prediction</h3>

        <p className="text-sm text-gray-300">
          {willRainSoon
            ? '🌧 High chance of rain in next 2-3 hours. Carry an umbrella.'
            : '☀️ Weather looks stable. No rain expected soon.'}
        </p>

        <div className="mt-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 transition-all duration-700"
              style={{ width: `${rainChance}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Rain Probability: {rainChance}%
          </p>
        </div>
      </div>
    </motion.div>
  );
}
