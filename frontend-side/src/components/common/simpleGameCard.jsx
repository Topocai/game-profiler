/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

import '../styles/simpleGameCard.css'
import PropTypes from 'prop-types'

import gameServices from '../../services/games'

import variables from '../../variables'

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

const SimpleGameCard = ({ game, cover, cardProps, style }) => {
  const [gameContent, setGameContent] = useState({})

  const {
    size,
    onClickHandler = () => {},
    onGameLoadHandler = () => {},
    cardGroup,
    context
  } = cardProps

  // Sets the gameCard Style based on the size
  const cardStyleTemplate = {
    ...style,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }

  if (size === cardSizes.SMALL) {
    cardStyleTemplate.height = '180px'
    cardStyleTemplate.width = '120px'
    cardStyleTemplate.maxHeight = '120px'
    cardStyleTemplate.maxWidth = '80px'
    cardStyleTemplate.boxShadow = 'rgba(0, 0, 0, 0.35) 0px -90px 36px -28px inset'
  }

  // Gets the game data from igdb if the game is a number

  useEffect(() => {
    async function getGame () {
      const gameInfo = await gameServices.getGameById(game)
      let coverUrl = await gameServices.getCover(gameInfo.id)
      gameInfo.cover = coverUrl

      // Sets the cover url to HTTPS
      coverUrl = coverUrl.slice(coverUrl.indexOf('/upload/') + 8, coverUrl.length)
      coverUrl = `https://images.igdb.com/igdb/image/upload/${coverUrl}`
      const style = {
        ...cardStyleTemplate,
        backgroundImage: `url(${coverUrl})`
      }
      setGameContent({ ...gameInfo, cardStyle: style, cardList: cardGroup })
    }

    // Checks if the game data exists or if it is a ID
    if (typeof (game) !== 'object') {
      // Sets an empty object if the game is not found for the load animation
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
      // While the game is loading get the game data
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
  }, [game])

  // When the game data loads, call the function for the load animation
  useEffect(() => {
    if (!gameContent.name) return
    onGameLoadHandler({ ...gameContent })
  }, [gameContent])

  const preventDefaultHandler = (event) => {
    event.preventDefault()
    onClickHandler(game)
  }
  return (
      <article
      title={gameContent.name}
      style={gameContent.cardStyle}
      className={`simple-game-card ${!gameContent.name ? 'loading-card' : ''}`}
      onClick={(e) => preventDefaultHandler(e)}>
          {
            (size === cardSizes.NORMAL && context !== variables.GRID_CARD_CONTEXTS.USER_LIST) &&
            <article
            className='simple-game-card-content'
            style={!gameContent.name ? { height: '300px' } : null}>
              <h4>
                <a href={gameContent.url}>{gameContent.name}</a>
              </h4>
              {
              gameContent.summary && gameContent.summary.length > 100
                ? <p>{gameContent.summary.slice(0, 100)}<a href={game.url}> ...</a></p>
                : <p>{gameContent.summary}</p>
              }
              <span>{gameContent.releaseDate}</span>
            </article>
          }
          {
            context === variables.GRID_CARD_CONTEXTS.USER_LIST &&
            <article
            className='simple-game-card-content'
            >
              <h4 style={{ margin: '0', fontSize: '0.75rem' }}>
                <a href={gameContent.url}>{gameContent.name}</a>
              </h4>
              <span style={{ fontSize: '0.65rem' }}>{variables.LIVE_VARIABLES.GAME_LISTS[game.cardList.toUpperCase()].display}</span>
            </article>
          }
          {
            size === cardSizes.SMALL &&
            <div style={{ width: '100%', height: '100%' }}></div>
          }
      </article>
  )
}

SimpleGameCard.propTypes = {
  game: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
  cover: PropTypes.string,
  cardProps: PropTypes.object,
  style: PropTypes.object
}

export default SimpleGameCard
