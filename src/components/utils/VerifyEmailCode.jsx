import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import {
  verifyEmailCode,
  resendVerificationEmail,
} from '../../services/authService'
import { loginSuccess } from '../../reducers/authReducer'
import { showNotification } from '../../reducers/notificationReducer'
import Notification from '../Notification'
import './verify-email.css'

const VerifyEmailCode = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes en secondes
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef([])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // Redirection si pas d'email
  useEffect(() => {
    if (!email) {
      dispatch(
        showNotification('⚠ Session expirée. Veuillez vous réinscrire.', 5)
      )
      navigate('/register')
    }
  }, [email, navigate, dispatch])

  // Formater le temps restant
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Gérer la saisie du code
  const handleChange = (index, value) => {
    // Accepter uniquement les chiffres
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Vérification automatique si tous les champs sont remplis
    if (newCode.every((digit) => digit !== '') && value) {
      handleVerify(newCode.join(''))
    }
  }

  // Gérer la touche Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Gérer le collage de code
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)

    if (!/^\d+$/.test(pastedData)) {
      dispatch(
        showNotification('⚠ Le code doit contenir uniquement des chiffres', 5)
      )
      return
    }

    const newCode = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setCode(newCode)

    // Focus sur le dernier champ rempli
    const lastIndex = pastedData.length - 1
    inputRefs.current[Math.min(lastIndex + 1, 5)]?.focus()

    // Vérification automatique si code complet
    if (pastedData.length === 6) {
      handleVerify(pastedData)
    }
  }

  // Vérifier le code
  const handleVerify = async (codeToVerify) => {
    const fullCode = codeToVerify || code.join('')

    if (fullCode.length !== 6) {
      dispatch(showNotification('⚠ Le code doit contenir 6 chiffres', 5))
      return
    }

    setLoading(true)

    try {
      const response = await verifyEmailCode(email, fullCode)

      if (response.token) {
        dispatch(loginSuccess(response.user))
        dispatch(
          showNotification('✅ Email vérifié avec succès ! Bienvenue !', 4)
        )
        navigate('/')
      }
    } catch (error) {
      console.error('Erreur vérification:', error)

      if (error.message.includes('expiré')) {
        dispatch(
          showNotification('❌ Code expiré. Demandez un nouveau code.', 5)
        )
        setCanResend(true)
        setTimeLeft(0)
      } else if (error.message.includes('invalide')) {
        dispatch(
          showNotification('❌ Code invalide. Vérifiez et réessayez.', 5)
        )
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        dispatch(showNotification(`❌ ${error.message}`, 5))
      }
    } finally {
      setLoading(false)
    }
  }

  // Renvoyer le code
  const handleResend = async () => {
    if (!canResend) return

    setResending(true)

    try {
      const email = location.state?.email
      const role = location.state?.role || 'user' // Ajoutez ceci
      await resendVerificationEmail(email, role) 
      await resendVerificationEmail(email)
      dispatch(
        showNotification('✅ Un nouveau code a été envoyé à votre email', 4)
      )
      setTimeLeft(300) // Réinitialiser le timer
      setCanResend(false)
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (error) {
      console.error('Erreur renvoi code:', error)
      dispatch(showNotification(`❌ ${error.message}`, 5))
    } finally {
      setResending(false)
    }
  }

  // Masquer l'email partiellement
  const maskedEmail = email
    ? email.replace(/(.{2})(.)(@.)/, (match, start, middle, end) => {
        return start + '*'.repeat(middle.length) + end
      })
    : ''

  return (
    <div className='verify-email-container'>
      <Notification />

      <div className='verify-email-card'>
        {/* Icône */}
        <div className='verify-email-icon'>
          <svg width='80' height='80' viewBox='0 0 24 24' fill='none'>
            <path
              d='M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z'
              fill='#1877f2'
              opacity='0.1'
            />
            <path
              d='M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z'
              fill='#1877f2'
            />
          </svg>
        </div>

        {/* Titre */}
        <h1 className='verify-email-title'>Vérifiez votre adresse e-mail</h1>

        {/* Description */}
        <p className='verify-email-description'>
          Nous avons envoyé un code de vérification à 6 chiffres à :
        </p>
        <p className='verify-email-address'>{maskedEmail}</p>

        {/* Champs de saisie du code */}
        <div className='verify-code-inputs'>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type='text'
              inputMode='numeric'
              maxLength='1'
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`verify-code-input ${digit ? 'filled' : ''}`}
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Timer */}
        <div className='verify-timer'>
          {timeLeft > 0 ? (
            <>
              <span className='timer-icon'>⏱</span>
              <span>
                Ce code expirera dans <strong>{formatTime(timeLeft)}</strong>
              </span>
            </>
          ) : (
            <span className='timer-expired'>❌ Code expiré</span>
          )}
        </div>

        {/* Bouton Vérifier */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || code.some((d) => !d)}
          className='verify-submit-btn'
        >
          {loading ? (
            <>
              <span className='spinner'></span>
              Vérification...
            </>
          ) : (
            'Vérifier'
          )}
        </button>

        {/* Renvoyer le code */}
        <div className='verify-resend-section'>
          <p>Vous n'avez pas reçu le code ?</p>
          <button
            onClick={handleResend}
            disabled={!canResend || resending}
            className='verify-resend-btn'
          >
            {resending ? 'Envoi...' : 'Renvoyer le code'}
          </button>
        </div>

        {/* Lien retour */}
        <div className='verify-footer'>
          <p>
            Mauvais e-mail ?{' '}
            <a href='/register' className='verify-link'>
              S'inscrire à nouveau
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailCode
