import { createSlice } from '@reduxjs/toolkit'
import postService from '../services/postService'
import { showNotification } from './notificationReducer'
import { setPosts } from './postFormReducer'

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    addCommentStart: (state) => {
      state.loading = true
      state.error = null
    },
    addCommentSuccess: (state) => {
      state.loading = false
    },
    addCommentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updateCommentStart: (state) => {
      state.loading = true
      state.error = null
    },
    updateCommentSuccess: (state) => {
      state.loading = false
    },
    updateCommentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    deleteCommentStart: (state) => {
      state.loading = true
      state.error = null
    },
    deleteCommentSuccess: (state) => {
      state.loading = false
    },
    deleteCommentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  addCommentStart,
  addCommentSuccess,
  addCommentFailure,
  updateCommentStart,
  updateCommentSuccess,
  updateCommentFailure,
  deleteCommentStart,
  deleteCommentSuccess,
  deleteCommentFailure,
} = commentSlice.actions

// === Thunk pour ajouter un commentaire ===
export const addCommentThunk =
  (postId, commentData) => async (dispatch, getState) => {
    dispatch(addCommentStart())

    try {
      const posts = getState().postForm.posts

      const updatedPosts = posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...(p.comments || []),
                { ...commentData, likes: [], replies: [] },
              ],
            }
          : p
      )

      dispatch(setPosts([...updatedPosts].reverse()))
      await postService.addComment(postId, commentData)

      dispatch(addCommentSuccess())
      dispatch(showNotification('Success: Commentaire ajouté avec succès.', 4))
    } catch (error) {
      console.error('Erreur ajout commentaire:', error)
      dispatch(addCommentFailure(error.message))
      dispatch(showNotification("Error: Échec de l'ajout du commentaire.", 5))
    }
  }

// === Thunk pour modifier un commentaire ===
export const updateCommentThunk =
  (postId, commentId, newText) => async (dispatch, getState) => {
    dispatch(updateCommentStart())

    try {
      const posts = getState().postForm.posts

      const updatedPosts = posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId ? { ...c, text: newText } : c
              ),
            }
          : p
      )

      dispatch(setPosts([...updatedPosts].reverse()))
      await postService.updateComment(postId, commentId, newText)

      dispatch(updateCommentSuccess())
      dispatch(showNotification('Success: Commentaire modifié avec succès.', 4))
    } catch (error) {
      console.error('Erreur modification commentaire:', error)
      dispatch(updateCommentFailure(error.message))
      dispatch(showNotification('Error: Échec de la modification.', 5))
    }
  }

// === Thunk pour supprimer un commentaire ===
export const deleteCommentThunk =
  (postId, commentId) => async (dispatch, getState) => {
    dispatch(deleteCommentStart())

    try {
      const posts = getState().postForm.posts

      const updatedPosts = posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.filter((c) => c.id !== commentId),
            }
          : p
      )

      dispatch(setPosts([...updatedPosts].reverse()))
      await postService.deleteComment(postId, commentId)

      dispatch(deleteCommentSuccess())
      dispatch(
        showNotification('Success: Commentaire supprimé avec succès.', 4)
      )
    } catch (error) {
      console.error('Erreur suppression commentaire:', error)
      dispatch(deleteCommentFailure(error.message))
      dispatch(showNotification('Error: Échec de la suppression.', 5))
    }
  }

// === Thunk pour liker/unliker un commentaire ===
export const toggleCommentLikeThunk =
  (postId, commentId, user) => async (dispatch, getState) => {
    try {
      const posts = getState().postForm.posts
      const userIdStr = String(user.id)

      const updatedPosts = posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) => {
                if (c.id === commentId) {
                  const likes = c.likes || []
                  const alreadyLiked = likes.some(
                    (l) => String(l.userId) === userIdStr
                  )

                  return {
                    ...c,
                    likes: alreadyLiked
                      ? likes.filter((l) => String(l.userId) !== userIdStr)
                      : [
                          ...likes,
                          {
                            userId: user.id,
                            userName:
                              user.firstName || user.username || user.email,
                          },
                        ],
                  }
                }
                return c
              }),
            }
          : p
      )

      dispatch(setPosts([...updatedPosts].reverse()))
      await postService.updateCommentLikes(postId, commentId, updatedPosts)
    } catch (error) {
      console.error('Erreur like commentaire:', error)
      dispatch(showNotification('Error: Échec du like.', 5))
    }
  }

// === Thunk pour ajouter une réponse ===
export const addReplyThunk =
  (postId, commentId, replyData) => async (dispatch, getState) => {
    dispatch(addCommentStart())

    try {
      const posts = getState().postForm.posts

      const updatedPosts = posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId
                  ? {
                      ...c,
                      replies: [
                        ...(c.replies || []),
                        { ...replyData, likes: [] },
                      ],
                    }
                  : c
              ),
            }
          : p
      )

      dispatch(setPosts([...updatedPosts].reverse()))
      await postService.addReply(postId, commentId, replyData)

      dispatch(addCommentSuccess())
      dispatch(showNotification('Success: Réponse ajoutée avec succès.', 4))
    } catch (error) {
      console.error('Erreur ajout réponse:', error)
      dispatch(addCommentFailure(error.message))
      dispatch(showNotification("Error: Échec de l'ajout de la réponse.", 5))
    }
  }

// === Thunk pour supprimer une réponse ===
export const deleteReplyThunk =
  (postId, commentId, replyId) => async (dispatch, getState) => {
    dispatch(deleteCommentStart())

    try {
      const posts = getState().postForm.posts

      const updatedPosts = posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId
                  ? {
                      ...c,
                      replies: c.replies.filter((r) => r.id !== replyId),
                    }
                  : c
              ),
            }
          : p
      )

      dispatch(setPosts([...updatedPosts].reverse()))
      await postService.deleteReply(postId, commentId, replyId)

      dispatch(deleteCommentSuccess())
      dispatch(showNotification('Success: Réponse supprimée avec succès.', 4))
    } catch (error) {
      console.error('Erreur suppression réponse:', error)
      dispatch(deleteCommentFailure(error.message))
      dispatch(showNotification('Error: Échec de la suppression.', 5))
    }
  }

// === Thunk pour liker une réponse ===
export const toggleReplyLikeThunk =
  (postId, commentId, replyId, user) => async (dispatch, getState) => {
    try {
      const posts = getState().postForm.posts
      const userIdStr = String(user.id)

      const updatedPosts = posts.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: p.comments.map((c) =>
                c.id === commentId
                  ? {
                      ...c,
                      replies: c.replies.map((r) => {
                        if (r.id === replyId) {
                          const likes = r.likes || []
                          const alreadyLiked = likes.some(
                            (l) => String(l.userId) === userIdStr
                          )

                          return {
                            ...r,
                            likes: alreadyLiked
                              ? likes.filter(
                                  (l) => String(l.userId) !== userIdStr
                                )
                              : [
                                  ...likes,
                                  {
                                    userId: user.id,
                                    userName:
                                      user.firstName ||
                                      user.username ||
                                      user.email,
                                  },
                                ],
                          }
                        }
                        return r
                      }),
                    }
                  : c
              ),
            }
          : p
      )

      dispatch(setPosts([...updatedPosts].reverse()))
      await postService.updateReplyLikes(
        postId,
        commentId,
        replyId,
        updatedPosts
      )
    } catch (error) {
      console.error('Erreur like réponse:', error)
      dispatch(showNotification('Error: Échec du like.', 5))
    }
  }

export default commentSlice.reducer
