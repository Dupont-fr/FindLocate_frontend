import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import userService from '../services/userService'
//import postService from '../services/postService'
import { fetchPostsThunk } from '../reducers/postFormReducer'
import PostCard from './PostCard'
import ConfirmDeleteModal from './updates/ConfirmDeleteModal'
import { showNotification } from '../reducers/notificationReducer'

const UserProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Récupérer les posts depuis Redux
  const allPosts = useSelector((state) => state.postForm.posts)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // === Charger le profil et les posts ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userService.getUserById(id)
        setUser(userData)

        // Charger tous les posts dans Redux
        dispatch(fetchPostsThunk())
      } catch (error) {
        console.error('Erreur chargement profil:', error)
        dispatch(
          showNotification('Erreur: Impossible de charger le profil.', 4)
        )
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, dispatch])

  // === Suppression du compte ===
  const handleDeleteUser = async () => {
    try {
      await userService.deleteUser(id)
      dispatch(showNotification('Compte supprimé avec succès.', 4))
      setConfirmDelete(false)
      navigate('/register')
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error)
      dispatch(
        showNotification('Erreur: Échec de la suppression du compte.', 4)
      )
    }
  }

  // Filtrer les posts de l'utilisateur depuis Redux
  const userPosts = allPosts.filter((post) => post.userId === id)

  if (loading) return <p>Chargement du profil...</p>
  if (!user) return <p>Utilisateur introuvable.</p>

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      {/* ======= EN-TÊTE DU PROFIL ======= */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginBottom: 20,
        }}
      >
        <img
          src={user.profilePicture || 'https://ui-avatars.com/api/?name=User'}
          alt='Avatar'
          width={90}
          height={90}
          style={{
            borderRadius: '50%',
            objectFit: 'cover',
            cursor: 'pointer',
          }}
          onClick={() => window.open(user.profilePicture, '_blank')}
        />
        <div>
          <h2>
            {user.firstName} {user.lastName}
          </h2>
          <p>{user.bio || 'Aucune biographie disponible.'}</p>
          <p style={{ color: '#777' }}>{user.email}</p>
        </div>
      </div>

      {/* ======= BOUTONS POUR L'UTILISATEUR CONNECTÉ ======= */}

      {/* ======= LISTE DES POSTS ======= */}
      <h3>📢 Publications de {user.firstName}</h3>
      {userPosts.length > 0 ? (
        userPosts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <p>Aucune annonce publiée pour le moment.</p>
      )}

      {/* ======= MODALE CONFIRMATION SUPPRESSION ======= */}
      {confirmDelete && (
        <ConfirmDeleteModal
          message='Voulez-vous vraiment supprimer votre compte ?'
          onConfirm={handleDeleteUser}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  )
}

export default UserProfile
