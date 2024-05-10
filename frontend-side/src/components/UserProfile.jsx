import { useState, useEffect } from 'react'

import './styles/user-profile.css'
import PropTypes from 'prop-types'

import gameServices from '../services/games'

import CardGrid from './CardGrid'

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
}

const gridContext = {
  NORMAL: 'normal',
  USER_MINI_LIST: 'user-mini-list'
}

const UserProfile = ({ userProfile }) => {
  const [userLists, setUserLists] = useState(null)

  const {
    userAvatar,
    userName,
    gender,
    platforms,
    gamesLists
  } = userProfile

  useEffect(() => {
    async function getLists () {
      const lists = await fillLists(gamesLists)
      setUserLists(lists)
    }
    getLists()
  }, [])

  if (userProfile.length === 0) return

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
          <div className='user-profile-platform'>
            <h3>Platforms</h3>
            <div className='user-profile-platforms-container'>
              {platforms.map(platform => <span key={platform}>{platform}</span>)}
            </div>
          </div>
          <div>
            <h3>Games</h3>
            <div className='user-profile-games-lists-container'>
              {
                userLists
                  ? Object.keys(userLists).map(list => {
                    return (
                      <div key={list} className='user-profile-games-list'>
                        <strong>{list}</strong>
                        <CardGrid size={'small'} context={'USER_MINI_LIST'} games={userLists[list]} />
                      </div>
                    )
                  })
                  : null
              }
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
