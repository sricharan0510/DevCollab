import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { X, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const ResetPassword = ({ isOpen }) => {
    if (!isOpen) return null
    const navigate = useNavigate()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const getPasswordStrength = () => {
        let strength = 0
        if (password.length >= 8) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++
        return strength
    }

    const strength = getPasswordStrength()

    const getStrengthLabel = () => {
        if (strength <= 1) return "Weak"
        if (strength === 2 || strength === 3) return "Medium"
        if (strength >= 4) return "Strong"
    }

    const getStrengthColor = () => {
        if (strength <= 1) return "bg-red-500"
        if (strength === 2 || strength === 3) return "bg-yellow-500"
        if (strength >= 4) return "bg-green-500"
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => navigate('/')}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-md mx-4"
                >
                    <div className="bg-card border border-border rounded-xl shadow-2xl p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => navigate('/signin')}
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <h2 className="text-2xl font-bold">Reset Password</h2>
                                    <p className="text-muted-foreground">
                                        Enter your new password
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => navigate('/')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        className="pl-10 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Strength Meter */}
                                {password && (
                                    <div className="space-y-1 mt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${(strength / 4) * 100}%`,
                                                        backgroundColor: strength <= 1 
                                                            ? '#ef4444' 
                                                            : strength <= 3 
                                                                ? '#facc15' 
                                                                : '#22c55e'
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                    className="h-full rounded-full"
                                                />
                                            </div>
                                            <span className="text-sm ml-2 text-muted-foreground">
                                                {getStrengthLabel()}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {password.length < 8 && "At least 8 characters"}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        className="pl-10 pr-10"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-3 text-muted-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== password && (
                                    <p className="text-red-500 text-sm">Passwords do not match</p>
                                )}
                            </div>

                            <Button
                                className="w-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
                                disabled={!password || password !== confirmPassword}
                            >
                                Reset Password
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default ResetPassword