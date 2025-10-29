import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from './ui/button'
import { Card } from './ui/card'
import CommentSection from './comments/CommentSection'
import PostEditForm from './updates/PostEditForm'
import ConfirmDeleteModal from './updates/ConfirmDeleteModal'
import postService from '../services/postService'
import messagingService from '../services/MessagingService'
import { showNotification } from '../reducers/notificationReducer'
import {
  setActiveConversation,
  setConversations,
} from '../reducers/messagingReducer'
import LikeButton from './LikeButton'

const PostDetail = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { posts } = useSelector((state) => state.postForm)
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  // const { conversations } = useSelector((state) => state.messaging)

  const [post, setPost] = useState(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [showEdit, setShowEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const foundPost = posts.find((p) => String(p.id) === String(postId))

    if (foundPost) {
      setPost(foundPost)
    } else {
      const fetchPost = async () => {
        try {
          const response = await postService.getPostById(postId)
          setPost(response)
        } catch {
          dispatch(showNotification('Error: Annonce introuvable.', 5))
          navigate('/')
        }
      }
      fetchPost()
    }
  }, [postId, posts, navigate, dispatch])

  if (!post) {
    return (
      <div style={styles.loading}>
        <p>Chargement de l'annonce...</p>
        <Button onClick={() => navigate('/')}>Retour à l'accueil</Button>
      </div>
    )
  }

  const allMedia = [...(post.images || []), ...(post.videos || [])]
  const isOwner = isAuthenticated && user?.id === post.userId

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % allMedia.length)
  }

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + allMedia.length) % allMedia.length
    )
  }

  const handleDelete = async () => {
    try {
      await postService.deletePost(post.id)
      dispatch(showNotification('Success: Post supprimé avec succès.', 4))
      navigate('/')
    } catch {
      dispatch(showNotification('Error: Échec de la suppression.', 4))
    }
  }
  const handleStartConversation = async () => {
    if (!isAuthenticated) {
      dispatch(showNotification('Error: Vous devez être connecté.', 5))
      navigate('/login')
      return
    }

    if (user.id === post.userId) {
      dispatch(
        showNotification(
          'Error: Vous ne pouvez pas vous envoyer de messages.',
          5
        )
      )
      return
    }

    try {
      console.log(' Démarrage de la conversation...')
      console.log('User:', {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      console.log('Post:', { userId: post.userId, userName: post.userName })

      //  Étape 1 : Vérifier si une conversation existe déjà
      const existingConv = await messagingService.findExistingConversation(
        user.id,
        post.userId
      )

      if (existingConv) {
        console.log(' Conversation existante trouvée:', existingConv.id)
        dispatch(setActiveConversation(existingConv.id))
        navigate('/messages')
        return
      }

      console.log(" Création d'une nouvelle conversation...")

      //  AJOUT : On appelle directement createConversation avec les bons paramètres
      const createdConv = await messagingService.createConversation(
        post.userId,
        post.userName || 'Utilisateur inconnu',
        post.userAvatar ||
          `https://ui-avatars.com/api/?name=${post.userName || 'User'}`
      )

      console.log(' Conversation créée avec succès:', createdConv)

      //  Recharger toutes les conversations
      const allConversations = await messagingService.getUserConversations()
      dispatch(setConversations(allConversations))

      //  Activer la nouvelle conversation
      dispatch(setActiveConversation(createdConv.id))

      console.log(
        ' Navigation vers /messages avec conversation ID:',
        createdConv.id
      )

      navigate('/messages')
      dispatch(showNotification('success: Conversation créée avec succès !', 3))
    } catch (error) {
      console.error(' Erreur complète:', error)
      console.error(" Message d'erreur:", error.message)
      console.error(' Stack:', error.stack)
      dispatch(
        showNotification('Error: Impossible de démarrer la conversation.', 5)
      )
    }
  }

  const isVideo = (url) =>
    url.includes('.mp4') || url.includes('.webm') || url.includes('video')

  return (
    <div style={styles.container}>
      {/* Header avec retour */}
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Retour
      </button>

      <div style={styles.content}>
        {/* Galerie */}
        <div style={styles.mediaSection}>
          <Card style={styles.mediaCard}>
            {allMedia.length > 0 ? (
              <div style={styles.mediaGallery}>
                {isVideo(allMedia[currentMediaIndex]) ? (
                  <video
                    src={allMedia[currentMediaIndex]}
                    controls
                    style={styles.mediaItem}
                  />
                ) : (
                  <img
                    src={allMedia[currentMediaIndex]}
                    alt='property'
                    style={styles.mediaItem}
                  />
                )}

                {allMedia.length > 1 && (
                  <>
                    <button onClick={prevMedia} style={styles.navButtonLeft}>
                      ←
                    </button>
                    <button onClick={nextMedia} style={styles.navButtonRight}>
                      →
                    </button>
                    <div style={styles.mediaCounter}>
                      {currentMediaIndex + 1} / {allMedia.length}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div style={styles.noMedia}>Aucun média disponible</div>
            )}
          </Card>

          {/* Miniatures */}
          {allMedia.length > 1 && (
            <div style={styles.thumbnails}>
              {allMedia.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  style={{
                    ...styles.thumbnail,
                    border:
                      index === currentMediaIndex
                        ? '3px solid #1877f2'
                        : '1px solid #ddd',
                  }}
                >
                  {isVideo(media) ? (
                    <video src={media} style={styles.thumbnailImage} />
                  ) : (
                    <img src={media} alt='' style={styles.thumbnailImage} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div style={styles.infoSection}>
          {/* Prix */}
          <Card style={styles.infoCard}>
            <h1 style={styles.price}>
              {parseInt(post.price).toLocaleString()} FCFA
            </h1>
            <p style={styles.type}>{post.type}</p>
          </Card>

          {/* Localisation */}
          <Card style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Localisation</h2>
            <p style={styles.locationText}>
              📍 {post.quartier}, {post.ville}
            </p>
            <p style={styles.regionText}>{post.region}</p>
          </Card>

          {/* Description */}
          <Card style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Description</h2>
            <p style={styles.description}>{post.content}</p>
          </Card>

          {/* Détails */}
          <Card style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Détails</h2>
            <div style={styles.detailsGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Type</span>
                <span style={styles.detailValue}>{post.type}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Région</span>
                <span style={styles.detailValue}>{post.region}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Ville</span>
                <span style={styles.detailValue}>{post.ville}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Quartier</span>
                <span style={styles.detailValue}>{post.quartier}</span>
              </div>
            </div>
          </Card>

          {/* Propriétaire */}
          <Card style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Propriétaire</h2>
            <div style={styles.ownerInfo}>
              <img
                src={post.userAvatar}
                alt={post.userName}
                style={styles.ownerAvatar}
              />
              <div style={styles.ownerDetails}>
                <h3 style={styles.ownerName}>{post.userName}</h3>
                <p style={styles.ownerLabel}>Annonceur</p>
              </div>
            </div>

            <div style={styles.ownerActions}>
              <Link
                to={`/user/${post.userId}`}
                style={{ flex: 1, textDecoration: 'none' }}
              >
                <Button style={styles.viewProfileBtn}>👁️ Voir le profil</Button>
              </Link>

              {user?.id !== post.userId && (
                <Button
                  onClick={handleStartConversation}
                  style={styles.messageBtn}
                >
                  Discuter
                </Button>
              )}
            </div>
          </Card>

          {/* Actions propriétaire */}
          {isOwner && (
            <Card style={styles.infoCard}>
              <div style={styles.ownerModifyActions}>
                <Button
                  onClick={() => setShowEdit(true)}
                  style={styles.editBtn}
                >
                  Modifier
                </Button>
                <Button
                  onClick={() => setConfirmDelete(true)}
                  style={styles.deleteBtn}
                >
                  Supprimer
                </Button>
              </div>
            </Card>
          )}

          {/* Likes */}
          <Card style={styles.infoCard}>
            <div style={styles.likesSection}>
              <LikeButton post={post} />
            </div>
          </Card>

          {/* Commentaires */}
          <Card style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>
              Commentaires ({post.comments?.length || 0})
            </h2>
            <CommentSection post={post} />
          </Card>
        </div>
      </div>

      {/* Modales */}
      {showEdit && (
        <PostEditForm post={post} onClose={() => setShowEdit(false)} />
      )}
      {confirmDelete && (
        <ConfirmDeleteModal
          message='Voulez-vous vraiment supprimer ce post ?'
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
  },
  '@media (min-width: 768px)': {
    content: {
      gridTemplateColumns: '1.5fr 1fr',
    },
  },
  mediaSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mediaCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    padding: 0,
  },
  mediaGallery: {
    position: 'relative',
    width: '100%',
    height: '400px',
    backgroundColor: '#000',
  },
  mediaItem: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  noMedia: {
    height: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
  },
  navButtonLeft: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navButtonRight: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  mediaCounter: {
    position: 'absolute',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
  },
  thumbnails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '8px',
  },
  thumbnail: {
    width: '100%',
    height: '60px',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e5e5e5',
  },
  price: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2a8f2a',
    margin: 0,
  },
  type: {
    fontSize: '16px',
    color: '#666',
    margin: '8px 0 0 0',
    textTransform: 'capitalize',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#222',
  },
  locationText: {
    fontSize: '16px',
    color: '#333',
    margin: '0 0 4px 0',
  },
  regionText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#444',
    margin: 0,
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: '15px',
    color: '#333',
  },
  ownerInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginBottom: '16px',
  },
  ownerAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
  },
  ownerLabel: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },
  ownerActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  viewProfileBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  messageBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#25D366',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  ownerModifyActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  editBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  deleteBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  likesSection: {
    display: 'flex',
    alignItems: 'center',
  },
}

export default PostDetail
