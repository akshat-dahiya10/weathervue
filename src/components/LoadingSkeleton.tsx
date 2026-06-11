'use client';

import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden lg:block lg:col-span-3 space-y-4"
        >
          <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-white/5 rounded-2xl border border-white/10 animate-pulse"
            />
          ))}
        </motion.div>

        {/* Main Card Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 lg:col-span-6"
        >
          <div className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="h-7 w-48 bg-white/10 rounded-lg mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-32 bg-white/5 rounded-lg mx-auto animate-pulse" />
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-32 h-32 bg-white/10 rounded-full animate-pulse" />
              <div>
                <div className="h-20 w-32 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="h-6 w-40 bg-white/10 rounded-lg mx-auto mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-white/5 rounded-lg mx-auto animate-pulse" />
            </div>

            <div className="h-px bg-white/10 mb-6" />

            <div className="flex justify-around">
              {[1, 2].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-5 w-20 bg-white/10 rounded-lg mx-auto mb-2 animate-pulse" />
                  <div className="h-5 w-16 bg-white/5 rounded-lg mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel Skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:block lg:col-span-3 space-y-4"
        >
          <div className="h-6 w-36 bg-white/10 rounded-lg animate-pulse" />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-16 bg-white/5 rounded-2xl border border-white/10 animate-pulse"
            />
          ))}
        </motion.div>
      </div>

      {/* Forecast Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <div className="h-6 w-40 bg-white/10 rounded-lg mb-6 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-52 bg-white/5 rounded-2xl border border-white/10 animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
