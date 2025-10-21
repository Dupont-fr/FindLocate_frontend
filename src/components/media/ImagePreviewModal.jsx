// src/components/ImagePreviewModal.jsx
import React from 'react'

const ImagePreviewModal = ({ mediaUrl, onClose }) => {
  if (!mediaUrl) return null

  const isVideo = mediaUrl.endsWith('.mp4') || mediaUrl.includes('video/upload')

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content'>
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            autoPlay
            style={{ maxWidth: '90%', maxHeight: '80%' }}
          />
        ) : (
          <img
            src={mediaUrl}
            alt='preview'
            style={{ maxWidth: '90%', maxHeight: '80%' }}
          />
        )}
      </div>
    </div>
  )
}

export default ImagePreviewModal
