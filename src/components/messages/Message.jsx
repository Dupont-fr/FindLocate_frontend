import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { showNotification } from '../../reducers/notificationReducer'
import ConversationDetail from './ConversationDetail'
import {
  setActiveConversation,
  setConversations,
} from '../../reducers/messagingReducer'
import messagingService from '../../services/MessagingService'

const Messages = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { conversations, activeConversationId } = useSelector(
    (state) => state.messaging
  )
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true)
        const data = await messagingService.getUserConversations()
        dispatch(setConversations(data))
      } catch (error) {
        console.error('Erreur:', error)
        dispatch(
          showNotification('Error: Impossible de charger les messages.', 5)
        )
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchConversations()
    }
  }, [user?.id, dispatch])

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  )

  if (!user) {
    navigate('/login')
    return null
  }

  // ✅ Fonction pour revenir à la liste
  const handleBackToList = () => {
    dispatch(setActiveConversation(null))
  }

  // ✅ Si une conversation est active, afficher SEULEMENT la conversation
  if (activeConversation) {
    console.log('📱 Affichage de la conversation avec onBack') // DEBUG
    return (
      <div style={styles.fullScreen}>
        <ConversationDetail
          conversation={activeConversation}
          onBack={handleBackToList}
        />
      </div>
    )
  }

  // ✅ Sinon, afficher SEULEMENT la liste des conversations
  return (
    <div style={styles.fullScreen}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Messages</h2>
      </div>

      {/* Barre de recherche */}
      <div style={styles.searchContainer}>
        <input
          type='text'
          placeholder='Rechercher une conversation...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Liste des conversations */}
      <div style={styles.conversationsList}>
        {loading ? (
          <div style={styles.centerContent}>
            <p style={styles.loadingText}>Chargement...</p>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => dispatch(setActiveConversation(conv.id))}
              style={styles.conversationItem}
            >
              <div style={styles.avatarWrapper}>
                <img
                  src={
                    conv.participantAvatar ||
                    'https://ui-avatars.com/api/?name=User'
                  }
                  alt='avatar'
                  style={styles.avatar}
                />
                {conv.unreadCount > 0 && (
                  <span style={styles.unreadBadge}>{conv.unreadCount}</span>
                )}
              </div>

              <div style={styles.conversationInfo}>
                <div style={styles.conversationHeader}>
                  <strong style={styles.participantName}>
                    {conv.participantName}
                  </strong>
                  {conv.lastMessageTime && (
                    <span style={styles.time}>
                      {new Date(conv.lastMessageTime).toLocaleTimeString(
                        'fr-FR',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </span>
                  )}
                </div>
                <p style={styles.lastMessage}>
                  {conv.lastMessage || 'Aucun message'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.centerContent}>
            <p style={styles.emptyText}>
              {searchQuery
                ? 'Aucune conversation trouvée'
                : 'Aucune conversation pour le moment'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  fullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: '#1877f2',
    borderBottom: '1px solid #e0e0e0',
    position: 'relative', // ✅ Permet d'utiliser le z-index
    zIndex: 2, // ✅ S’assure que ce soit visible au-dessus des autres éléments
    marginTop: '70px', // ✅ Ajuste cette valeur selon la hauteur de ta navbar
  },
  title: {
    margin: 0,
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
  },
  searchInput: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  conversationsList: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px 20px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  avatarWrapper: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#1877f2',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  participantName: {
    fontSize: '16px',
    color: '#050505',
    fontWeight: '600',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  time: {
    fontSize: '12px',
    color: '#65676b',
    flexShrink: 0,
    marginLeft: '10px',
  },
  lastMessage: {
    margin: 0,
    fontSize: '14px',
    color: '#65676b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  centerContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  loadingText: {
    color: '#999',
    fontSize: '14px',
    margin: 0,
  },
  emptyText: {
    color: '#999',
    fontSize: '14px',
    textAlign: 'center',
    margin: 0,
  },
}

export default Messages
