import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { showNotification } from '../reducers/notificationReducer'
import { useForm } from '../hooks/useForm'
import Notification from './Notification'
import { checkUserExists } from '../services/userService'
import { registerUser } from '../services/authService'
import { useNavigate } from 'react-router'
import MediaUploader from './media/MediaUploader'
import './utils/auth-styles.css'
import TermsModal from './utils/TermsModal'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const firstName = useForm('text')
  const lastName = useForm('text')
  const phonenumber = useForm('tel')
  const email = useForm('email')
  const password = useForm('password')
  const bio = useForm('text')

  const [profilePicture, setProfilePicture] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Validations
  const isFirstNameValid = firstName.value.trim().length >= 2
  const isLastNameValid = lastName.value.trim().length >= 2
  const isPhoneValid = phonenumber.value.trim().length >= 8
  const isEmailValid = /^\S+@\S+\.\S+$/.test(email.value)

  // Validations du mot de passe
  const hasMinLength = password.value.length >= 6
  const hasUpperCase = /[A-Z]/.test(password.value)
  const hasLowerCase = /[a-z]/.test(password.value)
  const hasNumber = /[0-9]/.test(password.value)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password.value)

  const isPasswordValid = hasMinLength

  const nextStep = () => {
    if (step === 1 && (!firstName.value.trim() || !lastName.value.trim())) {
      dispatch(
        showNotification('Warning: Please enter your first and last name.', 5)
      )
      return
    }
    if (step === 1 && (!isFirstNameValid || !isLastNameValid)) {
      dispatch(
        showNotification(
          'Warning: Names must be at least 2 characters long.',
          5
        )
      )
      return
    }
    if (step === 1 && !termsAccepted) {
      setShowTermsModal(true)
      return
    }
    if (
      step === 2 &&
      (!phonenumber.value.trim() ||
        !email.value.trim() ||
        !password.value.trim())
    ) {
      dispatch(
        showNotification('Warning: Please complete all contact info fields.', 5)
      )
      return
    }
    if (step === 2 && (!isPhoneValid || !isEmailValid || !isPasswordValid)) {
      dispatch(
        showNotification('Warning: Please meet all field requirements.', 5)
      )
      return
    }
    setStep((prev) => Math.min(prev + 1, 3))
  }
  const handleAcceptTerms = () => {
    setTermsAccepted(true)
    setShowTermsModal(false)
    setStep(2) // Passer à l'étape 2
    dispatch(
      showNotification(
        'Success: Conditions acceptées. Vous pouvez continuer.',
        3
      )
    )
  }
  const handleDeclineTerms = () => {
    setShowTermsModal(false)
    dispatch(
      showNotification(
        'Warning: Vous devez accepter les conditions pour créer un compte.',
        5
      )
    )
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!bio.value.trim() && !profilePicture) {
      dispatch(
        showNotification('Warning: Please add a bio or profile picture.', 5)
      )
      return
    }

    setLoading(true)

    try {
      // Vérifier les doublons
      const { emailExists, phoneExists } = await checkUserExists(
        email.value.trim(),
        phonenumber.value.trim()
      )

      if (emailExists) {
        dispatch(
          showNotification('Error: This email is already registered.', 5)
        )
        setLoading(false)
        return
      }
      if (phoneExists) {
        dispatch(
          showNotification('Error: This phone number is already used.', 5)
        )
        setLoading(false)
        return
      }

      const newUser = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        email: email.value.trim(),
        phonenumber: phonenumber.value.trim(),
        password: password.value.trim(),
        bio: bio.value.trim(),
        profilePicture:
          profilePicture ||
          'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      }

      // Inscription
      await registerUser(newUser)

      dispatch(
        showNotification(
          'Success: Registration complete! Check your email for the verification code.',
          5
        )
      )

      // Rediriger vers la page de vérification avec l'email
      navigate('/verify-email-code', { state: { email: email.value.trim() } })
    } catch (error) {
      dispatch(showNotification(`Error: ${error.message}`, 5))
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = (url) => {
    setProfilePicture(url)
  }

  return (
    <div className='register-container'>
      <Notification />
      <h2>Create Account</h2>
      <div className='register-progress'>
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`dot ${step === num ? 'active' : ''}`}
          ></div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='register-form'>
        {step === 1 && (
          <>
            <label>First Name:</label>
            <input {...firstName.inputProps} required />
            {firstName.value && (
              <div className='validation-indicator'>
                <span className={isFirstNameValid ? 'valid' : 'invalid'}>
                  {isFirstNameValid ? '✓' : '✗'} At least 2 characters
                </span>
              </div>
            )}

            <label>Last Name:</label>
            <input {...lastName.inputProps} required />
            {lastName.value && (
              <div className='validation-indicator'>
                <span className={isLastNameValid ? 'valid' : 'invalid'}>
                  {isLastNameValid ? '✓' : '✗'} At least 2 characters
                </span>
              </div>
            )}

            <button
              type='button'
              onClick={nextStep}
              disabled={!isFirstNameValid || !isLastNameValid}
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>Phone Number:</label>
            <input {...phonenumber.inputProps} required />
            {phonenumber.value && (
              <div className='validation-indicator'>
                <span className={isPhoneValid ? 'valid' : 'invalid'}>
                  {isPhoneValid ? '✓' : '✗'} At least 8 digits (
                  {phonenumber.value.length}/8)
                </span>
              </div>
            )}

            <label>Email:</label>
            <input {...email.inputProps} required />
            {email.value && (
              <div className='validation-indicator'>
                <span className={isEmailValid ? 'valid' : 'invalid'}>
                  {isEmailValid ? '✓' : '✗'} Valid email format
                </span>
              </div>
            )}

            <label>Password:</label>
            <div className='password-input-wrapper'>
              <input
                {...password.inputProps}
                type={showPassword ? 'text' : 'password'}
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

            {password.value && (
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
                    {hasSpecialChar ? '✓' : '✗'} One special character
                    (!@#$%...)
                  </li>
                </ul>
              </div>
            )}

            <div style={{ marginTop: '10px' }}>
              <button type='button' onClick={prevStep}>
                Back
              </button>
              <button
                type='button'
                onClick={nextStep}
                disabled={!isPhoneValid || !isEmailValid || !isPasswordValid}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <label>Bio:</label>
            <textarea
              {...bio.inputProps}
              placeholder='Tell us about yourself...'
            />
            {bio.value && (
              <div className='validation-indicator'>
                <span className={bio.value.length <= 500 ? 'valid' : 'invalid'}>
                  {bio.value.length <= 500 ? '✓' : '✗'} {bio.value.length}/500
                  characters
                </span>
              </div>
            )}

            <label>Profile Picture:</label>
            <MediaUploader
              onUploadComplete={handleUploadComplete}
              maxFiles={1}
              accept='image/*'
            />

            {profilePicture && (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <img
                  src={profilePicture}
                  alt='Profile Preview'
                  width={100}
                  style={{ borderRadius: '50%' }}
                />
                <div
                  className='validation-indicator'
                  style={{ marginTop: '10px' }}
                >
                  <span className='valid'>✓ Profile picture added</span>
                </div>
              </div>
            )}

            <div style={{ marginTop: '10px' }}>
              <button type='button' onClick={prevStep}>
                Back
              </button>
              <button type='submit' disabled={loading}>
                {loading ? 'Registering...' : 'Finish'}
              </button>
            </div>
          </>
        )}
        {showTermsModal && (
          <TermsModal
            onAccept={handleAcceptTerms}
            onDecline={handleDeclineTerms}
          />
        )}
      </form>
    </div>
  )
}

export default Register
