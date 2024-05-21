import SimpleGameCard from './simpleGameCard'
import PropTypes from 'prop-types'

import '../styles/card-grid.css'

const cardSizes = {
  NORMAL: 'normal',
  SMALL: 'small'
}

const gridContext = {
  NORMAL: 'normal',
  USER_MINI_LIST: 'user-mini-list',
  USER_LIST: 'user-list'
}

const CardGrid = ({ children, context, games, size, onGameClickHandler, onGameLoadHandler, cardsGroup }) => {
  if (games.length === 0) return null
  if (size === undefined) size = cardSizes.NORMAL
  if (context === undefined) context = gridContext.NORMAL

  const gridStyle = {
    gridTemplateColumns: size === cardSizes.SMALL
      ? `repeat(${games.length}, 0.1fr)`
      : `repeat(auto-fill, minmax(${context === gridContext.USER_LIST ? '120px' : '300px'}, 1fr))`
  }

  const gridClass = `card-grid ${Object.values(gridContext).includes(context) ? context : 'normal'}`

  const cardProps = {
    size,
    onClickHandler: onGameClickHandler,
    onGameLoadHandler,
    cardGroup: cardsGroup,
    context
  }
  return (
    <article style={gridStyle} className={gridClass}>
      {children && children}
      {
      context === gridContext.USER_MINI_LIST &&
      games.map(game => {
        const index = games.indexOf(game)
        const cardStyle = {
          placeSelf: 'center',
          gridColumn: `1 / ${index + 2}`,
          gridRow: '1/1'
        }

        if (typeof (game) !== 'object') {
          return <SimpleGameCard key={game} game={game} cover={null} style={cardStyle} cardProps={cardProps} />
        } else {
          return <SimpleGameCard key={game.id} game={game} cover={game.cover} style={cardStyle} cardProps={cardProps} />
        }
      })
      }
      {
        context !== gridContext.USER_MINI_LIST &&
        games.map(game => {
          if (typeof (game) !== 'object') {
            return <SimpleGameCard key={game} game={game} cover={null} cardProps={cardProps} />
          } else {
            return <SimpleGameCard key={game.id} game={game} cover={game.cover} cardProps={cardProps} />
          }
        })
      }
    </article>
  )
}

CardGrid.propTypes = {
  children: PropTypes.node,
  size: PropTypes.oneOf([cardSizes.NORMAL, cardSizes.SMALL]),
  context: PropTypes.oneOf(Object.values(gridContext)),
  games: PropTypes.array.isRequired,
  onGameClickHandler: PropTypes.func,
  onGameLoadHandler: PropTypes.func,
  cardsGroup: PropTypes.string
}

export default CardGrid
