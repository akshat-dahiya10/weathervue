'use client';

import { motion } from 'framer-motion';
import { Search, Globe, Clock, CloudSun } from 'lucide-react';

export default function WelcomeScreen() {
  const features = [
    {
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      title: 'Global Coverage',
      description: 'Search any city worldwide',
    },
    {
      icon: <Clock className="w-6 h-6 text-green-400" />,
      title: 'Real-time Data',
      description: 'Live weather updates',
    },
    {
      icon: <CloudSun className="w-6 h-6 text-yellow-400" />,
      title: '5-Day Forecast',
      description: 'Plan your week ahead',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Hero Icon */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl border border-white/20 flex items-center justify-center">
          <span className="text-6xl">⛅</span>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
      >
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">WeatherVue</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-400 text-center max-w-md mb-8"
      >
        Get accurate weather forecasts for any location around the world
      </motion.p>

      {/* Search Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-gray-400 mb-12"
      >
        <Search className="w-5 h-5" />
        <span>Search for a city to get started</span>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -5 }}
            className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 cursor-default"
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-3">
              {feature.icon}
            </div>
            <h3 className="text-white font-medium mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
