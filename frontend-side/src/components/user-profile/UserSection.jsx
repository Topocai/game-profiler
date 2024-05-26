import { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react'
import PropTypes from 'prop-types'

import userServices from '../../services/user'
import UserProfile from './UserProfile'
import UserGames from './UserGames'

const UserSection = forwardRef(function UserSection (props, ref) {
  const [userInfo, setUserInfo] = useState(null)
  const [allGames, setAllGames] = useState({
    loaded: 0,
    total: 0,
    alreadyLoaded: [],
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
  const { userId, onGameClickHandler = () => { }, loggedId } = props

  useEffect(() => {
    async function getUser () {
      if (!userId) return
      const user = await userServices.getUser(userId)
      setUserInfo(user)
      const gamesCount = Object.values(user.UserData.gamesList).reduce((acc, val) => acc + val.length, 0)
      setAllGames(prevData => ({ ...prevData, total: (gamesCount - user.UserData.gamesList.favorites.length), gamesList: user.UserData.gamesList }))
    }
    getUser()
  }, [userId])

  const addGame = useCallback((gameInfo, listToAdd, toFav) => {
    if (userId !== loggedId) return
    setAllGames(prevData => ({
      ...prevData,
      loaded: prevData.loaded + 1,
      gamesList: Object.keys(prevData.gamesList).reduce((acc, list) => {
        const newList = (list === listToAdd || (toFav && list === 'favorites'))
          ? (prevData.gamesList[list].find(g => g.id === gameInfo.id) ? prevData.gamesList[list] : [...prevData.gamesList[list], gameInfo])
          : prevData.gamesList[list].filter(g => g.id !== gameInfo.id)
        acc[list] = newList
        return acc
      }, {})
    }))
  }, [userId, loggedId])

  const loadGame = useCallback((gameInfo) => {
    if (!gameInfo.cardList) return
    if (allGames.alreadyLoaded.includes(gameInfo.id)) return
    if (allGames.loaded >= allGames.total) return
    setAllGames(prevData => ({
      ...prevData,
      loaded: prevData.loaded + 1,
      alreadyLoaded: [...prevData.alreadyLoaded, gameInfo.id],
      gamesList: Object.keys(prevData.gamesList).reduce((acc, list) => {
        const index = prevData.gamesList[list].findIndex(id => id === gameInfo.id)
        const newList = index >= 0
          ? [...prevData.gamesList[list]].fill(gameInfo, index, index + 1)
          : [...prevData.gamesList[list]]
        acc[list] = newList
        return acc
      }, {})
    }))
  }, [allGames.loaded, allGames.total, allGames.alreadyLoaded])

  useImperativeHandle(ref, () => {
    return {
      addGame,
      getLoadedInfo: () => allGames.gamesList
    }
  }, [addGame, allGames.gamesList])

  if (userInfo === null) return null

  const UserData = userInfo.UserData

  const userAvatar = UserData.user_avatar ? UserData.user_avatar : 'https://placehold.co/500x500'
  const userName = UserData.user_name
  const platforms = UserData.user_platform.length > 0 ? UserData.user_platform : null
  const gender = UserData.user_gender ? UserData.user_gender : null

  const gamesLists = UserData.gamesList ? UserData.gamesList : null

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
          onGameLoadHandler={loadGame}
          onGameClickHandler={onGameClickHandler} />}
        { activeTab === 'games' && <UserGames gamesLists={allGames.gamesList} onGameClickHandler={onGameClickHandler} /> }
    </section>

  )
})

UserSection.propTypes = {
  userId: PropTypes.string.isRequired,
  onGameClickHandler: PropTypes.func,
  loggedId: PropTypes.string
}

export default UserSection
