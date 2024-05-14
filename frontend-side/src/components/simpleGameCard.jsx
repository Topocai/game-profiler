import './styles/simpleGameCard.css'
import PropTypes from 'prop-types'

const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  return `${year}-${month}-${day}`
}

const cardSizes = {
  NORMAL: 'normal',
  SMALL: 'small'
}

const SimpleGameCard = ({ size, game, cover, onClickHandler, style }) => {
  if (!game.name) return null
  if (onClickHandler === undefined) onClickHandler = () => console.log('Fucking easter egg')

  const coverUrl = (cover !== 'No cover found' || cover !== undefined) ? cover : 'https://placehold.co/400x400'
  const gameSummary = game.summary && game.summary.length > 100 ? <p>{game.summary.slice(0, 100)}<a href={game.url}> ...</a></p> : <p>{game.summary}</p>
  const cardStyle = {
    ...style,
    backgroundImage: `url(${coverUrl})`,
    backgroundPosition: 'center'
  }
  if (size === cardSizes.SMALL) {
    cardStyle.height = '180px'
    cardStyle.width = '120px'
    cardStyle.boxShadow = 'rgba(0, 0, 0, 0.35) 0px -90px 36px -28px inset'
    cardStyle.backdropFilter = 'blur(2px)'
  }

  const preventDefaultHandler = (event) => {
    event.preventDefault()
    onClickHandler(game)
  }
  return (
      <article style={cardStyle} className="simple-game-card" onClick={(e) => preventDefaultHandler(e)}>
          {
            size === cardSizes.NORMAL &&
            <div className='simple-game-card-content'>
              <strong><a href={game.url}>{game.name}</a></strong>
              {gameSummary}
              <span>{getDateFromTimestamp(game.first_release_date)}</span>
            </div>
          }
          {
            size === cardSizes.SMALL &&
            <div style={{ backdropFilter: 'blur(1px)', width: '100%', height: '100%' }}>

            </div>
          }
      </article>
  )
}

SimpleGameCard.propTypes = {
  size: PropTypes.oneOf([cardSizes.NORMAL, cardSizes.SMALL]),
  game: PropTypes.object.isRequired,
  cover: PropTypes.string,
  onClickHandler: PropTypes.func,
  style: PropTypes.object
}

export default SimpleGameCard
