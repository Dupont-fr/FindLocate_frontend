import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router'
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
import { useSelector } from 'react-redux'
import ForgotPassword from './components/utils/ForgotPassword'
import VerifyEmailCode from './components/utils/VerifyEmailCode'
import VerifyResetCode from './components/utils/VerifyResetCode'
import './components/utils/auth-styles.css'
import { useEffect } from 'react'
import socketService from './services/socket'

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      socketService.connect(user.id)

      return () => {
        socketService.disconnect()
      }
    }
  }, [isAuthenticated, user?.id])

  return (
    <Router>
      <div>
        {/* ======= NAVBAR ======= */}
        <nav className='navbar'>
          {/* Logo */}
          <Link to='/' className='navbar-logo'>
            🏡 FindLocate
          </Link>

          {/* Liens et actions */}
          <div className='navbar-links'>
            <Link to='/' className='nav-link'>
              Acceuil
            </Link>
            <Link to='/add' className='nav-link'>
              Ajouter
            </Link>

            {!isAuthenticated ? (
              <>
                <Link to='/register' className='nav-link'>
                  Inscription
                </Link>
                <Link to='/login' className='nav-link'>
                  Connexion
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
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-email-code' element={<VerifyEmailCode />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-reset-code' element={<VerifyResetCode />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
