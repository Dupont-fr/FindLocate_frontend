const API_URL = 'http://localhost:3003/conversations'

// Récupérer toutes les conversations d'un utilisateur
const getUserConversations = async (userId) => {
  try {
    const res = await fetch(`${API_URL}?userId=${userId}`)
    if (!res.ok) throw new Error('Erreur chargement conversations')
    return await res.json()
  } catch (error) {
    console.error('Erreur getUserConversations:', error)
    throw error
  }
}

// Récupérer une conversation spécifique
const getConversation = async (conversationId) => {
  try {
    const res = await fetch(`${API_URL}/${conversationId}`)
    if (!res.ok) throw new Error('Conversation non trouvée')
    return await res.json()
  } catch (error) {
    console.error('Erreur getConversation:', error)
    throw error
  }
}

// Créer une nouvelle conversation
const createConversation = async (conversation) => {
  try {
    if (!conversation.id) {
      conversation.id = Math.random().toString(36).substring(2, 9)
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...conversation,
        messages: conversation.messages || [],
        createdAt: new Date().toISOString(),
      }),
    })

    if (!res.ok) throw new Error('Erreur création conversation')
    return await res.json()
  } catch (error) {
    console.error('Erreur createConversation:', error)
    throw error
  }
}

// Ajouter un message à une conversation
const addMessage = async (conversationId, message) => {
  try {
    const res = await fetch(`${API_URL}/${conversationId}`)
    if (!res.ok) throw new Error('Conversation non trouvée')

    const conversation = await res.json()

    if (!conversation.messages) {
      conversation.messages = []
    }

    const newMessage = {
      id: Date.now().toString(),
      ...message,
      createdAt: new Date().toISOString(),
    }

    conversation.messages.push(newMessage)
    conversation.lastMessage = message.text
    conversation.lastMessageTime = newMessage.createdAt

    const updateRes = await fetch(`${API_URL}/${conversationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(conversation),
    })

    if (!updateRes.ok) throw new Error('Erreur ajout message')
    return await updateRes.json()
  } catch (error) {
    console.error('Erreur addMessage:', error)
    throw error
  }
}

// Vérifier si une conversation existe entre deux utilisateurs
const findExistingConversation = async (userId1, userId2) => {
  try {
    const conversations = await getUserConversations(userId1)
    return conversations.find((c) => c.participantId === userId2) || null
  } catch (error) {
    console.error('Erreur findExistingConversation:', error)
    return null
  }
}

export default {
  getUserConversations,
  getConversation,
  createConversation,
  addMessage,
  findExistingConversation,
}
