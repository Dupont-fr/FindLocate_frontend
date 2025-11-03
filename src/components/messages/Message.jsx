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
import './Messages.css'

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

  const handleBackToList = () => {
    dispatch(setActiveConversation(null))
  }

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0
  )

  return (
    <div className='messages-container'>
      {/* Sidebar - Liste des conversations */}
      <div
        className={`conversations-sidebar ${
          activeConversation ? 'hide-mobile' : ''
        }`}
      >
        <div className='sidebar-header'>
          <h2 className='sidebar-title'>
            Messages
            {totalUnread > 0 && (
              <span className='total-unread-badge'>
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </h2>
        </div>

        <div className='search-container'>
          <input
            type='text'
            placeholder='Rechercher une conversation...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='search-input'
          />
        </div>

        <div className='conversations-list'>
          {loading ? (
            <div className='center-content'>
              <p className='loading-text'>Chargement...</p>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => dispatch(setActiveConversation(conv.id))}
                className={`conversation-item ${
                  activeConversationId === conv.id ? 'active' : ''
                } ${conv.unreadCount > 0 ? 'unread' : ''}`}
              >
                <div className='avatar-wrapper'>
                  <img
                    src={
                      conv.participantAvatar ||
                      'https://ui-avatars.com/api/?name=User'
                    }
                    alt='avatar'
                    className='conversation-avatar'
                  />
                  {conv.unreadCount > 0 && (
                    <span className='unread-badge'>
                      {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className='conversation-info'>
                  <div className='conversation-header'>
                    <strong className='participant-name'>
                      {conv.participantName}
                    </strong>
                    {conv.lastMessageTime && (
                      <span className='message-time'>
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
                  <p className='last-message'>
                    {conv.lastMessage || 'Aucun message'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className='center-content'>
              <p className='empty-text'>
                {searchQuery
                  ? 'Aucune conversation trouvée'
                  : 'Aucune conversation pour le moment'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className={`chat-area ${activeConversation ? 'show-mobile' : ''}`}>
        {activeConversation ? (
          <ConversationDetail
            conversation={activeConversation}
            onBack={handleBackToList}
          />
        ) : (
          <div className='empty-chat'>
            <div className='empty-chat-content'>
              <div className='empty-chat-icon'>💬</div>
              <h3>Sélectionnez une conversation</h3>
              <p>
                Choisissez une conversation dans la liste pour commencer à
                discuter
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages
