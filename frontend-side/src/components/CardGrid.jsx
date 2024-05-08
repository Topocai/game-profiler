/* eslint-disable react/prop-types */
import SimpleGameCard from './simpleGameCard'

import './styles/card-grid.css'

const CardGrid = ({ games }) => {
  if (games.length === 0) return null
  console.log(games)
  return (
    <section className='card-grid'>
      {games.map(game => <SimpleGameCard key={game.id} game={game} cover={game.cover} />)}
    </section>

  )
}

export default CardGrid
