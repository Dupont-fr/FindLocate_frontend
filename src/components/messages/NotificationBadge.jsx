import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import socketService from '../../services/socket'

const NotificationBadge = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    // 🆕 Handler pour les nouveaux messages
    const handleNewMessage = (data) => {
      console.log('🔔 Nouvelle notification message reçue:', data)
      addNotification({
        ...data,
        type: 'message',
      })
    }

    // 🆕 Handler pour les likes
    const handleNewLike = (data) => {
      console.log('🔔 Nouvelle notification like reçue:', data)
      addNotification(data)
    }

    // 🆕 Handler pour les commentaires
    const handleNewComment = (data) => {
      console.log('🔔 Nouvelle notification commentaire reçue:', data)
      addNotification(data)
    }

    // 🆕 Fonction commune pour ajouter une notification
    const addNotification = (data) => {
      // Notification navigateur
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.message, {
          body: data.commentPreview || data.messagePreview || data.postPreview,
          icon: data.senderAvatar,
          tag: `${data.type}-${data.postId || data.conversationId}`,
        })
      }

      setNotifications((prev) => {
        // Éviter les doublons
        const exists = prev.some(
          (n) =>
            n.type === data.type &&
            (n.postId === data.postId ||
              n.conversationId === data.conversationId) &&
            n.timestamp === data.timestamp
        )
        if (exists) return prev

        return [data, ...prev].slice(0, 20) // Garder max 20 notifications
      })

      playNotificationSound()
    }

    // Écouter les événements Socket.IO
    socketService.socket?.on('notification:new-message', handleNewMessage)
    socketService.socket?.on('notification:new-like', handleNewLike)
    socketService.socket?.on('notification:new-comment', handleNewComment)

    // Demander la permission pour les notifications navigateur
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    return () => {
      socketService.socket?.off('notification:new-message', handleNewMessage)
      socketService.socket?.off('notification:new-like', handleNewLike)
      socketService.socket?.off('notification:new-comment', handleNewComment)
    }
  }, [isAuthenticated, user?.id])

  const playNotificationSound = () => {
    try {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE='
      )
      audio.volume = 0.3
      audio.play().catch((e) => console.log('Son non joué:', e))
    } catch (error) {
      console.log('Erreur lecture son:', error)
    }
  }

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.filter((n, index) => index !== notificationId)
    )
  }

  // 🆕 Fonction pour gérer la navigation selon le type de notification
  const handleNotificationClick = (notif, index) => {
    markAsRead(index)
    setShowDropdown(false)

    switch (notif.type) {
      case 'message':
        navigate(`/messages?conversation=${notif.conversationId}`)
        break
      case 'like':
      case 'comment':
        navigate(`/posts/${notif.postId}`)
        break
      default:
        console.warn('Type de notification inconnu:', notif.type)
    }
  }

  // 🆕 Fonction pour obtenir l'icône selon le type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return '💬'
      case 'like':
        return '❤️'
      case 'comment':
        return '💭'
      default:
        return '🔔'
    }
  }

  const unreadCount = notifications.length

  if (!isAuthenticated) return null

  return (
    <div style={styles.container}>
      {/* Badge avec icône cloche */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        style={styles.bellButton}
        aria-label='Notifications'
      >
        <span style={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown des notifications */}
      {showDropdown && (
        <>
          {/* Overlay pour fermer le dropdown en cliquant à l'extérieur */}
          <div style={styles.overlay} onClick={() => setShowDropdown(false)} />

          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <strong>Notifications</strong>
              {unreadCount > 0 && (
                <button
                  onClick={() => setNotifications([])}
                  style={styles.clearButton}
                >
                  Tout effacer
                </button>
              )}
            </div>

            <div style={styles.notificationList}>
              {notifications.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Aucune notification</p>
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <div
                    key={`${notif.type}-${
                      notif.postId || notif.conversationId
                    }-${index}`}
                    style={styles.notificationItem}
                    onClick={() => handleNotificationClick(notif, index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div style={styles.iconContainer}>
                      <img
                        src={notif.senderAvatar || '/default-avatar.png'}
                        alt={notif.senderName}
                        style={styles.avatar}
                        onError={(e) => {
                          e.target.src = '/default-avatar.png'
                        }}
                      />
                      <span style={styles.typeIcon}>
                        {getNotificationIcon(notif.type)}
                      </span>
                    </div>
                    <div style={styles.notificationContent}>
                      <strong style={styles.senderName}>
                        {notif.senderName}
                      </strong>
                      <p style={styles.messagePreview}>{notif.message}</p>
                      {notif.commentPreview && (
                        <p style={styles.commentPreview}>
                          "{notif.commentPreview}"
                        </p>
                      )}
                      <span style={styles.timestamp}>
                        {new Date(notif.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  bellButton: {
    position: 'relative',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.2s',
  },
  bellIcon: {
    fontSize: '24px',
    display: 'block',
  },
  badge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: '#ff4444',
    color: '#fff',
    borderRadius: '50%',
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '0 4px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '360px',
    maxHeight: '500px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 15px',
    borderBottom: '1px solid #eee',
    backgroundColor: '#fff',
  },
  clearButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#1877f2',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  notificationList: {
    maxHeight: '450px',
    overflowY: 'auto',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#999',
  },
  notificationItem: {
    display: 'flex',
    gap: '10px',
    padding: '12px 15px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
  },
  iconContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  typeIcon: {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    fontSize: '14px',
    backgroundColor: '#fff',
    borderRadius: '50%',
    padding: '2px',
    lineHeight: '1',
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  senderName: {
    fontSize: '14px',
    color: '#050505',
    display: 'block',
    marginBottom: '4px',
  },
  messagePreview: {
    fontSize: '13px',
    color: '#65676b',
    margin: '0 0 4px 0',
  },
  commentPreview: {
    fontSize: '12px',
    color: '#888',
    fontStyle: 'italic',
    margin: '0 0 4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  timestamp: {
    fontSize: '11px',
    color: '#999',
  },
}

export default NotificationBadge
