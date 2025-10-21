// src/services/likeService.js
const API_URL = 'http://localhost:3003/posts'

// Ajout ou retrait d’un like sur un post
export const toggleLike = async (postId, updatedLikes) => {
  const response = await fetch(`${API_URL}/${postId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likes: updatedLikes }),
  })

  if (!response.ok) {
    throw new Error('Erreur mise à jour du like')
  }

  return await response.json()
}
