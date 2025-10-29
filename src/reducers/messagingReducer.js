import { createSlice } from '@reduxjs/toolkit'

const messagingSlice = createSlice({
  name: 'messaging',
  initialState: {
    conversations: [],
    activeConversationId: null,
    loading: false,
    error: null,
  },
  reducers: {
    // --- Charger les conversations ---
    setConversations: (state, action) => {
      state.conversations = action.payload
    },

    // --- Définir la conversation active ---
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload
    },

    // --- Ajouter une nouvelle conversation ---
    addConversation: (state, action) => {
      const exists = state.conversations.some((c) => c.id === action.payload.id)
      if (!exists) {
        state.conversations.unshift(action.payload)
      }
      if (!state.activeConversationId) {
        state.activeConversationId = action.payload.id
      }
    },

    // --- Mettre à jour une conversation ---
    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(
        (c) => c.id === action.payload.id
      )
      if (index !== -1) {
        state.conversations[index] = action.payload
      } else {
        state.conversations.unshift(action.payload)
      }
    },

    // --- Ajouter un message ---
    addMessage: (state, action) => {
      const { conversationId, message, isOwnMessage } = action.payload
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      )
      if (conversation) {
        if (!conversation.messages) conversation.messages = []
        conversation.messages.push(message)
        conversation.lastMessage = message.text
        conversation.lastMessageTime = message.createdAt

        // Incrémente le compteur si message reçu
        if (!isOwnMessage) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1
        }
      }
    },

    // --- Modifier un message ---
    editMessage: (state, action) => {
      const { conversationId, messageId, newText } = action.payload
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      )
      if (conversation && conversation.messages) {
        const msg = conversation.messages.find((m) => m.id === messageId)
        if (msg) {
          msg.text = newText
          msg.updatedAt = new Date().toISOString()
        }
      }
    },

    // --- Supprimer un message ---
    deleteMessage: (state, action) => {
      const { conversationId, messageId } = action.payload
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      )
      if (conversation && conversation.messages) {
        conversation.messages = conversation.messages.filter(
          (m) => m.id !== messageId
        )
      }
    },

    // --- Supprimer une conversation complète ---
    deleteConversation: (state, action) => {
      const conversationId = action.payload
      state.conversations = state.conversations.filter(
        (c) => c.id !== conversationId
      )
      if (state.activeConversationId === conversationId) {
        state.activeConversationId = null
      }
    },

    // --- Gestion du chargement et des erreurs ---
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setConversations,
  setActiveConversation,
  addConversation,
  updateConversation,
  addMessage,
  editMessage,
  deleteMessage,
  deleteConversation,
  setLoading,
  setError,
} = messagingSlice.actions

// --- Sélecteur de la conversation active ---
export const selectActiveConversation = (state) =>
  state.messaging.conversations.find(
    (c) => c.id === state.messaging.activeConversationId
  )

export default messagingSlice.reducer
