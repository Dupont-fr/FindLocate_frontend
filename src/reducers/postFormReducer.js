// src/reducers/postFormReducer.js
import { createSlice } from '@reduxjs/toolkit'
import postService from '../services/postService'
import { showNotification } from './notificationReducer'

const postFormSlice = createSlice({
  name: 'postForm',
  initialState: {
    posts: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    createPostStart: (state) => {
      //state.loading = true
      state.error = null
      state.success = false
    },
    createPostSuccess: (state, action) => {
      state.loading = false
      state.success = true
      state.posts.unshift(action.payload)
    },
    createPostFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    setPosts: (state, action) => {
      state.posts = action.payload.reverse()
    },
    updatePostAction: (state, action) => {
      const updatedPost = action.payload
      const index = state.posts.findIndex((p) => p.id === updatedPost.id)
      if (index !== -1) {
        state.posts[index] = updatedPost
      }
    },
    // Nouvelle action : synchroniser les infos utilisateur dans tous les posts
    updateUserInfoInPosts: (state, action) => {
      const { userId, firstName, lastName, profilePicture } = action.payload

      state.posts = state.posts.map((post) => {
        if (post.userId === userId) {
          return {
            ...post,
            userName: `${firstName} ${lastName}`,
            userAvatar: profilePicture,
            // Mise à jour des commentaires aussi
            comments:
              post.comments?.map((comment) => {
                if (comment.userId === userId) {
                  return {
                    ...comment,
                    userName: `${firstName} ${lastName}`,
                    userAvatar: profilePicture,
                  }
                }
                return comment
              }) || [],
          }
        }
        return post
      })
    },
  },
})

export const {
  updatePostAction,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  setPosts,
  updateUserInfoInPosts,
} = postFormSlice.actions

// Thunks
export const fetchPostsThunk = () => async (dispatch) => {
  try {
    const data = await postService.getAllPosts()
    dispatch(setPosts(data))
  } catch (error) {
    console.error('Erreur chargement posts', error)
  }
}

export const updatePostThunk = (id, updatedPost) => async (dispatch) => {
  try {
    const post = await postService.updatePost(id, updatedPost)
    dispatch(updatePostAction(post))
    dispatch(showNotification('Success: Post mis à jour avec succès.', 4))
  } catch (error) {
    console.error('Erreur mise à jour post', error)
    dispatch(showNotification('Error: Échec de la mise à jour.', 4))
  }
}

export const createPostThunk = (postData) => async (dispatch) => {
  dispatch(createPostStart())
  try {
    const createdPost = await postService.createPost(postData)
    dispatch(createPostSuccess(createdPost))
  } catch (error) {
    dispatch(createPostFailure(error.message))
  }
}

// Thunk pour synchroniser les infos utilisateur dans tous les posts et commentaires
export const syncUserInfoThunk =
  (userId, updatedUserData) => async (dispatch) => {
    try {
      dispatch(
        updateUserInfoInPosts({
          userId,
          firstName: updatedUserData.firstName,
          lastName: updatedUserData.lastName,
          profilePicture: updatedUserData.profilePicture,
        })
      )
    } catch (error) {
      console.error('Erreur synchronisation infos utilisateur', error)
    }
  }

export default postFormSlice.reducer
