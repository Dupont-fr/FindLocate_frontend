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
    setConversations: (state, action) => {
      state.conversations = action.payload
    },

    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload
    },

    addConversation: (state, action) => {
      const exists = state.conversations.some((c) => c.id === action.payload.id)
      if (!exists) {
        state.conversations.unshift(action.payload)
      }
      // ✅ définit la conversation active si aucune n’est ouverte
      if (!state.activeConversationId) {
        state.activeConversationId = action.payload.id
      }
    },

    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(
        (c) => c.id === action.payload.id
      )
      if (index !== -1) {
        state.conversations[index] = action.payload
      } else {
        // ✅ ajoute si elle n’existe pas
        state.conversations.unshift(action.payload)
      }
    },

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

        // ✅ augmente le compteur si message reçu
        if (!isOwnMessage) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1
        }
      }
    },

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
  setLoading,
  setError,
} = messagingSlice.actions

// ✅ Sélecteur pratique
export const selectActiveConversation = (state) => {
  return state.messaging.conversations.find(
    (c) => c.id === state.messaging.activeConversationId
  )
}

export default messagingSlice.reducer
