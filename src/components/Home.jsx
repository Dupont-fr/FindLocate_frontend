import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchPostsThunk } from '../reducers/postFormReducer'
import PostCard from './PostCard'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { posts, loading } = useSelector((state) => state.postForm)
  const query = useSelector((state) => state.search.query.toLowerCase())
  const currentUser = useSelector((state) => state.userForm?.user || null)

  const [priceFilter, setPriceFilter] = useState('')

  useEffect(() => {
    dispatch(fetchPostsThunk())
  }, [dispatch])

  if (loading) return <p style={styles.loading}>Chargement des annonces...</p>

  // Filtrage intelligent avec recherche et prix
  const filteredPosts = posts.filter((post) => {
    const searchText =
      `${post.region} ${post.ville} ${post.quartier} ${post.type} ${post.content} ${post.price}`.toLowerCase()
    const matchesSearch = searchText.includes(query)

    const matchesPrice =
      !priceFilter ||
      (priceFilter === 'low' && parseInt(post.price) < 1000) ||
      (priceFilter === 'medium' &&
        parseInt(post.price) >= 1000 &&
        parseInt(post.price) < 3000) ||
      (priceFilter === 'high' && parseInt(post.price) >= 3000)

    return matchesSearch && matchesPrice
  })

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>Trouvez votre logement idéal</h1>
          <p style={styles.heroSubtitle}>
            Des milliers d'annonces d'appartements, maisons et studios à travers
            le Cameroun
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div style={styles.filtersSection}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filtrer par prix :</label>
          <div style={styles.filterButtons}>
            <button
              onClick={() => setPriceFilter('')}
              style={{
                ...styles.filterButton,
                backgroundColor: priceFilter === '' ? '#1877f2' : '#f0f0f0',
                color: priceFilter === '' ? '#fff' : '#333',
              }}
            >
              Tous les prix
            </button>
            <button
              onClick={() => setPriceFilter('low')}
              style={{
                ...styles.filterButton,
                backgroundColor: priceFilter === 'low' ? '#1877f2' : '#f0f0f0',
                color: priceFilter === 'low' ? '#fff' : '#333',
              }}
            >
              Moins de 1000 FCFA
            </button>
            <button
              onClick={() => setPriceFilter('medium')}
              style={{
                ...styles.filterButton,
                backgroundColor:
                  priceFilter === 'medium' ? '#1877f2' : '#f0f0f0',
                color: priceFilter === 'medium' ? '#fff' : '#333',
              }}
            >
              1000 - 3000 FCFA
            </button>
            <button
              onClick={() => setPriceFilter('high')}
              style={{
                ...styles.filterButton,
                backgroundColor: priceFilter === 'high' ? '#1877f2' : '#f0f0f0',
                color: priceFilter === 'high' ? '#fff' : '#333',
              }}
            >
              3000+ FCFA
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2 style={styles.sectionTitle}>
          {filteredPosts.length} annonce{filteredPosts.length !== 1 ? 's' : ''}{' '}
          trouvée{filteredPosts.length !== 1 ? 's' : ''}
          {query && ` pour "${query}"`}
        </h2>

        {filteredPosts.length > 0 ? (
          <div style={styles.postsGrid}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/post/${post.id}`)}
                style={styles.postCardWrapper}
              >
                <PostCard post={post} user={currentUser} />
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              Aucune annonce ne correspond à votre recherche
            </p>
            {/* <button onClick={() => navigate('/add')} style={styles.createBtn}>
              + Créer une annonce
            </button> */}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#999',
  },
  hero: {
    backgroundImage:
      'url(https://images.unsplash.com/photo-1545324418-cc1a9f4ef555?w=1200&h=400&fit=crop)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroOverlay: {
    background: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  heroTitle: {
    color: '#fff',
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '10px',
    textAlign: 'center',
    margin: 0,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: '18px',
    textAlign: 'center',
    margin: 0,
  },
  filtersSection: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
  },
  filterGroup: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  filterLabel: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '12px',
    color: '#333',
    fontSize: '14px',
  },
  filterButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '10px 16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  postCardWrapper: {
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#999',
    marginBottom: '20px',
  },
  createBtn: {
    padding: '12px 24px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
}

export default Home
