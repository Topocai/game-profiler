/* eslint-disable react/prop-types */

import { useState } from 'react'
import gameServices from '../services/games'
import CardGrid from './CardGrid'
const UserLists = ({ listsData }) => {
  const [gamesFromList, setGames] = useState([])
  if (listsData.length === 0) return

  const onListSelected = async (event) => {
    const list = event.target.value
    const gamesList = listsData[list]

    const games = await gameServices.getGamesFromArray(gamesList)
    const gamesWithCover = await gameServices.getCoversFromArray(games)
    setGames(gamesWithCover)
  }
  return (
        <section>
            <datalist id="datalist-game-lists">
                {Object.keys(listsData).map(list => <option key={list}>{list}</option>)}
            </datalist>
            <input list="datalist-game-lists" onChange={(e) => onListSelected(e)}/>
            <details>
                <summary>List</summary>
                {gamesFromList.length > 0 ? <CardGrid games={gamesFromList} /> : null}
            </details>
        </section>
  )
}

export default UserLists
