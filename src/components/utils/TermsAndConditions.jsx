import { useNavigate } from 'react-router'
import './terms-styles.css'

const TermsAndConditions = () => {
  const navigate = useNavigate()

  return (
    <div className='terms-container'>
      <div className='terms-header'>
        <button onClick={() => navigate(-1)} className='terms-back-btn'>
          ← Retour
        </button>
        <h1>Conditions Générales d'Utilisation</h1>
        <p className='terms-last-update'>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div className='terms-content'>
        {/* 🆕 Section 1 */}
        <section className='terms-section'>
          <h2>1. Acceptation des Conditions</h2>
          <p>
            En accédant et en utilisant FindLocate (ci-après "la Plateforme"),
            vous acceptez d'être lié par les présentes Conditions Générales
            d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne
            pas utiliser la Plateforme.
          </p>
        </section>

        {/* 🆕 Section 2 */}
        <section className='terms-section'>
          <h2>2. Description du Service</h2>
          <p>
            FindLocate est une plateforme en ligne qui permet aux utilisateurs
            de publier et de rechercher des annonces immobilières (appartements,
            studios, maisons, chambres) au Cameroun.
          </p>
          <p>
            La Plateforme met en relation des annonceurs et des chercheurs de
            logements, mais n'intervient pas dans les transactions entre
            utilisateurs.
          </p>
        </section>

        {/* 🆕 Section 3 */}
        <section className='terms-section'>
          <h2>3. Inscription et Compte Utilisateur</h2>
          <h3>3.1 Conditions d'Inscription</h3>
          <ul>
            <li>Vous devez être âgé d'au moins 18 ans pour créer un compte</li>
            <li>
              Les informations fournies lors de l'inscription doivent être
              exactes et complètes
            </li>
            <li>
              Vous êtes responsable de la confidentialité de votre mot de passe
            </li>
            <li>Un seul compte par personne est autorisé</li>
          </ul>

          <h3>3.2 Sécurité du Compte</h3>
          <p>
            Vous êtes entièrement responsable de toutes les activités qui se
            produisent sous votre compte. En cas d'utilisation non autorisée,
            vous devez nous en informer immédiatement.
          </p>
        </section>

        {/* 🆕 Section 4 */}
        <section className='terms-section'>
          <h2>4. Règles de Publication d'Annonces</h2>
          <h3>4.1 Contenu Autorisé</h3>
          <p>Les annonces publiées doivent :</p>
          <ul>
            <li>Concerner uniquement des biens immobiliers au Cameroun</li>
            <li>Contenir des informations véridiques et à jour</li>
            <li>Inclure des photos réelles du bien proposé</li>
            <li>Mentionner un prix honnête et non trompeur</li>
          </ul>

          <h3>4.2 Contenu Interdit</h3>
          <p>Il est strictement interdit de publier :</p>
          <ul>
            <li>Des annonces frauduleuses ou trompeuses</li>
            <li>Du contenu offensant, discriminatoire ou illégal</li>
            <li>Des liens vers des sites externes non autorisés</li>
            <li>Des annonces en double</li>
            <li>Du spam ou de la publicité non sollicitée</li>
          </ul>
        </section>

        {/* 🆕 Section 5 */}
        <section className='terms-section'>
          <h2>5. Responsabilités et Limitations</h2>
          <h3>5.1 Responsabilité de la Plateforme</h3>
          <p>
            FindLocate agit uniquement en tant qu'intermédiaire. Nous ne sommes
            pas responsables :
          </p>
          <ul>
            <li>De la véracité des annonces publiées</li>
            <li>Des transactions entre utilisateurs</li>
            <li>Des litiges entre annonceurs et locataires/acheteurs</li>
            <li>De la qualité ou de l'état des biens immobiliers</li>
          </ul>

          <h3>5.2 Responsabilité des Utilisateurs</h3>
          <p>En tant qu'utilisateur, vous êtes responsable de :</p>
          <ul>
            <li>
              Vérifier l'authenticité des annonces avant toute transaction
            </li>
            <li>Rencontrer les annonceurs en personne avant tout engagement</li>
            <li>Ne pas effectuer de paiement avant visite du bien</li>
            <li>Respecter les lois camerounaises en vigueur</li>
          </ul>
        </section>

        {/* 🆕 Section 6 */}
        <section className='terms-section'>
          <h2>6. Protection des Données Personnelles</h2>
          <p>
            Nous collectons et traitons vos données personnelles conformément à
            notre Politique de Confidentialité. Vos données sont utilisées
            uniquement pour :
          </p>
          <ul>
            <li>La création et gestion de votre compte</li>
            <li>La publication de vos annonces</li>
            <li>La communication entre utilisateurs via notre messagerie</li>
            <li>L'amélioration de nos services</li>
          </ul>
          <p>Vos données ne seront jamais vendues à des tiers.</p>
        </section>

        {/* 🆕 Section 7 */}
        <section className='terms-section'>
          <h2>7. Messagerie et Communication</h2>
          <p>
            La Plateforme propose un système de messagerie interne. Il est
            interdit d'utiliser cette fonctionnalité pour :
          </p>
          <ul>
            <li>Harceler ou menacer d'autres utilisateurs</li>
            <li>Envoyer du spam ou du contenu commercial non sollicité</li>
            <li>Partager des informations frauduleuses</li>
          </ul>
        </section>

        {/* 🆕 Section 8 */}
        <section className='terms-section'>
          <h2>8. Signalement et Modération</h2>
          <p>
            Les utilisateurs peuvent signaler les annonces ou comportements
            inappropriés. Nous nous réservons le droit de :
          </p>
          <ul>
            <li>Supprimer toute annonce non conforme</li>
            <li>Suspendre ou supprimer les comptes en violation des règles</li>
            <li>Communiquer avec les autorités en cas d'activité illégale</li>
          </ul>
          <p className='terms-highlight'>
            ⚠️ Le signalement est anonyme et traité dans les plus brefs délais.
          </p>
        </section>

        {/* 🆕 Section 9 */}
        <section className='terms-section'>
          <h2>9. Propriété Intellectuelle</h2>
          <p>
            Tous les contenus de la Plateforme (logo, design, textes) sont la
            propriété de FindLocate. En publiant une annonce, vous accordez à
            FindLocate le droit d'afficher votre contenu sur la Plateforme.
          </p>
          <p>
            Vous conservez tous les droits sur vos photos et contenus
            personnels.
          </p>
        </section>

        {/* 🆕 Section 10 */}
        <section className='terms-section'>
          <h2>10. Modifications des Conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces Conditions à tout
            moment. Les utilisateurs seront informés par email des modifications
            importantes. L'utilisation continue de la Plateforme après
            modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        {/* 🆕 Section 11 */}
        <section className='terms-section'>
          <h2>11. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis les
            paramètres. Nous pouvons également suspendre ou supprimer votre
            compte en cas de violation de ces Conditions.
          </p>
        </section>

        {/* 🆕 Section 12 */}
        <section className='terms-section'>
          <h2>12. Loi Applicable</h2>
          <p>
            Ces Conditions sont régies par les lois de la République du
            Cameroun. Tout litige sera soumis aux tribunaux compétents de
            Douala.
          </p>
        </section>

        {/* 🆕 Section 13 */}
        <section className='terms-section'>
          <h2>13. Contact</h2>
          <p>
            Pour toute question concernant ces Conditions, vous pouvez nous
            contacter :
          </p>
          <div className='terms-contact-box'>
            <p>
              <strong>Email :</strong> findlocate237@gmail.com
            </p>
            <p>
              <strong>Téléphone :</strong> +237 692 763 964
            </p>
            <p>
              <strong>Adresse :</strong> Dschang, Cameroun
            </p>
          </div>
        </section>

        {/* 🆕 Section finale */}
        <section className='terms-section terms-acknowledgment'>
          <h2>Remerciements</h2>
          <p>
            Merci d'utiliser FindLocate. En acceptant ces Conditions, vous
            contribuez à créer une communauté sûre et fiable pour tous les
            utilisateurs.
          </p>
          <p className='terms-signature'>— L'équipe FindLocate</p>
        </section>
      </div>
    </div>
  )
}

export default TermsAndConditions
