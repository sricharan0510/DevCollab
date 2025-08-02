import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import {
  Github,
  Search,
  FileText,
  Users,
  Zap,
  Code,
  GitBranch,
  Download,
  Moon,
  Sun,
  Menu,
  X,
  ChevronRight,
  Play,
  Star,
  Eye,
  GitCommit,
  Brain,
  Sparkles,
  Rocket,
  Shield,
  Globe,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react'
import CodePlayground from './components/interactive/CodePlayground'
import InfiniteScrollCards from './components/interactive/InfiniteScrollCards'
import FeatureSpotlight from './components/interactive/FeatureSpotlight'
import GitHubContributionGraph from './components/interactive/GitHubContributionGraph'
import AIInsightsPanel from './components/interactive/AIInsightsPanel'
import './App.css'


function App() {
  const [isDark, setIsDark] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  }

  const features = [
    {
      icon: Github,
      title: "GitHub Integration",
      description: "Seamlessly connect your GitHub account and access all your repositories with OAuth authentication. Edit, commit, and push directly from our platform.",
      gradient: "from-gray-600 to-gray-800",
      stats: "100% OAuth Compatible"
    },
    {
      icon: Brain,
      title: "AI-Powered Search",
      description: "Find files and repositories instantly with our intelligent search powered by Gemini AI. Get contextual results across your entire codebase.",
      gradient: "from-blue-500 to-cyan-500",
      stats: "10x Faster Search"
    },
    {
      icon: FileText,
      title: "AI Summaries",
      description: "Generate comprehensive summaries of your files and repositories using AI. Export detailed documentation as PDF files for easy sharing.",
      gradient: "from-purple-500 to-pink-500",
      stats: "90% Time Saved"
    },
    {
      icon: Users,
      title: "Collaborative Workspace",
      description: "Invite team members and work together in real-time. Code, debug, and test collaboratively in a shared environment like LeetCode.",
      gradient: "from-green-500 to-emerald-500",
      stats: "Real-time Sync"
    },
    {
      icon: Zap,
      title: "Code Optimization",
      description: "Get intelligent suggestions to optimize your code performance and quality with AI-powered analysis and recommendations.",
      gradient: "from-yellow-500 to-orange-500",
      stats: "40% Performance Boost"
    },
    {
      icon: Shield,
      title: "Security Analysis",
      description: "Advanced security scanning with AI-powered vulnerability detection and automated fix suggestions for your codebase.",
      gradient: "from-red-500 to-pink-500",
      stats: "99.9% Threat Detection"
    }
  ]

  const steps = [
    {
      step: "01",
      title: "Connect GitHub",
      description: "Sign up with Gmail or GitHub and authorize your repositories",
      icon: Github,
      color: "from-gray-500 to-gray-700"
    },
    {
      step: "02",
      title: "AI Analysis",
      description: "Our AI analyzes your codebase and provides intelligent insights",
      icon: Brain,
      color: "from-blue-500 to-purple-500"
    },
    {
      step: "03",
      title: "Collaborate",
      description: "Invite teammates and work together in real-time workspace",
      icon: Users,
      color: "from-green-500 to-teal-500"
    },
    {
      step: "04",
      title: "Optimize & Deploy",
      description: "Apply AI suggestions and deploy with confidence",
      icon: Rocket,
      color: "from-orange-500 to-red-500"
    }
  ]

  const stats = [
    { label: "Active Developers", value: "50K+", icon: Users },
    { label: "Code Reviews", value: "1M+", icon: Eye },
    { label: "AI Suggestions", value: "10M+", icon: Brain },
    { label: "Time Saved", value: "100K hrs", icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className={`absolute top-20 left-10 w-72 h-72 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'bg-gradient-to-r from-blue-500/5 to-cyan-500/5'
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
          className={`absolute bottom-20 right-10 w-96 h-96 ${isDark ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-purple-500/5 to-pink-500/5'
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
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Code className="h-8 w-8 text-primary" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                DevCollab
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <motion.a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Features
              </motion.a>
              <motion.a
                href="#playground"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Playground
              </motion.a>
              <motion.a
                href="#testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                Reviews
              </motion.a>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-opacity-90 dark:hover:bg-opacity-90">
                  Sign in
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-opacity-90 dark:hover:bg-opacity-90">
                  Sign Up
                </Button>
              </motion.div>
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  <AnimatePresence mode="wait">
                    {isDark ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                  <AnimatePresence mode="wait">
                    {isMenuOpen ? (
                      <motion.div
                        key="x"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-background border-b border-border overflow-hidden"
            >
              <motion.div
                className="px-2 pt-2 pb-3 space-y-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.a
                  href="#features"
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                  variants={itemVariants}
                >
                  Features
                </motion.a>
                <motion.a
                  href="#playground"
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                  variants={itemVariants}
                >
                  Playground
                </motion.a>
                <motion.a
                  href="#testimonials"
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground"
                  variants={itemVariants}
                >
                  Reviews
                </motion.a>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-opacity-90 dark:hover:bg-opacity-90 mb-2">
                    Sign in
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-opacity-90 dark:hover:bg-opacity-90">
                    Sign Up
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/30 text-primary text-sm mb-8"
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(var(--primary), 0.3)" }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
              </motion.div>
              Trusted by 50,000+ developers worldwide
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Award className="h-4 w-4 ml-2" />
              </motion.div>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-8"
              variants={itemVariants}
            >
              Code Together,
              <br />
              <motion.span
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 200%"
                }}
              >
                Build Smarter
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
              variants={itemVariants}
            >
              The ultimate collaborative development platform powered by AI.
              Seamlessly integrate with GitHub, optimize code in real-time, and collaborate
              like never before with intelligent suggestions and automated workflows.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-black text-white dark:bg-white dark:text-black hover:bg-opacity-90 dark:hover:bg-opacity-90">
                  <Github className="mr-3 h-6 w-6" />
                  Connect GitHub
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="text-lg px-10 py-4 border-2 hover:bg-muted/50">
                  <Play className="mr-3 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="flex items-center justify-center mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: 1 + index * 0.2
                    }}
                  >
                    <div className={`p-3 rounded-full bg-gradient-to-r ${features[index]?.gradient || 'from-primary to-blue-600'} mr-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </motion.div>
                  <motion.div
                    className="text-3xl sm:text-4xl font-bold text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 + index * 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Code Playground Section */}
      <section id="playground" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Experience the Power of AI
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Try our interactive code playground and see how AI transforms your development workflow
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <CodePlayground isDark={isDark} />
          </motion.div>
        </div>
      </section>

      {/* Feature Spotlight */}
      <FeatureSpotlight />

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Everything you need to code collaboratively
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Powerful features designed to enhance your development workflow and team productivity
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-card p-8 rounded-xl border border-border hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-xl shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Performance</div>
                      <div className="font-bold text-primary">{feature.stats}</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  <motion.div
                    className="mt-6 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <span className="text-sm font-medium">Learn more</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Contribution Graph Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                Track Your Progress
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Real-time Activity Tracking</h3>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Cross-platform Synchronization</h3>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Achievement & Milestone System</h3>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Smart Time Analytics</h3>
                  </div>
                </div>
              </div>

              <motion.div
                className="mt-8 p-4 bg-muted/50 rounded-lg border border-border"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">Pro Tip</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <GitHubContributionGraph />
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Insights Panel Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <AIInsightsPanel />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                AI-Powered Dashboard
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Intelligent Code Analysis</h3>
                    <p className="text-muted-foreground">
                      Advanced AI algorithms analyze your codebase for complexity, maintainability, and best practices.
                      Get detailed reports on code quality metrics and improvement suggestions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Performance Optimization Engine</h3>
                    <p className="text-muted-foreground">
                      Identify performance bottlenecks and receive AI-generated optimization suggestions.
                      Monitor runtime performance, memory usage, and execution efficiency in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Advanced Security Scanning</h3>
                    <p className="text-muted-foreground">
                      Proactive vulnerability detection with AI-powered security analysis. Get instant alerts
                      for potential security risks and automated fix recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Team Collaboration Insights</h3>
                    <p className="text-muted-foreground">
                      Analyze team dynamics, code review patterns, and collaboration efficiency.
                      Identify knowledge gaps and optimize team workflows for better productivity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Predictive Development Analytics</h3>
                    <p className="text-muted-foreground">
                      Leverage machine learning to predict project timelines, identify potential blockers,
                      and optimize resource allocation for maximum development velocity.
                    </p>
                  </div>
                </div>
              </div>

              <motion.div
                className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">AI Advantage</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our AI continuously learns from your coding patterns to provide increasingly personalized
                  insights and recommendations, making you a more efficient developer over time.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl sm:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              How DevCollab Works
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Get started in minutes with our simple four-step process
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-center group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${step.color} text-white rounded-full text-xl font-bold mb-6 relative`}
                  whileHover={{
                    scale: 1.1,
                    rotate: 360
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    duration: 0.6
                  }}
                >
                  <step.icon className="h-8 w-8" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-background border-2 border-primary rounded-full flex items-center justify-center text-sm font-bold text-primary">
                    {step.step}
                  </div>
                </motion.div>
                <motion.h3
                  className="text-xl font-bold mb-3 group-hover:text-primary transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                  viewport={{ once: true }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  viewport={{ once: true }}
                >
                  {step.description}
                </motion.p>
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}
                    viewport={{ once: true }}
                    className="hidden lg:block absolute top-10 left-full transform -translate-x-1/2 translate-x-8"
                  >
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Loved by Developers Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what developers are saying about their experience with DevCollab
            </p>
          </motion.div>

          <InfiniteScrollCards />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted text-foreground dark:bg-[#0e0e10] dark:text-white relative overflow-hidden">
        {/* Soft Background Accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-4xl sm:text-5xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to transform your development workflow?
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of developers coding smarter with DevCollab. Start your free trial and unlock the future of AI-powered collaboration.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
              >
                <Github className="mr-3 h-6 w-6" />
                Start Free Trial
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ChevronRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border border-foreground text-foreground hover:bg-muted/20"
              >
                <Play className="mr-3 h-5 w-5" />
                Schedule Demo
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Code className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  DevCollab
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The ultimate collaborative development platform for modern teams.
                Powered by AI, built for developers.
              </p>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Github className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <Eye className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                  <GitCommit className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                </motion.div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DevCollab. All rights reserved. Built with ❤️ for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

