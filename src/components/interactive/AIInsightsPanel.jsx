import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  Users,
  Zap,
  Target,
  BarChart3
} from 'lucide-react'

const AIInsightsPanel = () => {
  const [activeMetric, setActiveMetric] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const metrics = [
    {
      title: "Code Quality",
      value: 94,
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "Overall code quality score"
    },
    {
      title: "Performance",
      value: 87,
      change: "+8%",
      trend: "up",
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      description: "Application performance metrics"
    },
    {
      title: "Security",
      value: 96,
      change: "+5%",
      trend: "up",
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Security vulnerability assessment"
    },
    {
      title: "Team Velocity",
      value: 78,
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Development team productivity"
    }
  ]

  const insights = [
    {
      type: "optimization",
      title: "Performance Optimization",
      description: "Found 3 functions that can be optimized for better performance",
      impact: "High",
      icon: Zap,
      color: "text-orange-500"
    },
    {
      type: "security",
      title: "Security Enhancement",
      description: "Detected potential SQL injection vulnerability in auth module",
      impact: "Critical",
      icon: AlertTriangle,
      color: "text-red-500"
    },
    {
      type: "collaboration",
      title: "Team Sync",
      description: "5 team members are working on similar features - consider coordination",
      impact: "Medium",
      icon: Users,
      color: "text-blue-500"
    },
    {
      type: "quality",
      title: "Code Quality",
      description: "Test coverage increased to 94% - excellent progress!",
      impact: "Low",
      icon: CheckCircle,
      color: "text-green-500"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 3000)
  }

  const Icon = metrics[activeMetric].icon;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: isAnalyzing ? 360 : 0 }}
            transition={{ duration: 1, repeat: isAnalyzing ? Infinity : 0, ease: "linear" }}
            className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
          >
            <Brain className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold">AI Insights Dashboard</h3>
            <p className="text-sm text-muted-foreground">Real-time code analysis</p>
          </div>
        </div>

        <motion.button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </motion.button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon
          return (
            <motion.div
              key={index}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${activeMetric === index
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                }`}
              onClick={() => setActiveMetric(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: activeMetric === index
                  ? '0 0 0 2px rgba(var(--primary), 0.2)'
                  : '0 0 0 0px transparent'
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${metric.color}`} />
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${metric.trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                  {metric.change}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}%</div>
              <div className="text-xs text-muted-foreground">{metric.title}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Active Metric Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMetric}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-muted/50 rounded-lg"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Icon className={`h-5 w-5 ${metrics[activeMetric].color}`} />
            <span className="font-medium">{metrics[activeMetric].title}</span>
          </div>
          <p className="text-sm text-muted-foreground">{metrics[activeMetric].description}</p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{metrics[activeMetric].value}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${activeMetric === 0 ? 'from-green-400 to-green-600' :
                    activeMetric === 1 ? 'from-yellow-400 to-yellow-600' :
                      activeMetric === 2 ? 'from-blue-400 to-blue-600' :
                        'from-purple-400 to-purple-600'
                  }`}
                initial={{ width: 0 }}
                animate={{ width: `${metrics[activeMetric].value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* AI Insights */}
      <div>
        <h4 className="font-medium mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Recent Insights
        </h4>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {insights.map((insight, index) => {
            const IconComponent = insight.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-1.5 rounded-full bg-background`}>
                  <IconComponent className={`h-3 w-3 ${insight.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="text-sm font-medium truncate">{insight.title}</h5>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${insight.impact === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        insight.impact === 'High' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                          insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                      {insight.impact}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Analysis Status */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="h-4 w-4 text-blue-500" />
              </motion.div>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                AI is analyzing your codebase...
              </span>
            </div>
            <div className="mt-2 w-full bg-blue-200 dark:bg-blue-800 rounded-full h-1">
              <motion.div
                className="h-1 bg-blue-500 rounded-full"
                animate={{ width: ["0%", "100%"] }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIInsightsPanel

