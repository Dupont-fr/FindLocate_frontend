// import { useDispatch, useSelector } from 'react-redux'
// import { toggleLikeThunk } from '../reducers/likeReducer'

// const LikeButton = ({ post }) => {
//   const dispatch = useDispatch()
//   const { user, isAuthenticated } = useSelector((state) => state.auth)

//   const likesArray = Array.isArray(post.likes) ? post.likes : []
//   const hasLiked = likesArray.some((l) => l.userId === user?.id)

//   const handleLike = () => {
//     if (!isAuthenticated || !user) {
//       alert('Vous devez être connecté pour aimer un post.')
//       return
//     }
//     dispatch(toggleLikeThunk(post, user))
//   }

//   // ✅ Texte d’affichage dynamique
//   const count = likesArray.length
//   let likeText = ''
//   if (count === 1) {
//     likeText = `${likesArray[0].userName} aime ce post`
//   } else if (count > 1) {
//     likeText = `${likesArray[count - 1].userName} et ${
//       count - 1
//     } autres aiment ce post`
//   }

//   return (
//     <div className='like-section'>
//       <button
//         onClick={handleLike}
//         className={`like-button ${hasLiked ? 'liked' : ''}`} // ✅ utilise la classe CSS
//         type='button'
//       >
//         ❤️ {hasLiked ? 'Je n’aime plus' : 'J’aime'}
//       </button>

//       {count > 0 && (
//         <p className='like-text'>
//           <small>{likeText}</small>
//         </p>
//       )}
//     </div>
//   )
// }

// export default LikeButton

import { useDispatch, useSelector } from 'react-redux'
import { toggleLikeThunk } from '../reducers/likeReducer'

const LikeButtonSimple = ({ post, style }) => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  const likesArray = Array.isArray(post.likes) ? post.likes : []
  const hasLiked = likesArray.some((l) => l.userId === user?.id)

  const handleLike = (e) => {
    e.stopPropagation()
    e.preventDefault()

    if (!isAuthenticated || !user) {
      alert('Vous devez être connecté pour aimer un post.')
      return
    }
    dispatch(toggleLikeThunk(post, user))
  }

  return (
    <button
      onClick={handleLike}
      style={style}
      title={hasLiked ? 'Vous aimez' : "J'aime"}
    >
      <span style={{ fontSize: '20px' }}>{hasLiked ? '❤️' : '🤍'}</span>
    </button>
  )
}

export default LikeButtonSimple
