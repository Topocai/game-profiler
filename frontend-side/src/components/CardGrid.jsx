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

const CardGrid = ({ children, size, context, games, onGameClickHandler }) => {
  if (games.length === 0) return null
  if (size === undefined) size = cardSizes.NORMAL
  if (context === undefined) context = gridContext.NORMAL

  const gridStyle = {
    gridTemplateColumns: size === cardSizes.SMALL
      ? `repeat(${games.length}, 0.1fr)`
      : 'repeat(auto-fill, minmax(300px, 1fr))'
  }

  const gridClass = `card-grid ${Object.values(gridContext).includes(context) ? context : 'normal'}`
  return (
    <article style={gridStyle} className={gridClass}>
      {children}
      {
      context === gridContext.USER_MINI_LIST &&
      games.map(game => {
        const index = games.indexOf(game)
        const cardStyle = {
          placeSelf: 'center',
          gridColumn: `1 / ${index + 2}`,
          gridRow: '1/1'
        }
        return <SimpleGameCard key={game.id} size={size} game={game} cover={game.cover} onClickHandler={onGameClickHandler} style={cardStyle} />
      })
      }
      {
        context === gridContext.NORMAL &&
        games.map(game => <SimpleGameCard key={game.id} size={size} game={game} cover={game.cover} onClickHandler={onGameClickHandler} />)
      }
    </article>
  )
}

CardGrid.propTypes = {
  size: PropTypes.oneOf([cardSizes.NORMAL, cardSizes.SMALL]),
  context: PropTypes.oneOf([gridContext.NORMAL, gridContext.USER_MINI_LIST]),
  games: PropTypes.array,
  onGameClickHandler: PropTypes.func
}

export default CardGrid
