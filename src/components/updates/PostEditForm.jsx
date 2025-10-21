// src/components/PostEditForm.jsx
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updatePostThunk } from '../../reducers/postFormReducer'
import { showNotification } from '../../reducers/notificationReducer'
import MediaUploader from '../media/MediaUploader'

const PostEditForm = ({ post, onClose }) => {
  const [form, setForm] = useState({
    content: post.content || '',
    region: post.region || '',
    ville: post.ville || '',
    quartier: post.quartier || '',
    type: post.type || '',
    price: post.price || '',
    images: post.images || [],
    videos: post.videos || [],
  })

  const dispatch = useDispatch()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  // 🔹 Supprimer une image existante
  const removeImage = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index)
    setForm({ ...form, images: updatedImages })
  }

  // 🔹 Supprimer une vidéo existante
  const removeVideo = (index) => {
    const updatedVideos = form.videos.filter((_, i) => i !== index)
    setForm({ ...form, videos: updatedVideos })
  }

  // 🔹 Ajouter une nouvelle image
  const handleImageUpload = (url) =>
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }))

  // 🔹 Ajouter une nouvelle vidéo
  const handleVideoUpload = (url) =>
    setForm((prev) => ({ ...prev, videos: [...prev.videos, url] }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedPost = { ...post, ...form }

    dispatch(updatePostThunk(post.id, updatedPost))
    dispatch(showNotification('✅ Post mis à jour avec succès.', 4))
    onClose()
  }

  return (
    <div className='modal'>
      <div className='modal-content'>
        <h3>Modifier votre annonce</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            name='content'
            value={form.content}
            onChange={handleChange}
            placeholder='Description'
            required
          />
          <input
            name='price'
            value={form.price}
            onChange={handleChange}
            placeholder='Prix (ex: 200 000 FCFA/mois)'
            required
          />
          <input
            name='region'
            value={form.region}
            onChange={handleChange}
            placeholder='Région'
          />
          <input
            name='ville'
            value={form.ville}
            onChange={handleChange}
            placeholder='Ville'
          />
          <input
            name='quartier'
            value={form.quartier}
            onChange={handleChange}
            placeholder='Quartier'
          />
          <select
            name='type'
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value=''>Choisir le type</option>
            <option value='appartement'>Appartement</option>
            <option value='studio'>Studio</option>
            <option value='maison'>Maison</option>
            <option value='chambre'>Chambre</option>
          </select>

          {/* 🔹 Aperçu des images existantes */}
          {form.images.length > 0 && (
            <div className='edit-media-grid'>
              {form.images.map((img, i) => (
                <div key={i} className='media-preview'>
                  <img src={img} alt={`img-${i}`} />
                  <button
                    type='button'
                    className='remove-media-btn'
                    onClick={() => removeImage(i)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 🔹 Ajouter de nouvelles images */}
          <MediaUploader
            onUploadComplete={handleImageUpload}
            maxFiles={10 - form.images.length}
          />

          {/* 🔹 Aperçu des vidéos existantes */}
          {form.videos.length > 0 && (
            <div className='edit-media-grid'>
              {form.videos.map((vid, i) => (
                <div key={i} className='media-preview'>
                  <video src={vid} controls />
                  <button
                    type='button'
                    className='remove-media-btn'
                    onClick={() => removeVideo(i)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 🔹 Ajouter de nouvelles vidéos */}
          <MediaUploader
            onUploadComplete={handleVideoUpload}
            maxFiles={5 - form.videos.length}
          />

          <div className='actions'>
            <button type='submit'>💾 Enregistrer</button>
            <button type='button' onClick={onClose}>
              ❌ Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostEditForm
