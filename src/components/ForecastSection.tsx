'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { Forecast } from '@/lib/types';

interface ForecastSectionProps {
  forecast: Forecast;
}

interface DailyForecast {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
  humidity: number;
  windSpeed: number;
}

function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function groupForecastByDay(forecast: Forecast): DailyForecast[] {
  const dailyData: Record<string, {
    label: string;
    dayName: string;
    temps: number[];
    weather: Forecast['list'][0]['weather'][0];
    humidity: number[];
    windSpeed: number[];
  }> = {};

  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = item.dt_txt.split(' ')[0];

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        label: date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        temps: [],
        weather: item.weather[0],
        humidity: [],
        windSpeed: [],
      };
    }

    dailyData[dayKey].temps.push(item.main.temp);
    dailyData[dayKey].humidity.push(item.main.humidity);
    dailyData[dayKey].windSpeed.push(item.wind.speed);
  });

  return Object.entries(dailyData)
    .slice(0, 5)
    .map(([dayKey, data]) => ({
      date: dayKey,
      dayName: data.dayName,
      tempMin: Math.round(Math.min(...data.temps)),
      tempMax: Math.round(Math.max(...data.temps)),
      weather: data.weather,
      humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
      windSpeed: Math.round((data.windSpeed.reduce((a, b) => a + b, 0) / data.windSpeed.length) * 3.6),
    }));
}

export default function ForecastSection({ forecast }: ForecastSectionProps) {
  const dailyForecasts = groupForecastByDay(forecast);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="w-full max-w-5xl mx-auto mt-8"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">5-Day Forecast</h3>
      </div>

      {/* Forecast Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {dailyForecasts.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-4 cursor-default transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-xl"
          >
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              {/* Day Name */}
              <p className="text-white font-medium text-center mb-3">
                {index === 0 ? 'Today' : day.dayName}
              </p>

              {/* Icon */}
              <div className="flex justify-center mb-2">
                <img
                  src={getWeatherIconUrl(day.weather.icon)}
                  alt={day.weather.description}
                  className="w-14 h-14 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Condition */}
              <p className="text-gray-400 text-xs text-center capitalize mb-3 truncate">
                {day.weather.description}
              </p>

              {/* Temperature */}
              <div className="flex justify-center items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-white">{day.tempMax}°</span>
                <span className="text-lg text-gray-400">{day.tempMin}°</span>
              </div>

              {/* Extra Details */}
              <div className="flex justify-between text-xs text-gray-500 pt-3 border-t border-white/10">
                <span>💧 {day.humidity}%</span>
                <span>💨 {day.windSpeed}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
