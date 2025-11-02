import { useNavigate } from 'react-router'
import './pages-styles.css'

const Help = () => {
  const navigate = useNavigate()

  const helpCategories = [
    {
      icon: '🏠',
      title: 'Publier une Annonce',
      description: 'Guides complets pour créer et gérer vos annonces',
      articles: [
        {
          title: 'Comment créer ma première annonce ?',
          content: `
            <h3>Étapes pour publier une annonce :</h3>
            <ol>
              <li><strong>Connectez-vous</strong> à votre compte FindLocate</li>
              <li>Cliquez sur le bouton <strong>"Publier une annonce"</strong> dans le menu</li>
              <li>Remplissez le formulaire :
                <ul>
                  <li>Choisissez le type de bien (Appartement, Studio, Maison, Chambre)</li>
                  <li>Indiquez le prix mensuel en FCFA</li>
                  <li>Sélectionnez la localisation (Région, Ville, Quartier)</li>
                  <li>Rédigez une description détaillée (minimum 10 caractères)</li>
                  <li>Ajoutez des photos de qualité (jusqu'à 5 photos)</li>
                </ul>
              </li>
              <li>Vérifiez vos informations et cliquez sur <strong>"Publier"</strong></li>
            </ol>
            <p><strong>💡 Astuce :</strong> Les annonces avec des photos claires et une description détaillée reçoivent 3x plus de contacts !</p>
          `,
        },
        {
          title: 'Conseils pour une bonne annonce',
          content: `
            <h3>Optimisez votre annonce :</h3>
            <ul>
              <li><strong>Photos :</strong> Prenez des photos lumineuses et de bonne qualité. Montrez toutes les pièces.</li>
              <li><strong>Titre :</strong> Soyez précis (ex: "Appartement 2 chambres à Bonapriso")</li>
              <li><strong>Description :</strong> Mentionnez les équipements (eau, électricité, parking, sécurité)</li>
              <li><strong>Prix :</strong> Indiquez un prix réaliste comparé au marché</li>
              <li><strong>Contact :</strong> Soyez disponible pour répondre rapidement aux messages</li>
            </ul>
          `,
        },
        {
          title: 'Modifier ou supprimer mon annonce',
          content: `
            <h3>Gérer vos annonces :</h3>
            <p><strong>Pour modifier :</strong></p>
            <ol>
              <li>Allez sur votre profil</li>
              <li>Cliquez sur l'annonce à modifier</li>
              <li>Cliquez sur "Modifier"</li>
              <li>Apportez vos changements et sauvegardez</li>
            </ol>
            <p><strong>Pour supprimer :</strong></p>
            <ol>
              <li>Ouvrez l'annonce</li>
              <li>Cliquez sur "Supprimer"</li>
              <li>Confirmez la suppression</li>
            </ol>
            <p><em>⚠️ Attention : La suppression est définitive et irréversible.</em></p>
          `,
        },
      ],
    },
    {
      icon: '🔍',
      title: 'Rechercher un Logement',
      description: 'Trouvez le bien parfait rapidement',
      articles: [
        {
          title: 'Comment utiliser les filtres de recherche ?',
          content: `
            <h3>Filtres disponibles :</h3>
            <ul>
              <li><strong>Type :</strong> Appartement, Studio, Maison, Chambre</li>
              <li><strong>Localisation :</strong> Région, Ville, Quartier</li>
              <li><strong>Prix :</strong> Fourchette de prix minimum et maximum</li>
            </ul>
            <p><strong>Astuce :</strong> Combinez plusieurs filtres pour affiner votre recherche.</p>
          `,
        },
        {
          title: 'Contacter un propriétaire',
          content: `
            <h3>Étapes pour contacter :</h3>
            <ol>
              <li>Cliquez sur l'annonce qui vous intéresse</li>
              <li>Cliquez sur le bouton <strong>"Discuter"</strong></li>
              <li>Une conversation privée s'ouvre automatiquement</li>
              <li>Présentez-vous et posez vos questions</li>
            </ol>
            <p><strong>💡 Conseil :</strong> Soyez poli et précis dans vos questions pour obtenir une réponse rapide.</p>
          `,
        },
        {
          title: 'Vérifier une annonce avant visite',
          content: `
            <h3>Points à vérifier :</h3>
            <ul>
              <li>✅ Le prix correspond-il au marché local ?</li>
              <li>✅ Les photos sont-elles de qualité et récentes ?</li>
              <li>✅ La description est-elle détaillée ?</li>
              <li>✅ Le propriétaire répond-il rapidement ?</li>
            </ul>
            <p><strong>⚠️ Signes d'alerte :</strong></p>
            <ul>
              <li>❌ Prix trop bas par rapport au marché</li>
              <li>❌ Photos floues ou volées sur internet</li>
              <li>❌ Demande de paiement avant visite</li>
              <li>❌ Propriétaire injoignable ou évasif</li>
            </ul>
          `,
        },
      ],
    },
    {
      icon: '💬',
      title: 'Messagerie',
      description: 'Communiquer en toute sécurité',
      articles: [
        {
          title: 'Utiliser la messagerie',
          content: `
            <h3>Fonctionnalités :</h3>
            <ul>
              <li><strong>Messages privés :</strong> Conversations chiffrées</li>
              <li><strong>Notifications :</strong> Alerte instantanée pour nouveaux messages</li>
              <li><strong>Historique :</strong> Tous vos échanges sont sauvegardés</li>
            </ul>
            <h3>Bonnes pratiques :</h3>
            <ul>
              <li>✅ Restez courtois et professionnel</li>
              <li>✅ Répondez rapidement aux messages</li>
              <li>✅ Posez des questions précises</li>
              <li>❌ Ne partagez jamais d'informations bancaires</li>
              <li>❌ N'envoyez pas de paiement avant visite</li>
            </ul>
          `,
        },
      ],
    },
    {
      icon: '🔒',
      title: 'Sécurité',
      description: 'Protégez-vous contre les arnaques',
      articles: [
        {
          title: 'Éviter les arnaques',
          content: `
            <h3>Règles d'or :</h3>
            <ol>
              <li><strong>TOUJOURS visiter le bien</strong> avant tout paiement</li>
              <li><strong>Rencontrer le propriétaire</strong> en personne</li>
              <li><strong>Vérifier l'identité</strong> du propriétaire</li>
              <li><strong>Demander un contrat</strong> de location écrit</li>
              <li><strong>Obtenir un reçu</strong> pour chaque paiement</li>
            </ol>
            <h3>🚨 Arnaque courantes :</h3>
            <ul>
              <li>Propriétaire "à l'étranger" qui demande un paiement anticipé</li>
              <li>Prix trop attractifs pour être vrais</li>
              <li>Demande d'informations bancaires par message</li>
              <li>Pression pour payer rapidement "avant que quelqu'un d'autre prenne"</li>
            </ul>
          `,
        },
        {
          title: 'Signaler une annonce suspecte',
          content: `
            <h3>Comment signaler :</h3>
            <ol>
              <li>Ouvrez l'annonce suspecte</li>
              <li>Cliquez sur le bouton <strong>"🚩 Signaler"</strong></li>
              <li>Choisissez le motif du signalement</li>
              <li>Ajoutez des détails si nécessaire</li>
              <li>Validez le signalement</li>
            </ol>
            <p>Notre équipe examinera votre signalement dans les 24-48h. Votre signalement reste <strong>anonyme</strong>.</p>
          `,
        },
      ],
    },
    {
      icon: '⚙️',
      title: 'Compte et Paramètres',
      description: 'Gérer votre profil FindLocate',
      articles: [
        {
          title: 'Modifier mon profil',
          content: `
            <h3>Informations modifiables :</h3>
            <ul>
              <li>Photo de profil</li>
              <li>Nom et prénom</li>
              <li>Numéro de téléphone</li>
              <li>Bio / Description</li>
              <li>Mot de passe</li>
            </ul>
            <p><strong>Pour modifier :</strong></p>
            <ol>
              <li>Allez sur "Mon profil"</li>
              <li>Cliquez sur "Modifier le profil"</li>
              <li>Changez vos informations</li>
              <li>Cliquez sur "Sauvegarder"</li>
            </ol>
          `,
        },
        {
          title: 'Changer mon mot de passe',
          content: `
            <h3>Étapes :</h3>
            <ol>
              <li>Allez dans "Paramètres"</li>
              <li>Section "Sécurité"</li>
              <li>Entrez votre mot de passe actuel</li>
              <li>Entrez votre nouveau mot de passe (min. 6 caractères)</li>
              <li>Confirmez le nouveau mot de passe</li>
              <li>Sauvegardez</li>
            </ol>
            <p><strong>💡 Mot de passe sécurisé :</strong></p>
            <ul>
              <li>Minimum 6 caractères</li>
              <li>Mélange de majuscules et minuscules</li>
              <li>Au moins un chiffre</li>
              <li>Au moins un caractère spécial (!@#$%)</li>
            </ul>
          `,
        },
        {
          title: 'Supprimer mon compte',
          content: `
            <h3>⚠️ Avant de supprimer :</h3>
            <p>La suppression est <strong>définitive</strong> et entraîne :</p>
            <ul>
              <li>❌ Perte de toutes vos annonces</li>
              <li>❌ Perte de l'historique de messages</li>
              <li>❌ Impossibilité de récupérer vos données</li>
            </ul>
            <h3>Pour supprimer :</h3>
            <ol>
              <li>Allez dans "Paramètres"</li>
              <li>Section "Compte"</li>
              <li>Cliquez sur "Supprimer mon compte"</li>
              <li>Confirmez en entrant votre mot de passe</li>
              <li>Validez la suppression définitive</li>
            </ol>
          `,
        },
      ],
    },
  ]

  return (
    <div className='help-container'>
      <div className='help-header'>
        <button onClick={() => navigate(-1)} className='help-back-btn'>
          ← Retour
        </button>
        <h1>🆘 Centre d'Aide</h1>
        <p className='help-subtitle'>
          Trouvez rapidement des réponses à toutes vos questions
        </p>
      </div>

      <div className='help-search'>
        <input
          type='text'
          placeholder="🔍 Rechercher dans l'aide..."
          className='help-search-input'
        />
      </div>

      <div className='help-content'>
        {helpCategories.map((category, catIndex) => (
          <div key={catIndex} className='help-category'>
            <div className='category-header'>
              <span className='category-icon'>{category.icon}</span>
              <div>
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </div>
            </div>

            <div className='articles-list'>
              {category.articles.map((article, artIndex) => (
                <details key={artIndex} className='help-article'>
                  <summary className='article-title'>
                    <span>📄 {article.title}</span>
                    <span className='arrow'>▼</span>
                  </summary>
                  <div
                    className='article-content'
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  />
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='help-footer'>
        <h3>Vous n'avez pas trouvé votre réponse ?</h3>
        <div className='help-actions'>
          <button onClick={() => navigate('/faq')} className='help-btn'>
            ❓ Voir la FAQ
          </button>
          <button
            onClick={() => navigate('/contact')}
            className='help-btn primary'
          >
            📧 Nous contacter
          </button>
        </div>
      </div>
    </div>
  )
}

export default Help
