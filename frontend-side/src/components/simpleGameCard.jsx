/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import './styles/simpleGameCard.css'
import PropTypes from 'prop-types'

import gameServices from '../services/games'

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
  const [gameContent, setGameContent] = useState({})

  const cardStyleTemplate = {
    ...style,
    backgroundPosition: 'center'
  }
  if (size === cardSizes.SMALL) {
    cardStyleTemplate.height = '180px'
    cardStyleTemplate.width = '120px'
    cardStyleTemplate.boxShadow = 'rgba(0, 0, 0, 0.35) 0px -90px 36px -28px inset'
    cardStyleTemplate.backdropFilter = 'blur(2px)'
  }

  useEffect(() => {
    async function getGame () {
      const gameInfo = await gameServices.getGameById(game)
      let coverUrl = await gameServices.getCover(gameInfo.id)
      gameInfo.cover = coverUrl

      coverUrl = coverUrl.slice(coverUrl.indexOf('/upload/') + 8, coverUrl.length)
      coverUrl = `https://images.igdb.com/igdb/image/upload/${coverUrl}`
      const style = {
        ...cardStyleTemplate,
        backgroundImage: `url(${coverUrl})`
      }
      setGameContent({ ...gameInfo, cardStyle: style })
    }

    if (typeof (game) !== 'object') {
      cardSizes.width = '250px'
      const newGameContent = {
        name: null,
        url: '#',
        summary: null,
        releaseDate: ' ',
        cover: 'No cover found',
        cardStyle: cardStyleTemplate
      }
      setGameContent(newGameContent)
      if (!isNaN(Number(game))) { getGame() }
    } else {
      const newGameContent = {
        name: game.name,
        url: game.url,
        summary: game.summary,
        releaseDate: getDateFromTimestamp(game.first_release_date),
        cover,
        cardStyle: { ...cardStyleTemplate, backgroundImage: `url(${cover})` }
      }
      setGameContent(newGameContent)
    }
  }, [])

  if (onClickHandler === undefined) onClickHandler = () => console.log('Fucking easter egg')

  const preventDefaultHandler = (event) => {
    event.preventDefault()
    onClickHandler(game)
  }
  return (
      <article title={gameContent.name} style={gameContent.cardStyle} className={`simple-game-card ${!gameContent.name ? 'loading-card' : ''}`} onClick={(e) => preventDefaultHandler(e)}>
          {
            size === cardSizes.NORMAL &&
            <article className='simple-game-card-content' style={!gameContent.name ? { height: '300px' } : null}>
              <h4><a href={gameContent.url}>{gameContent.name}</a></h4>
              {gameContent.summary && gameContent.summary.length > 100
                ? <p>{gameContent.summary.slice(0, 100)}<a href={game.url}> ...</a></p>
                : <p>{gameContent.summary}</p>}
              <span>{gameContent.releaseDate}</span>
            </article>
          }
          {
            size === cardSizes.SMALL &&
            <div style={{ backdropFilter: 'blur(1px)', width: '100%', height: '100%' }}></div>
          }
      </article>
  )
}

SimpleGameCard.propTypes = {
  size: PropTypes.oneOf([cardSizes.NORMAL, cardSizes.SMALL]),
  game: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
  cover: PropTypes.string,
  onClickHandler: PropTypes.func,
  style: PropTypes.object
}

export default SimpleGameCard
