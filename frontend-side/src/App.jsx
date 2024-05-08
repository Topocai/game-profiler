/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import './App.css'

import CardGrid from './components/CardGrid'
import UserSection from './components/UserSection'

import gameServices from './services/games'

const App = () => {
  const [games, setGames] = useState([])

  useEffect(() => {
    async function getGame () {
      const gamesResult = await gameServices.getGames()
      const gamesWithCovers = await gameServices.getCoversFromArray(gamesResult)

      setGames(gamesWithCovers)
    }
    getGame()
  }, [])

  const onSubmitHandler = async (event, { gameName }) => {
    event.preventDefault()
    const searchResult = await gameServices.getGamesBySearch(gameName)
    console.log(searchResult)
    if (searchResult.length > 0) {
      const gamesWithCovers = await gameServices.getCoversFromArray(searchResult)
      setGames(gamesWithCovers)
    }
  }
  return (
    <>
      <form onSubmit={(e) => onSubmitHandler(e, { gameName: e.target[0].value })}>
        <input type='text' placeholder='Ingresa el nombre de un juego'/>
        <button type='submit'>Buscar</button>
      </form>
      <CardGrid games={games} />
      <UserSection userId={'663b3e0fb24a1c46915f1994'} />
    </>
  )
}

export default App
