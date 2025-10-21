import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/userService'

const userFormSlice = createSlice({
  name: 'userForm',

  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  reducers: {
    submitUserFormStart: (state) => {
      state.loading = true
      state.error = null
    },
    submitUserFormSuccess: (state, action) => {
      state.loading = false
      state.user = action.payload

      state.error = null
    },
    submitUserFormFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const createUserThunk = (userData) => async (dispatch) => {
  dispatch(submitUserFormStart())
  try {
    const newUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,

      email: userData.email,
      password: userData.password,
      phonenumber: userData.phonenumber,
      bio: userData.bio,
      profilePicture:
        userData.profilePicture ||
        'https://cdn-icons-png.flaticon.com/512/149/149071.png',
      followers: [],
      following: [],
      posts: [],
      favorites: [],
    }

    //  Ici on appelle bien le service, pas la fonction du slice
    const createdUser = await userService.createUser(newUser)

    dispatch(submitUserFormSuccess(createdUser))
  } catch (error) {
    dispatch(submitUserFormFailure(error.message))
  }
}

export const {
  submitUserFormStart,
  submitUserFormSuccess,
  submitUserFormFailure,
} = userFormSlice.actions

export default userFormSlice.reducer
