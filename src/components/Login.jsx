import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../services/authService'
import { loginSuccess, loginFailure } from '../reducers/authReducer'
import { showNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router'
import Notification from './Notification'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  // Validation email
  const isEmailValid = /^\S+@\S+\.\S+$/.test(email)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const user = await loginUser(email, password)
      dispatch(loginSuccess(user))
      dispatch(showNotification('Success: Login successful!', 4))
      navigate('/')
    } catch (err) {
      dispatch(loginFailure(err.message))

      // Vérifier si l'erreur est liée à la vérification email
      if (err.needsVerification) {
        dispatch(
          showNotification(
            'Please verify your email before logging in. Check your inbox.',
            6
          )
        )
        setTimeout(() => {
          navigate('/verify-email-code', { state: { email } })
        }, 2000)
      } else {
        dispatch(showNotification(`Error: ${err.message}`, 5))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-container'>
      <Notification />
      <h2>Login</h2>

      <form onSubmit={handleSubmit} className='login-form'>
        <label>
          Email:
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='your.email@example.com'
            required
          />
        </label>

        {email && (
          <div className='validation-indicator'>
            <span className={isEmailValid ? 'valid' : 'invalid'}>
              {isEmailValid ? '✓' : '✗'} Valid email format
            </span>
          </div>
        )}

        <label>
          Password:
          <input
            // type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            type={showPassword ? 'text' : 'password'}
            required
          />
        </label>
        <button
          type='button'
          className='toggle-password'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>

        {password && (
          <div className='password-requirements'>
            <h4>Password Requirements:</h4>
            <ul>
              <li className={password.length >= 6 ? 'valid' : 'invalid'}>
                {password.length >= 6 ? '✓' : '✗'} At least 6 characters
              </li>
            </ul>
          </div>
        )}

        <div className='forgot-password-link'>
          <a href='/forgot-password'>Forgot password?</a>
        </div>

        <button
          type='submit'
          disabled={loading || !isEmailValid || password.length < 6}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className='form-footer'>
        <p>
          Don't have an account? <a href='/register'>Register here</a>
        </p>
      </div>
    </div>
  )
}

export default Login
