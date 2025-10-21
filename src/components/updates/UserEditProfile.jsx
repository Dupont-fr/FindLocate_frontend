import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { updateUser } from '../../services/userService'
import { showNotification } from '../../reducers/notificationReducer'
import { syncUserInfoThunk } from '../../reducers/postFormReducer'
import postService from '../../services/postService'
import MediaUploader from '../media/MediaUploader'

const UserEditProfile = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phonenumber: user?.phonenumber || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || '',
    password: user?.password || '',
  })

  const [uploading, setUploading] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleImageUpload = async (url) => {
    setForm({ ...form, profilePicture: url })
    dispatch(showNotification('Success: Photo de profil mise à jour !', 3))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 1. Mettre à jour l'utilisateur dans la base de données
      const updatedUser = await updateUser(user.id, form)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // 2. Synchroniser les infos dans Redux (pour la mise à jour instantanée du front)
      dispatch(
        syncUserInfoThunk(user.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          profilePicture: form.profilePicture,
        })
      )

      // 3. Synchroniser les infos dans la base de données (posts et commentaires)
      await postService.syncUserInfoInDatabase(
        user.id,
        form.firstName,
        form.lastName,
        form.profilePicture
      )

      dispatch(showNotification(' Profil mis à jour avec succès.', 4))
      navigate(`/user/${user.id}`)
    } catch (err) {
      console.error('Erreur de mise à jour :', err)
      dispatch(showNotification(' Erreur lors de la mise à jour.', 5))
    }
  }

  return (
    <div className='profile-edit' style={styles.container}>
      <h2 style={styles.title}>Modifier mes informations</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.avatarSection}>
          <img
            src={
              form.profilePicture ||
              'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            }
            alt='profil'
            style={styles.avatar}
          />
          <div>
            <p style={{ fontSize: 14, color: '#666' }}>Modifier la photo :</p>
            <MediaUploader
              onUploadComplete={handleImageUpload}
              setIsUploading={setUploading}
              maxFiles={1}
            />
          </div>
        </div>

        <label>Prénom</label>
        <input
          type='text'
          name='firstName'
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <label>Nom</label>
        <input
          type='text'
          name='lastName'
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <label>Adresse e-mail</label>
        <input
          type='email'
          name='email'
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Numéro de téléphone</label>
        <input
          type='tel'
          name='phonenumber'
          value={form.phonenumber}
          onChange={handleChange}
          placeholder='+237 6XX XXX XXX'
        />

        <label>Biographie</label>
        <textarea
          name='bio'
          value={form.bio}
          onChange={handleChange}
          rows='3'
          placeholder='Présentez-vous brièvement...'
        />

        <label>Mot de passe</label>
        <input
          type='password'
          name='password'
          value={form.password}
          onChange={handleChange}
          placeholder='********'
        />

        <button
          type='submit'
          disabled={uploading}
          style={{
            opacity: uploading ? 0.6 : 1,
            cursor: uploading ? 'not-allowed' : 'pointer',
          }}
        >
          {uploading ? 'Envoi en cours...' : '💾 Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '20px auto',
    background: '#fff',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#1877f2',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #1877f2',
  },
}

export default UserEditProfile
