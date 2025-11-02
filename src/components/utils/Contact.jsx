import { useState } from 'react'
import { useNavigate } from 'react-router'
import './pages-styles.css'

const Contact = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    setSending(true)

    try {
      // TODO: Implémenter l'envoi d'email backend
      // await fetch('http://localhost:3003/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      // Simuler l'envoi
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSent(true)
      setFormData({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => setSent(false), 5000)
    } catch (error) {
      console.error('Erreur envoi message:', error)
      alert("Erreur lors de l'envoi. Veuillez réessayer.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className='contact-container'>
      <div className='contact-header'>
        <button onClick={() => navigate(-1)} className='contact-back-btn'>
          ← Retour
        </button>
        <h1>📧 Contactez-nous</h1>
        <p className='contact-subtitle'>
          Nous sommes là pour vous aider. Envoyez-nous un message !
        </p>
      </div>

      <div className='contact-content'>
        <div className='contact-info'>
          <h2>Nos Coordonnées</h2>

          <div className='info-item'>
            <span className='info-icon'>📧</span>
            <div>
              <h3>Email</h3>
              <a href='findlocate237@gmail.com'>findlocate237@gmail.com</a>
            </div>
          </div>

          <div className='info-item'>
            <span className='info-icon'>📱</span>
            <div>
              <h3>Téléphone</h3>
              <a href='tel:+237000000000'>+237 692 763 964</a>
            </div>
          </div>

          <div className='info-item'>
            <span className='info-icon'>📍</span>
            <div>
              <h3>Adresse</h3>
              <p>Douala, Cameroun</p>
            </div>
          </div>

          <div className='info-item'>
            <span className='info-icon'>⏰</span>
            <div>
              <h3>Horaires</h3>
              <p>Lundi - Vendredi : 8h - 18h</p>
              <p>Samedi : 9h - 13h</p>
              <p>Dimanche : Fermé</p>
            </div>
          </div>

          <div className='social-links'>
            <h3>Suivez-nous</h3>
            <div className='social-icons'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span>📘</span> Facebook
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span>🐦</span> Twitter
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <span>📷</span> Instagram
              </a>
            </div>
          </div>
        </div>

        <div className='contact-form-section'>
          <h2>Envoyez-nous un message</h2>

          {sent && (
            <div className='success-message'>
              ✅ Message envoyé avec succès ! Nous vous répondrons dans les plus
              brefs délais.
            </div>
          )}

          <form onSubmit={handleSubmit} className='contact-form'>
            <div className='form-group'>
              <label>Nom complet *</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Votre nom'
                required
              />
            </div>

            <div className='form-group'>
              <label>Email *</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='votre.email@exemple.com'
                required
              />
            </div>

            <div className='form-group'>
              <label>Sujet</label>
              <input
                type='text'
                name='subject'
                value={formData.subject}
                onChange={handleChange}
                placeholder='Sujet de votre message'
              />
            </div>

            <div className='form-group'>
              <label>Message *</label>
              <textarea
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Décrivez votre demande...'
                rows='6'
                required
              />
            </div>

            <button type='submit' className='submit-btn' disabled={sending}>
              {sending ? 'Envoi en cours...' : '📤 Envoyer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
