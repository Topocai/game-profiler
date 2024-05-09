/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './App.css'

import CardGrid from './components/CardGrid'
import UserSection from './components/UserSection'
import UserLogin from './components/UserLogin'

import gameServices from './services/games'
import loginService from './services/login'
import userServices from './services/user'

const App = () => {
  const [games, setGames] = useState([])
  const [userLogged, setUser] = useState({})

  useEffect(() => {
    async function getGame () {
      const gamesResult = await gameServices.getGames()
      const gamesWithCovers = await gameServices.getCoversFromArray(gamesResult)

      setGames(gamesWithCovers)
    }
    getGame()
    const isLogged = window.localStorage.getItem('user')
    if (isLogged) setUser(JSON.parse(isLogged))
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

  return (
    <>
      {
        userLogged.token
          ? <button onClick={onLogoutHandler}>Logout</button>
          : <UserLogin onLogin={onLoginHandler} />
      }
      <form onSubmit={(e) => onSubmitHandler(e, { gameName: e.target[0].value })}>
        <input type='text' placeholder='Ingresa el nombre de un juego'/>
        <button type='submit'>Buscar</button>
      </form>
      <CardGrid games={games} />
      {userLogged.token && <UserSection userId={userLogged.id} />}
    </>
  )
}

export default App
