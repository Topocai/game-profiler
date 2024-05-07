/* eslint-disable react/prop-types */
import './App.css'
import CardGrid from './components/CardGrid'

import gameServices from './services/games'
import UserProfile from './components/UserProfile'

import { useState, useEffect } from 'react'

const App = () => {
  const [games, setGames] = useState([])

  const getCovers = async (games) => {
    const newGamesArray = games
    let covers = newGamesArray.map(game => gameServices.getCover(game.id))
    covers = await Promise.all(covers)

    newGamesArray.forEach((game, index) => {
      game.cover = covers[index]
      newGamesArray[index] = game
    })

    return newGamesArray
  }

  useEffect(() => {
    async function getGame () {
      const gamesResult = await gameServices.getGames()
      const gamesWithCovers = await getCovers(gamesResult)

      setGames(gamesWithCovers)
    }
    getGame()
  }, [])

  const onSubmitHandler = async (event, { gameName }) => {
    event.preventDefault()
    const searchResult = await gameServices.getGamesBySearch(gameName)
    console.log(searchResult)
    if (searchResult.length > 0) {
      const gamesWithCovers = await getCovers(searchResult)
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
      <UserProfile userId={'663abc87ac8842fd49120732'} />
    </>
  )
}

export default App
