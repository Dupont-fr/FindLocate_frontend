import axios from 'axios'
import { getToken } from './authService'

const API_URL = 'http://localhost:3003/api/conversations'

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
})

/**
 * Calculer le nombre de messages non lus
 */
const calculateUnreadCount = (conversation) => {
  if (!conversation.messages) return 0

  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id

  return conversation.messages.filter(
    (msg) => msg.senderId !== currentUserId && !msg.isRead
  ).length
}

/**
 * Récupérer toutes les conversations avec compteur non lus
 */
const getUserConversations = async () => {
  try {
    const response = await axios.get(API_URL, getConfig())

    const conversationsWithUnread = response.data.map((conv) => ({
      ...conv,
      unreadCount: calculateUnreadCount(conv),
    }))

    return conversationsWithUnread
  } catch (error) {
    console.error('❌ Erreur getUserConversations:', error)
    throw new Error(
      error.response?.data?.error || 'Erreur chargement conversations'
    )
  }
}

/**
 * Récupérer une conversation spécifique
 */
const getConversation = async (conversationId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${conversationId}`,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur getConversation:', error)
    throw new Error(error.response?.data?.error || 'Conversation non trouvée')
  }
}

/**
 * Créer une nouvelle conversation
 */
const createConversation = async (user2Id, user2Name, user2Avatar) => {
  try {
    const response = await axios.post(
      API_URL,
      { user2Id, user2Name, user2Avatar },
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur createConversation:', error)
    throw new Error(
      error.response?.data?.error || 'Erreur création conversation'
    )
  }
}

/**
 * Ajouter un message
 */
const addMessage = async (
  conversationId,
  text,
  mediaType = null,
  mediaUrl = '',
  mediaName = '',
  mediaSize = 0
) => {
  try {
    const response = await axios.post(
      ` ${API_URL}/${conversationId}/messages`,
      {
        text,
        mediaType,
        mediaUrl,
        mediaName,
        mediaSize,
        isRead: false,
      },
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur addMessage:', error)
    throw new Error(error.response?.data?.error || 'Erreur ajout message')
  }
}

/**
 * Modifier un message
 */
const updateMessage = async (conversationId, messageId, text) => {
  try {
    const response = await axios.put(
      `${API_URL}/${conversationId}/messages/${messageId}`,
      { text },
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur updateMessage:', error)
    throw new Error(
      error.response?.data?.error || 'Erreur modification message'
    )
  }
}

/**
 * Supprimer un message
 */
const deleteMessage = async (conversationId, messageId) => {
  try {
    const response = await axios.delete(
      ` ${API_URL}/${conversationId}/messages/${messageId}`,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur deleteMessage:', error)
    throw new Error(error.response?.data?.error || 'Erreur suppression message')
  }
}

/**
 * Marquer tous les messages comme lus
 */
const markMessagesAsRead = async (conversationId) => {
  try {
    const response = await axios.patch(
      ` ${API_URL}/${conversationId}/read`,
      {},
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur markMessagesAsRead:', error)
    throw new Error(
      error.response?.data?.error || 'Erreur marquage messages lus'
    )
  }
}

/**
 * Supprimer une conversation
 */
const deleteConversationForUser = async (conversationId) => {
  try {
    await axios.delete(`${API_URL}/${conversationId}`, getConfig())
    return true
  } catch (error) {
    console.error('❌ Erreur deleteConversationForUser:', error)
    throw new Error(
      error.response?.data?.error || 'Erreur suppression conversation'
    )
  }
}

/**
 * Vérifier si conversation existe
 */
const findExistingConversation = async (userId1, userId2) => {
  try {
    const conversations = await getUserConversations()
    return (
      conversations.find(
        (conv) =>
          (conv.user1Id === userId1 && conv.user2Id === userId2) ||
          (conv.user1Id === userId2 && conv.user2Id === userId1)
      ) || null
    )
  } catch (error) {
    console.error('❌ Erreur findExistingConversation:', error)
    return null
  }
}

export default {
  getUserConversations,
  getConversation,
  createConversation,
  addMessage,
  updateMessage,
  deleteMessage,
  markMessagesAsRead,
  deleteConversationForUser,
  findExistingConversation,
  calculateUnreadCount,
}
