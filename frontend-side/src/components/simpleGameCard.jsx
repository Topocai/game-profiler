import './styles/simpleGameCard.css'
import PropTypes from 'prop-types'

const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  return `${year}-${month}-${day}`
}

const SimpleGameCard = ({ game, cover, onClickHandler }) => {
  if (game === undefined || game === null) return null
  const coverUrl = cover !== 'No cover found' ? cover : 'https://placehold.co/500x900'
  const gameSummary = game.summary && game.summary.length > 100 ? <p>{game.summary.slice(0, 100)}<a href={game.url}> ...</a></p> : <p>{game.summary}</p>
  const cardStyle = {
    backgroundImage: `url(${coverUrl})`
  }
  return (
      <a onClick={() => onClickHandler(game)}>
        <article style={cardStyle} className="simple-game-card">
          <div className='simple-game-card-content'>
          <div className="thumb"></div>
            <strong><a href={game.url}>{game.name}</a></strong>
            {gameSummary}
            <span>{getDateFromTimestamp(game.first_release_date)}</span>
          </div>
        </article>
      </a>

  )
}

SimpleGameCard.propTypes = {
  game: PropTypes.object.isRequired,
  cover: PropTypes.string,
  onClickHandler: PropTypes.func
}

export default SimpleGameCard
