import { io } from 'socket.io-client'
import { getToken } from './authService'

const SOCKET_URL = 'http://localhost:3003'

class SocketService {
  constructor() {
    this.socket = null
  }

  connect(userId) {
    if (this.socket?.connected) return

    this.socket = io(SOCKET_URL, {
      auth: { token: getToken() },
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket connecté:', this.socket.id)
      this.socket.emit('user:online', userId)
    })

    this.socket.on('disconnect', () => {
      console.log('❌ Socket déconnecté')
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  // --- CONVERSATIONS ---
  joinConversation(conversationId) {
    this.socket?.emit('conversation:join', conversationId)
  }

  leaveConversation(conversationId) {
    this.socket?.emit('conversation:leave', conversationId)
  }

  // --- MESSAGES ---
  onMessageReceive(callback) {
    this.socket?.on('message:receive', callback)
  }
  offMessageReceive(callback) {
    this.socket?.off('message:receive', callback)
  }

  onMessageUpdated(callback) {
    this.socket?.on('message:updated', callback)
  }
  offMessageUpdated(callback) {
    this.socket?.off('message:updated', callback)
  }

  onMessageDeleted(callback) {
    this.socket?.on('message:deleted', callback)
  }
  offMessageDeleted(callback) {
    this.socket?.off('message:deleted', callback)
  }

  // --- TYPING ---
  startTyping(conversationId, userId, userName) {
    this.socket?.emit('typing:start', { conversationId, userId, userName })
  }

  stopTyping(conversationId, userId) {
    this.socket?.emit('typing:stop', { conversationId, userId })
  }

  onTypingUpdate(callback) {
    this.socket?.on('typing:update', callback)
  }
  offTypingUpdate(callback) {
    this.socket?.off('typing:update', callback)
  }

  // --- LECTURE ---
  markMessagesRead(conversationId, userId) {
    this.socket?.emit('messages:read', { conversationId, userId })
  }

  onMessagesRead(callback) {
    this.socket?.on('messages:read:update', callback)
  }
  offMessagesRead(callback) {
    this.socket?.off('messages:read:update', callback)
  }

  // --- STATUT UTILISATEUR ---
  onUserStatus(callback) {
    this.socket?.on('user:status', callback)
  }
  offUserStatus(callback) {
    this.socket?.off('user:status', callback)
  }

  // --- AUTRES ---
  removeAllListeners() {
    this.socket?.removeAllListeners()
  }

  sendMessage(conversationId, message) {
    if (!this.socket?.connected) return
    this.socket.emit('message:send', { conversationId, message })
  }
}

export default new SocketService()
