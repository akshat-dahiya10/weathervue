'use client';

import { motion } from 'framer-motion';
import { Droplets, Wind, Thermometer, Eye, Gauge, Cloud } from 'lucide-react';
import type { Weather } from '@/lib/types';

interface SidePanelProps {
  weather: Weather;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

function DetailItem({ icon, label, value, delay }: DetailItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 cursor-default"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-white truncate">{value}</p>
      </div>
    </motion.div>
  );
}

export default function SidePanel({ weather }: SidePanelProps) {
  const windSpeed = (weather.wind.speed * 3.6).toFixed(1); // Convert m/s to km/h
  const windDirection = getWindDirection(weather.wind.deg);

  const details: DetailItemProps[] = [
    {
      icon: <Thermometer className="w-5 h-5 text-orange-400" />,
      label: 'Feels Like',
      value: `${Math.round(weather.main.feels_like)}°C`,
      delay: 0.1,
    },
    {
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      label: 'Humidity',
      value: `${weather.main.humidity}%`,
      delay: 0.2,
    },
    {
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      label: 'Wind Speed',
      value: `${windSpeed} km/h ${windDirection}`,
      delay: 0.3,
    },
    {
      icon: <Eye className="w-5 h-5 text-green-400" />,
      label: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      delay: 0.4,
    },
    {
      icon: <Gauge className="w-5 h-5 text-purple-400" />,
      label: 'Pressure',
      value: `${weather.main.pressure} hPa`,
      delay: 0.5,
    },
    {
      icon: <Cloud className="w-5 h-5 text-gray-400" />,
      label: 'Cloudiness',
      value: `${weather.clouds.all}%`,
      delay: 0.6,
    },
  ];

  return (
    <div className="w-full">
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
      >
        <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        Weather Details
      </motion.h3>
      <div className="space-y-2">
        {details.map((detail) => (
          <DetailItem key={detail.label} {...detail} />
        ))}
      </div>
    </div>
  );
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
