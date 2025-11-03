import axios from 'axios'

const API_URL = 'http://localhost:3003/api/auth'

// Inscription utilisateur (envoie code de vérification)
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData)
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Erreur lors de l'inscription")
  }
}

// Vérifier le code email
export const verifyEmailCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_URL}/verify-email`, {
      email,
      code,
    })

    // Sauvegarder le token et l'utilisateur après vérification
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Erreur lors de la vérification du code')
  }
}

// Renvoyer code de vérification
export const resendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/resend-verification`, {
      email,
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Erreur lors de l'envoi du code")
  }
}

// Connexion utilisateur
export const loginUser = async (email, password) => {
  try {
    const role = location.state?.role || 'user' // Ajoutez ceci
    await resendVerificationEmail(email, role)
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    })

    // Sauvegarder le token et l'utilisateur
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response.data.user
  } catch (error) {
    if (error.response && error.response.data) {
      const errorData = error.response.data
      const err = new Error(errorData.error)
      err.needsVerification = errorData.needsVerification || false
      throw err
    }
    throw new Error('Erreur de connexion au serveur')
  }
}

// Demander code de réinitialisation mot de passe
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, { email })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    }
    throw new Error("Erreur lors de l'envoi du code")
  }
}

// Vérifier code de réinitialisation
export const verifyResetCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_URL}/verify-reset-code`, {
      email,
      code,
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Code invalide ou expiré')
  }
}

// Réinitialiser le mot de passe
export const resetPassword = async (email, code, password) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, {
      email,
      code,
      password,
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Erreur lors de la réinitialisation du mot de passe')
  }
}

// Vérifier si le token JWT est toujours valide
export const verifyToken = async () => {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('No token found')
  }

  try {
    const response = await axios.get(`${API_URL}/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data.user
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    throw new Error('Token invalid or expired', error)
  }
}

// Déconnexion
export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

// Récupérer le token
export const getToken = () => {
  return localStorage.getItem('token')
}

// Récupérer l'utilisateur connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export default {
  registerUser,
  verifyEmailCode,
  resendVerificationEmail,
  loginUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  verifyToken,
  logoutUser,
  getToken,
  getCurrentUser,
}
