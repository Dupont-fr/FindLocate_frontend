import { useState } from 'react'
import { useNavigate } from 'react-router'
import './pages-styles.css'

const FAQ = () => {
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = useState(null)

  const faqData = [
    {
      category: ' Utilisation de la plateforme',
      questions: [
        {
          q: 'Comment publier une annonce ?',
          a: "Pour publier une annonce, connectez-vous à votre compte, cliquez sur 'Publier une annonce' dans le menu, remplissez le formulaire avec les détails de votre bien (type, prix, localisation, description) et ajoutez des photos. Votre annonce sera visible immédiatement après publication.",
        },
        {
          q: 'Est-ce gratuit de publier une annonce ?',
          a: "Oui, la publication d'annonces sur FindLocate est totalement gratuite. Vous pouvez publier autant d'annonces que vous le souhaitez sans frais.",
        },
        {
          q: 'Comment rechercher un logement ?',
          a: "Utilisez la barre de recherche sur la page d'accueil. Vous pouvez filtrer par type de logement (appartement, studio, maison, chambre), par région, ville, quartier et par fourchette de prix.",
        },
        {
          q: 'Puis-je modifier mon annonce après publication ?',
          a: "Oui, accédez à votre annonce via votre profil, cliquez sur 'Modifier' et apportez vos changements. Les modifications seront visibles immédiatement.",
        },
      ],
    },
    {
      category: '💬 Communication',
      questions: [
        {
          q: 'Comment contacter un annonceur ?',
          a: "Sur chaque annonce, vous trouverez un bouton 'Discuter'. Cliquez dessus pour ouvrir une conversation privée avec le propriétaire via notre messagerie interne.",
        },
        {
          q: 'Mes messages sont-ils privés ?',
          a: 'Oui, toutes vos conversations sont privées et chiffrées. Seuls vous et votre interlocuteur pouvez voir vos messages.',
        },
        {
          q: "Comment savoir si j'ai reçu un message ?",
          a: 'Vous recevrez une notification en temps réel (cloche 🔔 dans le menu) et un email lorsque vous recevez un nouveau message.',
        },
      ],
    },
    {
      category: '🔒 Sécurité',
      questions: [
        {
          q: 'Comment éviter les arnaques ?',
          a: "Ne payez jamais avant d'avoir visité le bien. Rencontrez toujours le propriétaire en personne. Méfiez-vous des prix trop bas. Utilisez notre système de signalement si vous détectez une annonce suspecte.",
        },
        {
          q: 'Comment signaler une annonce frauduleuse ?',
          a: "Sur chaque annonce, cliquez sur le bouton '🚩 Signaler'. Choisissez le motif du signalement et ajoutez des détails si nécessaire. Notre équipe examinera rapidement votre signalement.",
        },
        {
          q: 'Mes données personnelles sont-elles protégées ?',
          a: 'Oui, nous utilisons un chiffrement SSL et ne partageons jamais vos données avec des tiers. Consultez notre Politique de Confidentialité pour plus de détails.',
        },
      ],
    },
    {
      category: '💰 Paiement et Prix',
      questions: [
        {
          q: 'Comment fonctionne le paiement ?',
          a: 'FindLocate ne gère pas les paiements. Les transactions se font directement entre le locataire et le propriétaire. Nous recommandons de faire un contrat écrit et de toujours demander un reçu.',
        },
        {
          q: 'Y a-t-il des frais cachés ?',
          a: "Non, FindLocate est une plateforme gratuite pour tous les utilisateurs. Il n'y a aucun frais caché.",
        },
        {
          q: 'Comment négocier le prix ?',
          a: 'Contactez directement le propriétaire via notre messagerie. Soyez respectueux et proposez un prix raisonnable basé sur les prix du marché dans la zone.',
        },
      ],
    },
    {
      category: '👤 Compte et Profil',
      questions: [
        {
          q: 'Comment créer un compte ?',
          a: "Cliquez sur 'S'inscrire' dans le menu, remplissez le formulaire avec vos informations (nom, email, téléphone, mot de passe), vérifiez votre email et votre compte sera activé.",
        },
        {
          q: "J'ai oublié mon mot de passe",
          a: "Cliquez sur 'Mot de passe oublié' sur la page de connexion. Entrez votre email et vous recevrez un lien pour réinitialiser votre mot de passe.",
        },
        {
          q: 'Comment supprimer mon compte ?',
          a: "Allez dans 'Mon profil' > 'Paramètres' > 'Supprimer mon compte'. Attention : cette action est irréversible et supprimera toutes vos annonces.",
        },
        {
          q: 'Comment modifier mes informations personnelles ?',
          a: "Accédez à votre profil, cliquez sur 'Modifier le profil' et mettez à jour vos informations. N'oubliez pas de sauvegarder.",
        },
      ],
    },
    {
      category: '📱 Technique',
      questions: [
        {
          q: "L'application est-elle disponible sur mobile ?",
          a: "Oui, FindLocate est optimisé pour mobile. Vous pouvez accéder au site depuis n'importe quel navigateur mobile. Une application mobile dédiée est en développement.",
        },
        {
          q: 'Pourquoi mes photos ne se chargent pas ?',
          a: 'Vérifiez votre connexion internet. Assurez-vous que vos photos sont au format JPG ou PNG et ne dépassent pas 5 MB chacune. Essayez de compresser vos images si nécessaire.',
        },
        {
          q: 'Les notifications ne fonctionnent pas',
          a: 'Vérifiez que vous avez autorisé les notifications dans les paramètres de votre navigateur. Sur Chrome : Paramètres > Confidentialité > Autorisations du site > Notifications.',
        },
      ],
    },
  ]

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className='faq-container'>
      <div className='faq-header'>
        <button onClick={() => navigate(-1)} className='faq-back-btn'>
          ← Retour
        </button>
        <h1>❓ Questions Fréquemment Posées</h1>
        <p className='faq-subtitle'>
          Trouvez rapidement des réponses à vos questions
        </p>
      </div>

      <div className='faq-content'>
        {faqData.map((category, catIndex) => (
          <div key={catIndex} className='faq-category'>
            <h2 className='category-title'>{category.category}</h2>

            {category.questions.map((item, qIndex) => {
              const index = `${catIndex}-${qIndex}`
              const isOpen = openIndex === index

              return (
                <div
                  key={qIndex}
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                  onClick={() => toggleQuestion(catIndex, qIndex)}
                >
                  <div className='faq-question'>
                    <h3>{item.q}</h3>
                    <span className='faq-icon'>{isOpen ? '−' : '+'}</span>
                  </div>
                  {isOpen && (
                    <div className='faq-answer'>
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className='faq-contact'>
        <h3>Vous ne trouvez pas de réponse ?</h3>
        <p>Notre équipe est là pour vous aider</p>
        <button onClick={() => navigate('/contact')} className='contact-btn'>
          📧 Nous contacter
        </button>
      </div>
    </div>
  )
}

export default FAQ
