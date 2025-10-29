import { useState } from 'react'
import { forgotPassword } from '../../services/authService'
import { useDispatch } from 'react-redux'
import { showNotification } from '../../reducers/notificationReducer'
import { useNavigate } from 'react-router'
import Notification from '../Notification'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await forgotPassword(email)
      dispatch(
        showNotification('Password reset code sent! Check your email.', 5)
      )

      // Rediriger vers la page de saisie du code
      navigate('/verify-reset-code', { state: { email } })
    } catch (error) {
      dispatch(showNotification(`Error: ${error.message}`, 5))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='forgot-password-container'>
      <Notification />
      <h2>Forgot Password?</h2>
      <p>Enter your email address and we'll send you a reset code.</p>

      <form onSubmit={handleSubmit} className='forgot-password-form'>
        <label>Email:</label>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='your.email@example.com'
          required
        />

        <button type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Code'}
        </button>
      </form>

      <div className='form-footer'>
        <p>
          Remember your password? <a href='/login'>Login here</a>
        </p>
        <p>
          Don't have an account? <a href='/register'>Register here</a>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
