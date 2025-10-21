import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { setSearchQuery } from './reducers/searchReducer'
import Register from './components/Register'
import PostForm from './components/PostForm'
import Home from './components/Home'
import Login from './components/Login'
import Notification from './components/Notification'
import UserProfile from './components/UserProfile'
import UserEditProfile from './components/updates/UserEditProfile'
import AccountMenu from './components/AccountMenu'
import MyPosts from './components/MyPosts'
import DeleteAccount from './components/DeleteAccount'
import './index.css'
import Messages from './components/messages/Message'
import PostDetail from './components/PostDetail'

const App = () => {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { query } = useSelector((state) => state.search)

  return (
    <Router>
      <div>
        {/* ======= NAVBAR ======= */}
        <nav className='navbar'>
          {/* Logo */}
          <Link to='/' className='navbar-logo'>
            🏡 FindLocate
          </Link>

          {/* 🔍 Barre de recherche */}
          <input
            type='text'
            className='navbar-search'
            placeholder='Rechercher par ville, région, type, prix...'
            value={query}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />

          {/* Liens et actions */}
          <div className='navbar-links'>
            <Link to='/' className='nav-link'>
              Home
            </Link>
            <Link to='/add' className='nav-link'>
              Add new
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to='/register' className='nav-link'>
                  Register
                </Link>
                <Link to='/login' className='nav-link'>
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link to='/messages' className='nav-link'>
                  💬 Messages
                </Link>
                <AccountMenu />
              </>
            )}
          </div>
        </nav>

        {/* Notifications */}
        <div className='notification-container'>
          <Notification />
        </div>

        {/* ======= ROUTES ======= */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/add'
            element={
              isAuthenticated ? <PostForm /> : <Navigate to='/login' replace />
            }
          />
          <Route path='/user/:id' element={<UserProfile />} />
          <Route
            path='/profile/edit'
            element={
              isAuthenticated ? (
                <UserEditProfile />
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
          <Route
            path='/my-posts/:userId'
            element={
              isAuthenticated ? <MyPosts /> : <Navigate to='/login' replace />
            }
          />
          <Route
            path='/profile/delete'
            element={
              isAuthenticated ? (
                <DeleteAccount />
              ) : (
                <Navigate to='/login' replace />
              )
            }
          />
          <Route
            path='/post/:postId'
            element={<PostDetail key={window.location.pathname} />}
          />
          <Route
            path='/messages'
            element={
              isAuthenticated ? <Messages /> : <Navigate to='/login' replace />
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
