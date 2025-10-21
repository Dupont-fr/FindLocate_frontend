import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    isAuthenticated: !!localStorage.getItem('user'),
    error: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    loginFailure(state, action) {
      state.error = action.payload
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('user')
    },
    updateAuthUser(state, action) {
      state.user = action.payload
    },
  },
})

export const { loginSuccess, loginFailure, logout, updateAuthUser } =
  authSlice.actions
export default authSlice.reducer
