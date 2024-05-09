import './styles/user-profile.css'
import PropTypes from 'prop-types'

const UserProfile = ({ userProfile }) => {
  if (userProfile.length === 0) return
  const {
    userAvatar,
    userName,
    gender,
    platforms,
    gamesLists
  } = userProfile
  return (
    <section>
      <article className='user-profile-container'>
        <section className='user-profile-display'>
          <figure className='user-profile-avatar'>
            <img src={userAvatar} alt={userName} />
          </figure>
        </section>
        <section className='user-profile-info'>
          <div className='user-profile-name'>
            <h2>{userName}</h2>
            <p>{gender || 'Unknown'}</p>
          </div>
          <div>
            <h3>Platforms</h3>
            <div className='user-profile-platform'>
              {platforms.map(platform => <span key={platform}>{platform}</span>)}
            </div>
          </div>
          <div>
            <h3>Games</h3>
            <div>
              {Object.keys(gamesLists).map(list => {
                return (
                  <span key={list}>{list}: {gamesLists[list].length}</span>
                )
              })}
            </div>
          </div>
        </section>
      </article>
    </section>
  )
}

UserProfile.propTypes = {
  userProfile: PropTypes.object.isRequired
}

export default UserProfile
