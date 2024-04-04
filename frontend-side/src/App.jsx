/* eslint-disable react/prop-types */
import './App.css'
import services from './services/requests'
import ProfileForm from './components/profileEdit'
import SimpleGameCard from './components/simpleGameCard'

import { useState, useEffect } from 'react'

const App = () => {
  const [game, setGame] = useState({})
  const [cover, setCover] = useState()

  function getGame() {
    services.get_random_games()
    .then(game => {
      setGame(game[0])
      services.get_cover(game[0].id).then(cover => setCover(cover))
    })
  }

  useEffect(getGame, [])

  return (
    <>
      <ProfileForm gender_get={services.get_genders} plataforms_get={services.get_plataforms} />
      <SimpleGameCard game={game} cover={cover}/>
    </>
  )
}

export default App
