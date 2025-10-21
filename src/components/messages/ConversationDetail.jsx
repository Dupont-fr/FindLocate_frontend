import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addMessage } from '../../reducers/messagingReducer'
import messagingService from '../../services/MessagingService'
import { showNotification } from '../../reducers/notificationReducer'

const ConversationDetail = ({ conversation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const messages = conversation.messages || []

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim()) return

    setLoading(true)
    try {
      const newMessage = {
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`,
        senderAvatar: user.profilePicture,
        text: messageText,
      }

      await messagingService.addMessage(conversation.id, newMessage)

      dispatch(
        addMessage({
          conversationId: conversation.id,
          message: newMessage,
        })
      )

      setMessageText('')
      dispatch(showNotification('Success: Message envoyé.', 3))
    } catch (error) {
      console.error('Erreur:', error)
      dispatch(showNotification("Error: Echec de l'envoi du message.", 5))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* En-tête */}
      <div style={styles.header}>
        <img
          src={
            conversation.participantAvatar ||
            'https://ui-avatars.com/api/?name=User'
          }
          alt='avatar'
          style={styles.headerAvatar}
        />
        <h3 style={styles.headerTitle}>{conversation.participantName}</h3>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.emptyMessages}>
            <p>Aucun message pour le moment. Commencez la conversation !</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.messageWrapper,
                justifyContent:
                  msg.senderId === user.id ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.message,
                  backgroundColor:
                    msg.senderId === user.id ? '#0084ff' : '#f0f0f0',
                  color: msg.senderId === user.id ? '#fff' : '#050505',
                }}
              >
                <p style={styles.messageText}>{msg.text}</p>
                <small style={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type='text'
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder='Ecrivez un message...'
          disabled={loading}
          style={styles.input}
        />
        <button
          type='submit'
          disabled={loading || !messageText.trim()}
          style={{
            ...styles.sendBtn,
            opacity: loading || !messageText.trim() ? 0.5 : 1,
            cursor: loading || !messageText.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '...' : 'Envoyer'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    borderBottom: '1px solid #eee',
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#fff',
  },
  emptyMessages: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
    fontSize: '14px',
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '5px',
  },
  message: {
    maxWidth: '60%',
    padding: '10px 12px',
    borderRadius: '18px',
    wordWrap: 'break-word',
  },
  messageText: {
    margin: '0 0 4px 0',
    fontSize: '13px',
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.7,
  },
  form: {
    display: 'flex',
    gap: '8px',
    padding: '15px',
    borderTop: '1px solid #eee',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  sendBtn: {
    padding: '10px 20px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  },
}

export default ConversationDetail
