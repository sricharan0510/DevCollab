import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  GitBranch, 
  Zap, 
  Brain, 
  Users, 
  Star,
  Coffee,
  Lightbulb,
  Rocket,
  Shield
} from 'lucide-react'

const FloatingElements = () => {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const elements = [
    { icon: Code, color: 'text-blue-500', size: 'h-6 w-6', delay: 0 },
    { icon: GitBranch, color: 'text-green-500', size: 'h-5 w-5', delay: 1 },
    { icon: Zap, color: 'text-yellow-500', size: 'h-7 w-7', delay: 2 },
    { icon: Brain, color: 'text-purple-500', size: 'h-6 w-6', delay: 3 },
    { icon: Users, color: 'text-pink-500', size: 'h-5 w-5', delay: 4 },
    { icon: Star, color: 'text-orange-500', size: 'h-4 w-4', delay: 5 },
    { icon: Coffee, color: 'text-amber-600', size: 'h-5 w-5', delay: 6 },
    { icon: Lightbulb, color: 'text-cyan-500', size: 'h-6 w-6', delay: 7 },
    { icon: Rocket, color: 'text-red-500', size: 'h-5 w-5', delay: 8 },
    { icon: Shield, color: 'text-emerald-500', size: 'h-6 w-6', delay: 9 }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => {
        const IconComponent = element.icon
        const startX = Math.random() * dimensions.width
        const startY = Math.random() * dimensions.height
        
        return (
          <motion.div
            key={index}
            className={`absolute ${element.color}`}
            initial={{ 
              x: startX,
              y: startY,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              x: [
                startX,
                startX + (Math.random() - 0.5) * 200,
                startX + (Math.random() - 0.5) * 300,
                startX
              ],
              y: [
                startY,
                startY + (Math.random() - 0.5) * 200,
                startY + (Math.random() - 0.5) * 300,
                startY
              ],
              opacity: [0, 0.6, 0.3, 0.6, 0],
              scale: [0, 1, 0.8, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: element.delay,
              ease: "easeInOut"
            }}
          >
            <div className="p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-lg border border-border">
              <IconComponent className={element.size} />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default FloatingElements

