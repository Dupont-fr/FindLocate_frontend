import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUserThunk } from '../reducers/userFormReducer'
import { showNotification } from '../reducers/notificationReducer'
import { useForm } from '../hooks/useForm'
import Notification from './Notification'
import { checkUserExists } from '../services/userService'
import { useNavigate } from 'react-router'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, user } = useSelector((state) => state.userForm)

  const firstName = useForm('text')
  const lastName = useForm('text')
  const phonenumber = useForm('tel')
  const email = useForm('email')
  const password = useForm('password')
  const bio = useForm('text')
  const profilePicture = useForm('file')

  const [step, setStep] = useState(1)

  const nextStep = () => {
    if (step === 1 && (!firstName.value.trim() || !lastName.value.trim())) {
      dispatch(
        showNotification('Warning: Please enter your first and last name.', 5)
      )
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
    setStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Vérification si tous les champs sont remplis
    if (!bio.value.trim() && !profilePicture.value) {
      dispatch(
        showNotification('Warning: Please add a bio or profile picture.', 5)
      )
      return
    }

    // Vérifie si l'utilisateur existe déjà avant la création
    const { emailExists, phoneExists, passwordExists } = await checkUserExists(
      email.value.trim(),
      phonenumber.value.trim(),
      password.value.trim()
    )

    if (emailExists) {
      dispatch(showNotification('Error: This email is already registered.', 5))
      return
    }
    if (phoneExists) {
      dispatch(showNotification('Error: This phone number is already used.', 5))
      return
    }
    if (passwordExists) {
      dispatch(
        showNotification('Error: Please choose a different password.', 5)
      )
      return
    }

    // Création du nouvel utilisateur
    const newUser = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      phonenumber: phonenumber.value.trim(),
      password: password.value.trim(),
      bio: bio.value.trim(),
      profilePicture:
        profilePicture.value ||
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    }

    dispatch(createUserThunk(newUser))
    dispatch(showNotification('Success: Account created successfully!', 5))

    // Redirection vers la page de connexion
    navigate('/login')
  }

  // Réinitialisation après succès
  useEffect(() => {
    if (user) {
      firstName.reset()
      lastName.reset()
      email.reset()
      phonenumber.reset()
      password.reset()
      bio.reset()
      profilePicture.reset()
      setStep(1)
    }
  }, [user])

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
            <label>Last Name:</label>
            <input {...lastName.inputProps} required />
            <button type='button' onClick={nextStep}>
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>Phone Number:</label>
            <input {...phonenumber.inputProps} required />
            <label>Email:</label>
            <input {...email.inputProps} required />
            <label>Password:</label>
            <input {...password.inputProps} required />
            <div style={{ marginTop: '10px' }}>
              <button type='button' onClick={prevStep}>
                Back
              </button>
              <button type='button' onClick={nextStep}>
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
            <label>Profile Picture:</label>
            <input {...profilePicture.inputProps} />
            {profilePicture.preview && (
              <img
                src={profilePicture.preview}
                alt='preview'
                width={100}
                style={{ borderRadius: '50%' }}
              />
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
      </form>
    </div>
  )
}

export default Register
