import axios from 'axios'
import { getToken } from './authService'

const baseUrl = 'http://localhost:3003/api/users'

// Configuration pour inclure le token dans les requêtes
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
})

// Récupérer tous les utilisateurs
export const getUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Récupérer un utilisateur par ID
export const getUserById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

// Créer un utilisateur (utiliser registerUser de authService à la place)
export const createUser = async (newUser) => {
  const response = await axios.post(
    'http://localhost:3003/api/auth/register',
    newUser
  )
  return response.data.user
}

// Vérifier si un utilisateur existe (pour la validation côté client)
export const checkUserExists = async (email, phonenumber) => {
  try {
    const users = await getUsers()

    const emailExists = users.some((u) => u.email === email)
    const phoneExists = users.some((u) => u.phonenumber === phonenumber)

    return { emailExists, phoneExists }
  } catch (error) {
    console.error('Error checking user existence:', error)
    return { emailExists: false, phoneExists: false }
  }
}

// Mettre à jour un utilisateur (requiert authentification)
export const updateUser = async (id, updatedData) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedData, getConfig())
  return response.data
}

// Supprimer un utilisateur (requiert authentification)
export const deleteUser = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, getConfig())
  return true
}

// Récupérer les posts d'un utilisateur
export const getUserPosts = async (userId) => {
  const response = await axios.get(
    `http://localhost:3003/api/posts?userId=${userId}`
  )
  return response.data
}

export default {
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getUsers,
  getUserPosts,
  checkUserExists,
}
