import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { X, Mail, RefreshCw, ArrowLeft } from 'lucide-react'

const OTPverification = ({ isOpen, email }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const inputRefs = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    if (timeLeft <= 0) return

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, isOpen])

  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [isOpen])

  const handleInputChange = (index, value) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => navigate('/')}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-md mx-4"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-2xl p-6">
            {/* Header with Back and Close */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/signin')}
                className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300"
                aria-label="Back to Sign In"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex-1 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Verify your email
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  We sent a code to{' '}
                  <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 dark:bg-primary/30 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary dark:text-primary-light" />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-center block text-gray-700 dark:text-gray-300"
                htmlFor="otp-inputs"
              >
                Enter 6-digit verification code
              </label>
              <div className="flex justify-center space-x-2" id="otp-inputs">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-12 text-center text-lg font-bold border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center space-y-2 mt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Code expires in{' '}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatTime(timeLeft)}
                </span>
              </p>

              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary dark:text-primary-light"
                disabled={timeLeft > 0}
                onClick={() => alert('Resend code logic here')}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Resend code
              </Button>
            </div>

            <Button
              type="button"
              className="w-full mt-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white dark:text-black"
              disabled={otp.some((d) => d === '')}
              onClick={() => alert('Verify button clicked')}
            >
              Verify Email
            </Button>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Check your spam folder if you don't see the email.
                <br />
                Need help?{' '}
                <a
                  href="/support"
                  className="text-primary dark:text-primary-light hover:underline"
                >
                  Contact support
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default OTPverification
