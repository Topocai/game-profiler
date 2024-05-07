/* eslint-disable react/prop-types */
import './styles/game-card.css'

const GameCard = ({ name, summary, cover }) => {
  console.log('Cover of card: ', cover)
  return (
      <article className="game-card">
        <img className="game-card-background" src={cover.cover} alt="" />
        <div className="game-card-content">
          <header>
            <strong className="game-card-title">{name}</strong>
            <div className="game-card-user-inputs">
              <button className="game-card-user-state">Playing</button>
              <button className="game-card-user-state">Finished</button>
              <button className="game-card-user-state">On-Hold</button>
              <button className="game-card-user-state">Fav</button>
            </div>
          </header>
          <div className="game-card-genres">
            <p>G</p>
          </div>
          <p className="game-card-description">{summary}</p>
        </div>
      </article>
  )
}

export default GameCard
