'use client';

import { motion } from 'framer-motion';
import {
  Brain,
  Sun,
  Sunset,
  Cloud,
  Wind,
  ShieldCheck
} from 'lucide-react';

import type { Weather, Forecast } from '@/lib/types';
import { useTilt } from '@/hooks/useTilt';
import { predictRainProbability } from '@/lib/aiPredictor';

interface SidePanelProps {
  weather: Weather;
  forecast?: Forecast; // ✅ FIXED (optional)
}

export default function SidePanel({
  weather,
  forecast
}: SidePanelProps) {
  const tilt = useTilt();

  const sunrise = new Date(
    weather.sys.sunrise * 1000
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const sunset = new Date(
    weather.sys.sunset * 1000
  ).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  // ✅ REAL AI
  const ai = predictRainProbability(weather, forecast);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="
      tilt
      bg-white/[0.06]
      backdrop-blur-3xl
      rounded-[30px]
      p-8
      border
      border-white/10
      shadow-[0_20px_60px_rgba(0,0,0,0.4)]
      space-y-8
      "
    >
      {/* Light reflection */}
      <div className="light-reflection pointer-events-none absolute inset-0 rounded-[30px]" />

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Weather Insights
        </h2>

        <p className="text-slate-400 mt-2">
          Real-time atmospheric details
        </p>
      </div>

      {/* AI Prediction Card */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="
        rounded-3xl
        p-5
        bg-gradient-to-br
        from-cyan-500/20
        via-blue-500/20
        to-purple-500/20
        border
        border-cyan-400/20
        "
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-5 h-5" />
          <span className="font-semibold">
            AI Rain Prediction
          </span>
        </div>

        <p className="text-sm text-slate-300 mb-4">
          {ai.label}
        </p>

        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{
              width: `${ai.probability}%`
            }}
          />
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Confidence: {ai.probability}%
        </p>
      </motion.div>

      {/* Weather Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card">
          <Sun className="w-6 h-6" />
          <span className="text-sm text-slate-400">
            Sunrise
          </span>
          <p className="font-bold">
            {sunrise}
          </p>
        </div>

        <div className="glass-card">
          <Sunset className="w-6 h-6" />
          <span className="text-sm text-slate-400">
            Sunset
          </span>
          <p className="font-bold">
            {sunset}
          </p>
        </div>

        <div className="glass-card">
          <Cloud className="w-6 h-6" />
          <span className="text-sm text-slate-400">
            Cloud Cover
          </span>
          <p className="font-bold">
            {weather.clouds?.all ?? 0}%
          </p>
        </div>

        <div className="glass-card">
          <Wind className="w-6 h-6" />
          <span className="text-sm text-slate-400">
            Wind Speed
          </span>
          <p className="font-bold">
            {weather.wind.speed} m/s
          </p>
        </div>
      </div>

      {/* UV Card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.05]
        p-5
        backdrop-blur-xl
        "
      >
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-semibold">
            UV Index
          </span>
        </div>

        <div className="text-4xl font-black">
          5.2
        </div>

        <p className="text-slate-400 text-sm mt-2">
          Moderate exposure level
        </p>
      </motion.div>

      {/* Quick Summary */}
      <div
        className="
        rounded-3xl
        border
        border-white/10
        bg-white/[0.04]
        p-5
        "
      >
        <h3 className="font-semibold mb-3">
          Quick Summary
        </h3>

        <p className="text-slate-400 text-sm leading-6">
          Current temperature is{' '}
          {Math.round(weather.main.temp)}° with{' '}
          {weather.weather[0].description}. Visibility is{' '}
          {(weather.visibility / 1000).toFixed(1)} km and
          wind conditions are moderate.
        </p>
      </div>
    </motion.div>
  );
}
