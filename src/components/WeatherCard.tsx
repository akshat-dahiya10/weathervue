'use client';

import { motion } from 'framer-motion';
import type { Weather } from '@/lib/types';

export default function WeatherCard({ weather }: { weather: Weather }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-xl text-white"
    >
      {/* City */}
      <h2 className="text-3xl font-bold">
        {weather.name}, {weather.sys.country}
      </h2>

      {/* Temp */}
      <div className="text-6xl font-extrabold mt-2">
        {Math.round(weather.main.temp)}°C
      </div>

      {/* Condition */}
      <p className="text-lg opacity-80 capitalize">
        {weather.weather[0].description}
      </p>

      {/* EXTRA DETAILS 🔥 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p className="text-sm opacity-70">Humidity</p>
          <p className="text-xl font-semibold">
            {weather.main.humidity}%
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p className="text-sm opacity-70">Wind Speed</p>
          <p className="text-xl font-semibold">
            {weather.wind.speed} m/s
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p className="text-sm opacity-70">Pressure</p>
          <p className="text-xl font-semibold">
            {weather.main.pressure} hPa
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-xl text-center">
          <p className="text-sm opacity-70">Feels Like</p>
          <p className="text-xl font-semibold">
            {Math.round(weather.main.feels_like)}°C
          </p>
        </div>

      </div>
    </motion.div>
  );
}
