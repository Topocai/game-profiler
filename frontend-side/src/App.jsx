/* eslint-disable react/prop-types */
import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

import CardGrid from './components/common/CardGrid'
import UserSection from './components/user-profile/UserSection'
import UserLogin from './components/auth/UserLogin'
import EditGame from './components/common/EditGame'

import gameServices from './services/games'
import loginService from './services/login'
import userServices from './services/user'

import variables from './variables'

const LOAD_ARRAY = ['this', 'is', 'an', 'easter', 'egg']
const LIMIT_PER_SEARCH = 6

const App = () => {
  // const [appState, setAppState] = useState({ ...appStateBody })
  const [gamesResult, setGamesResult] = useState(LOAD_ARRAY)
  const [userLogged, setUserLogged] = useState(() => {
    const user = window.localStorage.getItem('user')
    if (user) {
      return JSON.parse(user)
    }
    return {}
  })
  // eslint-disable-next-line no-unused-vars
  const [userDisplay, setUserDisplay] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const userParam = searchParams.get('username')
    if (userParam) {
      return {
        username: userParam,
        timeout: null,
        id: null
      }
    } else if (userLogged.id) {
      return {
        username: userLogged.username,
        timeout: null,
        id: userLogged.id
      }
    }
    return {
      username: '',
      timeout: null,
      id: null
    }
  })
  const [selectedGame, setSelectedGame] = useState(null)

  // eslint-disable-next-line no-unused-vars
  const [lastSearch, setLastSearch] = useState('')

  const userSectionRef = useRef(null)

  useEffect(() => {
    console.log('First effect')
    // Initiate games
    async function getGames (amount) {
      const gamesResult = await gameServices.getGames(amount)
      const gamesWithCovers = await gameServices.getCoversFromArray(gamesResult)

      setGamesResult(gamesWithCovers)
    }
    getGames(LIMIT_PER_SEARCH)
    async function setLiveVariables () {
      await variables.LIVE_VARIABLES.updateVariables()
    }
    setLiveVariables()
  }, [])

  const getDisplayId = useCallback(async () => {
    const user = await userServices.getUserDataByUsername(userDisplay.username)
    if (!user) return
    console.log(user)
    setUserDisplay({ ...userDisplay, id: user.user_id })
  }, [userDisplay])

  useEffect(() => {
    if (userDisplay.id) return
    getDisplayId()
  }, [userDisplay.username, userDisplay.id])

  const userSearchHandler = async (value) => {
    const newDisplay = {
      username: value.trim(),
      timeout: null
    }
    if (newDisplay.username === '') {
      if (userLogged) {
        newDisplay.username = userLogged.username
        newDisplay.id = userLogged.id
      }
    }
    const timeout = setTimeout(() => setUserDisplay({ ...newDisplay, timeout: null }), 2000)
    clearTimeout(userDisplay.timeout)
    setUserDisplay({ ...userDisplay, timeout })
  }

  const onSearchHandler = async (event, { gameName }) => {
    event.preventDefault()
    setGamesResult(LOAD_ARRAY)
    const searchResult = await gameServices.getGamesBySearch(gameName)
    if (searchResult.length > 0) {
      const gamesWithCovers = await gameServices.getCoversFromArray(searchResult)
      setGamesResult(gamesWithCovers)
    }
    setLastSearch(gameName)
  }

  const onTokenExpires = () => {
    window.localStorage.removeItem('user')
    setUserLogged({})
  }

  const onLoginHandler = async (event) => {
    event.preventDefault()
    const username = event.target[0].value
    const password = event.target[1].value
    try {
      const userLogged = await loginService.loginUser(username, password)
      window.localStorage.setItem('user', JSON.stringify(userLogged))
      setUserLogged(userLogged)
    } catch (err) {
      console.error('[LOGIN ERROR]', err.response.data)
    }
  }

  const onLogoutHandler = () => {
    window.localStorage.removeItem('user')
    setUserLogged({})
  }

  const onGameClick = (game) => {
    console.log('click')
    setSelectedGame(game)
  }

  const addOrModifyGameHandler = async (event, newUserData, listAdded, toFavorite) => {
    event.preventDefault()
    if (!newUserData) {
      setSelectedGame(null)
      return
    }
    const response = await userServices.putUserData(newUserData, { userData: userLogged, onTokenExpiresCallback: onTokenExpires })
    console.log(response)
    userSectionRef.current.addGame({ ...selectedGame, cardList: listAdded }, listAdded, toFavorite)
    setSelectedGame(null)
  }/*

  const searchMoreHandler = async (e) => {
    e.preventDefault()
    const conditions = `id != (${games.map(game => game.id).join(',').slice(0, -1)})`
    const moreGames = await gameServices.getGamesBySearch(lastSearch, conditions)
    if (moreGames.length > 0) {
      const moreGamesWithCovers = await gameServices.getCoversFromArray(moreGames)
      setGames([...games, ...moreGamesWithCovers])
    }
  }
  */

  return (
    <main>
       {
         userLogged.token
           ? <button onClick={onLogoutHandler}>Logout</button>
           : <UserLogin onLogin={onLoginHandler} />
       }
       <form onSubmit={(e) => onSearchHandler(e, { gameName: e.target[0].value })}>
         <input type='text' placeholder='Ingresa el nombre de un juego'/>
         <button type='submit'>Buscar</button>
       </form>
       {
         (userLogged.token && selectedGame) && <EditGame game={selectedGame} userLogged={userLogged} onSubmitHandler={addOrModifyGameHandler} />
       }
       <CardGrid size={'normal'} games={gamesResult} onGameClickHandler={onGameClick} />
       <input type="text" onChange={(e) => userSearchHandler(e.target.value)} />
       {userDisplay.id && <UserSection userId={userDisplay.id} ref={userSectionRef} onGameClickHandler={onGameClick} loggedId={userLogged.id} />}
    </main>
  )
}

export default App
