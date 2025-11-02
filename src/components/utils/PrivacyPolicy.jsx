import { useNavigate } from 'react-router'
import './pages-styles.css'

const PrivacyPolicy = () => {
  const navigate = useNavigate()

  return (
    <div className='privacy-container'>
      <div className='privacy-header'>
        <button onClick={() => navigate(-1)} className='privacy-back-btn'>
          ← Retour
        </button>
        <h1>🔒 Politique de Confidentialité</h1>
        <p className='privacy-last-update'>
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>

      <div className='privacy-content'>
        <section className='privacy-section'>
          <h2>1. Introduction</h2>
          <p>
            Chez FindLocate, nous prenons la protection de vos données
            personnelles très au sérieux. Cette politique de confidentialité
            explique comment nous collectons, utilisons, partageons et
            protégeons vos informations.
          </p>
        </section>

        <section className='privacy-section'>
          <h2>2. Données Collectées</h2>
          <h3>2.1 Informations que vous nous fournissez</h3>
          <ul>
            <li>
              <strong>Inscription :</strong> Nom, prénom, email, numéro de
              téléphone, mot de passe
            </li>
            <li>
              <strong>Profil :</strong> Photo de profil, bio, préférences
            </li>
            <li>
              <strong>Annonces :</strong> Descriptions, photos, localisation des
              biens
            </li>
            <li>
              <strong>Messages :</strong> Contenu des conversations avec
              d'autres utilisateurs
            </li>
          </ul>

          <h3>2.2 Informations collectées automatiquement</h3>
          <ul>
            <li>Adresse IP et localisation approximative</li>
            <li>Type de navigateur et appareil utilisé</li>
            <li>Pages visitées et temps passé sur le site</li>
            <li>Cookies et technologies similaires</li>
          </ul>
        </section>

        <section className='privacy-section'>
          <h2>3. Utilisation des Données</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>✅ Créer et gérer votre compte</li>
            <li>✅ Publier et gérer vos annonces</li>
            <li>✅ Faciliter la communication entre utilisateurs</li>
            <li>✅ Envoyer des notifications importantes</li>
            <li>✅ Améliorer nos services</li>
            <li>✅ Détecter et prévenir les fraudes</li>
            <li>✅ Respecter nos obligations légales</li>
          </ul>
        </section>

        <section className='privacy-section'>
          <h2>4. Partage des Données</h2>
          <p>
            Nous ne vendons JAMAIS vos données personnelles. Nous pouvons
            partager vos informations uniquement dans ces cas :
          </p>
          <ul>
            <li>
              <strong>Autres utilisateurs :</strong> Informations de profil
              public et annonces
            </li>
            <li>
              <strong>Prestataires de services :</strong> Hébergement, emails
              (sous contrat strict)
            </li>
            <li>
              <strong>Autorités légales :</strong> Si requis par la loi
            </li>
          </ul>
        </section>

        <section className='privacy-section'>
          <h2>5. Sécurité des Données</h2>
          <p>Nous mettons en place des mesures de sécurité robustes :</p>
          <ul>
            <li>🔐 Chiffrement SSL/TLS pour toutes les communications</li>
            <li>🔐 Mots de passe hashés avec bcrypt</li>
            <li>🔐 Serveurs sécurisés et surveillés 24/7</li>
            <li>🔐 Accès limité aux données par le personnel</li>
            <li>🔐 Sauvegardes régulières et chiffrées</li>
          </ul>
        </section>

        <section className='privacy-section'>
          <h2>6. Vos Droits</h2>
          <p>Conformément au RGPD, vous avez le droit de :</p>
          <ul>
            <li>
              <strong>Accès :</strong> Consulter vos données personnelles
            </li>
            <li>
              <strong>Rectification :</strong> Corriger vos informations
            </li>
            <li>
              <strong>Suppression :</strong> Supprimer votre compte et vos
              données
            </li>
            <li>
              <strong>Portabilité :</strong> Récupérer vos données dans un
              format lisible
            </li>
            <li>
              <strong>Opposition :</strong> Refuser certains traitements
            </li>
            <li>
              <strong>Limitation :</strong> Limiter l'utilisation de vos données
            </li>
          </ul>
          <p>
            Pour exercer vos droits, contactez-nous à :
            <a href='mailto:loketo@gmail.com'> loketo@gmail.com</a>
          </p>
        </section>

        <section className='privacy-section'>
          <h2>7. Cookies</h2>
          <p>Nous utilisons des cookies pour :</p>
          <ul>
            <li>Maintenir votre session connectée</li>
            <li>Mémoriser vos préférences</li>
            <li>Analyser l'utilisation du site</li>
          </ul>
          <p>
            Vous pouvez gérer les cookies dans les paramètres de votre
            navigateur.
          </p>
        </section>

        <section className='privacy-section'>
          <h2>8. Données des Mineurs</h2>
          <p>
            FindLocate est réservé aux personnes de 18 ans et plus. Nous ne
            collectons pas sciemment de données de mineurs. Si nous découvrons
            qu'un mineur nous a fourni des informations, nous supprimerons
            immédiatement ces données.
          </p>
        </section>

        <section className='privacy-section'>
          <h2>9. Conservation des Données</h2>
          <p>Nous conservons vos données :</p>
          <ul>
            <li>Compte actif : Tant que vous utilisez nos services</li>
            <li>Compte supprimé : 30 jours (pour récupération éventuelle)</li>
            <li>Données légales : Selon les obligations légales (max 5 ans)</li>
          </ul>
        </section>

        <section className='privacy-section'>
          <h2>10. Modifications</h2>
          <p>
            Nous pouvons modifier cette politique à tout moment. Les changements
            importants vous seront notifiés par email. La date de dernière mise
            à jour est indiquée en haut.
          </p>
        </section>

        <section className='privacy-section'>
          <h2>11. Contact</h2>
          <p>Pour toute question concernant cette politique :</p>
          <div className='contact-box'>
            <p>
              <strong>Email :</strong> loketo@gmail.com
            </p>
            <p>
              <strong>Adresse :</strong> Douala, Cameroun
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
