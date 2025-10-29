// src/components/comments/CommentSection.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addCommentThunk,
  updateCommentThunk,
  deleteCommentThunk,
} from '../../reducers/commentReducer'
import { Link, useNavigate } from 'react-router'
import CommentItem from './CommentItem'
import { showNotification } from '../../reducers/notificationReducer'

const CommentSection = ({ post }) => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const [text, setText] = useState('')
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated || !user) {
      // alert('Vous devez être connecté pour commenter.')
      dispatch(
        showNotification('Error: Vous devez être connecté pour aimer!!.', 5)
      )
      navigate('/login')
      return
    }
    if (!text.trim()) return

    const newComment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userAvatar: user.profilePicture,
      text: text.trim(),
    }

    dispatch(addCommentThunk(post.id, newComment))
    setText('')
  }

  const handleEditComment = (commentId, newText) => {
    if (!newText.trim()) return
    dispatch(updateCommentThunk(post.id, commentId, newText))
  }

  const handleDeleteComment = (commentId) => {
    dispatch(deleteCommentThunk(post.id, commentId))
  }

  return (
    <div className='comment-section' style={styles.container}>
      <h4 style={styles.title}>Commentaires</h4>

      {post.comments?.length ? (
        <div style={styles.commentsList}>
          {post.comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              postId={post.id}
              currentUser={user}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      ) : (
        <p style={styles.emptyText}>Aucun commentaire pour le moment.</p>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type='text'
          value={text}
          placeholder='Écrire un commentaire...'
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <button type='submit' style={styles.button}>
          Publier
        </button>
      </form>
    </div>
  )
}

const styles = {
  container: {
    marginTop: '12px',
    padding: '8px 6px',
    borderTop: '1px solid #eee',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  commentsList: {
    maxHeight: '220px',
    overflowY: 'auto',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  form: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 'bold',
    transition: 'background-color 0.2s',
  },
}

export default CommentSection
