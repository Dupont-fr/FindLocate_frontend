import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/authReducer'
import userService from '../services/userService'
import { showNotification } from '../reducers/notificationReducer'

const DeleteAccount = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleDeleteAccount = async () => {
    if (confirmText !== 'SUPPRIMER MON COMPTE') {
      dispatch(
        showNotification(
          'Error: Veuillez taper exactement "SUPPRIMER MON COMPTE"',
          5
        )
      )
      return
    }

    setLoading(true)
    try {
      await userService.deleteUser(user.id)
      dispatch(showNotification('Votre compte a été supprimé.', 4))
      dispatch(logout())
      navigate('/')
    } catch (error) {
      console.error('Erreur suppression compte:', error)
      dispatch(showNotification('Error: Impossible de supprimer le compte.', 5))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Supprimer mon compte</h2>

        <div style={styles.warningBox}>
          <p style={styles.warningText}>
            Cette action est <strong>irréversible</strong>. En supprimant votre
            compte :
          </p>
          <ul style={styles.list}>
            <li>Toutes vos données seront supprimées</li>
            <li>Vos posts et commentaires seront supprimés</li>
            <li>Vous ne pourrez pas récupérer votre compte</li>
          </ul>
        </div>

        {!showConfirm ? (
          <button onClick={() => setShowConfirm(true)} style={styles.deleteBtn}>
            Continuer vers la suppression
          </button>
        ) : (
          <div style={styles.confirmSection}>
            <p style={styles.confirmText}>
              Pour confirmer, veuillez taper exactement :
            </p>
            <strong style={styles.confirmKeyword}>SUPPRIMER MON COMPTE</strong>

            <input
              type='text'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder='Taper le texte...'
              style={styles.input}
            />

            <div style={styles.buttonGroup}>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || confirmText !== 'SUPPRIMER MON COMPTE'}
                style={{
                  ...styles.confirmBtn,
                  opacity:
                    loading || confirmText !== 'SUPPRIMER MON COMPTE' ? 0.5 : 1,
                  cursor:
                    loading || confirmText !== 'SUPPRIMER MON COMPTE'
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                {loading ? 'Suppression...' : 'Supprimer définitivement'}
              </button>

              <button
                onClick={() => {
                  setShowConfirm(false)
                  setConfirmText('')
                }}
                style={styles.cancelBtn}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          Retour
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    color: '#d32f2f',
    marginBottom: '20px',
    textAlign: 'center',
  },
  warningBox: {
    backgroundColor: '#ffe0e0',
    border: '2px solid #d32f2f',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
  },
  warningText: {
    color: '#c62828',
    margin: '0 0 10px 0',
  },
  list: {
    color: '#c62828',
    marginLeft: '20px',
    marginBottom: 0,
  },
  deleteBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  confirmSection: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  confirmText: {
    margin: '0 0 10px 0',
    fontSize: '14px',
    color: '#333',
  },
  confirmKeyword: {
    display: 'block',
    padding: '10px',
    backgroundColor: '#fff',
    border: '2px solid #d32f2f',
    borderRadius: '4px',
    textAlign: 'center',
    marginBottom: '15px',
    color: '#d32f2f',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    marginBottom: '15px',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
  },
  confirmBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#e0e0e0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  backBtn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginTop: '10px',
  },
}

export default DeleteAccount
