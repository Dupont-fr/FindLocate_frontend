import React from 'react'
/**
 * SplashScreen - Écran de chargement initial style Facebook
 * Affiche le logo, le nom de l'app et des points animés
 */
const SplashScreen = () => {
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    logoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      animation: 'fadeIn 0.6s ease-in',
    },
    logo: {
      width: '1px',
      height: '1px',
      backgroundColor: '#fff',
      borderRadius: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(0, 102, 255, 0.3)',
    },
    logoText: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#ffffff',
    },
    appName: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a1a1a',
      letterSpacing: '-0.5px',
    },
    dotsContainer: {
      display: 'flex',
      gap: '12px',
      marginTop: '60px',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: '#0066FF',
    },
    dot1: {
      animation: 'bounce 1.4s ease-in-out infinite',
    },
    dot2: {
      animation: 'bounce 1.4s ease-in-out 0.2s infinite',
    },
    dot3: {
      animation: 'bounce 1.4s ease-in-out 0.4s infinite',
    },
    dot4: {
      animation: 'bounce 1.4s ease-in-out 0.6s infinite',
    },
    footer: {
      position: 'absolute',
      bottom: '40px',
      fontSize: '13px',
      color: '#999999',
      fontWeight: '500',
    },
  }

  const animations = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: translateY(0);
        opacity: 0.6;
      }
      40% {
        transform: translateY(-20px);
        opacity: 1;
      }
    }
  `

  return (
    <>
      <style>{animations}</style>
      <div style={styles.container}>
        <div style={styles.logoContainer}>
          {/* Logo de l'application */}
          <div style={styles.logo}>
            {/* Remplacez par votre logo ici */}
            <img
              src='logo.jpg'
              alt='FindLocate'
              style={{ width: '260px', height: '260px', objectFit: 'contain' }}
            />
            {/* <span style={styles.logoText}>FindLocate</span> */}
          </div>

          {/* Nom de l'application */}
          <div style={styles.appName}>FindLocate</div>
        </div>

        {/* Points animés style Facebook */}
        <div style={styles.dotsContainer}>
          <div style={{ ...styles.dot, ...styles.dot1 }}></div>
          <div style={{ ...styles.dot, ...styles.dot2 }}></div>
          <div style={{ ...styles.dot, ...styles.dot3 }}></div>
          <div style={{ ...styles.dot, ...styles.dot4 }}></div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>from FindLocate Team</div>
      </div>
    </>
  )
}

export default SplashScreen
