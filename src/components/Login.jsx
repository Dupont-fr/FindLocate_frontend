import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { loginUser } from '../services/authService'
import { loginSuccess, loginFailure } from '../reducers/authReducer'
import { showNotification } from '../reducers/notificationReducer'
import { useNavigate } from 'react-router'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const user = await loginUser(email, password)
      dispatch(loginSuccess(user))

      //  Notification succès
      dispatch(showNotification('Success: Connexion réussie !', 4))
      navigate('/')
    } catch (err) {
      dispatch(loginFailure(err.message))

      //  Notification erreur
      dispatch(showNotification(`Error: ${err.message}`, 5))
    }
  }

  return (
    <div className='login-container'>
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email :
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Mot de passe :
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type='submit'>Se connecter</button>
      </form>
    </div>
  )
}

export default Login
