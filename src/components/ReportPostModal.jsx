import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'

const ReportPostModal = ({ postId, onClose, onSubmit }) => {
  const [step, setStep] = useState(1) // 1: confirmation, 2: choix du motif
  const [selectedReason, setSelectedReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🆕 Liste des motifs de signalement
  const reportReasons = [
    { id: 'spam', label: '🚫 Spam ou publicité non sollicitée' },
    { id: 'fake', label: '⚠️ Fausse annonce ou arnaque' },
    { id: 'inappropriate', label: '🔞 Contenu inapproprié ou offensant' },
    { id: 'duplicate', label: '📋 Annonce en double' },
    { id: 'wrong-category', label: '🏷️ Mauvaise catégorie' },
    { id: 'price-abuse', label: '💰 Prix abusif ou trompeur' },
    { id: 'harassment', label: '😡 Harcèlement ou intimidation' },
    { id: 'other', label: '❓ Autre raison' },
  ]

  const handleConfirm = () => {
    setStep(2)
  }

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      alert('Veuillez sélectionner un motif de signalement')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        postId,
        reason: selectedReason,
        additionalInfo: additionalInfo.trim(),
      })

      onClose()
    } catch (error) {
      console.error('Erreur lors du signalement:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <Card style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* 🆕 ÉTAPE 1 : Confirmation */}
        {step === 1 && (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}>⚠️ Signaler cette annonce</h2>
            </div>

            <div style={styles.body}>
              <p style={styles.description}>
                Voulez-vous vraiment signaler cette annonce ?
              </p>
              <p style={styles.anonymousNote}>
                🔒 Votre signalement restera <strong>anonyme</strong>.
                L'administrateur sera notifié et examinera le contenu.
              </p>
            </div>

            <div style={styles.footer}>
              <Button onClick={onClose} style={styles.cancelBtn}>
                Annuler
              </Button>
              <Button onClick={handleConfirm} style={styles.confirmBtn}>
                Continuer
              </Button>
            </div>
          </>
        )}

        {/* 🆕 ÉTAPE 2 : Choix du motif */}
        {step === 2 && (
          <>
            <div style={styles.header}>
              <h2 style={styles.title}>
                Pourquoi signalez-vous cette annonce ?
              </h2>
            </div>

            <div style={styles.body}>
              <div style={styles.reasonsList}>
                {reportReasons.map((reason) => (
                  <label
                    key={reason.id}
                    style={{
                      ...styles.reasonItem,
                      backgroundColor:
                        selectedReason === reason.id ? '#e3f2fd' : '#fff',
                      borderColor:
                        selectedReason === reason.id ? '#1877f2' : '#ddd',
                    }}
                  >
                    <input
                      type='radio'
                      name='reason'
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      style={styles.radio}
                    />
                    <span style={styles.reasonLabel}>{reason.label}</span>
                  </label>
                ))}
              </div>

              {/* 🆕 Champ optionnel pour plus d'infos */}
              <div style={styles.additionalSection}>
                <label style={styles.textareaLabel}>
                  Informations supplémentaires (optionnel)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder='Ajoutez des détails si nécessaire...'
                  maxLength={500}
                  style={styles.textarea}
                />
                <small style={styles.charCount}>
                  {additionalInfo.length} / 500 caractères
                </small>
              </div>
            </div>

            <div style={styles.footer}>
              <Button onClick={() => setStep(1)} style={styles.cancelBtn}>
                Retour
              </Button>
              <Button
                onClick={handleSubmitReport}
                disabled={!selectedReason || isSubmitting}
                style={{
                  ...styles.submitBtn,
                  opacity: !selectedReason || isSubmitting ? 0.6 : 1,
                  cursor:
                    !selectedReason || isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Envoi en cours...' : '🚨 Signaler'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #e5e5e5',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#222',
  },
  body: {
    padding: '20px',
    overflowY: 'auto',
    flex: 1,
  },
  description: {
    fontSize: '15px',
    color: '#444',
    marginBottom: '16px',
    lineHeight: '1.5',
  },
  anonymousNote: {
    fontSize: '14px',
    color: '#666',
    backgroundColor: '#f0f8ff',
    padding: '12px',
    borderRadius: '8px',
    borderLeft: '4px solid #1877f2',
  },
  reasonsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  reasonItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px',
    border: '2px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  radio: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  reasonLabel: {
    fontSize: '15px',
    color: '#333',
    flex: 1,
  },
  additionalSection: {
    marginTop: '20px',
  },
  textareaLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  textarea: {
    width: '100%',
    minHeight: '80px',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  charCount: {
    display: 'block',
    textAlign: 'right',
    fontSize: '12px',
    color: '#999',
    marginTop: '4px',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #e5e5e5',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  confirmBtn: {
    padding: '10px 20px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
  },
}

export default ReportPostModal
