import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  Download,
  Sparkles,
  Brain,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FeatureSpotlight = () => {
  const [activeDemo, setActiveDemo] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState('')

  const demoData = {
    search: {
      title: "AI-Powered Intelligent Search",
      subtitle: "Find anything in your codebase instantly",
      icon: Search,
      color: "from-blue-500 to-cyan-500"
    },
    summary: {
      title: "AI Documentation Generator",
      subtitle: "Generate comprehensive summaries automatically",
      icon: FileText,
      color: "from-purple-500 to-pink-500"
    }
  }

  const mockSearchResults = [
    {
      file: "auth/login.js",
      line: 23,
      preview: "const authenticateUser = async (credentials) => {",
      relevance: 95
    },
    {
      file: "middleware/auth.js",
      line: 15,
      preview: "function validateToken(token) {",
      relevance: 88
    },
    {
      file: "utils/security.js",
      line: 7,
      preview: "export const hashPassword = (password) => {",
      relevance: 82
    }
  ]

  const mockSummary = `# Authentication System Documentation

## Overview
This module handles user authentication with JWT tokens and bcrypt password hashing.

## Key Components
- **Login Handler**: Validates credentials and generates tokens
- **Middleware**: Protects routes with token verification
- **Security Utils**: Password hashing and validation

## Usage Examples
\`\`\`javascript
const user = await authenticateUser(credentials);
const isValid = validateToken(user.token);
\`\`\`

## Security Features
- Bcrypt password hashing
- JWT token expiration
- Rate limiting protection`

  useEffect(() => {
    if (searchQuery && activeDemo === 'search') {
      const timer = setTimeout(() => {
        setSearchResults(mockSearchResults)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, activeDemo])

  const handleGenerateSummary = () => {
    setIsGenerating(true)
    setGeneratedSummary('')

    // Simulate AI generation with typing effect
    setTimeout(() => {
      let index = 0
      const timer = setInterval(() => {
        if (index < mockSummary.length) {
          setGeneratedSummary(prev => prev + mockSummary[index])
          index++
        } else {
          clearInterval(timer)
          setIsGenerating(false)
        }
      }, 20)
    }, 1000)
  }

  const Icon = demoData[activeDemo].icon;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Experience AI-Powered Development
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how our intelligent features transform your coding workflow
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Controls */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex space-x-4 mb-8">
              {Object.entries(demoData).map(([key, data]) => {
                const IconComponent = data.icon
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveDemo(key)}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-lg border transition-all ${activeDemo === key
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:bg-muted'
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="font-medium">
                      {key === 'search' ? 'Smart Search' : 'AI Summary'}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`bg-gradient-to-r ${demoData[activeDemo].color} p-1 rounded-lg mb-6`}>
                  <div className="bg-background rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 bg-gradient-to-r ${demoData[activeDemo].color} rounded-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{demoData[activeDemo].title}</h3>
                        <p className="text-muted-foreground">{demoData[activeDemo].subtitle}</p>
                      </div>
                    </div>

                    {activeDemo === 'search' ? (
                      <div className="space-y-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search for authentication logic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <AnimatePresence>
                          {searchResults.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2"
                            >
                              {searchResults.map((result, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm">{result.file}</span>
                                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                                      {result.relevance}% match
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground font-mono">
                                    Line {result.line}: {result.preview}
                                  </p>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button
                          onClick={handleGenerateSummary}
                          disabled={isGenerating}
                          className="w-full"
                        >
                          {isGenerating ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Brain className="h-4 w-4 mr-2" />
                              </motion.div>
                              Generating Summary...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate AI Summary
                            </>
                          )}
                        </Button>

                        <AnimatePresence>
                          {generatedSummary && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-muted p-4 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Generated Documentation</span>
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4 mr-1" />
                                  Export PDF
                                </Button>
                              </div>
                              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                                {generatedSummary}
                              </pre>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Visual Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card border border-border rounded-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-muted-foreground">DevCollab AI</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">AI Analysis Complete</p>
                    <p className="text-sm text-muted-foreground">Found 12 optimization opportunities</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Performance</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">+25%</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Time Saved</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">4.2h</p>
                  </div>
                </div>

                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-lg text-white"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(168, 85, 247, 0.4)",
                      "0 0 0 10px rgba(168, 85, 247, 0)",
                      "0 0 0 0 rgba(168, 85, 247, 0)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Ready to collaborate?</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-800" />
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeatureSpotlight

