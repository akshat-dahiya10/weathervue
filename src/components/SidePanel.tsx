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
import { predictRainProbability } from '../lib/aiPredictor';
import { generateWeatherSummary } from '../lib/aiSummary';

interface SidePanelProps {
  weather: Weather;
  forecast: Forecast;
}

export default function SidePanel({
  weather,
  forecast
}: SidePanelProps) {

  const { tiltRef, handleMouseMove, handleMouseLeave } = useTilt();

  const sunrise = new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const sunset = new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const ai = predictRainProbability(weather, forecast);
  const summary = generateWeatherSummary(weather, forecast);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/[0.05] backdrop-blur-3xl rounded-[30px] p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] space-y-8"
    >

      {/* 🔥 ULTRA AI CARD */}
      <motion.div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.03 }}
        className="
        relative
        overflow-hidden
        rounded-3xl
        p-6
        bg-gradient-to-br
        from-cyan-500/20
        via-blue-500/20
        to-purple-500/20
        border border-cyan-400/20
        shadow-[0_0_40px_rgba(0,200,255,0.3)]
        group
        "
      >

        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-500/10 blur-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-cyan-400 animate-pulse" />
            <span className="font-semibold text-lg">
              AI Weather Engine
            </span>
          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300">
            LIVE
          </span>
        </div>

        {/* Animated probability */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${ai.probability}%` }}
          transition={{ duration: 1.2 }}
          className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
        />

        <div className="flex justify-between text-sm text-slate-300 mb-3">
          <span>Rain Probability</span>
          <span className="font-bold text-white">
            {ai.probability}%
          </span>
        </div>

        {/* AI Label */}
        <p className="text-sm text-cyan-300 mb-4">
          {ai.label}
        </p>

        {/* AI Summary (typing feel) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-slate-300 leading-6"
        >
          {summary}
        </motion.p>

      </motion.div>

      {/* OTHER CARDS SAME (unchanged but premium feel) */}

      <div className="grid grid-cols-2 gap-4">

        <div className="glass-card">
          <Sun className="w-6 h-6" />
          <span>Sunrise</span>
          <p>{sunrise}</p>
        </div>

        <div className="glass-card">
          <Sunset className="w-6 h-6" />
          <span>Sunset</span>
          <p>{sunset}</p>
        </div>

        <div className="glass-card">
          <Cloud className="w-6 h-6" />
          <span>Cloud</span>
          <p>{weather.clouds?.all ?? 0}%</p>
        </div>

        <div className="glass-card">
          <Wind className="w-6 h-6" />
          <span>Wind</span>
          <p>{weather.wind.speed} m/s</p>
        </div>

      </div>

      {/* UV */}
      <div className="glass-card">
        <ShieldCheck className="w-6 h-6" />
        <span>UV Index</span>
        <p className="text-3xl font-bold">5.2</p>
      </div>

    </motion.div>
  );
}
