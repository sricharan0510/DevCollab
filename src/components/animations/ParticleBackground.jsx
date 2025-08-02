import { useCallback } from 'react'
import { motion } from 'framer-motion'

const ParticleBackground = ({ isDark = false }) => {
  // Fallback animated background since react-particles might have issues
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient blobs */}
      <motion.div
        className={`absolute top-20 left-10 w-72 h-72 ${
          isDark ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'bg-gradient-to-r from-blue-500/5 to-cyan-500/5'
        } rounded-full blur-3xl`}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className={`absolute bottom-20 right-10 w-96 h-96 ${
          isDark ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-purple-500/5 to-pink-500/5'
        } rounded-full blur-3xl`}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
          x: [0, -100, 0],
          y: [0, 50, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div
        className={`absolute top-1/2 left-1/2 w-64 h-64 ${
          isDark ? 'bg-gradient-to-r from-green-500/8 to-emerald-500/8' : 'bg-gradient-to-r from-green-500/4 to-emerald-500/4'
        } rounded-full blur-3xl`}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -180, -360],
          x: [-50, 50, -50],
          y: [-50, 50, -50]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 ${
            isDark ? 'bg-white/20' : 'bg-black/10'
          } rounded-full`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default ParticleBackground

