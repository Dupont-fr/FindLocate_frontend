import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { Badge } from './ui/badge'
import { showNotification } from '../reducers/notificationReducer'
import Notification from './Notification'

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const likesCount = post.likes?.length || 0
  const hasLiked = post.likes?.some((l) => l.userId === user?.id)

  const handleCardClick = (e) => {
    // Naviguer vers les détails du post
    e.preventDefault()
    navigate(`/post/${post.id}`)
  }

  const handleLikeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (!user) {
      // alert('Vous devez être connecté pour aimer un post')
      dispatch(
        showNotification('Vous devez être connecté pour aimer un post !', 5)
      )
      return
    }

    // Dispatch l'action de like
    import('../reducers/likeReducer').then(({ toggleLikeThunk }) => {
      dispatch(toggleLikeThunk(post, user))
    })
  }

  return (
    <div onClick={handleCardClick} style={styles.card}>
      <Notification />
      {/* Image principale avec bouton like flottant */}
      <div style={styles.imageContainer}>
        {post.images?.length > 0 ? (
          <img src={post.images[0]} alt='property' style={styles.image} />
        ) : post.videos?.length > 0 ? (
          <video src={post.videos[0]} style={styles.image} preload='metadata' />
        ) : (
          <div style={styles.noImage}>Aucune image</div>
        )}

        {/* Bouton Like flottant */}
        <button
          onClick={handleLikeClick}
          style={{
            ...styles.likeButton,
            color: hasLiked ? '#ff4d4d' : '#fff',
          }}
          title={hasLiked ? 'Vous aimez' : "J'aime"}
        >
          <span style={{ fontSize: '20px' }}>{hasLiked ? '❤️' : '🤍'}</span>
        </button>

        {/* Badge du nombre de médias */}
        {(post.images?.length > 1 || post.videos?.length > 0) && (
          <Badge style={styles.mediaBadge}>
            📷 {(post.images?.length || 0) + (post.videos?.length || 0)}
          </Badge>
        )}

        {/* Prix Tag */}
        {post.price && (
          <div style={styles.priceTag}>
            {parseInt(post.price).toLocaleString()} FCFA
          </div>
        )}
      </div>

      {/* Informations */}
      <div style={styles.infoSection}>
        <h3 style={styles.title}>
          {post.type || 'Logement'} à {post.ville}
        </h3>

        <p style={styles.location}>
          📍 {post.quartier}, {post.region}
        </p>

        <div style={styles.footer}>
          <div
            style={styles.authorInfo}
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/user/${post.userId}`)
            }}
          >
            <img
              src={post.userAvatar || 'https://ui-avatars.com/api/?name=User'}
              alt={post.userName}
              style={styles.avatar}
            />
            <span style={styles.authorName}>{post.userName}</span>
          </div>

          <div style={styles.stats} onClick={(e) => e.stopPropagation()}>
            <span style={styles.statItem}>❤️ {likesCount}</span>
            <span style={styles.statItem}>💬 {post.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: '#e8f5ffff',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e5e5e5',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '250px',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '14px',
  },
  likeButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    zIndex: 10,
  },
  mediaBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
  },
  priceTag: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    backgroundColor: '#1877f2',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  infoSection: {
    padding: '16px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222',
    margin: '0 0 8px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  location: {
    fontSize: '13px',
    color: '#666',
    margin: '0 0 12px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0',
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  authorName: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#444',
  },
  stats: {
    display: 'flex',
    gap: '12px',
  },
  statItem: {
    fontSize: '13px',
    color: '#666',
  },
}

export default PostCard
