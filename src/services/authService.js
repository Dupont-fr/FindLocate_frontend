const API_URL = 'http://localhost:3003/users' // ton json-server

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}?email=${email}`)
  const data = await response.json()

  if (data.length === 0) {
    throw new Error('Utilisateur introuvable.')
  }

  const user = data[0]
  if (user.password !== password) {
    throw new Error('Mot de passe incorrect.')
  }

  return user
}
