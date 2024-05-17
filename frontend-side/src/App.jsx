/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import './App.css'

import CardGrid from './components/CardGrid'
import UserSection from './components/UserSection'
import UserLogin from './components/UserLogin'
import EditGame from './components/EditGame'

import gameServices from './services/games'
import loginService from './services/login'
import userServices from './services/user'
// eslint-disable-next-line no-unused-vars
import testingObjects from './services/testingObjects'
import variables from './variables'

const searchArray = ['this', 'is', 'a', 'easter', 'egg']

const LIMIT_PER_SEARCH = 6

const App = () => {
  // const [appState, setAppState] = useState({ ...appStateBody })
  const [games, setGames] = useState(searchArray)
  const [userLogged, setUser] = useState({})
  const [selectedGame, setSelectedGame] = useState(null)

  const userSectionRef = useRef(null)

  useEffect(() => {
    // Initiate games
    async function getGames (amount) {
      const gamesResult = await gameServices.getGames(amount)
      const gamesWithCovers = await gameServices.getCoversFromArray(gamesResult)

      setGames(gamesWithCovers)
    }
    async function setLiveVariables () {
      await variables.LIVE_VARIABLES.updateVariables()
    }
    getGames(LIMIT_PER_SEARCH)
    setLiveVariables()
    // Check if user has logged
    const isLogged = window.localStorage.getItem('user')
    if (isLogged) {
      setUser(JSON.parse(isLogged))
    }
  }, [])

  const onSearchHandler = async (event, { gameName }) => {
    event.preventDefault()
    setGames(searchArray)
    const searchResult = await gameServices.getGamesBySearch(gameName)
    if (searchResult.length > 0) {
      const gamesWithCovers = await gameServices.getCoversFromArray(searchResult)
      setGames(gamesWithCovers)
    }
  }

  const onTokenExpires = () => {
    window.localStorage.removeItem('user')
    setUser({})
  }

  const onLoginHandler = async (event) => {
    event.preventDefault()
    const username = event.target[0].value
    const password = event.target[1].value
    try {
      const userLogged = await loginService.loginUser(username, password)
      window.localStorage.setItem('user', JSON.stringify(userLogged))
      setUser(userLogged)
    } catch (err) {
      console.error('[LOGIN ERROR]', err.response.data)
    }
  }

  const onLogoutHandler = () => {
    window.localStorage.removeItem('user')
    setUser({})
  }

  const onGameClick = (game) => {
    console.log(game)
    setSelectedGame(game)
  }

  const addOrModifyGameHandler = async (event, newUserData) => {
    event.preventDefault()
    const response = await userServices.putUserData(newUserData, { userData: userLogged, onTokenExpiresCallback: onTokenExpires })
    console.log(response)
    setSelectedGame(null)
  }
  /*
  const testHandler = (e) => {
    e.preventDefault()
    console.log(variables.LIVE_VARIABLES.GENRES)
  } */

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
        <CardGrid size={'normal'} games={games} onGameClickHandler={onGameClick} />
        {userLogged.token && <UserSection userId={userLogged.id} ref={userSectionRef} />}
     </main>
  )
}

export default App
