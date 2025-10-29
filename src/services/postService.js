import axios from 'axios'

const API_URL = 'http://localhost:3003/api/posts'

/* -------------------------------------------------------------------------- */
/* 🟩 AJOUT DU TOKEN D’AUTHENTIFICATION 🟩 */
/* -------------------------------------------------------------------------- */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  if (!token) return { 'Content-Type': 'application/json' }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

/* -------------------------------------------------------------------------- */
/* 🟩 CRÉATION / LECTURE / MISE À JOUR / SUPPRESSION DE POST 🟩 */
/* -------------------------------------------------------------------------- */

const createPost = async (newPost) => {
  if (!newPost.id) newPost.id = Math.random().toString(36).substring(2, 9)

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(newPost),
  })

  if (!response.ok) throw new Error('Erreur lors de la création du post')
  return await response.json()
}

const getAllPosts = async () => {
  const res = await fetch(API_URL, { headers: getAuthHeaders() })
  if (!res.ok) throw new Error('Erreur de chargement des posts')
  return await res.json()
}

const updatePost = async (id, updatedPost) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedPost),
  })
  if (!response.ok) throw new Error('Erreur mise à jour du post')
  return await response.json()
}

const deletePost = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (!res.ok) throw new Error('Erreur suppression du post')
  return true
}

/* -------------------------------------------------------------------------- */
/* 🟩 COMMENTAIRES 🟩 */
/* -------------------------------------------------------------------------- */

const addComment = async (postId, commentData) => {
  const response = await fetch(`${API_URL}/${postId}`)
  const post = await response.json()
  if (!post.comments) post.comments = []

  const newComment = {
    ...commentData,
    likes: commentData.likes || [],
    replies: commentData.replies || [],
  }

  const updatedComments = [...post.comments, newComment]

  const updateRes = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ comments: updatedComments }),
  })

  if (!updateRes.ok) throw new Error('Erreur ajout commentaire')
  return await updateRes.json()
}

const updateComment = async (postId, commentId, newText) => {
  const response = await fetch(`${API_URL}/${postId}`)
  const post = await response.json()
  if (!post.comments) throw new Error('Aucun commentaire trouvé')

  const updatedComments = post.comments.map((c) =>
    c.id === commentId ? { ...c, text: newText } : c
  )

  const updateRes = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ comments: updatedComments }),
  })

  if (!updateRes.ok) throw new Error('Erreur modification commentaire')
  return await updateRes.json()
}

const deleteComment = async (postId, commentId) => {
  const response = await fetch(`${API_URL}/${postId}`)
  const post = await response.json()
  if (!post.comments) throw new Error('Aucun commentaire trouvé')

  const updatedComments = post.comments.filter((c) => c.id !== commentId)

  const updateRes = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ comments: updatedComments }),
  })

  if (!updateRes.ok) throw new Error('Erreur suppression commentaire')
  return await updateRes.json()
}

/* -------------------------------------------------------------------------- */
/* 🟩 NOUVELLES MÉTHODES POUR LIKES ET RÉPONSES 🟩 */
/* -------------------------------------------------------------------------- */

// ✅ Liker / déliker un commentaire
const updateCommentLikes = async (postId, commentId, userData) => {
  // 🟨 On ne garde que les champs essentiels de l’utilisateur
  const likeData = {
    userId: userData.userId,
    userName: userData.userName,
    userAvatar: userData.userAvatar,
  }

  const response = await axios.patch(
    `${API_URL}/${postId}`,
    {
      action: 'toggleCommentLike',
      commentId,
      likeData,
    },
    { headers: getAuthHeaders() }
  )
  return response.data
}

// ✅ Ajouter une réponse
const addReply = async (postId, commentId, replyData) => {
  const cleanReply = {
    id: replyData.id || Date.now().toString(),
    userId: replyData.userId,
    userName: replyData.userName,
    userAvatar: replyData.userAvatar,
    text: replyData.text,
    likes: [],
    createdAt: new Date().toISOString(),
  }

  const response = await axios.patch(
    `${API_URL}/${postId}`,
    {
      action: 'addReply',
      commentId,
      replyData: cleanReply,
    },
    { headers: getAuthHeaders() }
  )
  return response.data
}

// ✅ Supprimer une réponse
const deleteReply = async (postId, commentId, replyId) => {
  const response = await axios.patch(
    `${API_URL}/${postId}`,
    {
      action: 'deleteReply',
      commentId,
      replyId,
    },
    { headers: getAuthHeaders() }
  )
  return response.data
}

// ✅ Liker / déliker une réponse
const updateReplyLikes = async (postId, commentId, replyId, userData) => {
  const likeData = {
    userId: userData.userId,
    userName: userData.userName,
    userAvatar: userData.userAvatar,
  }

  const response = await axios.patch(
    `${API_URL}/${postId}`,
    {
      action: 'toggleReplyLike',
      commentId,
      replyId,
      likeData,
    },
    { headers: getAuthHeaders() }
  )
  return response.data
}

/* -------------------------------------------------------------------------- */
/* 🟩 AUTRES UTILITAIRES 🟩 */
/* -------------------------------------------------------------------------- */

const updatePostLikes = async (postId, likesArray) => {
  const response = await axios.patch(
    `${API_URL}/${postId}`,
    { likes: likesArray },
    { headers: getAuthHeaders() }
  )
  return response.data
}

const getPostsByUser = async (userId) => {
  const response = await fetch(`${API_URL}?userId=${userId}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok)
    throw new Error("Erreur récupération des posts de l'utilisateur")
  return await response.json()
}

const syncUserInfoInDatabase = async (
  userId,
  firstName,
  lastName,
  profilePicture
) => {
  try {
    const posts = await getAllPosts()
    const userPosts = posts.filter((post) => post.userId === userId)

    for (const post of userPosts) {
      const updatedPost = {
        ...post,
        userName: `${firstName} ${lastName}`,
        userAvatar: profilePicture,
        comments:
          post.comments?.map((comment) => {
            if (comment.userId === userId) {
              return {
                ...comment,
                userName: `${firstName} ${lastName}`,
                userAvatar: profilePicture,
                replies:
                  comment.replies?.map((reply) => {
                    if (reply.userId === userId) {
                      return {
                        ...reply,
                        userName: `${firstName} ${lastName}`,
                        userAvatar: profilePicture,
                      }
                    }
                    return reply
                  }) || [],
              }
            }
            return comment
          }) || [],
      }

      await updatePost(post.id, updatedPost)
    }

    return true
  } catch (error) {
    console.error('Erreur synchronisation base de données:', error)
    throw error
  }
}

/* -------------------------------------------------------------------------- */
/* 🟩 EXPORT FINAL 🟩 */
/* -------------------------------------------------------------------------- */
export default {
  createPost,
  getAllPosts,
  updatePost,
  updatePostLikes,
  addComment,
  updateComment,
  deleteComment,
  updateCommentLikes,
  addReply,
  deleteReply,
  updateReplyLikes,
  deletePost,
  getPostsByUser,
  syncUserInfoInDatabase,
}
