/* eslint-disable react/prop-types */
import './styles/simpleGameCard.css'

const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = `0${date.getMonth() + 1}`.slice(-2)
  const day = `0${date.getDate()}`.slice(-2)
  return `${year}-${month}-${day}`
}

const SimpleGameCard = ({ game, cover }) => {
  /**
     * game: {
     * id
     * first_release_date: number
     * name
     * summary
     * url
     * }
     */
  if (game === undefined || game === null) return null
  const coverUrl = cover !== 'No cover found' ? cover : 'https://placehold.co/500x900'
  const gameSummary = game.summary && game.summary.length > 100 ? <p>{game.summary.slice(0, 100)}<a href={game.url}> ...</a></p> : <p>{game.summary}</p>
  const cardStyle = {
    backgroundImage: `url(${coverUrl})`
  }
  return (
        <article style={cardStyle} className="simple-game-card">
            <div className='simple-game-card-content'>
            <div className="thumb"></div>
              <strong><a href={game.url}>{game.name}</a></strong>
              {gameSummary}
              <span>{getDateFromTimestamp(game.first_release_date)}</span>
            </div>
        </article>
  )
}

export default SimpleGameCard
