import React, { useState, useEffect } from 'react'
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
import socketService from './services/socket'
import NotificationBadge from './components/messages/NotificationBadge'
import TermsAndConditions from './components/utils/TermsAndConditions'
import Footer from './components/utils/Footer'
import AdminDashboard from './components/admin/AdminDashboard'

// Import des icônes Lucide React
import { Menu, X, Settings, User } from 'lucide-react'
import Help from './components/utils/Help'
import PrivacyPolicy from './components/utils/PrivacyPolicy'
import Contact from './components/utils/Contact'
import FAQ from './components/utils/FAQ'
import SplashScreen from './components/SplashScreen'

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  // État pour gérer l'ouverture/fermeture du menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // État pour gérer l'ouverture/fermeture du menu compte utilisateur
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  // État pour détecter la taille de l'écran (responsive)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [showSplash, setShowSplash] = useState(true)
  const [setAppReady] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      socketService.connect(user.id)

      return () => {
        socketService.disconnect()
      }
    }
  }, [isAuthenticated, user?.id])

  // Détection responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const startTime = Date.now()
    const initApp = async () => {
      try {
        setAppReady(true)
      } catch (error) {
        console.error('Erreur de chargement:', error)
        setAppReady(true)
      }
    }
    initApp()
    const minDisplayTime = 5000
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime
      if (elapsedTime >= minDisplayTime) {
        setShowSplash(false)
      } else {
        setTimeout(() => setShowSplash(false), minDisplayTime - elapsedTime)
      }
    }, minDisplayTime)
    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }
  // Fonction pour fermer le menu mobile après navigation
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  // Fonction pour toggle le menu compte utilisateur - CORRECTION ICI
  const toggleAccountMenu = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsAccountMenuOpen((prev) => !prev)
  }

  // Styles pour le navbar (style Rental.ca)
  const navbarStyles = {
    navbar: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #e6e6e6',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '80px',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 24px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    logo: {
      width: '48px',
      height: '48px',
      backgroundColor: '#0066FF',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1a1a1a',
      letterSpacing: '-0.5px',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    navLink: {
      padding: '10px 16px',
      color: '#1a1a1a',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    },
    rightSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#0066FF',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      display: 'inline-block',
    },
    userButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: 'transparent',
      border: '1px solid #e6e6e6',
      borderRadius: '24px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      position: 'relative',
    },
    userAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#0066FF',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
    },
    hamburger: {
      padding: '8px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      borderRadius: '8px',
    },
  }

  return (
    <Router>
      <div>
        {/* ======= NAVBAR STYLE RENTAL.CA ======= */}
        <nav style={navbarStyles.navbar}>
          <div style={navbarStyles.container}>
            {/* Section gauche: Logo + Navigation Desktop */}
            <div style={navbarStyles.leftSection}>
              {/* Menu Hamburger - Visible seulement sur mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  ...navbarStyles.hamburger,
                  display: isMobile ? 'block' : 'none',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#f5f5f5')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = 'transparent')
                }
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logo */}
              <Link
                to='/'
                style={navbarStyles.logoContainer}
                onClick={handleLinkClick}
              >
                <div style={navbarStyles.logo}>
                  {/* Remplacez par votre logo */}
                  <img
                    src='/logo3.png'
                    alt='Logo'
                    style={{
                      width: '9000px',
                      height: '100px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                  {/* <span
                    style={{
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: 'bold',
                    }}
                  >
                    FL
                  </span> */}
                </div>
                {/* <span style={navbarStyles.logoText}>FindLocate</span> */}
              </Link>

              {/* Navigation Desktop - Cachée sur mobile */}
              {!isMobile && (
                <div style={navbarStyles.navLinks}>
                  <Link
                    to='/'
                    style={navbarStyles.navLink}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = '#f5f5f5')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = 'transparent')
                    }
                  >
                    Accueil
                  </Link>
                  {isAuthenticated && (
                    <Link
                      to='/messages'
                      style={navbarStyles.navLink}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#f5f5f5')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = 'transparent')
                      }
                    >
                      💬 Messages
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Section droite: Actions utilisateur */}
            <div style={navbarStyles.rightSection}>
              {!isAuthenticated ? (
                <>
                  {/* Connexion - Caché sur mobile */}
                  <Link
                    to='/login'
                    style={{
                      ...navbarStyles.navLink,
                      display: isMobile ? 'none' : 'block',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = '#f5f5f5')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = 'transparent')
                    }
                  >
                    Connexion
                  </Link>
                  {/* S'inscrire - Caché sur mobile */}
                  <Link
                    to='/register'
                    style={{
                      ...navbarStyles.addButton,
                      display: isMobile ? 'none' : 'inline-block',
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = '#0052cc')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = '#0066FF')
                    }
                  >
                    S'inscrire
                  </Link>
                </>
              ) : (
                <>
                  {/* Bouton Ajouter - Caché sur mobile */}
                  {!isMobile && (
                    <Link
                      to='/add'
                      style={navbarStyles.addButton}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#0052cc')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = '#0066FF')
                      }
                    >
                      + Ajouter
                    </Link>
                  )}

                  {/* Badge de notification */}
                  <div style={{ position: 'relative' }}>
                    <NotificationBadge />
                  </div>

                  {/* Bouton utilisateur avec menu */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={toggleAccountMenu}
                      style={navbarStyles.userButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#d0d0d0'
                        e.currentTarget.style.boxShadow =
                          '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e6e6e6'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <Menu size={20} color='#1a1a1a' />
                      <div style={navbarStyles.userAvatar}>
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.firstName}
                            style={{
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <User size={18} />
                        )}
                      </div>
                    </button>

                    {/* AccountMenu - S'ouvre directement au clic */}
                    {isAccountMenuOpen && (
                      <AccountMenu
                        isOpen={isAccountMenuOpen}
                        onClose={() => setIsAccountMenuOpen(false)}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Menu Mobile - Overlay */}
          {isMobileMenuOpen && (
            <>
              {/* Overlay sombre */}
              <div
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  position: 'fixed',
                  top: '72px',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 999,
                }}
              />

              {/* Panneau de menu mobile */}
              <div
                style={{
                  position: 'fixed',
                  top: '72px',
                  left: 0,
                  bottom: 0,
                  width: '300px',
                  backgroundColor: '#fff',
                  boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  overflowY: 'auto',
                  padding: '16px',
                }}
              >
                {/* Liens de navigation mobile - Tous avec style bleu */}
                <Link
                  to='/'
                  onClick={handleLinkClick}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#fff',
                    backgroundColor: '#0066FF',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = '#0052cc')
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = '#0066FF')
                  }
                >
                  🏠 Accueil
                </Link>

                {isAuthenticated ? (
                  <>
                    {/* Bouton Ajouter */}
                    <Link
                      to='/add'
                      onClick={handleLinkClick}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#fff',
                        backgroundColor: '#0066FF',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#0052cc')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = '#0066FF')
                      }
                    >
                      ➕ Ajouter une annonce
                    </Link>

                    {/* Messages */}
                    <Link
                      to='/messages'
                      onClick={handleLinkClick}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#fff',
                        backgroundColor: '#0066FF',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#0052cc')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = '#0066FF')
                      }
                    >
                      💬 Messages
                    </Link>

                    <div
                      style={{
                        borderTop: '1px solid #e6e6e6',
                        margin: '16px 0',
                      }}
                    />

                    {/* Paramètres */}
                    <Link
                      to='/profile/edit'
                      onClick={handleLinkClick}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 16px',
                        color: '#fff',
                        backgroundColor: '#0066FF',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        marginBottom: '8px',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#0052cc')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = '#0066FF')
                      }
                    >
                      <Settings size={18} style={{ marginRight: '8px' }} />
                      Paramètres
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Connexion */}
                    <Link
                      to='/login'
                      onClick={handleLinkClick}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#fff',
                        backgroundColor: '#0066FF',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#0052cc')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = '#0066FF')
                      }
                    >
                      🔐 Connexion
                    </Link>

                    {/* S'inscrire */}
                    <Link
                      to='/register'
                      onClick={handleLinkClick}
                      style={{
                        display: 'block',
                        padding: '12px 16px',
                        color: '#fff',
                        backgroundColor: '#0066FF',
                        textDecoration: 'none',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '8px',
                        marginBottom: '8px',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = '#0052cc')
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = '#0066FF')
                      }
                    >
                      📝 S'inscrire
                    </Link>
                  </>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Espace pour compenser la navbar fixe */}
        <div style={{ height: '72px' }} />

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
          <Route
            path='/admin'
            element={
              user?.role === 'admin' ? <AdminDashboard /> : <Navigate to='/' />
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/verify-email-code' element={<VerifyEmailCode />} />
          <Route path='/verify-reset-code' element={<VerifyResetCode />} />
          <Route path='/NotificationBadge' element={<NotificationBadge />} />
          <Route path='/terms' element={<TermsAndConditions />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/privacy' element={<PrivacyPolicy />} />
          <Route path='/help' element={<Help />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
