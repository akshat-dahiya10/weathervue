'use client';

import { motion } from 'framer-motion';
import { Droplets, Wind, Gauge, Thermometer } from 'lucide-react';
import type { Weather } from '@/lib/types';

export default function WeatherCard({ weather }: { weather: Weather }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative max-w-4xl mx-auto p-[1px] rounded-3xl bg-gradient-to-r from-white/20 to-white/5"
    >
      <div className="bg-black/30 backdrop-blur-2xl rounded-3xl p-8 text-white shadow-2xl">

        {/* City */}
        <h2 className="text-4xl font-bold">
          {weather.name}, {weather.sys.country}
        </h2>

        {/* Temp */}
        <div className="text-7xl font-extrabold mt-2 tracking-tight">
          {Math.round(weather.main.temp)}°
        </div>

        {/* Condition */}
        <p className="text-xl opacity-80 capitalize">
          {weather.weather[0].description}
        </p>

        {/* DETAILS GRID 🔥 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">

          <div className="glass-card">
            <Droplets />
            <p>{weather.main.humidity}%</p>
            <span>Humidity</span>
          </div>

          <div className="glass-card">
            <Wind />
            <p>{weather.wind.speed} m/s</p>
            <span>Wind</span>
          </div>

          <div className="glass-card">
            <Gauge />
            <p>{weather.main.pressure} hPa</p>
            <span>Pressure</span>
          </div>

          <div className="glass-card">
            <Thermometer />
            <p>{Math.round(weather.main.feels_like)}°</p>
            <span>Feels Like</span>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
