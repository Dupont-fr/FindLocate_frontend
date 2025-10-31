import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { fetchPostsThunk } from '../reducers/postFormReducer'
import PostCard from './PostCard'
import { setSearchQuery } from '../reducers/searchReducer'

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
      (priceFilter === 'low' && parseInt(post.price) < 50000) ||
      (priceFilter === 'medium' &&
        parseInt(post.price) >= 50000 &&
        parseInt(post.price) < 100000) ||
      (priceFilter === 'high' && parseInt(post.price) >= 100000)

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
          {/* 🔍 Barre de recherche */}
          <div style={styles.searchBarContainer}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}></span>
              <input
                type='text'
                placeholder='Rechercher par ville, région, type, prix...'
                value={query}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                style={styles.searchInput}
              />
              {/* <button style={styles.searchButton}>Rechercher</button> */}
            </div>
          </div>
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
              Moins de 50 000 FCFA
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
              50 000 - 100 000 FCFA
            </button>
            <button
              onClick={() => setPriceFilter('high')}
              style={{
                ...styles.filterButton,
                backgroundColor: priceFilter === 'high' ? '#1877f2' : '#f0f0f0',
                color: priceFilter === 'high' ? '#fff' : '#333',
              }}
            >
              100 000+ FCFA
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
            <button onClick={() => navigate('/add')} style={styles.createBtn}>
              + Créer une annonce
            </button>
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
    // backgroundImage:
    //   'url(https://images.unsplash.com/photo-1545324418-cc1a9f4ef555?w=1200&h=400&fit=crop)'  https://plus.unsplash.com/premium_photo-1754269381929-d4a956e721fd?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RG91YWxhJTJDJTIwQ2FtZXJvb258ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=3000,
    backgroundImage:
      'url(https://upload.wikimedia.org/wikipedia/commons/f/f0/Yaounde_Cameroon.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px',
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
  searchBarContainer: {
    marginTop: '30px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },

  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '18px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '600px',
  },

  searchIcon: {
    fontSize: '20px',
    color: '#555',
    marginLeft: '10px',
    marginRight: '8px',
  },

  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '15px',
    color: '#333',
    backgroundColor: 'transparent',
  },

  searchButton: {
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}

export default Home
