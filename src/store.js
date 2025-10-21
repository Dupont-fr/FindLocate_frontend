import { configureStore } from '@reduxjs/toolkit'
import userFormReducer from './reducers/userFormReducer'
import notificationReducer from './reducers/notificationReducer'
import postFormReducer from './reducers/postFormReducer'
import authReducer from './reducers/authReducer'
import likeReducer from './reducers/likeReducer'
import commentReducer from './reducers/commentReducer'
import searchReducer from './reducers/searchReducer'
import messagingReducer from './reducers/messagingReducer'
const store = configureStore({
  reducer: {
    userForm: userFormReducer,
    notification: notificationReducer,
    postForm: postFormReducer,
    auth: authReducer,
    likes: likeReducer,
    comments: commentReducer,
    search: searchReducer,
    messaging: messagingReducer,
  },
})

export default store
