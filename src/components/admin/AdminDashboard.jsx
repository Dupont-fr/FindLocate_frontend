import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import './AdminDashboard.css'
import LoadingSpinner from '../LoadingSpinner'

const AdminDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  // 🆕 AJOUT: Nouveaux états pour les nouvelles statistiques
  const [topPosts, setTopPosts] = useState(null)
  const [topUsers, setTopUsers] = useState([])
  const [topCities, setTopCities] = useState([])
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  // 🆕 AJOUT: État pour gérer l'export
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/')
      return
    }

    fetchAdminData()
  }, [isAuthenticated, user, navigate])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }

      // 🆕 Récupérer toutes les statistiques en parallèle
      const [
        statsRes,
        timelineRes,
        usersRes,
        postsRes,
        topPostsRes,
        topUsersRes,
        topCitiesRes,
        reportsRes,
      ] = await Promise.all([
        fetch('http://localhost:3003/api/admin/stats', { headers }),
        fetch('http://localhost:3003/api/admin/stats/timeline?period=30', {
          headers,
        }),
        fetch('http://localhost:3003/api/admin/users', { headers }),
        fetch('http://localhost:3003/api/admin/posts', { headers }),
        fetch('http://localhost:3003/api/admin/stats/top-posts', { headers }),
        fetch('http://localhost:3003/api/admin/stats/top-users', { headers }),
        fetch('http://localhost:3003/api/admin/stats/cities', { headers }),
        fetch('http://localhost:3003/api/admin/reports', { headers }),
      ])

      const statsData = await statsRes.json()
      const timelineData = await timelineRes.json()
      const usersData = await usersRes.json()
      const postsData = await postsRes.json()
      const topPostsData = await topPostsRes.json()
      const topUsersData = await topUsersRes.json()
      const topCitiesData = await topCitiesRes.json()
      const reportsData = await reportsRes.json()

      // ✅ DEBUG: Vérifier la structure des données
      console.log('📊 Sample User:', usersData[0])
      console.log('📊 Sample Post:', postsData[0])
      console.log(
        '📊 User keys:',
        usersData[0] ? Object.keys(usersData[0]) : 'No users'
      )
      console.log(
        '📊 Post keys:',
        postsData[0] ? Object.keys(postsData[0]) : 'No posts'
      )

      setStats(statsData)
      setTimeline(timelineData)
      setUsers(usersData)
      setPosts(postsData)
      setTopPosts(topPostsData)
      setTopUsers(topUsersData)
      setTopCities(topCitiesData)
      setReports(reportsData)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setLoading(false)
    }
  }

  // ✅ CORRECTION: Fonction de suppression d'utilisateur avec validation d'ID
  const handleDeleteUser = async (userId) => {
    // ✅ DEBUG: Afficher l'ID reçu
    console.log('🔍 handleDeleteUser appelé avec userId:', userId)
    console.log('🔍 Type de userId:', typeof userId)

    // ✅ AJOUT: Vérifier que l'ID existe et est valide
    if (!userId || userId === 'undefined' || userId === 'null') {
      alert('Erreur : ID utilisateur invalide')
      console.error('Invalid user ID:', userId)
      return
    }

    if (
      !window.confirm(
        'Êtes-vous sûr de vouloir supprimer cet utilisateur et tous ses posts ?'
      )
    )
      return

    try {
      const token = localStorage.getItem('token')
      console.log("🗑️ Suppression de l'utilisateur:", userId) // ✅ Log pour debug

      const response = await fetch(
        `http://localhost:3003/api/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      // ✅ AJOUT: Vérifier la réponse
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || "Erreur lors de la suppression de l'utilisateur"
        )
      }

      // ✅ CORRECTION: Utiliser _id OU id pour filtrer
      setUsers(users.filter((u) => (u._id || u.id) !== userId))
      alert('Utilisateur et ses posts supprimés avec succès')
      fetchAdminData() // Recharger les stats
    } catch (error) {
      console.error('Error deleting user:', error)
      alert(`Erreur lors de la suppression de l'utilisateur: ${error.message}`)
    }
  }

  // ✅ CORRECTION: Fonction de suppression de post avec validation d'ID
  const handleDeletePost = async (postId) => {
    // ✅ DEBUG: Afficher l'ID reçu
    console.log('🔍 handleDeletePost appelé avec postId:', postId)
    console.log('🔍 Type de postId:', typeof postId)

    // ✅ AJOUT : Vérification que l'ID existe
    if (!postId || postId === 'undefined' || postId === 'null') {
      alert('Erreur : ID du post invalide')
      console.error('Invalid post ID:', postId)
      return
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return

    try {
      const token = localStorage.getItem('token')
      console.log('🗑️ Suppression du post:', postId) // 🆕 Log pour debug

      const response = await fetch(
        `http://localhost:3003/api/admin/posts/${postId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          errorData.error || 'Erreur lors de la suppression du post'
        )
      }

      // ✅ CORRECTION: Utiliser _id OU id pour filtrer
      setPosts(posts.filter((p) => (p._id || p.id) !== postId))
      alert('Post supprimé avec succès')
      fetchAdminData() // Recharger les stats
    } catch (error) {
      console.error('Error deleting post:', error)
      alert(`Erreur lors de la suppression du post: ${error.message}`)
    }
  }

  // 🆕 AJOUT: Fonction pour exporter les données
  const handleExport = async (format) => {
    try {
      setExporting(true)
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:3003/api/admin/export/${format}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (format === 'json') {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: 'application/json',
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rapport-findlocate-${
          new Date().toISOString().split('T')[0]
        }.json`
        a.click()
      } else if (format === 'csv') {
        const data = await response.text()
        const blob = new Blob([data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rapport-findlocate-${
          new Date().toISOString().split('T')[0]
        }.csv`
        a.click()
      }

      alert('Rapport téléchargé avec succès !')
    } catch (error) {
      console.error('Error exporting data:', error)
      alert("Erreur lors de l'export")
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    // return <div className='admin-loading'>Chargement des données...</div>
    return <LoadingSpinner fullScreen text='Chargement des données...' />
  }

  if (!stats) {
    return <div className='admin-error'>Erreur de chargement</div>
  }

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ]

  // Préparer les données pour les graphiques
  const typeData = Object.entries(stats.postsByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const regionData = Object.entries(stats.postsByRegion)
    .map(([name, value]) => ({ name, value }))
    .slice(0, 10)

  const priceData = Object.entries(stats.avgPriceByType).map(
    ([name, value]) => ({
      type: name.charAt(0).toUpperCase() + name.slice(1),
      prix: value,
    })
  )

  // 🆕 AJOUT: Données pour les nouveaux graphiques
  const topUsersData = topUsers.slice(0, 5).map((u) => ({
    name: u.name.split(' ')[0],
    posts: u.posts,
    likes: u.likes,
    comments: u.comments,
  }))

  return (
    <div className='admin-container'>
      <div className='admin-header'>
        <div>
          <h1>🛡️ Panneau d'Administration</h1>
          <p>
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>
        {/* 🆕 AJOUT: Boutons d'export */}
        <div className='admin-export-buttons'>
          <button
            onClick={() => handleExport('json')}
            disabled={exporting}
            className='btn-export'
          >
            📥 Export JSON
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className='btn-export'
          >
            📊 Export CSV
          </button>
        </div>
      </div>

      {/* Onglets */}
      <div className='admin-tabs'>
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          👥 Utilisateurs ({users.length})
        </button>
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          📝 Posts ({posts.length})
        </button>
        {/* 🆕 AJOUT: Onglet signalements */}
        <button
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          🚨 Signalements ({reports?.total || 0})
        </button>
      </div>

      {/* Dashboard */}
      {activeTab === 'dashboard' && (
        <div className='admin-dashboard'>
          {/* Cartes de statistiques */}
          <div className='stats-grid'>
            <div className='stat-card'>
              <h3>Utilisateurs Total</h3>
              <p className='stat-number'>{stats.general.totalUsers}</p>
              <span className='stat-badge'>
                +{stats.general.newUsersLast30Days} ce mois
              </span>
            </div>
            <div className='stat-card'>
              <h3>Posts Total</h3>
              <p className='stat-number'>{stats.general.totalPosts}</p>
              <span className='stat-badge'>
                +{stats.general.newPostsLast30Days} ce mois
              </span>
            </div>
            <div className='stat-card'>
              <h3>Utilisateurs Actifs</h3>
              <p className='stat-number'>{stats.general.activeUsers}</p>
            </div>
            <div className='stat-card'>
              <h3>Signalements</h3>
              <p className='stat-number'>{reports?.total || 0}</p>
              <span className='stat-badge stat-badge-danger'>À traiter</span>
            </div>
          </div>

          {/* Graphique chronologique */}
          <div className='chart-container'>
            <h3>📈 Évolution (30 derniers jours)</h3>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='users'
                  stroke='#1206e8ff'
                  name='Nouveaux utilisateurs'
                />
                <Line
                  type='monotone'
                  dataKey='posts'
                  stroke='#007a2fff'
                  name='Nouveaux posts'
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 🆕 AJOUT: Posts les plus populaires */}
          <div
            className='stats-grid'
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            }}
          >
            {topPosts?.mostLiked && (
              <div className='stat-card highlight-card'>
                <h3>❤️ Post le Plus Aimé</h3>
                <p className='stat-name'>{topPosts.mostLiked.content}...</p>
                <div className='stat-details'>
                  <span>👍 {topPosts.mostLiked.likes} likes</span>
                  <span>👤 {topPosts.mostLiked.author}</span>
                </div>
                <span className='stat-badge'>
                  {topPosts.mostLiked.type} -{' '}
                  {parseInt(topPosts.mostLiked.price).toLocaleString()} FCFA
                </span>
              </div>
            )}
            {topPosts?.mostCommented && (
              <div className='stat-card highlight-card'>
                <h3>💬 Post le Plus Commenté</h3>
                <p className='stat-name'>{topPosts.mostCommented.content}...</p>
                <div className='stat-details'>
                  <span>💭 {topPosts.mostCommented.comments} commentaires</span>
                  <span>👤 {topPosts.mostCommented.author}</span>
                </div>
                <span className='stat-badge'>
                  {topPosts.mostCommented.type} -{' '}
                  {parseInt(topPosts.mostCommented.price).toLocaleString()} FCFA
                </span>
              </div>
            )}
          </div>

          {/* 🆕 AJOUT: Top 5 utilisateurs les plus actifs */}
          <div className='chart-container'>
            <h3>🏆 Top 5 Utilisateurs les Plus Actifs</h3>
            <ResponsiveContainer width='100%' height={350}>
              <RadarChart data={topUsersData}>
                <PolarGrid />
                <PolarAngleAxis dataKey='name' />
                <PolarRadiusAxis />
                <Radar
                  name='Posts'
                  dataKey='posts'
                  stroke='#8884d8'
                  fill='#8884d8'
                  fillOpacity={0.6}
                />
                <Radar
                  name='Likes reçus'
                  dataKey='likes'
                  stroke='#82ca9d'
                  fill='#82ca9d'
                  fillOpacity={0.6}
                />
                <Radar
                  name='Commentaires'
                  dataKey='comments'
                  stroke='#ffc658'
                  fill='#ffc658'
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphiques côte à côte */}
          <div className='charts-row'>
            <div className='chart-container'>
              <h3>🏠 Posts par Type</h3>
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                  >
                    {typeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className='chart-container'>
              <h3>💰 Prix Moyen par Type</h3>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={priceData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='type' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='prix' fill='#82ca9d' name='Prix moyen (FCFA)' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🆕 AJOUT: Top villes */}
          <div className='chart-container'>
            <h3>🏙️ Top 10 Villes avec le Plus de Posts</h3>
            <ResponsiveContainer width='100%' height={350}>
              <BarChart data={topCities} layout='vertical'>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis type='number' />
                <YAxis dataKey='name' type='category' width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey='posts' fill='#8884d8' name='Nombre de posts' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Posts par région */}
          <div className='chart-container'>
            <h3>📍 Top 10 Régions</h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='value' fill='#0088FE' name='Nombre de posts' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Liste des utilisateurs */}
      {activeTab === 'users' && (
        <div className='admin-table'>
          <h2>Gestion des Utilisateurs</h2>
          <table>
            <thead>
              <tr>
                <th>Photo</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Inscrit le</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                // ✅ CORRECTION: Obtenir l'ID de manière flexible
                const userId = u._id || u.id
                return (
                  <tr key={userId}>
                    <td>
                      <img
                        src={u.profilePicture}
                        alt={u.firstName}
                        className='user-avatar'
                      />
                    </td>
                    <td>
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td>{u.phonenumber}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          u.isActive ? 'active' : 'inactive'
                        }`}
                      >
                        {u.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {/* ✅ DEBUG: Afficher l'ID dans le bouton */}
                      <button
                        onClick={() => {
                          console.log('🖱️ Bouton cliqué - User object:', u)
                          console.log('🖱️ userId (calculé):', userId)
                          handleDeleteUser(userId)
                        }}
                        className='btn-delete'
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Liste des posts */}
      {activeTab === 'posts' && (
        <div className='admin-table'>
          <h2>Gestion des Posts</h2>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Contenu</th>
                <th>Type</th>
                <th>Prix</th>
                <th>Localisation</th>
                <th>Auteur</th>
                <th>Likes</th>
                <th>Commentaires</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                // ✅ CORRECTION: Obtenir l'ID de manière flexible
                const postId = p._id || p.id
                return (
                  <tr key={postId}>
                    <td>
                      {p.images?.[0] && (
                        <img
                          src={p.images[0]}
                          alt='Post'
                          className='post-thumbnail'
                        />
                      )}
                    </td>
                    <td>{p.content.substring(0, 50)}...</td>
                    <td>
                      <span className='type-badge'>{p.type}</span>
                    </td>
                    <td>{parseInt(p.price).toLocaleString()} FCFA</td>
                    <td>
                      {p.quartier}, {p.ville}
                    </td>
                    <td>{p.userName}</td>
                    <td>{p.likes?.length || 0}</td>
                    <td>{p.comments?.length || 0}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {/* ✅ DEBUG: Afficher l'ID dans le bouton */}
                      <button
                        onClick={() => {
                          console.log('🖱️ Bouton cliqué - Post object:', p)
                          console.log('🖱️ postId (calculé):', postId)
                          handleDeletePost(postId)
                        }}
                        className='btn-delete'
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 🆕 AJOUT: Onglet signalements */}
      {activeTab === 'reports' && (
        <div className='admin-table'>
          <h2>Posts Signalés ({reports?.total || 0})</h2>
          {reports && reports.posts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Contenu</th>
                  <th>Auteur</th>
                  <th>Signalements</th>
                  <th>Dernier signalement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.posts.map((report) => (
                  <tr key={report.postId}>
                    <td>{report.content}...</td>
                    <td>{report.author}</td>
                    <td>
                      <span className='stat-badge stat-badge-danger'>
                        {report.reportsCount} signalement(s)
                      </span>
                    </td>
                    <td>
                      {new Date(report.lastReported).toLocaleDateString(
                        'fr-FR'
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/posts/${report.postId}`)}
                        className='btn-view'
                      >
                        👁️ Voir
                      </button>
                      {/* ✅ CORRECTION: Utiliser report.postId directement */}
                      <button
                        onClick={() => handleDeletePost(report.postId)}
                        className='btn-delete'
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='admin-empty-state'>
              <p>✅ Aucun signalement en attente</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default AdminDashboard
