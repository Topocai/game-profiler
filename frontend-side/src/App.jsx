/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './App.css'

import CardGrid from './components/CardGrid'
import UserSection from './components/UserSection'
import UserLogin from './components/UserLogin'
import EditGame from './components/EditGame'

import gameServices from './services/games'
import loginService from './services/login'

const userStates = {
  LOGGED: 'logged',
  LOGOUT: 'logout'
}

const appStateBody = {
  userSection: userStates.LOADING
}

const App = () => {
  const [appState, setAppState] = useState({ ...appStateBody })
  const [games, setGames] = useState([])
  const [userLogged, setUser] = useState({})

  useEffect(() => {
    if (userLogged === null) setAppState({ ...appState, userSection: userStates.LOGOUT })
    else setAppState({ ...appState, userSection: userStates.LOGGED })
  }, [userLogged])

  useEffect(() => {
    async function getGame () {
      const gamesResult = await gameServices.getGames()
      const gamesWithCovers = await gameServices.getCoversFromArray(gamesResult)

      setGames(gamesWithCovers)
    }
    getGame()
    const isLogged = window.localStorage.getItem('user')
    if (isLogged) {
      setUser(JSON.parse(isLogged))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmitHandler = async (event, { gameName }) => {
    event.preventDefault()
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

  const testHandler = (event) => {
    console.log(event)
  }

  return (
    <>
      {
        userLogged.token
          ? <button onClick={onLogoutHandler}>Logout</button>
          : <UserLogin onLogin={onLoginHandler} />
      }
      {
        userLogged.token && <EditGame game={games[0]} userLogged={userLogged} onSubmitHandler={testHandler} />
      }
      <form onSubmit={(e) => onSubmitHandler(e, { gameName: e.target[0].value })}>
        <input type='text' placeholder='Ingresa el nombre de un juego'/>
        <button type='submit'>Buscar</button>
      </form>
      <CardGrid size={'normal'} games={games} onGameClickHandler={testHandler} />
      {userLogged.token && <UserSection userId={userLogged.id} />}
    </>
  )
}

export default App
