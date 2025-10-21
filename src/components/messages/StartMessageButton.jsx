import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import {
  setConversations,
  setActiveConversation,
} from '../../reducers/messagingReducer'
import { showNotification } from '../../reducers/notificationReducer'
import ConversationDetail from './ConversationDetail'
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
        const data = await messagingService.getUserConversations(user.id)
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

  return (
    <div style={styles.container}>
      {/* Liste des conversations */}
      <div style={styles.sidebar}>
        <h2 style={styles.title}>Messages</h2>

        <input
          type='text'
          placeholder='Rechercher une conversation...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />

        {loading ? (
          <p style={styles.loadingText}>Chargement...</p>
        ) : filteredConversations.length > 0 ? (
          <div style={styles.conversationsList}>
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => dispatch(setActiveConversation(conv.id))}
                style={{
                  ...styles.conversationItem,
                  backgroundColor:
                    activeConversationId === conv.id ? '#e7f3ff' : '#fff',
                  borderLeft:
                    activeConversationId === conv.id
                      ? '4px solid #1877f2'
                      : 'none',
                }}
              >
                <img
                  src={
                    conv.participantAvatar ||
                    'https://ui-avatars.com/api/?name=User'
                  }
                  alt='avatar'
                  style={styles.avatar}
                />

                <div style={styles.conversationInfo}>
                  <strong style={styles.participantName}>
                    {conv.participantName}
                  </strong>
                  <p style={styles.lastMessage}>
                    {conv.lastMessage || 'Aucun message'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span style={styles.unreadBadge}>{conv.unreadCount}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.emptyText}>
            {searchQuery
              ? 'Aucune conversation trouvée'
              : 'Aucune conversation pour le moment'}
          </p>
        )}
      </div>

      {/* Zone de chat */}
      <div style={styles.chatArea}>
        {activeConversation ? (
          <ConversationDetail conversation={activeConversation} />
        ) : (
          <div style={styles.emptyChat}>
            <p>Sélectionnez une conversation pour commencer à discuter</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    height: 'calc(100vh - 80px)',
    backgroundColor: '#fff',
  },
  sidebar: {
    width: '300px',
    borderRight: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  title: {
    padding: '15px',
    margin: 0,
    fontSize: '24px',
    fontWeight: 'bold',
    borderBottom: '1px solid #eee',
  },
  searchInput: {
    padding: '10px 15px',
    border: 'none',
    borderBottom: '1px solid #eee',
    fontSize: '13px',
    outline: 'none',
  },
  conversationsList: {
    flex: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  conversationInfo: {
    flex: 1,
    minWidth: 0,
    position: 'relative',
  },
  participantName: {
    display: 'block',
    fontSize: '13px',
    color: '#050505',
    marginBottom: '4px',
  },
  lastMessage: {
    fontSize: '12px',
    color: '#65676b',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  unreadBadge: {
    position: 'absolute',
    top: '10px',
    right: '0',
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
  loadingText: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
  },
  emptyText: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
    fontSize: '13px',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  emptyChat: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '16px',
  },
}

export default Messages
