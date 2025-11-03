import React from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Composant LoadingSpinner - Affiche un cercle de chargement animé
 *
 * @param {string} size - Taille du spinner: 'small', 'medium', 'large' (défaut: 'medium')
 * @param {string} color - Couleur du spinner (défaut: '#0066FF')
 * @param {boolean} fullScreen - Si true, affiche en plein écran avec overlay (défaut: false)
 * @param {string} text - Texte à afficher sous le spinner (optionnel)
 */
const LoadingSpinner = ({
  size = 'medium',
  color = '#0066FF',
  fullScreen = false,
  text = 'Chargement...',
}) => {
  // Tailles du spinner
  const sizes = {
    small: 24,
    medium: 40,
    large: 60,
  }

  const spinnerSize = sizes[size] || sizes.medium

  // Styles du spinner
  const styles = {
    // Container plein écran avec overlay
    fullScreenContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    // Container inline
    inlineContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    // Spinner wrapper
    spinnerWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: text ? '12px' : '0',
    },
    // Animation CSS
    spinner: {
      animation: 'spin 1s linear infinite',
    },
    // Texte de chargement
    text: {
      color: fullScreen ? '#ffffff' : '#666666',
      fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
      fontWeight: '500',
      textAlign: 'center',
    },
  }

  // Animation keyframes
  const spinAnimation = `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `

  const spinnerContent = (
    <>
      <style>{spinAnimation}</style>
      <div style={styles.spinnerWrapper}>
        <Loader2 size={spinnerSize} color={color} style={styles.spinner} />
      </div>
      {text && <div style={styles.text}>{text}</div>}
    </>
  )

  if (fullScreen) {
    return <div style={styles.fullScreenContainer}>{spinnerContent}</div>
  }

  return <div style={styles.inlineContainer}>{spinnerContent}</div>
}

export default LoadingSpinner
