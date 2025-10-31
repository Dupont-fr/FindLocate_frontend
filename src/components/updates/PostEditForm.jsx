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
          Bio:
          <textarea
            name='content'
            value={form.content}
            onChange={handleChange}
            placeholder='Description'
            required
          />
          Prix:{' '}
          <input
            name='price'
            value={form.price}
            onChange={handleChange}
            placeholder='Prix (ex: 200 000 FCFA/mois)'
            required
          />
          Region:
          <input
            name='region'
            value={form.region}
            onChange={handleChange}
            placeholder='Région'
          />
          Ville:
          <input
            name='ville'
            value={form.ville}
            onChange={handleChange}
            placeholder='Ville'
          />
          Quartier:
          <input
            name='quartier'
            value={form.quartier}
            onChange={handleChange}
            placeholder='Quartier'
          />
          Type:
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
          <p>Images actuelles:</p>
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
                    🗑️
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
            <button type='submit'> Enregistrer</button>
            <button type='button' onClick={onClose}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostEditForm
/* 💎 Style du formulaire d’édition de post */
const styles = `
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  animation: fadeInUp 0.3s ease;
  overflow-y: auto;
  max-height: 90vh;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #222;
  font-size: 1.5rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

form input,
form textarea,
form select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s ease;
}

form input:focus,
form textarea:focus,
form select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.1);
}

textarea {
  min-height: 80px;
  resize: vertical;
}

/* 📸 Grille des médias */
.edit-media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.media-preview {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eee;
}

.media-preview img,
.media-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-media-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.2s ease;
}

.remove-media-btn:hover {
  background: rgba(255,0,0,0.8);
}

/* 🧭 Boutons d’action */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.actions button {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.3s ease;
}

.actions button[type="submit"] {
  background: #007bff;
  color: white;
}

.actions button[type="submit"]:hover {
  background: #0056b3;
  transform: scale(1.03);
}

.actions button[type="button"] {
  background: #f0f0f0;
}

.actions button[type="button"]:hover {
  background: #ddd;
  transform: scale(1.03);
}

/* 🌟 Animation d’apparition */
@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 📱 Responsive */
@media (max-width: 480px) {
  .modal-content {
    padding: 18px;
    border-radius: 12px;
  }

  form input,
  form textarea,
  form select {
    font-size: 0.95rem;
  }

  .actions {
    flex-direction: column;
  }

  .actions button {
    width: 100%;
  }
}
`

// ✅ Injecter dynamiquement le style dans la page (aucune logique modifiée)
if (!document.getElementById('post-edit-form-style')) {
  const styleTag = document.createElement('style')
  styleTag.id = 'post-edit-form-style'
  styleTag.innerHTML = styles
  document.head.appendChild(styleTag)
}
