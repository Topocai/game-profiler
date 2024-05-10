import SimpleGameCard from './simpleGameCard'
import PropTypes from 'prop-types'

import './styles/card-grid.css'

const cardSizes = {
  NORMAL: 'normal',
  SMALL: 'small'
}

const gridContext = {
  NORMAL: 'normal',
  USER_MINI_LIST: 'user-mini-list'
}

const CardGrid = ({ size, context, games, onGameClickHandler }) => {
  if (games.length === 0) return null
  if (size === undefined) size = cardSizes.NORMAL
  if (context === undefined) context = gridContext.NORMAL

  const gridStyle = {
    gridTemplateColumns: size === cardSizes.SMALL
      ? 'repeat(5, 60px)'
      : 'repeat(auto-fill, minmax(300px, 1fr))'
  }

  const gridClass = `card-grid ${gridContext[context]}`
  return (
    <section style={gridStyle} className={gridClass}>
      {games.map(game => <SimpleGameCard key={game.id} size={size} game={game} cover={game.cover} onClickHandler={onGameClickHandler} />)}
    </section>

  )
}

CardGrid.propTypes = {
  size: PropTypes.oneOf([cardSizes.NORMAL, cardSizes.SMALL]),
  context: PropTypes.oneOf([gridContext.NORMAL, gridContext.USER_MINI_LIST]),
  games: PropTypes.array,
  onGameClickHandler: PropTypes.func.isRequired
}

export default CardGrid
