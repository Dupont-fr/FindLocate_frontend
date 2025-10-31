// ✅ AJOUT: Import axios et getToken
import axios from 'axios'
import { getToken } from './authService'

// ✅ MODIFIÉ: Changer l'URL pour pointer vers l'API backend avec authentification
const API_URL = 'http://localhost:3003/api/conversations'

// ✅ AJOUT: Configuration pour inclure le token JWT
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  },
})

/**
 * Récupérer toutes les conversations de l'utilisateur connecté
 * ✅ MODIFIÉ: Utilise axios + authentification JWT (le backend filtre automatiquement)
 */
const getUserConversations = async () => {
  try {
    const response = await axios.get(API_URL, getConfig())
    return response.data
  } catch (error) {
    console.error('❌ Erreur getUserConversations:', error)
    throw new Error(
      error.response?.data?.error || 'Erreur chargement conversations'
    )
  }
}

/**
 * Récupérer une conversation spécifique
 * ✅ MODIFIÉ: Utilise axios + authentification JWT
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
 * Créer une nouvelle conversation ou récupérer une existante
 * ✅ MODIFIÉ: Format simplifié - le backend gère user1 automatiquement
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
 * Ajouter un message à une conversation
 * ✅ MODIFIÉ: Support des médias (images, vidéos, documents)
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
      `${API_URL}/${conversationId}/messages`,
      { text, mediaType, mediaUrl, mediaName, mediaSize },
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
 * ✅ AJOUT: Nouvelle route RESTful
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
 * ✅ MODIFIÉ: Utilise la nouvelle route RESTful
 */
const deleteMessage = async (conversationId, messageId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${conversationId}/messages/${messageId}`,
      getConfig()
    )
    return response.data
  } catch (error) {
    console.error('❌ Erreur deleteMessage:', error)
    throw new Error(error.response?.data?.error || 'Erreur suppression message')
  }
}

/**
 * Marquer tous les messages d'une conversation comme lus
 * ✅ AJOUT: Nouvelle fonctionnalité
 */
const markMessagesAsRead = async (conversationId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${conversationId}/read`,
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
 * Supprimer une conversation (suppression logique)
 * ✅ MODIFIÉ: Plus besoin de passer userId - le backend le récupère du token
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
 * Vérifie s'il existe une conversation entre deux utilisateurs
 * ✅ CONSERVÉ: Pour compatibilité (utilise getUserConversations)
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
}
