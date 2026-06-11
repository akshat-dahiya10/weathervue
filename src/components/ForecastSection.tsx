'use client';

import { motion } from 'framer-motion';
import { Calendar, Droplets, Wind } from 'lucide-react';
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
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

function groupForecastByDay(forecast: Forecast): DailyForecast[] {
  const dailyData: Record<
    string,
    {
      label: string;
      dayName: string;
      temps: number[];
      weather: Forecast['list'][0]['weather'][0];
      humidity: number[];
      windSpeed: number[];
    }
  > = {};

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
        dayName: date.toLocaleDateString('en-US', {
          weekday: 'short',
        }),
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
      humidity: Math.round(
        data.humidity.reduce((a, b) => a + b, 0) /
          data.humidity.length
      ),
      windSpeed: Math.round(
        (data.windSpeed.reduce((a, b) => a + b, 0) /
          data.windSpeed.length) *
          3.6
      ),
    }));
}

export default function ForecastSection({
  forecast,
}: ForecastSectionProps) {
  const dailyForecasts = groupForecastByDay(forecast);

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      className="w-full max-w-6xl mx-auto mt-12"
    >
      {/* Header */}

      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-cyan-400" />

            <h3 className="text-2xl md:text-3xl font-black text-white">
              5-Day Forecast
            </h3>
          </div>

          <p className="text-slate-400 mt-2">
            Extended weather outlook
          </p>
        </div>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {dailyForecasts.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
            }}
            className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-white/10
            bg-white/[0.05]
            backdrop-blur-2xl
            p-5
            hover:border-cyan-400/40
            hover:shadow-[0_0_50px_rgba(59,130,246,0.25)]
            transition-all
            duration-500
            "
          >
            {/* Glow */}

            <div
              className="
              absolute
              inset-0
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
              bg-gradient-to-b
              from-cyan-500/10
              via-blue-500/5
              to-transparent
              "
            />

            <div className="relative z-10">
              {/* Day */}

              <div className="text-center mb-4">
                <p className="font-bold text-white text-lg">
                  {index === 0
                    ? 'Today'
                    : day.dayName}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {day.date}
                </p>
              </div>

              {/* Weather Icon */}

              <div className="flex justify-center mb-4">
                <img
                  src={getWeatherIconUrl(
                    day.weather.icon
                  )}
                  alt={day.weather.description}
                  className="
                  w-24
                  h-24
                  drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]
                  group-hover:scale-125
                  transition-all
                  duration-500
                  "
                />
              </div>

              {/* Weather Condition */}

              <p
                className="
                text-center
                text-sm
                text-slate-300
                capitalize
                mb-5
                min-h-[40px]
                "
              >
                {day.weather.description}
              </p>

              {/* Temperature */}

              <div className="flex justify-center items-end gap-2 mb-5">
                <span className="text-3xl font-black text-white">
                  {day.tempMax}°
                </span>

                <span className="text-lg text-slate-400">
                  {day.tempMin}°
                </span>
              </div>

              {/* Temperature Bar */}

              <div className="mb-5">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="
                    h-full
                    rounded-full
                    bg-gradient-to-r
                    from-cyan-400
                    via-blue-500
                    to-violet-500
                    "
                    style={{
                      width: `${Math.min(
                        day.tempMax * 2,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Stats */}

              <div className="space-y-3 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Droplets className="w-4 h-4" />
                    Humidity
                  </div>

                  <span className="text-white font-medium">
                    {day.humidity}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Wind className="w-4 h-4" />
                    Wind
                  </div>

                  <span className="text-white font-medium">
                    {day.windSpeed} km/h
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
