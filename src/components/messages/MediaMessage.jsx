const MediaMessage = ({ mediaType, mediaUrl, mediaName, text }) => {
  // const formatFileSize = (bytes) => {
  //   if (bytes === 0) return '0 Bytes'
  //   const k = 1024
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB']
  //   const i = Math.floor(Math.log(bytes) / Math.log(k))
  //   return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  // }

  const getFileIcon = (type) => {
    if (type === 'document') return '📄'
    if (type === 'video') return '🎥'
    if (type === 'image') return '🖼️'
    return '📎'
  }

  if (mediaType === 'image' && mediaUrl) {
    return (
      <div style={styles.mediaContainer}>
        <img
          src={mediaUrl}
          alt='Image'
          style={styles.image}
          onClick={() => window.open(mediaUrl, '_blank')}
        />
        {text && <p style={styles.caption}>{text}</p>}
      </div>
    )
  }

  if (mediaType === 'video' && mediaUrl) {
    return (
      <div style={styles.mediaContainer}>
        <video src={mediaUrl} controls style={styles.video} />
        {text && <p style={styles.caption}>{text}</p>}
      </div>
    )
  }

  if (mediaType === 'document' && mediaUrl) {
    return (
      <div style={styles.mediaContainer}>
        <a
          href={mediaUrl}
          target='_blank'
          rel='noopener noreferrer'
          style={styles.documentLink}
        >
          <span style={styles.fileIcon}>{getFileIcon(mediaType)}</span>
          <div style={styles.fileInfo}>
            <span style={styles.fileName}>{mediaName || 'Document'}</span>
          </div>
        </a>
        {text && <p style={styles.caption}>{text}</p>}
      </div>
    )
  }

  return null
}

const styles = {
  mediaContainer: {
    marginTop: '4px',
  },
  image: {
    maxWidth: '250px',
    maxHeight: '250px',
    borderRadius: '8px',
    cursor: 'pointer',
    objectFit: 'cover',
  },
  video: {
    maxWidth: '250px',
    maxHeight: '250px',
    borderRadius: '8px',
  },
  caption: {
    margin: '4px 0 0 0',
    fontSize: '13px',
  },
  documentLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
  },
  fileIcon: {
    fontSize: '24px',
  },
  fileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  fileName: {
    fontSize: '13px',
    fontWeight: '500',
  },
}

export default MediaMessage
