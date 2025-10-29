import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  verifyEmailCode,
  resendVerificationEmail,
} from '../../services/authService'
import { showNotification } from '../../reducers/notificationReducer'
import { loginSuccess } from '../../reducers/authReducer'
import { useNavigate, useLocation } from 'react-router'
import Notification from '../Notification'

const VerifyEmailCode = () => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Récupérer l'email passé depuis Register
  const email = location.state?.email || ''

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (code.length !== 6) {
      dispatch(showNotification('Please enter a valid 6-digit code', 5))
      return
    }

    setLoading(true)

    try {
      const data = await verifyEmailCode(email, code)

      // Connexion automatique après vérification
      dispatch(loginSuccess(data.user))
      dispatch(
        showNotification('Success: Email verified! Welcome to FindLocate!', 5)
      )
      navigate('/')
    } catch (error) {
      dispatch(showNotification(`Error: ${error.message}`, 5))
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      dispatch(
        showNotification('Email address not found. Please register again.', 5)
      )
      navigate('/register')
      return
    }

    setResending(true)

    try {
      await resendVerificationEmail(email)
      dispatch(
        showNotification('New verification code sent! Check your email.', 5)
      )
      setCode('') // Réinitialiser le champ
    } catch (error) {
      dispatch(showNotification(`Error: ${error.message}`, 5))
    } finally {
      setResending(false)
    }
  }

  return (
    <div className='verify-code-container'>
      <Notification />
      <div className='email-icon'>📧</div>
      <h2>Verify Your Email</h2>
      <p>We've sent a 6-digit verification code to:</p>
      <p className='email-display'>
        <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit} className='verify-code-form'>
        <label>Enter Verification Code:</label>
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

        <div className='warning-box'>
          <strong>⏰ Important:</strong> This code will expire in 5 minutes.
        </div>

        <button type='submit' disabled={loading || code.length !== 6}>
          {loading ? 'Verifying...' : 'Verify Email'}
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
          Wrong email? <a href='/register'>Register again</a>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailCode
