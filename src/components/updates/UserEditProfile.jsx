import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { updateUser } from '../../services/userService'
import { showNotification } from '../../reducers/notificationReducer'
import { syncUserInfoThunk } from '../../reducers/postFormReducer'
import { loginSuccess } from '../../reducers/authReducer'
import postService from '../../services/postService'
import MediaUploader from '../media/MediaUploader'
import Notification from '../Notification'

const UserEditProfile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
  })

  const [uploading, setUploading] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Validations
  const isFirstNameValid = form.firstName.trim().length >= 2
  const isLastNameValid = form.lastName.trim().length >= 2
  const isBioValid = form.bio.length <= 500

  // Validations du nouveau mot de passe
  const hasMinLength = newPassword.length >= 6
  const hasUpperCase = /[A-Z]/.test(newPassword)
  const hasLowerCase = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
  const passwordsMatch =
    newPassword === confirmNewPassword && newPassword !== ''
  const isNewPasswordValid = hasMinLength && passwordsMatch

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageUpload = async (url) => {
    setForm({ ...form, profilePicture: url })
    dispatch(showNotification('Success: Profile picture updated!', 3))
  }

  // Dans UserEditProfile.jsx - Remplacer la fonction handleSubmit

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation avant soumission
    if (!isFirstNameValid || !isLastNameValid) {
      dispatch(
        showNotification('Error: Please meet all field requirements.', 5)
      )
      return
    }

    if (!isBioValid) {
      dispatch(
        showNotification('Error: Bio must not exceed 500 characters.', 5)
      )
      return
    }

    // Si l'utilisateur veut changer le mot de passe
    if (showPasswordSection) {
      if (!currentPassword) {
        dispatch(
          showNotification('Error: Please enter your current password.', 5)
        )
        return
      }
      if (!isNewPasswordValid) {
        dispatch(
          showNotification('Error: Please meet all password requirements.', 5)
        )
        return
      }
    }

    try {
      const updateData = {
        firstName: form.firstName,
        lastName: form.lastName,
        bio: form.bio,
        profilePicture: form.profilePicture,
      }

      // Si changement de mot de passe
      if (showPasswordSection && newPassword) {
        updateData.currentPassword = currentPassword
        updateData.newPassword = newPassword
      }

      console.log('📤 Envoi des données:', {
        ...updateData,
        currentPassword: '***',
        newPassword: '***',
      })

      // 1. Mettre à jour l'utilisateur dans la base de données
      const updatedUser = await updateUser(user.id, updateData)

      // 2. Mettre à jour localStorage et Redux
      localStorage.setItem('user', JSON.stringify(updatedUser))
      dispatch(loginSuccess(updatedUser))

      // 3. Synchroniser les infos dans Redux (pour la mise à jour instantanée du front)
      dispatch(
        syncUserInfoThunk(user.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          profilePicture: form.profilePicture,
        })
      )

      // 4. Synchroniser les infos dans la base de données (posts et commentaires)
      await postService.syncUserInfoInDatabase(
        user.id,
        form.firstName,
        form.lastName,
        form.profilePicture
      )

      dispatch(showNotification('Success: Profile updated successfully!', 4))

      // Réinitialiser les champs de mot de passe
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
      setShowPasswordSection(false)

      navigate(`/user/${user.id}`)
    } catch (err) {
      console.error('❌ Update error:', err)

      // Gestion détaillée des erreurs
      let errorMessage = 'Update failed'

      if (err.response) {
        // Le serveur a répondu avec un code d'erreur
        const status = err.response.status
        const backendError = err.response.data?.error

        console.log('📊 Status:', status)
        console.log('📋 Backend error:', backendError)

        if (status === 400) {
          if (backendError === 'Current password is incorrect') {
            errorMessage = 'Current password is incorrect. Please try again.'
          } else if (backendError?.includes('password')) {
            errorMessage = backendError
          } else {
            errorMessage = 'Invalid data provided. Please check your inputs.'
          }
        } else if (status === 401) {
          errorMessage = 'Session expired. Please log in again.'
        } else if (status === 403) {
          errorMessage = 'You do not have permission to update this profile.'
        } else if (status === 404) {
          errorMessage = 'User not found.'
        } else {
          errorMessage = backendError || 'An error occurred. Please try again.'
        }
      } else if (err.request) {
        // La requête a été envoyée mais pas de réponse
        errorMessage = 'Cannot reach the server. Please check your connection.'
      } else {
        // Erreur lors de la configuration de la requête
        errorMessage = err.message || 'An unexpected error occurred.'
      }

      dispatch(showNotification(`Error: ${errorMessage}`, 5))
    }
  }
  return (
    <div className='profile-edit' style={styles.container}>
      <Notification />
      <h2 style={styles.title}>✏️ Edit Profile</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.avatarSection}>
          <img
            src={
              form.profilePicture ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt='profile'
            style={styles.avatar}
          />
          <div>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
              Change profile picture:
            </p>
            <MediaUploader
              onUploadComplete={handleImageUpload}
              setIsUploading={setUploading}
              maxFiles={1}
              accept='image/*'
            />
          </div>
        </div>

        <label style={styles.label}>First Name</label>
        <input
          type='text'
          name='firstName'
          value={form.firstName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {form.firstName && (
          <div className='validation-indicator'>
            <span className={isFirstNameValid ? 'valid' : 'invalid'}>
              {isFirstNameValid ? '✓' : '✗'} At least 2 characters
            </span>
          </div>
        )}

        <label style={styles.label}>Last Name</label>
        <input
          type='text'
          name='lastName'
          value={form.lastName}
          onChange={handleChange}
          style={styles.input}
          required
        />
        {form.lastName && (
          <div className='validation-indicator'>
            <span className={isLastNameValid ? 'valid' : 'invalid'}>
              {isLastNameValid ? '✓' : '✗'} At least 2 characters
            </span>
          </div>
        )}

        <label style={styles.label}>Email (read-only)</label>
        <input
          type='email'
          value={user?.email || ''}
          style={{
            ...styles.input,
            backgroundColor: '#f0f0f0',
            cursor: 'not-allowed',
          }}
          disabled
        />
        <p style={{ fontSize: 12, color: '#666', marginTop: -8 }}>
          📧 Email cannot be changed for security reasons
        </p>

        <label style={styles.label}>Phone Number (read-only)</label>
        <input
          type='tel'
          value={user?.phonenumber || ''}
          style={{
            ...styles.input,
            backgroundColor: '#f0f0f0',
            cursor: 'not-allowed',
          }}
          disabled
        />
        <p style={{ fontSize: 12, color: '#666', marginTop: -8 }}>
          📱 Phone number cannot be changed
        </p>

        <label style={styles.label}>Bio</label>
        <textarea
          name='bio'
          value={form.bio}
          onChange={handleChange}
          rows='3'
          style={styles.textarea}
          placeholder='Tell us about yourself...'
        />
        {form.bio && (
          <div className='validation-indicator'>
            <span className={isBioValid ? 'valid' : 'invalid'}>
              {isBioValid ? '✓' : '✗'} {form.bio.length}/500 characters
            </span>
          </div>
        )}

        {/* Section Changement de mot de passe */}
        <div style={styles.passwordSection}>
          <button
            type='button'
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            style={styles.togglePasswordButton}
          >
            {showPasswordSection
              ? '🔒 Cancel Password Change'
              : '🔐 Change Password'}
          </button>

          {showPasswordSection && (
            <div style={styles.passwordFields}>
              <label style={styles.label}>Current Password</label>
              <div className='password-input-wrapper'>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={styles.input}
                  placeholder='Enter current password'
                  required
                />
                <button
                  type='button'
                  className='toggle-password'
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <label style={styles.label}>New Password</label>
              <div className='password-input-wrapper'>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  placeholder='Enter new password'
                  required
                />
                <button
                  type='button'
                  className='toggle-password'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <label style={styles.label}>Confirm New Password</label>
              <div className='password-input-wrapper'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  style={styles.input}
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
                      {hasSpecialChar ? '✓' : '✗'} One special character
                      (!@#$%...)
                    </li>
                  </ul>
                </div>
              )}

              {confirmNewPassword && (
                <div className='validation-indicator' style={{ marginTop: 10 }}>
                  <span className={passwordsMatch ? 'valid' : 'invalid'}>
                    {passwordsMatch ? '✓' : '✗'} Passwords match
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type='submit'
          disabled={
            uploading || !isFirstNameValid || !isLastNameValid || !isBioValid
          }
          style={{
            ...styles.submitButton,
            opacity:
              uploading || !isFirstNameValid || !isLastNameValid || !isBioValid
                ? 0.6
                : 1,
            cursor:
              uploading || !isFirstNameValid || !isLastNameValid || !isBioValid
                ? 'not-allowed'
                : 'pointer',
          }}
        >
          {uploading ? '⏳ Uploading...' : '💾 Save Changes'}
        </button>

        <button
          type='button'
          onClick={() => navigate(`/user/${user.id}`)}
          style={styles.cancelButton}
        >
          ❌ Cancel
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '20px auto',
    background: '#fff',
    padding: 30,
    borderRadius: 12,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    color: '#1877f2',
    fontSize: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 15,
    padding: 15,
    background: '#f8f9fa',
    borderRadius: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #1877f2',
  },
  label: {
    fontWeight: 600,
    color: '#333',
    marginBottom: 5,
    marginTop: 5,
  },
  input: {
    padding: 12,
    border: '2px solid #e1e8ed',
    borderRadius: 8,
    fontSize: 14,
    transition: 'all 0.3s ease',
  },
  textarea: {
    padding: 12,
    border: '2px solid #e1e8ed',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.3s ease',
  },
  passwordSection: {
    marginTop: 20,
    padding: 15,
    background: '#f8f9fa',
    borderRadius: 10,
  },
  togglePasswordButton: {
    width: '100%',
    padding: 12,
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  passwordFields: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  submitButton: {
    padding: 15,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: 10,
  },
  cancelButton: {
    padding: 12,
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
}

export default UserEditProfile
