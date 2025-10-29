import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router'
import {
  toggleCommentLikeThunk,
  addReplyThunk,
  deleteReplyThunk,
  toggleReplyLikeThunk,
} from '../../reducers/commentReducer'
import { showNotification } from '../../reducers/notificationReducer'

const CommentItem = ({ comment, postId, currentUser, onEdit, onDelete }) => {
  const dispatch = useDispatch()
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(comment.text)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [showReplies, setShowReplies] = useState(false)
  const navigate = useNavigate()

  const isOwner = currentUser?.id === comment.userId
  const isCurrentUser = currentUser?.id === comment.userId

  const likes = comment.likes || []
  const replies = comment.replies || []
  const hasLiked = likes.some((l) => l.userId === currentUser?.id)

  const handleSaveEdit = () => {
    if (editedText.trim() && editedText !== comment.text) {
      onEdit(comment.id, editedText)
      setIsEditing(false)
    } else {
      setIsEditing(false)
    }
  }

  const handleConfirmDelete = () => {
    onDelete(comment.id)
    setShowDeleteConfirm(false)
    setShowMenu(false)
  }

  const handleLikeComment = () => {
    if (!currentUser) {
      // alert('Vous devez être connecté pour aimer.')
      dispatch(
        showNotification('Error: Vous devez être connecté pour aimer!!.', 5)
      )
      navigate('/login')
      return
    }
    dispatch(toggleCommentLikeThunk(postId, comment.id, currentUser))
  }

  const handleAddReply = () => {
    if (!currentUser) {
      // alert('Vous devez être connecté pour répondre.')
      dispatch(showNotification('Vous devez être connecté pour répondre!!.', 5))
      navigate('/login')
      return
    }
    if (!replyText.trim()) return

    const newReply = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      userAvatar: currentUser.profilePicture,
      text: replyText.trim(),
    }

    dispatch(addReplyThunk(postId, comment.id, newReply))
    setReplyText('')
    setShowReplyForm(false)
    setShowReplies(true)
  }

  const handleDeleteReply = (replyId) => {
    dispatch(deleteReplyThunk(postId, comment.id, replyId))
  }

  const handleLikeReply = (replyId) => {
    if (!currentUser) {
      // alert('Vous devez être connecté pour aimer.')
      dispatch(
        showNotification('Error: Vous devez être connecté pour aimer!!.', 5)
      )
      navigate('/login')
      return
    }
    dispatch(toggleReplyLikeThunk(postId, comment.id, replyId, currentUser))
  }

  return (
    <div
      style={{
        ...styles.commentItem,
        flexDirection: isCurrentUser ? 'row-reverse' : 'row',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
      }}
    >
      <Link to={`/user/${comment.userId}`} style={styles.link}>
        <img
          src={comment.userAvatar}
          alt={comment.userName}
          width={32}
          height={32}
          style={styles.avatar}
        />
      </Link>

      <div
        style={{
          ...styles.commentContent,
          alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
        }}
      >
        {/* En-tête : nom + menu */}
        <div
          style={{
            ...styles.header,
            flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          }}
        >
          <Link to={`/user/${comment.userId}`} style={styles.link}>
            <strong style={styles.userName}>{comment.userName}</strong>
          </Link>

          {isOwner && (
            <div style={styles.menuContainer}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={styles.menuButton}
              >
                ⋮
              </button>

              {showMenu && (
                <div style={styles.menuDropdown}>
                  <button
                    onClick={() => {
                      setIsEditing(true)
                      setShowMenu(false)
                    }}
                    style={styles.menuItem}
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true)
                      setShowMenu(false)
                    }}
                    style={{ ...styles.menuItem, color: '#d32f2f' }}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contenu : texte ou input d'édition */}
        {isEditing ? (
          <div
            style={{
              ...styles.editContainer,
              backgroundColor: isCurrentUser ? '#e7f3ff' : '#f0f2f5',
            }}
          >
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              style={styles.editTextarea}
              autoFocus
            />
            <div style={styles.editButtons}>
              <button onClick={handleSaveEdit} style={styles.saveBtnEdit}>
                Enregistrer
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditedText(comment.text)
                }}
                style={styles.cancelBtnEdit}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <p
            style={{
              ...styles.text,
              backgroundColor: isCurrentUser ? '#0084ff' : '#f0f2f5',
              color: isCurrentUser ? '#fff' : '#050505',
              marginLeft: isCurrentUser ? 0 : 8,
              marginRight: isCurrentUser ? 8 : 0,
            }}
          >
            {comment.text}
          </p>
        )}

        {/* Boutons d'actions : J'aime, Répondre */}
        <div
          style={{
            ...styles.actionButtons,
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
          }}
        >
          <button
            onClick={handleLikeComment}
            style={{
              ...styles.actionBtn,
              color: hasLiked ? '#0084ff' : '#65676b',
            }}
          >
            👍 {hasLiked ? "J'aime plus" : "J'aime"}
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            style={styles.actionBtn}
          >
            💬 Répondre
          </button>
          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              style={styles.actionBtn}
            >
              {showReplies ? 'Masquer' : 'Voir'} {replies.length} réponse(s)
            </button>
          )}
        </div>

        {/* Affichage du nombre de likes */}
        {likes.length > 0 && (
          <p style={styles.likeCount}>
            👍 {likes.length}{' '}
            {likes.length === 1 ? 'personne aime' : 'personnes aiment'}
          </p>
        )}

        {/* Formulaire de réponse */}
        {showReplyForm && (
          <div style={styles.replyForm}>
            <input
              type='text'
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder='Écrivez une réponse...'
              style={styles.replyInput}
            />
            <button onClick={handleAddReply} style={styles.replyBtn}>
              Envoyer
            </button>
            <button
              onClick={() => setShowReplyForm(false)}
              style={styles.replyCancelBtn}
            >
              Annuler
            </button>
          </div>
        )}

        {/* Affichage des réponses */}
        {showReplies && replies.length > 0 && (
          <div style={styles.repliesContainer}>
            {replies.map((reply) => (
              <ReplyItem
                key={reply.id}
                reply={reply}
                currentUser={currentUser}
                postId={postId}
                commentId={comment.id}
                onDeleteReply={handleDeleteReply}
                onLikeReply={handleLikeReply}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div style={styles.deleteConfirmModal}>
          <div style={styles.deleteConfirmContent}>
            <p style={styles.deleteConfirmText}>
              Êtes-vous sûr de vouloir supprimer ce commentaire ?
            </p>
            <div style={styles.deleteConfirmButtons}>
              <button
                onClick={handleConfirmDelete}
                style={styles.confirmDeleteBtn}
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={styles.cancelDeleteBtn}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Composant pour les réponses
const ReplyItem = ({
  reply,
  currentUser,

  onDeleteReply,
  onLikeReply,
}) => {
  const isCurrentUser = currentUser?.id === reply.userId
  const likes = reply.likes || []
  const hasLiked = likes.some((l) => l.userId === currentUser?.id)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <div
      style={{
        ...styles.replyItem,
        flexDirection: isCurrentUser ? 'row-reverse' : 'row',
      }}
    >
      <Link to={`/user/${reply.userId}`} style={styles.link}>
        <img
          src={reply.userAvatar}
          alt={reply.userName}
          width={28}
          height={28}
          style={styles.replyAvatar}
        />
      </Link>

      <div style={{ flex: 1 }}>
        <div style={styles.replyHeader}>
          <Link to={`/user/${reply.userId}`} style={styles.link}>
            <strong style={styles.replyName}>{reply.userName}</strong>
          </Link>
        </div>

        <p
          style={{
            ...styles.replyText,
            backgroundColor: isCurrentUser ? '#0084ff' : '#f0f2f5',
            color: isCurrentUser ? '#fff' : '#050505',
            marginLeft: isCurrentUser ? 0 : 8,
            marginRight: isCurrentUser ? 8 : 0,
          }}
        >
          {reply.text}
        </p>

        <div
          style={{
            ...styles.replyActions,
            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
          }}
        >
          <button
            onClick={() => onLikeReply(reply.id)}
            style={{
              ...styles.actionBtn,
              color: hasLiked ? '#0084ff' : '#65676b',
            }}
          >
            👍 {hasLiked ? "J'aime plus" : "J'aime"}
          </button>
          {currentUser?.id === reply.userId && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{ ...styles.actionBtn, color: '#d32f2f' }}
            >
              🗑️ Supprimer
            </button>
          )}
        </div>

        {likes.length > 0 && <p style={styles.likeCount}>👍 {likes.length}</p>}

        {showDeleteConfirm && (
          <div style={styles.deleteConfirmModal}>
            <div style={styles.deleteConfirmContent}>
              <p style={styles.deleteConfirmText}>Supprimer cette réponse ?</p>
              <div style={styles.deleteConfirmButtons}>
                <button
                  onClick={() => {
                    onDeleteReply(reply.id)
                    setShowDeleteConfirm(false)
                  }}
                  style={styles.confirmDeleteBtn}
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={styles.cancelDeleteBtn}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  commentItem: {
    display: 'flex',
    gap: 10,
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  avatar: {
    borderRadius: '50%',
    flexShrink: 0,
  },
  commentContent: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 13,
    color: '#050505',
  },
  menuContainer: {
    position: 'relative',
  },
  menuButton: {
    background: 'transparent',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    padding: '0 4px',
    color: '#65676b',
  },
  menuDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: 140,
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '8px 12px',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: 13,
    color: '#050505',
  },
  text: {
    margin: 0,
    fontSize: 13,
    color: '#050505',
    wordWrap: 'break-word',
    padding: '8px 12px',
    borderRadius: 8,
    maxWidth: '70%',
  },
  editContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 8,
    borderRadius: 6,
  },
  editTextarea: {
    padding: 8,
    border: '1px solid #1877f2',
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: 60,
  },
  editButtons: {
    display: 'flex',
    gap: 8,
  },
  saveBtnEdit: {
    padding: '6px 12px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cancelBtnEdit: {
    padding: '6px 12px',
    backgroundColor: '#e4e6eb',
    color: '#050505',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 12,
  },
  actionButtons: {
    display: 'flex',
    gap: 12,
    marginTop: 6,
    fontSize: 13,
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    color: '#65676b',
    cursor: 'pointer',
    fontSize: 12,
    padding: 0,
  },
  likeCount: {
    fontSize: 12,
    color: '#65676b',
    margin: '4px 0 0 0',
  },
  replyForm: {
    display: 'flex',
    gap: 6,
    marginTop: 8,
    padding: '8px 0',
    borderTop: '1px solid #eee',
  },
  replyInput: {
    flex: 1,
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '16px',
    fontSize: 12,
    fontFamily: 'inherit',
  },
  replyBtn: {
    padding: '6px 12px',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 'bold',
  },
  replyCancelBtn: {
    padding: '6px 12px',
    backgroundColor: '#e4e6eb',
    color: '#050505',
    border: 'none',
    borderRadius: '16px',
    cursor: 'pointer',
    fontSize: 12,
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 12,
    borderLeft: '2px solid #e5e5ea',
  },
  replyItem: {
    display: 'flex',
    gap: 8,
    marginBottom: 10,
    padding: 6,
  },
  replyAvatar: {
    borderRadius: '50%',
    flexShrink: 0,
  },
  replyHeader: {
    marginBottom: 2,
  },
  replyName: {
    fontSize: 12,
    color: '#050505',
  },
  replyText: {
    margin: 0,
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 6,
    maxWidth: '80%',
  },
  replyActions: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  },
  deleteConfirmModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  deleteConfirmContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
    maxWidth: 400,
    textAlign: 'center',
  },
  deleteConfirmText: {
    margin: '0 0 16px 0',
    fontSize: 14,
    color: '#050505',
  },
  deleteConfirmButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  confirmDeleteBtn: {
    padding: '8px 20px',
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cancelDeleteBtn: {
    padding: '8px 20px',
    backgroundColor: '#e4e6eb',
    color: '#050505',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 13,
  },
}

export default CommentItem
