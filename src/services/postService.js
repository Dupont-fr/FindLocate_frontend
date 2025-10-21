import axios from 'axios'

const API_URL = 'http://localhost:3003/posts'

const createPost = async (newPost) => {
  if (!newPost.id) {
    newPost.id = Math.random().toString(36).substring(2, 9)
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  })

  if (!response.ok) {
    throw new Error('Erreur lors de la création du post')
  }

  return await response.json()
}

const getAllPosts = async () => {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Erreur de chargement des posts')
  return await res.json()
}

const updatePost = async (id, updatedPost) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost),
  })
  if (!response.ok) throw new Error('Erreur mise à jour du post')
  return await response.json()
}

const updatePostLikes = async (postId, likesArray) => {
  const response = await axios.patch(`${API_URL}/${postId}`, {
    likes: likesArray,
  })
  return response.data
}

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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments: updatedComments }),
  })

  if (!updateRes.ok) throw new Error('Erreur suppression commentaire')
  return await updateRes.json()
}

// Nouvelle fonction : Liker un commentaire
const updateCommentLikes = async (postId, commentId, updatedPosts) => {
  const post = updatedPosts.find((p) => p.id === postId)
  if (!post) throw new Error('Post non trouvé')

  const updateRes = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments: post.comments }),
  })

  if (!updateRes.ok) throw new Error('Erreur mise à jour likes commentaire')
  return await updateRes.json()
}

// Nouvelle fonction : Ajouter une réponse
const addReply = async (postId, commentId, replyData) => {
  const response = await fetch(`${API_URL}/${postId}`)
  const post = await response.json()

  if (!post.comments) throw new Error('Aucun commentaire trouvé')

  const updatedComments = post.comments.map((c) =>
    c.id === commentId
      ? {
          ...c,
          replies: [...(c.replies || []), { ...replyData, likes: [] }],
        }
      : c
  )

  const updateRes = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments: updatedComments }),
  })

  if (!updateRes.ok) throw new Error('Erreur ajout réponse')
  return await updateRes.json()
}

// Nouvelle fonction : Supprimer une réponse
const deleteReply = async (postId, commentId, replyId) => {
  const response = await fetch(`${API_URL}/${postId}`)
  const post = await response.json()

  if (!post.comments) throw new Error('Aucun commentaire trouvé')

  const updatedComments = post.comments.map((c) =>
    c.id === commentId
      ? {
          ...c,
          replies: c.replies.filter((r) => r.id !== replyId),
        }
      : c
  )

  const updateRes = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments: updatedComments }),
  })

  if (!updateRes.ok) throw new Error('Erreur suppression réponse')
  return await updateRes.json()
}

// Nouvelle fonction : Liker une réponse
const updateReplyLikes = async (postId, commentId, replyId, updatedPosts) => {
  const post = updatedPosts.find((p) => p.id === postId)
  if (!post) throw new Error('Post non trouvé')

  const updateRes = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comments: post.comments }),
  })

  if (!updateRes.ok) throw new Error('Erreur mise à jour likes réponse')
  return await updateRes.json()
}

const deletePost = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erreur suppression du post')
  return true
}

const getPostsByUser = async (userId) => {
  const response = await fetch(`http://localhost:3003/posts?userId=${userId}`)
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
