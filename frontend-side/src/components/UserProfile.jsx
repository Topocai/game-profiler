import './styles/user-profile.css'
import PropTypes from 'prop-types'

import CardGrid from './CardGrid'

import variables from '../variables'

/*
const fillLists = async (lists) => {
  const newObject = {}
  const values = Object.values(lists).map(list => list.map(game => gameServices.getGameById(game)))
  for (let i = 0; i < values.length; i++) {
    const list = values[i]
    const gamesInfo = await Promise.all(list)
    const newList = await gameServices.getCoversFromArray(gamesInfo)
    newObject[Object.keys(lists)[i]] = newList
  }
  return newObject
} */

const gridContext = {
  NORMAL: 'normal',
  USER_MINI_LIST: 'user-mini-list'
}

const UserProfile = ({ userProfile }) => {
  const {
    userAvatar,
    userName,
    gender,
    platforms,
    gamesLists
  } = userProfile
  /*
  async function getLists () {
    const lists = await fillLists(gamesLists)
    setUserLists(lists)
  }

  getLists() */

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
            <p>{variables.LIVE_VARIABLES.GENRES[gender.toUpperCase()].display || 'Unknown'}</p>
          </article>
          <div className='user-profile-platform'>
            <h3>Platforms</h3>
            <div className='user-profile-platforms-container'>
              {platforms.map(platform => <span key={platform}>{variables.LIVE_VARIABLES.PLATFORMS[platform.toUpperCase()].display}</span>)}
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
                    <strong>{variables.LIVE_VARIABLES.GAME_LISTS[list.toUpperCase()].display}</strong>
                    <CardGrid size={'small'} context={gridContext.USER_MINI_LIST} games={gamesLists[list]} />
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
  userProfile: PropTypes.object.isRequired
}

export default UserProfile
