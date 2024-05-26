import { useEffect, useState, useCallback } from 'react'

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

const SimpleGameCard = ({ game, cover = 'no cover found', cardProps = {}, style }) => {
  const [gameContent, setGameContent] = useState({
    id: null,
    name: null,
    url: '#',
    summary: null,
    releaseDate: ' ',
    cardList: ' ',
    cover
  })

  const {
    size = variables.CARD_SIZES.NORMAL,
    onClickHandler = () => {},
    onGameLoadHandler = () => {}, // Needs to be a useCallback
    cardGroup = ' ',
    context = variables.GRID_CARD_CONTEXTS.NORMAL
  } = cardProps

  const cardStyleTemplate = {
    ...style,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }

  const getCover = useCallback(async () => {
    const id = typeof (game) !== 'object' ? game : game.id
    if (isNaN(Number(id))) return
    if (!gameContent.name) return
    if (gameContent.cover && gameContent.cover.toLowerCase() !== 'no cover found') return
    if (cover && cover.toLowerCase() !== 'no cover found') return

    const coverUrl = await gameServices.getCover(id)
    if (!coverUrl || coverUrl.toLowerCase() === 'no cover found') {
      console.log('repeat loop')
      setTimeout(() => getCover(id), 10000)
      return
    }
    setGameContent(prevData => ({ ...prevData, cover: coverUrl }))
  }, [cover, gameContent.cover, gameContent.name, game])

  // Gets the cover from igdb and retry if it is not found
  useEffect(() => {
    getCover()
  }, [gameContent.cover, getCover])

  const getGame = useCallback(async () => {
    if (gameContent.name) return
    try {
      const gameInfo = await gameServices.getGameById(game)

      if (!gameContent.cover || gameContent.cover.toLowerCase() === 'no cover found') {
        const coverUrl = await gameServices.getCover(game)
        if (coverUrl !== '') gameInfo.cover = coverUrl
      } else {
        gameInfo.cover = gameContent.cover
      }

      if (!gameInfo) {
        console.log('Error, looping', game)
        getGame()
        return
      }
      setGameContent({ ...gameInfo, cardList: cardGroup })
    } catch {
      console.log('Error, looping catch', game)
      getGame()
    }
  }, [cardGroup, game, gameContent])

  // Gets the game data from igdb if the game is a number
  useEffect(() => {
    // Checks if the game data exists or if it is a ID
    if (typeof (game) !== 'object') {
      if (!isNaN(Number(game))) { getGame() }
      return
    }
    if (gameContent.name) return
    const newGameContent = {
      id: game.id,
      name: game.name,
      url: game.url,
      summary: game.summary,
      releaseDate: getDateFromTimestamp(game.first_release_date),
      cardList: game.cardList ? game.cardList : cardGroup,
      cover
    }
    setGameContent(newGameContent)
  }, [game, cover, getGame, gameContent, cardGroup])

  // When the game data loads, call the function for the load animation
  useEffect(() => {
    if (!gameContent.name) return
    onGameLoadHandler({ ...gameContent })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameContent])

  const preventDefaultHandler = (event) => {
    event.preventDefault()
    onClickHandler(game)
  }

  if (!gameContent.name) cardStyleTemplate.width = '250px'

  return (
      <article
      title={gameContent.name}
      style={{
        ...cardStyleTemplate,
        backgroundImage: `url(${gameContent.cover})`
      }}
      className={`simple-game-card ${!gameContent.name ? 'loading-card' : ''} ${size === variables.CARD_SIZES.SMALL ? 'small-card' : ''}`}
      role='button'
      onClick={(e) => preventDefaultHandler(e)}>
          {
            (size === variables.CARD_SIZES.NORMAL && context !== variables.GRID_CARD_CONTEXTS.USER_LIST) &&
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
              <span style={{ fontSize: '0.65rem' }}>
              {Object.keys(variables.LIVE_VARIABLES.GAME_LISTS).includes(gameContent.cardList.toUpperCase())
                ? variables.LIVE_VARIABLES.GAME_LISTS[gameContent.cardList.toUpperCase()].display
                : '--'}
              </span>
            </article>
          }
          {
            size === variables.CARD_SIZES.SMALL &&
            <div style={{ width: '100%', height: '100%' }}></div>
          }
      </article>
  )
}

SimpleGameCard.propTypes = {
  game: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]).isRequired,
  cover: PropTypes.string,
  cardProps: PropTypes.object,
  style: PropTypes.object
}

export default SimpleGameCard
