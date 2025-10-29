import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  verifyResetCode,
  forgotPassword,
  resetPassword,
} from '../../services/authService'
import { showNotification } from '../../reducers/notificationReducer'
import { useNavigate, useLocation } from 'react-router'
import Notification from '../Notification'

const VerifyResetCode = () => {
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState(1) // 1: enter code, 2: enter new password
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Récupérer l'email passé depuis ForgotPassword
  const email = location.state?.email || ''

  // Validations du mot de passe
  const hasMinLength = newPassword.length >= 6
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasLowerCase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  const passwordsMatch = newPassword === confirmPassword && newPassword !== ''

  const isPasswordValid = hasMinLength && passwordsMatch

  const handleVerifyCode = async (e) => {
    e.preventDefault()

    if (code.length !== 6) {
      dispatch(showNotification('Please enter a valid 6-digit code', 5))
      return
    }

    setLoading(true)

    try {
      await verifyResetCode(email, code)
      dispatch(showNotification('Code verified! Enter your new password.', 5))
      setStep(2) // Passer à l'étape de nouveau mot de passe
    } catch (error) {
      dispatch(showNotification(`Error: ${error.message}`, 5))
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!isPasswordValid) {
      dispatch(showNotification('Please meet all password requirements', 5))
      return
    }

    setLoading(true)

    try {
      await resetPassword(email, code, newPassword)
      dispatch(
        showNotification('Success: Password reset! You can now login.', 5)
      )
      navigate('/login')
    } catch (error) {
      dispatch(showNotification(`Error: ${error.message}`, 5))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      dispatch(showNotification('Email address not found.', 5))
      navigate('/forgot-password')
      return
    }

    setResending(true)

    try {
      await forgotPassword(email)
      dispatch(showNotification('New reset code sent! Check your email.', 5))
      setCode('') // Réinitialiser le champ
    } catch (error) {
      dispatch(showNotification(`Error: ${error.message}`, 5))
    } finally {
      setResending(false)
    }
  }

  if (step === 1) {
    return (
      <div className='verify-code-container'>
        <Notification />
        <div className='email-icon'>🔐</div>
        <h2>Enter Reset Code</h2>
        <p>We've sent a 6-digit reset code to:</p>
        <p className='email-display'>
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerifyCode} className='verify-code-form'>
          <label>Enter Reset Code:</label>
          <input
            type='text'
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            placeholder='000000'
            maxLength={6}
            className='code-input'
            required
          />

          {code && (
            <div className='validation-indicator'>
              <span className={code.length === 6 ? 'valid' : 'invalid'}>
                {code.length === 6 ? '✓' : '✗'} 6 digits required ({code.length}
                /6)
              </span>
            </div>
          )}

          <div className='warning-box'>
            <strong>⏰ Important:</strong> This code will expire in 5 minutes.
          </div>

          <button type='submit' disabled={loading || code.length !== 6}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className='resend-section'>
          <p>Didn't receive the code?</p>
          <button
            onClick={handleResendCode}
            disabled={resending}
            className='resend-code-button'
          >
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        <div className='form-footer'>
          <p>
            Remember your password? <a href='/login'>Login here</a>
          </p>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className='reset-password-container'>
        <Notification />
        <h2>Create New Password</h2>
        <p>Enter your new password below.</p>

        <form onSubmit={handleResetPassword} className='reset-password-form'>
          <label>New Password:</label>
          <div className='password-input-wrapper'>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password'
              required
            />
            <button
              type='button'
              className='toggle-password'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          <label>Confirm Password:</label>
          <div className='password-input-wrapper'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm new password'
              required
            />
            <button
              type='button'
              className='toggle-password'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {newPassword && (
            <div className='password-requirements'>
              <h4>Password Requirements:</h4>
              <ul>
                <li className={hasMinLength ? 'valid' : 'invalid'}>
                  {hasMinLength ? '✓' : '✗'} At least 6 characters
                </li>
                <li className={hasUpperCase ? 'valid' : 'invalid'}>
                  {hasUpperCase ? '✓' : '✗'} One uppercase letter (A-Z)
                </li>
                <li className={hasLowerCase ? 'valid' : 'invalid'}>
                  {hasLowerCase ? '✓' : '✗'} One lowercase letter (a-z)
                </li>
                <li className={hasNumber ? 'valid' : 'invalid'}>
                  {hasNumber ? '✓' : '✗'} One number (0-9)
                </li>
                <li className={hasSpecialChar ? 'valid' : 'invalid'}>
                  {hasSpecialChar ? '✓' : '✗'} One special character (!@#$%...)
                </li>
              </ul>
            </div>
          )}

          {confirmPassword && (
            <div className='validation-indicator' style={{ marginTop: '10px' }}>
              <span className={passwordsMatch ? 'valid' : 'invalid'}>
                {passwordsMatch ? '✓' : '✗'} Passwords match
              </span>
            </div>
          )}

          <button type='submit' disabled={loading || !isPasswordValid}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    )
  }

  return null
}

export default VerifyResetCode
