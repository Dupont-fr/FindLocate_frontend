import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPostsThunk } from '../reducers/postFormReducer'
import PostCard from './PostCard'
import { showNotification } from '../reducers/notificationReducer'

const MyPosts = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user: currentUser } = useSelector((state) => state.auth)
  const allPosts = useSelector((state) => state.postForm.posts)

  // Vérifier que l'utilisateur accède à ses propres posts
  useEffect(() => {
    if (currentUser?.id !== userId) {
      dispatch(showNotification('Error: Accès non autorisé.', 4))
      navigate('/')
    }
  }, [userId, currentUser, navigate, dispatch])

  useEffect(() => {
    dispatch(fetchPostsThunk())
  }, [dispatch])

  // Filtrer les posts de l'utilisateur
  const userPosts = allPosts.filter((post) => post.userId === userId)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          Retour
        </button>
        <h2>Mes Publications</h2>
      </div>

      {userPosts.length > 0 ? (
        <div style={styles.postsList}>
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <p>Vous n'avez pas encore publié d'annonces.</p>
          {/* <button onClick={() => navigate('/add')} style={styles.createBtn}>
            📝 Créer une annonce
          </button> */}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
  },
  backBtn: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    border: '1px solid #eee',
  },
  createBtn: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
}

export default MyPosts
