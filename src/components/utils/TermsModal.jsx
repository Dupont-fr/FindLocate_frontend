import { useState } from 'react'
import { Link } from 'react-router'
import './terms-modal-styles.css'

const TermsModal = ({ onAccept, onDecline }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [acceptCheckbox, setAcceptCheckbox] = useState(false)

  // 🆕 Fonction pour détecter si l'utilisateur a scrollé jusqu'en bas
  const handleScroll = (e) => {
    const element = e.target
    const isAtBottom =
      element.scrollHeight - element.scrollTop <= element.clientHeight + 50

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  return (
    <div className='terms-modal-overlay'>
      <div className='terms-modal-container'>
        {/* 🆕 Header */}
        <div className='terms-modal-header'>
          <h2>📜 Conditions Générales d'Utilisation</h2>
          <p className='terms-modal-subtitle'>
            Veuillez lire et accepter nos conditions avant de continuer
          </p>
        </div>

        {/* 🆕 Contenu scrollable */}
        <div className='terms-modal-content' onScroll={handleScroll}>
          <div className='terms-modal-text'>
            {/* 🆕 Version résumée pour la modal */}
            <section>
              <h3>1. Acceptation des Conditions</h3>
              <p>
                En créant un compte sur FindLocate, vous acceptez d'être lié par
                ces Conditions Générales d'Utilisation.
              </p>
            </section>

            <section>
              <h3>2. Utilisation de la Plateforme</h3>
              <p>
                FindLocate est une plateforme de mise en relation pour les
                annonces immobilières au Cameroun. Nous ne sommes pas
                responsables des transactions entre utilisateurs.
              </p>
            </section>

            <section>
              <h3>3. Votre Compte</h3>
              <ul>
                <li>Vous devez avoir au moins 18 ans</li>
                <li>Les informations fournies doivent être exactes</li>
                <li>Vous êtes responsable de votre mot de passe</li>
                <li>Un seul compte par personne</li>
              </ul>
            </section>

            <section>
              <h3>4. Publication d'Annonces</h3>
              <p>
                <strong>Autorisé :</strong>
              </p>
              <ul>
                <li>Annonces immobilières véridiques</li>
                <li>Photos réelles des biens</li>
                <li>Prix honnêtes et précis</li>
              </ul>
              <p>
                <strong>Interdit :</strong>
              </p>
              <ul>
                <li>Annonces frauduleuses ou trompeuses</li>
                <li>Contenu offensant ou illégal</li>
                <li>Spam ou publicité non sollicitée</li>
                <li>Annonces en double</li>
              </ul>
            </section>

            <section>
              <h3>5. Vos Responsabilités</h3>
              <p>En tant qu'utilisateur, vous devez :</p>
              <ul>
                <li>Vérifier l'authenticité des annonces</li>
                <li>Rencontrer les annonceurs en personne</li>
                <li>Ne jamais payer avant d'avoir visité le bien</li>
                <li>Respecter les lois camerounaises</li>
              </ul>
            </section>

            <section>
              <h3>6. Protection des Données</h3>
              <p>
                Vos données personnelles sont collectées uniquement pour la
                gestion de votre compte et la publication d'annonces. Elles ne
                seront jamais vendues à des tiers.
              </p>
            </section>

            <section>
              <h3>7. Comportement et Messagerie</h3>
              <p>Il est strictement interdit de :</p>
              <ul>
                <li>Harceler ou menacer d'autres utilisateurs</li>
                <li>Envoyer du spam</li>
                <li>Partager des informations frauduleuses</li>
              </ul>
            </section>

            <section>
              <h3>8. Signalement</h3>
              <p>
                Vous pouvez signaler les annonces inappropriées de manière
                anonyme. Nous nous réservons le droit de supprimer les contenus
                non conformes et de suspendre les comptes en violation.
              </p>
            </section>

            <section>
              <h3>9. Modifications</h3>
              <p>
                Nous pouvons modifier ces Conditions à tout moment. Vous serez
                informé par email des changements importants.
              </p>
            </section>

            <section className='terms-modal-highlight'>
              <h3>10. Loi Applicable</h3>
              <p>
                Ces Conditions sont régies par les lois de la République du
                Cameroun.
              </p>
            </section>

            <div className='terms-modal-footer-text'>
              <p>
                <strong>Contact :</strong> findlocate237@gmail.com
              </p>
              <p className='terms-modal-date'>
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          {/* 🆕 Indicateur de scroll */}
          {!hasScrolledToBottom && (
            <div className='terms-scroll-indicator'>
              <span>↓ Faites défiler pour lire l'intégralité ↓</span>
            </div>
          )}
        </div>

        {/* 🆕 Section acceptation */}
        <div className='terms-modal-acceptance'>
          <label className='terms-checkbox-label'>
            <input
              type='checkbox'
              checked={acceptCheckbox}
              onChange={(e) => setAcceptCheckbox(e.target.checked)}
              disabled={!hasScrolledToBottom}
            />
            <span>
              J'ai lu et j'accepte les{' '}
              <Link to='/terms' target='_blank' className='terms-link'>
                Conditions Générales d'Utilisation
              </Link>
            </span>
          </label>

          {!hasScrolledToBottom && (
            <p className='terms-scroll-reminder'>
              ⚠️ Veuillez lire l'intégralité des conditions avant d'accepter
            </p>
          )}
        </div>

        {/* 🆕 Boutons d'action */}
        <div className='terms-modal-actions'>
          <button onClick={onDecline} className='terms-decline-btn'>
            Refuser
          </button>
          <button
            onClick={onAccept}
            disabled={!acceptCheckbox || !hasScrolledToBottom}
            className='terms-accept-btn'
            style={{
              opacity: !acceptCheckbox || !hasScrolledToBottom ? 0.5 : 1,
              cursor:
                !acceptCheckbox || !hasScrolledToBottom
                  ? 'not-allowed'
                  : 'pointer',
            }}
          >
            Accepter et Continuer
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsModal
