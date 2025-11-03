import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Composant LoadingButton - Bouton qui affiche un spinner pendant le chargement
 *
 * @param {boolean} loading - État de chargement
 * @param {string} text - Texte du bouton
 * @param {string} loadingText - Texte pendant le chargement (optionnel)
 * @param {function} onClick - Fonction appelée au clic
 * @param {boolean} disabled - Désactiver le bouton
 * @param {string} type - Type de bouton: 'primary', 'secondary', 'danger'
 * @param {object} style - Styles personnalisés
 */
const LoadingButton = ({
  loading = false,
  text = 'Envoyer',
  loadingText = 'Chargement...',
  onClick,
  disabled = false,
  type = 'primary',
  style = {},
  ...props
}) => {
  // Styles selon le type de bouton
  const buttonTypes = {
    primary: {
      backgroundColor: '#0066FF',
      color: '#ffffff',
      hoverColor: '#0052cc',
    },
    secondary: {
      backgroundColor: '#e6e6e6',
      color: '#1a1a1a',
      hoverColor: '#d0d0d0',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      hoverColor: '#dc2626',
    },
  }

  const buttonStyle = buttonTypes[type] || buttonTypes.primary

  const styles = {
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '12px 24px',
      backgroundColor: buttonStyle.backgroundColor,
      color: buttonStyle.color,
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: loading || disabled ? 'not-allowed' : 'pointer',
      opacity: loading || disabled ? 0.6 : 1,
      transition: 'all 0.2s ease',
      minWidth: '120px',
      ...style,
    },
    spinner: {
      animation: 'spin 1s linear infinite',
    },
  }

  const spinAnimation = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `

  return (
    <>
      <style>{spinAnimation}</style>
      <button
        style={styles.button}
        onClick={onClick}
        disabled={loading || disabled}
        onMouseEnter={(e) => {
          if (!loading && !disabled) {
            e.target.style.backgroundColor = buttonStyle.hoverColor
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && !disabled) {
            e.target.style.backgroundColor = buttonStyle.backgroundColor
          }
        }}
        {...props}
      >
        {loading && (
          <Loader2 size={18} color='currentColor' style={styles.spinner} />
        )}
        <span>{loading ? loadingText : text}</span>
      </button>
    </>
  )
}

export default LoadingButton
