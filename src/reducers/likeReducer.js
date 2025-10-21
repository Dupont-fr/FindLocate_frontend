import { createSlice } from '@reduxjs/toolkit'
import postService from '../services/postService'
import { updatePostAction } from './postFormReducer'

const likeSlice = createSlice({
  name: 'likes',
  initialState: { loading: false, error: null },
  reducers: {
    likeStart: (state) => {
      state.loading = true
      state.error = null
    },
    likeSuccess: (state) => {
      state.loading = false
    },
    likeFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const { likeStart, likeSuccess, likeFailure } = likeSlice.actions

// === 🔥 Version Optimistic ===
export const toggleLikeThunk = (post, user) => async (dispatch) => {
  const likesArray = Array.isArray(post.likes) ? [...post.likes] : []
  const userIdStr = String(user.id)
  const alreadyLiked = likesArray.some((l) => String(l.userId) === userIdStr)

  // --- Étape 1 : créer l’état "optimiste"
  const updatedLikes = alreadyLiked
    ? likesArray.filter((l) => String(l.userId) !== userIdStr)
    : [
        ...likesArray,
        {
          userId: user.id,
          userName: user.firstName || user.username || user.email,
        },
      ]

  const optimisticPost = { ...post, likes: updatedLikes }

  // --- Étape 2 : mise à jour immédiate du store (optimiste)
  dispatch(updatePostAction(optimisticPost))

  // --- Étape 3 : tentative d’enregistrement côté serveur
  try {
    const updatedFromServer = await postService.updatePostLikes(
      post.id,
      updatedLikes
    )
    // ⚙️ Réconciliation avec les données serveur
    dispatch(updatePostAction(updatedFromServer))
    dispatch(likeSuccess())
  } catch (err) {
    console.error('Erreur lors du like:', err)
    dispatch(likeFailure(err.message || 'Erreur like'))
    // ❌ Étape 4 : rollback (annule le changement si échec serveur)
    dispatch(updatePostAction(post))
  }
}

export default likeSlice.reducer
