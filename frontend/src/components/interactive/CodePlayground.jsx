import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Play, Copy, Check, Zap, FileCode, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CodePlayground = ({ isDark = false }) => {
  const [activeTab, setActiveTab] = useState('javascript')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)

  const codeExamples = {
    javascript: {
      code: `// AI-Powered Code Analysis
function analyzeCode(sourceCode) {
  const suggestions = ai.analyze({
    code: sourceCode,
    language: 'javascript',
    optimizations: true
  });
  
  return suggestions.map(s => ({
    type: s.severity,
    message: s.description,
    fix: s.autoFix
  }));
}

// Real-time Collaboration
const workspace = new CollaborativeEditor({
  roomId: 'dev-session-123',
  features: ['live-cursors', 'voice-chat']
});`,
      language: 'javascript',
      icon: FileCode
    },
    python: {
      code: `# AI Code Optimization
import devcollab as dc

@dc.optimize
def process_data(data):
    """AI will suggest performance improvements"""
    result = []
    for item in data:
        if item.is_valid():
            result.append(item.transform())
    return result

# GitHub Integration
repo = dc.connect_github('user/repo')
files = repo.search_ai('authentication logic')
summary = dc.generate_summary(files)`,
      language: 'python',
      icon: Zap
    },
    typescript: {
      code: `// Type-Safe Collaboration
interface CollabSession {
  users: User[];
  activeFile: string;
  aiSuggestions: Suggestion[];
}

class DevCollabWorkspace {
  private session: CollabSession;
  
  async startSession(roomId: string) {
    this.session = await this.connect(roomId);
    this.enableAI();
    this.syncWithGitHub();
  }
  
  @AIAssisted
  refactorCode(selection: CodeSelection) {
    return this.ai.suggest(selection);
  }
}`,
      language: 'typescript',
      icon: GitBranch
    }
  }

  const tabs = Object.keys(codeExamples)

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning) {
        setCurrentLine(prev => (prev + 1) % 15)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [isRunning])

  const handleRun = () => {
    setIsRunning(true)
    setTimeout(() => setIsRunning(false), 3000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto bg-card border border-border rounded-lg overflow-hidden shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-muted/50 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-muted-foreground ml-4">
            DevCollab Playground
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRun}
              disabled={isRunning}
            >
              <Play className="h-4 w-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center"
                >
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Copied!
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/30">
        {tabs.map((tab) => {
          const IconComponent = codeExamples[tab].icon
          return (
            <motion.button
              key={tab}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                  ? 'border-primary text-primary bg-background'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.button>
          )
        })}
      </div>

      {/* Code Editor */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <SyntaxHighlighter
              language={codeExamples[activeTab].language}
              style={isDark ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: 'transparent',
                fontSize: '14px',
                lineHeight: '1.5'
              }}
              showLineNumbers
              lineNumberStyle={{
                color: isDark ? '#6b7280' : '#9ca3af',
                paddingRight: '1rem'
              }}
            >
              {codeExamples[activeTab].code}
            </SyntaxHighlighter>

            {/* Running indicator */}
            {isRunning && (
              <motion.div
                className="absolute left-0 w-1 bg-primary rounded-r"
                style={{
                  top: `${2 + currentLine * 1.5}rem`,
                  height: '1.5rem'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* AI Suggestions Panel */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-muted/30 p-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">AI Analysis Results</span>
              </div>
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-green-600 dark:text-green-400"
                >
                  ✓ Code quality: Excellent
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="text-sm text-blue-600 dark:text-blue-400"
                >
                  💡 Suggestion: Consider using async/await for better readability
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="text-sm text-purple-600 dark:text-purple-400"
                >
                  🚀 Performance: Can be optimized by 15%
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default CodePlayground

