// src/components/Notification.jsx
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) return null

  //  Détection automatique du type de message
  const lowerMsg = notification.toLowerCase()
  const isSuccess = lowerMsg.includes('success')
  const isError = lowerMsg.includes('error')
  const isWarning = lowerMsg.includes('warning') || lowerMsg.includes('please')
  const isInfo = !isSuccess && !isError && !isWarning // Par défaut, message informatif

  //  Style dynamique en fonction du type
  const style = {
    padding: '12px 16px',
    margin: '10px auto',
    borderRadius: '8px',
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: '600px',
    fontSize: '15px',
    border: '1px solid',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',

    ...(isSuccess && {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderColor: '#c3e6cb',
    }),

    ...(isError && {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderColor: '#f5c6cb',
    }),

    ...(isWarning && {
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderColor: '#ffeeba',
    }),

    ...(isInfo && {
      backgroundColor: '#d1ecf1',
      color: '#0c5460',
      borderColor: '#bee5eb',
    }),
  }

  //  Icône dynamique
  const icon = isSuccess ? '✅' : isError ? '❌' : isWarning ? '⚠️' : 'ℹ️'

  return (
    <div style={style}>
      {icon} {notification}
    </div>
  )
}

export default Notification
