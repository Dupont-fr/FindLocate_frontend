import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createPostThunk } from '../reducers/postFormReducer'
import { useForm, useStepForm } from '../hooks'
import { showNotification } from '../reducers/notificationReducer'
import MediaUploader from './media/MediaUploader'
import { useNavigate } from 'react-router'

const PostForm = () => {
  const dispatch = useDispatch()
  const { loading, success } = useSelector((state) => state.postForm)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { step, next, prev, resetSteps } = useStepForm(3)
  const navigate = useNavigate()

  // Champs de texte
  const region = useForm('text')
  const ville = useForm('text')
  const quartier = useForm('text')
  const type = useForm('text')
  const content = useForm('text')
  const price = useForm('number')

  // Médias
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])

  // --- Validation des étapes ---
  const handleNextStep = () => {
    if (step === 1 && !content.inputProps.value.trim()) {
      dispatch(showNotification('Error: La description est obligatoire.', 5))
      return
    }

    if (
      step === 2 &&
      (!price.inputProps.value.trim() ||
        !region.inputProps.value.trim() ||
        !ville.inputProps.value.trim() ||
        !quartier.inputProps.value.trim() ||
        !type.inputProps.value.trim())
    ) {
      dispatch(
        showNotification(
          'Error: Veuillez remplir toutes les informations de localisation.',
          5
        )
      )
      return
    }

    next()
  }

  // --- Soumission du post ---
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!isAuthenticated || !user) {
      dispatch(showNotification('Error: Vous devez être connecté.', 5))
      return
    }

    if (
      !content.inputProps.value.trim() ||
      !region.inputProps.value.trim() ||
      !ville.inputProps.value.trim() ||
      !quartier.inputProps.value.trim() ||
      !type.inputProps.value.trim()
    ) {
      dispatch(showNotification('Error: Tous les champs sont obligatoires.', 5))
      return
    }

    if (images.length === 0 && videos.length === 0) {
      dispatch(
        showNotification(
          'Warning: Pensez à ajouter au moins une image ou une vidéo.',
          5
        )
      )
      return
    }

    const newPost = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      price: price.inputProps.value,

      userAvatar: user.profilePicture,
      content: content.inputProps.value,
      region: region.inputProps.value,
      ville: ville.inputProps.value,
      quartier: quartier.inputProps.value,
      type: type.inputProps.value,
      images,
      videos,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    }

    dispatch(createPostThunk(newPost))
    dispatch(showNotification('Success: Annonce publiée avec succès !', 5))
    navigate('/')

    // Réinitialisation complète
    resetSteps()
    price.reset()
    content.reset()
    region.reset()
    ville.reset()
    quartier.reset()
    type.reset()
    setImages([])
    setVideos([])
  }

  return (
    <div className='post-form'>
      <h3>Créer une annonce</h3>

      <form onSubmit={handleSubmit}>
        {/* === Étape 1 : Description === */}
        {step === 1 && (
          <div>
            <textarea
              {...content.inputProps}
              placeholder='Décrivez votre annonce...'
              required
              style={{
                width: '100%',
                minHeight: '100px',
                marginBottom: '10px',
              }}
            />
            <button type='button' onClick={handleNextStep}>
              Suivant
            </button>
          </div>
        )}

        {/* === Étape 2 : Localisation === */}
        {step === 2 && (
          <div>
            <input
              {...price.inputProps}
              placeholder='Prix (ex: 200 000 FCFA/mois)'
              required
            />
            <pre> </pre>

            <br />
            <input {...region.inputProps} placeholder='Région' required />
            <br />
            <input {...ville.inputProps} placeholder='Ville' required />
            <br />
            <input {...quartier.inputProps} placeholder='Quartier' required />
            <br />
            <select {...type.inputProps} required>
              <option value=''>Choisir le type</option>
              <option value='appartement'>Appartement</option>
              <option value='studio'>Studio</option>
              <option value='maison'>Maison</option>
              <option value='chambre'>Chambre</option>
            </select>
            <div style={{ marginTop: '10px' }}>
              <button type='button' onClick={prev}>
                Retour
              </button>
              <button type='button' onClick={handleNextStep}>
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* === Étape 3 : Médias === */}
        {step === 3 && (
          <div>
            <h4>Ajoutez vos médias</h4>
            <h5 style={{ fontSize: '14px', color: '#555' }}>
              Vous pouvez téléverser des images ou vidéos (max 10 images et 5
              vidéos)
            </h5>
            {/* Gestion via MediaUploader */}
            <MediaUploader
              onUploadComplete={(url) => setImages((prev) => [...prev, url])}
              maxFiles={10}
            />{' '}
            une image
            <br />
            <MediaUploader
              onUploadComplete={(url) => setVideos((prev) => [...prev, url])}
              maxFiles={5}
            />{' '}
            une video
            {/* Aperçu des images */}
            <div className='preview'>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt='preview'
                  width={90}
                  style={{ borderRadius: '8px', margin: 4 }}
                />
              ))}
            </div>
            <div style={{ marginTop: '10px' }}>
              <button type='button' onClick={prev}>
                Retour
              </button>
              <button
                type='submit'
                disabled={loading}
                style={{
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginLeft: '10px',
                }}
              >
                {loading ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </div>
        )}
      </form>

      {success && (
        <p style={{ color: 'green', marginTop: 10 }}>
          Annonce publiée avec succès !
        </p>
      )}
    </div>
  )
}

export default PostForm
