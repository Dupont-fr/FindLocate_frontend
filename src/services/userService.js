import axios from 'axios'

const baseUrl = 'http://localhost:3003/users'

// Récupérer tous les utilisateurs
export const getUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Créer un nouvel utilisateur
// export const createUser = async (userData) => {
//   const response = await axios.post(baseUrl, userData)
//   return response.data
// }
export const checkUserExists = async (email, phonenumber, password) => {
  const res = await axios.get(baseUrl)
  const users = res.data

  // Vérifie les doublons
  const emailExists = users.some((u) => u.email === email)
  const phoneExists = users.some((u) => u.phonenumber === phonenumber)
  const passwordExists = users.some((u) => u.password === password)

  return { emailExists, phoneExists, passwordExists }
}

export const createUser = async (newUser) => {
  const res = await axios.post(baseUrl, newUser)
  return res.data
}

// Récupérer un utilisateur par ID
const getUserById = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`)
  if (!res.ok) throw new Error('Utilisateur introuvable')
  return await res.json()
}

// Mettre à jour un utilisateur
export const updateUser = async (id, updatedData) => {
  const res = await axios.put(`${baseUrl}/${id}`, updatedData)
  return res.data
}

// Supprimer un utilisateur
export const deleteUser = async (id) => {
  const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Erreur suppression utilisateur')
  return true
}

export const getUserPosts = async (userId) => {
  //  ne surtout pas mettre /users ici !
  const response = await fetch(`http://localhost:3003/posts?userId=${userId}`)
  if (!response.ok) {
    throw new Error('Erreur récupération des posts')
  }
  return await response.json()
}
export default {
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  getUsers,
  getUserPosts,
}
