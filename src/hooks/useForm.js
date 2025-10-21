import { useState } from 'react'
import { uploadImageToCloudinary } from '../services/cloudinaryService'

export const useForm = (type = 'text') => {
  const [value, setValue] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onChange = async (e) => {
    if (type === 'file') {
      const file = e.target.files[0]
      if (!file) return

      setLoading(true)
      setError(null)
      setPreview(URL.createObjectURL(file)) // aperçu local immédiat

      try {
        const url = await uploadImageToCloudinary(file)
        setValue(url) // URL Cloudinary
      } catch (err) {
        console.error('Erreur upload Cloudinary:', err)
        setError('Échec du téléchargement de l’image.')
      } finally {
        setLoading(false)
      }
    } else {
      setValue(e.target.value)
    }
  }

  const reset = () => {
    setValue('')
    setPreview(null)
    setError(null)
  }

  // Pour les inputs normaux, on garde value ; pour les fichiers, on ne met pas "value"
  const inputProps =
    type === 'file'
      ? { type, onChange, accept: 'image/*' }
      : { type, value, onChange }

  return {
    inputProps, // à utiliser dans <input {...inputProps} />
    value, // utile si tu veux le récupérer directement
    preview, // aperçu image avant upload
    reset, // pour vider le champ
    loading, // état d’attente
    error, // message d’erreur Cloudinary
  }
}
