import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/authReducer'

const AccountMenu = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      dispatch(logout())
      setIsOpen(false)
      navigate('/')
    }
  }

  return (
    <div style={styles.container} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={styles.triggerBtn}
        title='Mon compte'
      >
        {user?.firstName}
      </button>

      {isOpen && (
        <div style={styles.menu}>
          <div style={styles.header}>
            <img
              src={
                user?.profilePicture || 'https://ui-avatars.com/api/?name=User'
              }
              alt='avatar'
              style={styles.avatar}
            />
            <div style={styles.userInfo}>
              <strong>
                {user?.firstName} {user?.lastName}
              </strong>
              <small>{user?.email}</small>
            </div>
          </div>

          <hr style={styles.divider} />

          <button
            onClick={() => handleNavigate(`/user/${user?.id}`)}
            style={styles.menuItem}
          >
            👁️ Voir mon profil
          </button>

          <button
            onClick={() => handleNavigate('/profile/edit')}
            style={styles.menuItem}
          >
            ✏️ Modifier mon profil
          </button>

          <button
            onClick={() => handleNavigate(`/my-posts/${user?.id}`)}
            style={styles.menuItem}
          >
            📝 Mes posts
          </button>

          <hr style={styles.divider} />

          <button
            onClick={() => handleNavigate('/profile/delete')}
            style={{ ...styles.menuItem, color: '#d32f2f' }}
          >
            🗑️ Supprimer mon compte
          </button>

          <button
            onClick={handleLogout}
            style={{ ...styles.menuItem, color: '#d32f2f' }}
          >
            🚪 Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  triggerBtn: {
    background: 'transparent',
    border: 'none',
    color: '#1877f2',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.2s',
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '240px',
    marginTop: '8px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderBottom: '1px solid #f0f0f0',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '12px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '0',
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '10px 12px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#050505',
    transition: 'background-color 0.2s',
  },
}

export default AccountMenu
