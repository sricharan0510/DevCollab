import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const GitHubContributionGraph = () => {
  const [hoveredCell, setHoveredCell] = useState(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Generate contribution data for 3 months (approximately 13 weeks)
  const generateContributionData = () => {
    const data = []
    const today = new Date()
    const weeksToShow = 13 // 3 months
    
    for (let week = 0; week < weeksToShow; week++) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        const date = new Date(today)
        date.setDate(date.getDate() - (weeksToShow - 1 - week) * 7 - (6 - day))
        
        // Generate realistic contribution pattern
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const baseActivity = isWeekend ? 0.3 : 0.8
        const randomFactor = Math.random()
        const contributions = Math.floor(randomFactor * baseActivity * 15)
        
        weekData.push({
          date: date.toISOString().split('T')[0],
          contributions,
          level: contributions === 0 ? 0 : Math.min(Math.floor(contributions / 3) + 1, 4)
        })
      }
      data.push(weekData)
    }
    return data
  }

  const [contributionData] = useState(generateContributionData())

  const getColorClass = (level) => {
    const colors = {
      0: 'bg-muted border border-border',
      1: 'bg-green-200 dark:bg-green-900 border border-green-300 dark:border-green-700',
      2: 'bg-green-300 dark:bg-green-700 border border-green-400 dark:border-green-600',
      3: 'bg-green-400 dark:bg-green-600 border border-green-500 dark:border-green-500',
      4: 'bg-green-500 dark:bg-green-500 border border-green-600 dark:border-green-400'
    }
    return colors[level] || colors[0]
  }

  const totalContributions = contributionData
    .flat()
    .reduce((sum, day) => sum + day.contributions, 0)

  const getCurrentMonthLabel = () => {
    const now = new Date()
    const threeMonthsAgo = new Date(now)
    threeMonthsAgo.setMonth(now.getMonth() - 3)
    
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    
    return {
      start: months[threeMonthsAgo.getMonth()],
      middle: months[new Date(now.getFullYear(), now.getMonth() - 1).getMonth()],
      end: months[now.getMonth()]
    }
  }

  const monthLabels = getCurrentMonthLabel()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  useEffect(() => {
    const timer = setTimeout(() => setAnimationComplete(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Contribution Activity</h3>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">{totalContributions}</span> contributions in the last 3 months
        </p>
      </div>

      <div className="relative">
        {/* Month labels */}
        <div className="flex justify-between text-xs text-muted-foreground mb-2 ml-8">
          <span>{monthLabels.start}</span>
          <span>{monthLabels.middle}</span>
          <span>{monthLabels.end}</span>
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between text-xs text-muted-foreground mr-2 h-24">
            {days.map((day, index) => (
              <span key={day} className={index % 2 === 1 ? 'block' : 'hidden'}>
                {day}
              </span>
            ))}
          </div>

          {/* Contribution grid - contained within bounds */}
          <div className="flex space-x-1 overflow-hidden">
            {contributionData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col space-y-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 ${getColorClass(day.level)}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      boxShadow: hoveredCell === `${weekIndex}-${dayIndex}` 
                        ? '0 0 0 2px rgb(34 197 94)' 
                        : '0 0 0 0px transparent'
                    }}
                    transition={{ 
                      delay: animationComplete ? 0 : (weekIndex * 0.02 + dayIndex * 0.01),
                      duration: 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.2,
                      zIndex: 10
                    }}
                    onMouseEnter={() => setHoveredCell(`${weekIndex}-${dayIndex}`)}
                    onMouseLeave={() => setHoveredCell(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute z-20 bg-popover text-popover-foreground p-2 rounded-md shadow-md text-xs pointer-events-none"
            style={{
              left: '50%',
              top: '-40px',
              transform: 'translateX(-50%)'
            }}
          >
            {(() => {
              const [weekIdx, dayIdx] = hoveredCell.split('-').map(Number)
              const dayData = contributionData[weekIdx][dayIdx]
              return (
                <div>
                  <div className="font-medium">
                    {dayData.contributions} contributions
                  </div>
                  <div className="text-muted-foreground">
                    {new Date(dayData.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              )
            })()}
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {Math.floor(totalContributions / 13)}
          </div>
          <div className="text-xs text-muted-foreground">Avg/week</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {contributionData.flat().filter(day => day.contributions > 0).length}
          </div>
          <div className="text-xs text-muted-foreground">Active days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {Math.max(...contributionData.flat().map(day => day.contributions))}
          </div>
          <div className="text-xs text-muted-foreground">Best day</div>
        </div>
      </div>
    </div>
  )
}

export default GitHubContributionGraph

