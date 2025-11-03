import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addMessage,
  updateConversation,
  setConversations,
  setActiveConversation,
  markConversationAsRead,
} from '../../reducers/messagingReducer'
import messagingService from '../../services/MessagingService'
import { showNotification } from '../../reducers/notificationReducer'
import socketService from '../../services/socket'
import MediaUploader from '../media/MediaUploader'
import MediaMessage from './MediaMessage'

const ConversationDetail = ({ conversation, onBack }) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingMessage, setEditingMessage] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [deletingConv, setDeletingConv] = useState(false)
  const [typingUser, setTypingUser] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [showMediaOptions, setShowMediaOptions] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [isParticipantOnline, setIsParticipantOnline] = useState(false)

  const typingTimeoutRef = useRef(null)
  const messagesEndRef = useRef(null)

  const messages = conversation.messages || []

  // ✅ Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ✅ Marquer messages comme lus à l'ouverture
  useEffect(() => {
    if (!conversation?.id || !user?.id) return

    const markAsRead = async () => {
      try {
        console.log('📖 Marquage messages comme lus:', conversation.id)
        dispatch(markConversationAsRead(conversation.id))
        await messagingService.markMessagesAsRead(conversation.id)
        socketService.markMessagesRead(conversation.id, user.id)
      } catch (error) {
        console.error('❌ Erreur marquage messages lus:', error)
      }
    }

    markAsRead()
  }, [conversation?.id, user?.id, dispatch])

  // ✅ WEBSOCKET - Gestion complète
  useEffect(() => {
    if (!conversation?.id) return

    console.log('🔌 Connexion WebSocket pour conversation:', conversation.id)

    socketService.joinConversation(conversation.id)

    // ✅ Réception nouveau message
    const handleMessageReceive = ({ conversationId, message }) => {
      console.log('📨 Message reçu via WebSocket:', message)

      if (conversationId === conversation.id) {
        const messageExists = conversation.messages.some(
          (m) => m.id === message.id || m._id === message.id
        )

        if (!messageExists) {
          console.log('➕ Ajout du message au store Redux')
          dispatch(
            addMessage({
              conversationId,
              message,
              isOwnMessage: message.senderId === user.id,
            })
          )

          // Marquer comme lu si je ne suis pas l'expéditeur
          if (message.senderId !== user.id) {
            console.log('✅ Marquage automatique comme lu')
            messagingService.markMessagesAsRead(conversationId)
            socketService.markMessagesRead(conversationId, user.id)
          }
        } else {
          console.log('⚠ Message déjà présent, ignoré')
        }
      }
    }

    // ✅ Message modifié
    const handleMessageUpdated = ({ conversationId, messageId, text }) => {
      console.log('✏ Message modifié:', messageId)

      if (conversationId === conversation.id) {
        const updated = {
          ...conversation,
          messages: conversation.messages.map((m) =>
            m.id === messageId ? { ...m, text, updatedAt: new Date() } : m
          ),
        }
        dispatch(updateConversation(updated))
      }
    }

    // ✅ Message supprimé
    const handleMessageDeleted = ({ conversationId, messageId }) => {
      console.log('🗑 Message supprimé:', messageId)

      if (conversationId === conversation.id) {
        const updated = {
          ...conversation,
          messages: conversation.messages.filter((m) => m.id !== messageId),
        }
        dispatch(updateConversation(updated))
      }
    }

    // ✅ Indicateur "en train d'écrire"
    const handleTypingUpdate = ({
      conversationId,
      userId,
      userName,
      isTyping,
    }) => {
      console.log('⌨ Typing update:', { userId, userName, isTyping })

      if (conversationId === conversation.id && userId !== user.id) {
        setTypingUser(isTyping ? userName : null)
      }
    }

    // ✅ Statut utilisateur (online/offline)
    const handleUserStatus = ({ userId, status }) => {
      console.log('👤 Statut utilisateur:', { userId, status })

      if (userId === conversation.participantId) {
        setIsParticipantOnline(status === 'online')
      }
    }

    // ✅ Confirmation de lecture (double check)
    const handleMessagesRead = ({ conversationId, userId }) => {
      console.log('✓✓ Messages lus par:', userId)

      if (conversationId === conversation.id && userId !== user.id) {
        const updated = {
          ...conversation,
          messages: conversation.messages.map((msg) =>
            msg.senderId === user.id ? { ...msg, isRead: true } : msg
          ),
        }
        dispatch(updateConversation(updated))
      }
    }

    // ✅ Enregistrement des listeners
    socketService.onMessageReceive(handleMessageReceive)
    socketService.onMessageUpdated(handleMessageUpdated)
    socketService.onMessageDeleted(handleMessageDeleted)
    socketService.onTypingUpdate(handleTypingUpdate)
    socketService.onUserStatus(handleUserStatus)
    socketService.onMessagesRead(handleMessagesRead)

    console.log('✅ Tous les listeners WebSocket enregistrés')

    // ✅ Nettoyage
    return () => {
      console.log(
        '🔌 Déconnexion WebSocket pour conversation:',
        conversation.id
      )
      socketService.leaveConversation(conversation.id)
      socketService.offMessageReceive()
      socketService.offMessageUpdated()
      socketService.offMessageDeleted()
      socketService.offTypingUpdate()
      socketService.offUserStatus()
      socketService.offMessagesRead()
    }
  }, [
    conversation?.id,
    dispatch,
    user.id,
    conversation.messages,
    conversation.participantId,
  ])

  // ✅ Gestion de la saisie
  const handleTyping = (e) => {
    setMessageText(e.target.value)

    if (!isTyping && e.target.value) {
      setIsTyping(true)
      console.log('⌨ Début de frappe')
      socketService.startTyping(
        conversation.id,
        user.id,
        ` ${user.firstName} ${user.lastName}`
      )
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      console.log('⌨ Fin de frappe')
      socketService.stopTyping(conversation.id, user.id)
    }, 2000)
  }

  // ✅ Envoi de message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim()) return

    setLoading(true)
    const messageToSend = messageText.trim()

    try {
      if (isTyping) {
        socketService.stopTyping(conversation.id, user.id)
        setIsTyping(false)
      }

      console.log('📤 Envoi message:', messageToSend)

      // Créer message optimiste
      const optimisticMessage = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`,
        senderAvatar: user.profilePicture,
        text: messageToSend,
        isRead: true, // Mon propre message est déjà lu
        createdAt: new Date().toISOString(),
      }

      // ✅ Ajouter immédiatement à Redux (optimiste)
      dispatch(
        addMessage({
          conversationId: conversation.id,
          message: optimisticMessage,
          isOwnMessage: true,
        })
      )

      // ✅ Envoyer au backend
      await messagingService.addMessage(conversation.id, messageToSend)

      setMessageText('')
      console.log('✅ Message envoyé avec succès')
    } catch (error) {
      console.error('❌ Erreur envoi message:', error)
      dispatch(showNotification("Error: Échec de l'envoi du message.", 5))
    } finally {
      setLoading(false)
    }
  }

  const handleMediaUpload = async (mediaUrl, mediaType) => {
    try {
      setUploadingMedia(true)

      let type = 'document'
      let name = 'file'

      if (mediaType === 'image/*') {
        type = 'image'
        name = 'image.jpg'
      } else if (mediaType === 'video/*') {
        type = 'video'
        name = 'video.mp4'
      }

      await messagingService.addMessage(
        conversation.id,
        messageText.trim() || '',
        type,
        mediaUrl,
        name
      )

      setMessageText('')
      setShowMediaOptions(false)
      dispatch(showNotification('success: Média envoyé avec succès !', 3))
    } catch (error) {
      console.error('Erreur envoi média:', error)
      dispatch(showNotification("Error: Échec de l'envoi du média", 5))
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await messagingService.deleteMessage(conversation.id, messageId)
      dispatch(showNotification('success: Message supprimé avec succès', 3))
    } catch (error) {
      console.error('Error: suppression:', error)
      dispatch(showNotification('Error: Échec de la suppression', 5))
    }
  }

  const handleEditMessage = async (messageId, newText) => {
    try {
      await messagingService.updateMessage(conversation.id, messageId, newText)
      dispatch(showNotification('success: Message modifié avec succès', 3))
    } catch (error) {
      console.error('Erreur modification:', error)
      dispatch(showNotification('Error: Échec de la modification', 5))
    }
  }

  const handleDeleteConversation = async () => {
    const confirmDelete = window.confirm(
      'Voulez-vous vraiment supprimer cette conversation ?'
    )
    if (!confirmDelete) return

    try {
      setDeletingConv(true)
      await messagingService.deleteConversationForUser(conversation.id)
      const updatedList = await messagingService.getUserConversations()
      dispatch(setConversations(updatedList))
      dispatch(setActiveConversation(null))

      if (onBack) {
        onBack()
      }

      dispatch(
        showNotification('success: Conversation supprimée avec succès', 3)
      )
    } catch (error) {
      console.error('Erreur suppression conversation:', error)
      dispatch(showNotification('Error: Erreur de suppression', 5))
    } finally {
      setDeletingConv(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* En-tête */}
      <div style={styles.hero}>
        {onBack && (
          <button
            onClick={onBack}
            style={styles.backButton}
            aria-label='Retour'
          >
            ←
          </button>
        )}

        <div style={styles.avatarContainer}>
          <img
            src={
              conversation.participantAvatar ||
              'https://ui-avatars.com/api/?name=User'
            }
            alt='avatar'
            style={styles.headerAvatar}
          />
          {isParticipantOnline && <span style={styles.onlineIndicator} />}
        </div>

        <div style={styles.headerInfo}>
          <h3 style={styles.headerTitle}>{conversation.participantName}</h3>
          <span style={styles.statusText}>
            {isParticipantOnline ? '🟢 En ligne' : '⚪ Hors ligne'}
          </span>
        </div>

        <button
          onClick={handleDeleteConversation}
          disabled={deletingConv}
          style={{
            ...styles.deleteConvBtn,
            opacity: deletingConv ? 0.6 : 1,
            cursor: deletingConv ? 'not-allowed' : 'pointer',
          }}
          aria-label='Supprimer la conversation'
        >
          🗑
        </button>
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
              key={msg.id || msg._id}
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
                {msg.senderId === user.id && (
                  <div style={styles.menuWrapper}>
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === msg.id ? null : msg.id)
                      }
                      style={styles.menuButton}
                    >
                      ⋯
                    </button>

                    {openMenuId === msg.id && (
                      <div style={styles.dropdownMenu}>
                        <button
                          onClick={() => {
                            setEditingMessage(msg)
                            setOpenMenuId(null)
                          }}
                          style={styles.dropdownItem}
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => {
                            setMessageToDelete(msg)
                            setShowDeleteModal(true)
                            setOpenMenuId(null)
                          }}
                          style={{ ...styles.dropdownItem, color: 'red' }}
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {msg.mediaType && msg.mediaUrl ? (
                  <MediaMessage
                    mediaType={msg.mediaType}
                    mediaUrl={msg.mediaUrl}
                    mediaName={msg.mediaName}
                    text={msg.text}
                  />
                ) : (
                  <p style={styles.messageText}>{msg.text}</p>
                )}

                <small style={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {msg.senderId === user.id && (
                    <span
                      style={{
                        marginLeft: '5px',
                        color: msg.isRead ? '#4fc3f7' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {msg.isRead ? '✓✓' : '✓'}
                    </span>
                  )}
                </small>
              </div>
            </div>
          ))
        )}

        {/* ✅ Indicateur "en train d'écrire" */}
        {typingUser && (
          <div style={styles.typingIndicator}>
            <div style={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <em>{typingUser} est en train d'écrire...</em>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showMediaOptions && (
        <div style={styles.mediaOptionsContainer}>
          <div style={styles.mediaOption}>
            <span>📷 Image</span>
            <MediaUploader
              onUploadComplete={(url) => handleMediaUpload(url, 'image/*')}
              setIsUploading={setUploadingMedia}
              maxFiles={1}
              accept='image/*'
            />
          </div>
          <div style={styles.mediaOption}>
            <span>🎥 Vidéo</span>
            <MediaUploader
              onUploadComplete={(url) => handleMediaUpload(url, 'video/*')}
              setIsUploading={setUploadingMedia}
              maxFiles={1}
              accept='video/*'
            />
          </div>
        </div>
      )}

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSendMessage} style={styles.form}>
        <button
          type='button'
          onClick={() => setShowMediaOptions(!showMediaOptions)}
          style={styles.attachButton}
          disabled={uploadingMedia}
        >
          📎
        </button>

        <input
          type='text'
          value={messageText}
          onChange={handleTyping}
          placeholder='Écrivez un message...'
          disabled={loading || uploadingMedia}
          style={styles.input}
        />

        <button
          type='submit'
          disabled={loading || uploadingMedia || !messageText.trim()}
          style={{
            ...styles.sendBtn,
            opacity: loading || uploadingMedia || !messageText.trim() ? 0.5 : 1,
          }}
        >
          {loading || uploadingMedia ? '⏳' : '➤'}
        </button>
      </form>

      {/* Modales */}
      {showDeleteModal && messageToDelete && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h4>Supprimer ce message ?</h4>
            <p>Cette action est irréversible.</p>
            <div style={styles.modalActions}>
              <button
                onClick={() => {
                  handleDeleteMessage(messageToDelete.id)
                  setShowDeleteModal(false)
                }}
                style={{ ...styles.modalBtn, backgroundColor: '#d9534f' }}
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ ...styles.modalBtn, backgroundColor: '#ccc' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {editingMessage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h4>Modifier le message</h4>
            <textarea
              value={editingMessage.text}
              onChange={(e) =>
                setEditingMessage({ ...editingMessage, text: e.target.value })
              }
              style={styles.textarea}
            />
            <div style={styles.modalActions}>
              <button
                onClick={() => {
                  handleEditMessage(editingMessage.id, editingMessage.text)
                  setEditingMessage(null)
                }}
                style={{ ...styles.modalBtn, backgroundColor: '#5cb85c' }}
              >
                Enregistrer
              </button>
              <button
                onClick={() => setEditingMessage(null)}
                style={{ ...styles.modalBtn, backgroundColor: '#ccc' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ✅ STYLES COMPLETS
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 15px',
    backgroundColor: '#1877f2',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
  },
  avatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '12px',
    height: '12px',
    backgroundColor: '#44b700',
    border: '2px solid #fff',
    borderRadius: '50%',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  deleteConvBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    flexShrink: 0,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#f5f5f5',
  },
  emptyMessages: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
  },
  messageWrapper: {
    display: 'flex',
    animation: 'slideIn 0.3s ease',
  },
  message: {
    maxWidth: '60%',
    padding: '10px 12px',
    borderRadius: '18px',
    wordWrap: 'break-word',
    position: 'relative',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
    wordBreak: 'break-word',
    lineHeight: '1.4',
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.7,
    display: 'block',
    marginTop: '4px',
  },
  menuWrapper: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
  },
  menuButton: {
    background: 'rgba(0,0,0,0.2)',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px 8px',
    borderRadius: '4px',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '25px',
    right: '0',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 10,
    minWidth: '120px',
  },
  dropdownItem: {
    padding: '10px 12px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background 0.2s',
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#65676b',
    fontStyle: 'italic',
    backgroundColor: '#fff',
    borderRadius: '18px',
    maxWidth: '60%',
  },
  typingDots: {
    display: 'flex',
    gap: '4px',
  },
  form: {
    display: 'flex',
    gap: '8px',
    padding: '15px',
    borderTop: '1px solid #eee',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  input: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none',
  },
  sendBtn: {
    padding: '10px 20px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  mediaOptionsContainer: {
    display: 'flex',
    gap: '10px',
    padding: '10px 15px',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid #ddd',
  },
  mediaOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '90%',
    maxWidth: '340px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    textAlign: 'center',
  },
  modalActions: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '10px',
  },
  modalBtn: {
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: 1,
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
}

export default ConversationDetail
