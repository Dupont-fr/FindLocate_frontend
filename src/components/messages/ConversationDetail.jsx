import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addMessage,
  updateConversation,
  setConversations,
  setActiveConversation,
} from '../../reducers/messagingReducer'
import messagingService from '../../services/MessagingService'
import { showNotification } from '../../reducers/notificationReducer'
import socketService from '../../services/socket'

const ConversationDetail = ({ conversation }) => {
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
  const typingTimeoutRef = useRef(null)
  const messagesEndRef = useRef(null)

  const messages = conversation.messages || []

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ✅ CORRIGÉ: Gestion WebSocket pour cette conversation
  useEffect(() => {
    if (!conversation?.id) return

    socketService.joinConversation(conversation.id)

    // ✅ Handler pour les nouveaux messages
    const handleMessageReceive = ({ conversationId, message }) => {
      if (conversationId === conversation.id) {
        // ✅ Vérifier si le message n'existe pas déjà (éviter les doublons)
        const messageExists = conversation.messages.some(
          (m) => m.id === message.id || m._id === message.id
        )

        if (!messageExists) {
          dispatch(addMessage({ conversationId, message }))
        }

        // Marquer comme lu si c'est l'autre utilisateur qui envoie
        if (message.senderId !== user.id) {
          messagingService.markMessagesAsRead(conversationId)
        }
      }
    }

    // ✅ Handler pour les messages modifiés
    const handleMessageUpdated = ({ conversationId, messageId, text }) => {
      if (conversationId === conversation.id) {
        const updated = {
          ...conversation,
          messages: conversation.messages.map((m) =>
            m.id === messageId
              ? { ...m, text, updatedAt: new Date().toISOString() }
              : m
          ),
        }
        dispatch(updateConversation(updated))
      }
    }

    // ✅ Handler pour les messages supprimés
    const handleMessageDeleted = ({ conversationId, messageId }) => {
      if (conversationId === conversation.id) {
        const updated = {
          ...conversation,
          messages: conversation.messages.filter((m) => m.id !== messageId),
        }
        dispatch(updateConversation(updated))
      }
    }

    // ✅ Handler pour "en train d'écrire"
    const handleTypingUpdate = ({
      conversationId,
      userId,
      userName,
      isTyping,
    }) => {
      if (conversationId === conversation.id && userId !== user.id) {
        setTypingUser(isTyping ? userName : null)
      }
    }

    // Attacher les listeners
    socketService.onMessageReceive(handleMessageReceive)
    socketService.onMessageUpdated(handleMessageUpdated)
    socketService.onMessageDeleted(handleMessageDeleted)
    socketService.onTypingUpdate(handleTypingUpdate)

    // ✅ IMPORTANT: Nettoyage complet
    return () => {
      socketService.leaveConversation(conversation.id)
      // Retirer TOUS les listeners pour éviter les doublons
      socketService.offMessageReceive()
      socketService.offMessageUpdated()
      socketService.offMessageDeleted()
      socketService.offTypingUpdate()
    }
  }, [conversation?.id, dispatch, user.id, conversation.messages])

  // Gérer l'indicateur "en train d'écrire"
  const handleTyping = (e) => {
    setMessageText(e.target.value)

    if (!isTyping) {
      setIsTyping(true)
      socketService.startTyping(
        conversation.id,
        user.id,
        `${user.firstName} ${user.lastName}`
      )
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socketService.stopTyping(conversation.id, user.id)
    }, 2000)
  }

  // ✅ CORRIGÉ: Envoi d'un message SANS ajout local temporaire
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim()) return

    setLoading(true)
    const messageToSend = messageText.trim()

    try {
      // Arrêter l'indicateur "en train d'écrire"
      if (isTyping) {
        socketService.stopTyping(conversation.id, user.id)
        setIsTyping(false)
      }

      // ✅ Envoyer au backend - le WebSocket s'occupera de l'affichage
      await messagingService.addMessage(conversation.id, messageToSend)

      setMessageText('')
      dispatch(showNotification('success: Message envoyé avec succès !', 3))
    } catch (error) {
      console.error('Erreur:', error)
      dispatch(showNotification("Error: Échec de l'envoi du message.", 5))
    } finally {
      setLoading(false)
    }
  }

  // Supprimer un message
  const handleDeleteMessage = async (messageId) => {
    try {
      await messagingService.deleteMessage(conversation.id, messageId)
      dispatch(showNotification('success: Message supprimé avec succès', 3))
    } catch (error) {
      console.error('Error: suppression:', error)
      dispatch(showNotification('Error: Échec de la suppression', 5))
    }
  }

  // Modifier un message
  const handleEditMessage = async (messageId, newText) => {
    try {
      await messagingService.updateMessage(conversation.id, messageId, newText)
      dispatch(showNotification('success: Message modifié avec succès', 3))
    } catch (error) {
      console.error('Erreur modification:', error)
      dispatch(showNotification('Error: Échec de la modification', 5))
    }
  }

  // Suppression d'une conversation
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

        <button
          onClick={handleDeleteConversation}
          disabled={deletingConv}
          style={{
            ...styles.deleteConvBtn,
            opacity: deletingConv ? 0.6 : 1,
            cursor: deletingConv ? 'not-allowed' : 'pointer',
          }}
        >
          {deletingConv ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>

      {/* Liste des messages */}
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

                <p style={styles.messageText}>{msg.text}</p>
                <small style={styles.messageTime}>
                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {msg.updatedAt && ' (modifié)'}
                </small>
              </div>
            </div>
          ))
        )}

        {/* Indicateur "en train d'écrire" */}
        {typingUser && (
          <div style={styles.typingIndicator}>
            <em>{typingUser} est en train d'écrire...</em>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Formulaire d'envoi */}
      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type='text'
          value={messageText}
          onChange={handleTyping}
          placeholder='Écrivez un message...'
          disabled={loading}
          style={styles.input}
        />
        <button
          type='submit'
          disabled={loading || !messageText.trim()}
          style={{
            ...styles.sendBtn,
            opacity: loading || !messageText.trim() ? 0.5 : 1,
          }}
        >
          {loading ? '...' : 'Envoyer'}
        </button>
      </form>

      {/* Modale suppression */}
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

      {/* Modale édition */}
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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    // 📱 Mobile: Prend toute la hauteur
    maxHeight: 'calc(100vh - 60px)',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff',
    // 📱 Mobile: Réduit le padding
    '@media (max-width: 768px)': {
      padding: '10px',
      gap: '8px',
    },
  },

  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    // 📱 Mobile: Plus petit
    '@media (max-width: 768px)': {
      width: '35px',
      height: '35px',
    },
  },

  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 'bold',
    flex: 1, // 📱 Prend l'espace restant
    overflow: 'hidden', // 📱 Évite le débordement
    textOverflow: 'ellipsis', // 📱 Ajoute "..."
    whiteSpace: 'nowrap', // 📱 Pas de retour à la ligne
    // 📱 Mobile: Plus petit
    '@media (max-width: 768px)': {
      fontSize: '14px',
    },
  },

  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    backgroundColor: '#fff',
    // 📱 Mobile: Réduit le padding
    '@media (max-width: 768px)': {
      padding: '10px',
      gap: '8px',
    },
  },

  messageWrapper: {
    display: 'flex',
    // 📱 Mobile: Adapté automatiquement
  },

  message: {
    maxWidth: '60%', // 📱 60% sur desktop
    padding: '10px 12px',
    borderRadius: '18px',
    wordWrap: 'break-word',
    position: 'relative',
    // 📱 Mobile: Prend plus d'espace
    '@media (max-width: 768px)': {
      maxWidth: '75%',
      padding: '8px 10px',
      fontSize: '14px',
    },
  },

  messageText: {
    margin: 0,
    fontSize: '13px',
    wordBreak: 'break-word', // 📱 Coupe les longs mots
    // 📱 Mobile: Légèrement plus petit
    '@media (max-width: 768px)': {
      fontSize: '13px',
    },
  },

  messageTime: {
    fontSize: '11px',
    opacity: 0.7,
    display: 'block', // 📱 Force un retour à la ligne
    marginTop: '4px',
    // 📱 Mobile: Plus petit
    '@media (max-width: 768px)': {
      fontSize: '10px',
    },
  },

  form: {
    display: 'flex',
    gap: '8px',
    padding: '15px',
    borderTop: '1px solid #eee',
    backgroundColor: '#f9f9f9',
    // 📱 Mobile: Réduit le padding et adapte les gaps
    '@media (max-width: 768px)': {
      padding: '10px',
      gap: '6px',
      position: 'sticky', // 📱 Reste en bas
      bottom: 0,
    },
  },

  input: {
    flex: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '13px',
    outline: 'none',
    // 📱 Mobile: Ajuste le padding
    '@media (max-width: 768px)': {
      padding: '8px 12px',
      fontSize: '14px', // 📱 Plus lisible sur mobile
    },
  },

  sendBtn: {
    padding: '10px 20px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
    cursor: 'pointer',
    // 📱 Mobile: Bouton plus compact
    '@media (max-width: 768px)': {
      padding: '8px 16px',
      fontSize: '13px',
    },
  },

  typingIndicator: {
    padding: '8px 12px',
    fontSize: '13px',
    color: '#65676b',
    fontStyle: 'italic',
    // 📱 Mobile: Plus petit
    '@media (max-width: 768px)': {
      fontSize: '12px',
      padding: '6px 10px',
    },
  },

  emptyMessages: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    // 📱 Mobile: Moins de padding
    '@media (max-width: 768px)': {
      padding: '20px',
      fontSize: '14px',
    },
  },

  menuWrapper: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    // 📱 Mobile: Zone de touch plus grande
    '@media (max-width: 768px)': {
      top: '-8px',
      right: '-8px',
    },
  },

  menuButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px', // 📱 Zone de touch plus grande
    // 📱 Mobile: Plus gros pour le touch
    '@media (max-width: 768px)': {
      fontSize: '20px',
      padding: '8px',
    },
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
    minWidth: '120px', // 📱 Largeur minimale
    // 📱 Mobile: Plus visible
    '@media (max-width: 768px)': {
      minWidth: '140px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
  },

  dropdownItem: {
    padding: '8px 12px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background 0.2s',
    // 📱 Mobile: Plus d'espace pour touch
    '@media (max-width: 768px)': {
      padding: '12px 16px',
      fontSize: '14px',
    },
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
    // 📱 Mobile: Ajuste pour l'écran complet
    padding: '20px', // 📱 Évite que la modal touche les bords
  },

  modal: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    width: '300px',
    maxWidth: '90%', // 📱 Ne dépasse pas 90% de l'écran
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    textAlign: 'center',
    // 📱 Mobile: S'adapte mieux
    '@media (max-width: 768px)': {
      width: '100%',
      maxWidth: '340px',
      padding: '20px 15px',
    },
  },

  modalActions: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-around',
    gap: '10px', // 📱 Espace entre les boutons
    // 📱 Mobile: Boutons en colonne si nécessaire
    '@media (max-width: 480px)': {
      flexDirection: 'column',
      gap: '8px',
    },
  },

  modalBtn: {
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 14px',
    cursor: 'pointer',
    flex: 1, // 📱 Prend la même largeur
    minWidth: '80px', // 📱 Largeur minimale
    // 📱 Mobile: Plus grand pour le touch
    '@media (max-width: 768px)': {
      padding: '10px 16px',
      fontSize: '14px',
    },
  },

  textarea: {
    width: '100%',
    height: '80px',
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '13px',
    resize: 'none',
    boxSizing: 'border-box', // 📱 Inclut le padding dans la largeur
    fontFamily: 'inherit', // 📱 Utilise la même police
    // 📱 Mobile: Plus grand et lisible
    '@media (max-width: 768px)': {
      height: '100px',
      fontSize: '14px',
      padding: '10px',
    },
  },

  deleteConvBtn: {
    marginLeft: 'auto',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'background 0.2s',
    whiteSpace: 'nowrap', // 📱 Pas de retour à la ligne
    // 📱 Mobile: Plus compact
    '@media (max-width: 768px)': {
      fontSize: '11px',
      padding: '5px 10px',
    },
  },
}

export default ConversationDetail
