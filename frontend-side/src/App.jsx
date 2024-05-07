/* eslint-disable react/prop-types */
import './App.css'
import CardGrid from './components/CardGrid'

import gameServices from './services/games'

import { useState, useEffect } from 'react'

const App = () => {
  const [games, setGames] = useState([])

  useEffect(() => {
    async function getGame () {
      const gamesResult = await gameServices.getGames()

      let covers = gamesResult.map(game => gameServices.getCover(game.id))
      covers = await Promise.all(covers)

      gamesResult.forEach((game, index) => {
        game.cover = covers[index]
        gamesResult[index] = game
      })
      setGames(gamesResult)
    }
    getGame()
  }, [])

  return (
    <>
      <CardGrid games={games} />
    </>
  )
}

export default App
