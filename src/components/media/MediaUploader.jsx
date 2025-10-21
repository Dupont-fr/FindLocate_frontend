// // src/components/MediaUploader.jsx
// import { useEffect } from 'react'

// const MediaUploader = ({ onUploadComplete, maxFiles = 10 }) => {
//   useEffect(() => {
//     // Charger le script Cloudinary (une seule fois)
//     if (!window.cloudinary) {
//       const script = document.createElement('script')
//       script.src = 'https://upload-widget.cloudinary.com/global/all.js'
//       script.async = true
//       document.body.appendChild(script)
//     }
//   }, [])

//   const openWidget = () => {
//     if (!window.cloudinary) {
//       alert("Cloudinary n'est pas encore chargé.")
//       return
//     }

//     const widget = window.cloudinary.createUploadWidget(
//       {
//         cloudName: 'ddnolovmg', // ton nom Cloudinary
//         uploadPreset: 'findlocate_unsigned', // ton preset
//         multiple: true,
//         maxFiles: maxFiles,
//         resourceType: 'auto', // image ou vidéo
//         cropping: true, //  permet de recadrer
//         showAdvancedOptions: true,
//         maxFileSize: 10485760, // 10 Mo
//         folder: 'posts',
//         sources: ['local', 'camera', 'url'], // options
//       },
//       (error, result) => {
//         if (!error && result && result.event === 'success') {
//           console.log(' Upload réussi:', result.info.secure_url)
//           onUploadComplete(result.info.secure_url) // renvoie l’URL au parent
//         } else if (error) {
//           console.error(' Erreur upload:', error)
//         }
//       }
//     )

//     widget.open()
//   }

//   return (
//     <button
//       type='button'
//       onClick={openWidget}
//       style={{
//         backgroundColor: '#1877f2',
//         color: 'white',
//         border: 'none',
//         padding: '8px 16px',
//         borderRadius: '6px',
//         cursor: 'pointer',
//         marginTop: '10px',
//       }}
//     >
//       Ajouter
//     </button>
//   )
// }

// export default MediaUploader
// src/components/media/MediaUploader.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { showNotification } from '../../reducers/notificationReducer'
import { uploadImageToCloudinary } from '../../services/cloudinaryService'

const SCRIPT_URLS = [
  'https://upload-widget.cloudinary.com/latest/global/all.js',
  'https://widget.cloudinary.com/v2.0/global/all.js',
  'https://upload-widget.cloudinary.com/global/all.js',
]

const MediaUploader = ({
  onUploadComplete,
  maxFiles = 10,
  accept = 'image/*,video/*',
}) => {
  const dispatch = useDispatch()
  const [widgetReady, setWidgetReady] = useState(false)
  const [loadingScript, setLoadingScript] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const loadScript = (url) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
          // script déjà présent
          return resolve()
        }
        const s = document.createElement('script')
        s.src = url
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('load error'))
        // safety timeout
        setTimeout(() => {
          // si pas encore chargé après 10s, on rejette
          reject(new Error('timeout'))
        }, 10000)
        document.body.appendChild(s)
      })

    const tryLoad = async () => {
      setLoadingScript(true)
      for (const url of SCRIPT_URLS) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await loadScript(url)
          if (!mounted) return
          // vérifie que l'objet global attendu existe
          if (
            window.cloudinary &&
            typeof window.cloudinary.createUploadWidget === 'function'
          ) {
            setWidgetReady(true)
            dispatch(
              showNotification('Success: Cloudinary widget prêt.', 'info')
            )
            setLoadingScript(false)
            return
          }
          // sinon continue essayer suivant url
        } catch {
          // essaie la prochaine url
          // console.warn('script load fail', url, err)
        }
      }
      // si on arrive ici, aucune URL n'a fonctionné
      setLoadingScript(false)
      setWidgetReady(false)
      dispatch(
        showNotification(
          'Warning: Cloudinary widget indisponible — upload manuel activé.',
          5
        )
      )
    }

    tryLoad()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const openWidget = () => {
    if (!window.cloudinary || !window.cloudinary.createUploadWidget) {
      // fallback: ouvrir input file
      fileInputRef.current?.click()
      return
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'ddnolovmg', // adapte si besoin
        uploadPreset: 'findlocate_unsigned', // adapte ton preset
        multiple: true,
        maxFiles,
        resourceType: 'auto',
        cropping: true,
        showAdvancedOptions: true,
        folder: 'posts',
        sources: ['local', 'camera', 'url'],
      },
      (error, result) => {
        if (error) {
          console.error('Widget error', error)
          dispatch(showNotification(`Error: Erreur widget Cloudinary.`, 5))
          return
        }
        // résultat d'un upload réussi
        if (result && result.event === 'success' && result.info) {
          const url = result.info.secure_url || result.info.url
          onUploadComplete(url)
          dispatch(
            showNotification('Success: Fichier téléversé avec succès.', 3)
          )
        }
      }
    )
    widget.open()
  }

  // fallback manual upload via your existing service
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files).slice(0, maxFiles)
    if (!files.length) return
    dispatch(showNotification('Info: Téléversement en cours...', 2))
    try {
      for (const file of files) {
        const url = await uploadImageToCloudinary(file)
        onUploadComplete(url)
      }
      dispatch(
        showNotification('Success: Tous les fichiers ont été téléchargés.', 3)
      )
    } catch (err) {
      console.error('Upload manual error', err)
      dispatch(showNotification('Error: Échec du téléchargement.', 5))
    }
  }

  return (
    <div style={{ marginTop: 8 }}>
      <button
        type='button'
        onClick={openWidget}
        style={{
          backgroundColor: '#1877f2',
          color: '#fff',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 6,
          cursor: 'pointer',
        }}
      >
        {widgetReady ? ' Ajouter' : ' Ajouter'}
      </button>

      {/* input file caché pour fallback */}
      <input
        ref={fileInputRef}
        type='file'
        accept={accept}
        multiple
        style={{ display: 'none' }}
        onChange={handleFiles}
      />

      {loadingScript && (
        <span style={{ marginLeft: 10 }}>Chargement widget…</span>
      )}
      {!loadingScript && !widgetReady && (
        <div style={{ color: '#666', marginTop: 6, fontSize: 13 }}>
          Widget Cloudinary indisponible — l'upload manuel sera utilisé.
        </div>
      )}
    </div>
  )
}

export default MediaUploader
