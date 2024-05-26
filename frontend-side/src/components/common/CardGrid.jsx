import SimpleGameCard from './simpleGameCard'
import PropTypes from 'prop-types'

import '../styles/card-grid.css'

import variables from '../../variables'

const CardGrid = ({ children, context, games, size, onGameClickHandler = undefined, onGameLoadHandler = undefined, cardsGroup = undefined }) => {
  if (games.length === 0) return null
  if (size === undefined) size = variables.CARD_SIZES.NORMAL
  if (context === undefined) context = variables.GRID_CARD_CONTEXTS.NORMAL

  const gridStyle = {
    gridTemplateColumns: size === variables.CARD_SIZES.SMALL
      ? `repeat(${games.length}, 0.1fr)`
      : `repeat(auto-fill, minmax(${context === variables.GRID_CARD_CONTEXTS.USER_LIST ? '120px' : '300px'}, 1fr))`
  }

  const gridClass = `card-grid ${Object.values(variables.GRID_CARD_CONTEXTS).includes(context) ? context : 'normal'}`

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
      context === variables.GRID_CARD_CONTEXTS.USER_MINI_LIST &&
      games.map((game, index) => {
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
        context !== variables.GRID_CARD_CONTEXTS.USER_MINI_LIST &&
        games.map((game, index) => {
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
  size: PropTypes.oneOf(Object.values(variables.CARD_SIZES)),
  context: PropTypes.oneOf(Object.values(variables.GRID_CARD_CONTEXTS)),
  games: PropTypes.array.isRequired,
  onGameClickHandler: PropTypes.func,
  onGameLoadHandler: PropTypes.func,
  cardsGroup: PropTypes.string
}

export default CardGrid
