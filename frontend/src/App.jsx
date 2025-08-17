import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import OTPverification from './pages/OTPverification'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage isOpen={true} onClose={() => { }} />} />
        <Route path="/signup" element={<SignUpPage isOpen={true} onClose={() => { }} />} />
        <Route path="/forgot-password" element={<ForgotPassword isOpen={true} onClose={() => { }} />} />
        <Route path="/reset-password" element={<ResetPassword isOpen={true} onClose={() => { }} />} />
        <Route path="/otp-verification" element={<OTPverification isOpen={true} onClose={() => { }} email="user@example.com" />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  )
}

export default App
