import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import CardGrid from './CardGrid'

import variables from '../variables'

const UserGames = ({ gamesLists }) => {
  const [gamesDisplayed, setGamesDisplayed] = useState({
    listsDisplayed: [],
    games: []
  })

  useEffect(() => {
    setGamesDisplayed({
      listsDisplayed: ['favorites'],
      games: [...gamesLists.favorites]
    })
  }, [gamesLists])

  const addList = (list) => {
    setGamesDisplayed(prevData => ({
      listsDisplayed: [...prevData.listsDisplayed, list],
      games: [...prevData.games, ...gamesLists[list]]
    }))
  }

  const removeList = (list) => {
    setGamesDisplayed(prevData => ({
      listsDisplayed: prevData.listsDisplayed.filter(l => l !== list),
      games: prevData.games.filter(g => !gamesLists[list].includes(g))
    }))
  }

  const onListSelected = (event, list) => {
    if (gamesDisplayed.listsDisplayed.includes('favorites')) {
      setGamesDisplayed({
        listsDisplayed: [],
        games: []
      })
    }

    if (!gamesDisplayed.listsDisplayed.includes(list)) {
      addList(list)
    } else {
      removeList(list)
    }
  }

  return (
        <section>
            <article className='tabs-container'>
                {
                  Object.keys(gamesLists).map(list => {
                    if (list === 'favorites') return null
                    return (
                      <div className="tab-container" key={list}>
                        <input
                          type="checkbox"
                          name="tabs"
                          id={list}
                          checked={gamesDisplayed.listsDisplayed.includes(list)}
                          onChange={(event) => onListSelected(event, list)}
                        />
                        <label htmlFor={list}>{variables.LIVE_VARIABLES.GAME_LISTS[list.toUpperCase()].display}</label>
                      </div>
                    )
                  })
                }
            </article>
            <CardGrid games={gamesDisplayed.games} context={variables.GRID_CARD_CONTEXTS.USER_LIST} />
        </section>
  )
}

UserGames.propTypes = {
  gamesLists: PropTypes.object.isRequired
}

export default UserGames
