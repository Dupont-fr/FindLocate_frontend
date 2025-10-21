const ConfirmDeleteModal = ({ message, onConfirm, onCancel }) => (
  <div className='modal-overlay'>
    <div className='modal-box'>
      <p>{message}</p>
      <div>
        <button onClick={onConfirm}>Oui</button>
        <button onClick={onCancel}>Annuler</button>
      </div>
    </div>
  </div>
)
export default ConfirmDeleteModal
// src/components/ConfirmDeleteModal.jsx
