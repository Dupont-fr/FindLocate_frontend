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
    },

    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(
        (c) => c.id === action.payload.id
      )
      if (index !== -1) {
        state.conversations[index] = action.payload
      }
    },

    addMessage: (state, action) => {
      const { conversationId, message, isOwnMessage } = action.payload
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      )

      if (conversation) {
        if (!conversation.messages) conversation.messages = []

        conversation.messages.push({
          ...message,
          isRead: isOwnMessage,
        })

        conversation.lastMessage = message.text
        conversation.lastMessageTime = message.createdAt

        if (!isOwnMessage) {
          conversation.unreadCount = (conversation.unreadCount || 0) + 1
        }
      }
    },

    markConversationAsRead: (state, action) => {
      const conversationId = action.payload
      const conversation = state.conversations.find(
        (c) => c.id === conversationId
      )

      if (conversation) {
        conversation.unreadCount = 0

        if (conversation.messages) {
          conversation.messages = conversation.messages.map((msg) => ({
            ...msg,
            isRead: true,
          }))
        }
      }
    },

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

    deleteConversation: (state, action) => {
      const conversationId = action.payload
      state.conversations = state.conversations.filter(
        (c) => c.id !== conversationId
      )
      if (state.activeConversationId === conversationId) {
        state.activeConversationId = null
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
  markConversationAsRead,
  editMessage,
  deleteMessage,
  deleteConversation,
  setLoading,
  setError,
} = messagingSlice.actions

export const selectActiveConversation = (state) =>
  state.messaging.conversations.find(
    (c) => c.id === state.messaging.activeConversationId
  )

export default messagingSlice.reducer
