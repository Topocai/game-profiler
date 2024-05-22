/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import userServices from '../../services/user'
import UserProfile from './UserProfile'
import UserGames from './UserGames'

const UserSection = forwardRef(function UserSection (props, ref) {
  const [userInfo, setUserInfo] = useState(null)
  const [allGames, setAllGames] = useState({
    loaded: 0,
    total: 0,
    gamesList: {
      finished: [],
      playing: [],
      abandoned: [],
      on_hold: [],
      wishlist: [],
      favorites: []
    }
  })

  const [activeTab, setActiveTab] = useState('user')
  const { userId } = props

  useEffect(() => {
    async function getUser () {
      const user = await userServices.getUser(userId)
      setUserInfo(user)
      const gamesCount = Object.values(user.UserData.gamesList).reduce((acc, val) => acc + val.length, 0)
      setAllGames({ ...allGames, total: gamesCount })
    }
    getUser()
  }, [userId])

  const addGame = (gameInfo, listToAdd, toFav) => {
    if (!allGames) return
    setAllGames(prevData => ({
      ...prevData,
      gamesList: Object.keys(prevData.gamesList).reduce((acc, list) => {
        const newList = (list === listToAdd || (toFav && list === 'favorites'))
          ? [...prevData.gamesList[list], gameInfo]
          : prevData.gamesList[list].filter(g => g.id !== gameInfo.id)
        acc[list] = newList
        return acc
      }, {})
    }))
  }

  const loadGame = (gameInfo) => {
    if (!gameInfo.cardList) return
    setAllGames(prevData => ({
      ...prevData,
      loaded: prevData.loaded + 1,
      gamesList: {
        ...prevData.gamesList,
        [gameInfo.cardList]: [...prevData.gamesList[gameInfo.cardList], gameInfo]
      }
    }))
  }

  useImperativeHandle(ref, () => {
    return {
      addGame,
      getLoadedInfo: () => allGames.gamesList
    }
  }, [])

  if (userInfo === null) return null

  const userAvatar = userInfo.UserData.user_avatar ? userInfo.UserData.user_avatar : 'https://placehold.co/500x500'
  const userName = userInfo.UserData.user_name
  const platforms = userInfo.UserData.user_platform.length > 0 ? userInfo.UserData.user_platform : null
  const gender = userInfo.UserData.user_gender ? userInfo.UserData.user_gender : null

  const gamesLists = userInfo.UserData.gamesList ? userInfo.UserData.gamesList : null

  const userProfile = {
    userAvatar,
    userName,
    platforms,
    gender,
    gamesLists
  }

  return (
    <section>
        <article className='tabs-container'>
          <div className="tab-container">
            <input
              type="radio"
              name="tabs"
              id="user"
              checked={activeTab === 'user'}
              onChange={() => setActiveTab('user')}
            />
            <label htmlFor="user">User Profile</label>
          </div>
          <div className="tab-container">
            <input
              type="radio"
              name="tabs"
              id="games"
              checked={activeTab === 'games'}
              onChange={() => setActiveTab('games')}
              disabled={allGames.loaded < allGames.total}
            />
            <label htmlFor="games">User Games</label>
          </div>
        </article>
        { activeTab === 'user' &&
        <UserProfile
        userProfile={userProfile}
        gamesLists={allGames.loaded >= allGames.total ? allGames.gamesList : userProfile.gamesLists}
        onGameLoadHandler={loadGame} />}
        { activeTab === 'games' && <UserGames gamesLists={allGames.gamesList} /> }
    </section>

  )
})

UserSection.propTypes = {
  userId: PropTypes.string.isRequired
}

export default UserSection
