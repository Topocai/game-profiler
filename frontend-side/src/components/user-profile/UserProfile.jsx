import '../styles/user-profile.css'
import PropTypes from 'prop-types'

import CardGrid from '../common/CardGrid'

import variables from '../../variables'

const UserProfile = ({ userProfile, gamesLists, onGameLoadHandler, onGameClickHandler }) => {
  const {
    userAvatar,
    userName,
    gender,
    platforms
  } = userProfile

  if (userProfile.length === 0) return

  return (
    <section>
      <article className='user-profile-container'>
        <figure className='user-profile-avatar'>
          <img src={userAvatar} alt={userName} />
        </figure>
        <section className='user-profile-info'>
          <article className='user-profile-name'>
            <h2>{userName}</h2>
            <p>
              {variables.LIVE_VARIABLES.GENRES[gender.toUpperCase()]
                ? variables.LIVE_VARIABLES.GENRES[gender.toUpperCase()].display
                : '-Unknown'}
            </p>
          </article>
          <div className='user-profile-platform'>
            <h3>Platforms</h3>
            <div className='user-profile-platforms-container'>
              {platforms.map(platform => <span key={platform}>
                {variables.LIVE_VARIABLES.PLATFORMS[platform.toUpperCase()]
                  ? variables.LIVE_VARIABLES.PLATFORMS[platform.toUpperCase()].display
                  : `-${platform}`}
                </span>)}
            </div>
          </div>
        </section>
      </article>
      <article>
        <h3>Games</h3>
        <div className='user-profile-games-lists-container'>
          {
            gamesLists
              ? Object.keys(gamesLists).map(list => {
                return (
                  <div key={list} className='user-profile-games-list'>
                    <strong>
                      {variables.LIVE_VARIABLES.GAME_LISTS[list.toUpperCase()]
                        ? variables.LIVE_VARIABLES.GAME_LISTS[list.toUpperCase()].display
                        : `-${list}`} {gamesLists[list].length}
                    </strong>
                    <CardGrid size={'small'}
                     context={variables.GRID_CARD_CONTEXTS.USER_MINI_LIST}
                     games={gamesLists[list]}
                     onGameLoadHandler={onGameLoadHandler}
                     cardsGroup={list}
                     onGameClickHandler={onGameClickHandler}/>
                  </div>
                )
              })
              : null
          }
        </div>
      </article>
    </section>
  )
}

UserProfile.propTypes = {
  userProfile: PropTypes.object.isRequired,
  onGameLoadHandler: PropTypes.func.isRequired,
  gamesLists: PropTypes.object.isRequired,
  onGameClickHandler: PropTypes.func.isRequired
}

export default UserProfile
