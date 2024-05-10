import { useState, useEffect } from 'react'

import userServices from '../services/user'
import PropTypes from 'prop-types'

const EditGame = ({ game, userLogged, onSubmitHandler }) => {
  const [user, setUserData] = useState(null)

  useEffect(() => {
    async function getUser () {
      const userData = await userServices.getUser(userLogged.id)
      setUserData(userData)
    }
    getUser()
  }, [])

  if (game === undefined || game === null) return null
  if (user === null) return null
  const userGames = user.UserData.userGamesData
  const userLists = user.UserData.gamesList
  const gameData = userGames.find(gameList => gameList.game_id === game.id)

  const onListSelected = async (event) => {
    const list = event.target.value
    console.log(list)
    Object.keys(userLists).forEach(
      listI => (userLists[listI].includes(game.id) ? userLists[listI].splice(userLists[listI].indexOf(game.id), 1) : null)
    )
    userLists[list].push(game.id)
    const userData = { ...user.UserData, gamesList: userLists }
    const newUser = { ...user, UserData: userData }
    setUserData(newUser)
  }

  const onFavoriteHandler = async () => {

  }

  return (
        <dialog open>
            <form onSubmit={(e) => onSubmitHandler(e)}>
                <fieldset name='lists'>
                {
                    Object.keys(userLists).map(list => {
                      if (list === 'favorites') return null
                      return (
                        <label key={list}>{list}
                            <input
                              type="radio"
                              value={list}
                              name="list"
                              onChange={(e) => onListSelected(e)}
                              checked={userLists[list].includes(game.id)}
                            />
                        </label>
                      )
                    })
                }
                </fieldset>

                <label>Favorite
                    <input type="checkbox" checked={userLists.favorites.includes(game.id)}/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </dialog>
  )
}

EditGame.propTypes = {
  game: PropTypes.object,
  userLogged: PropTypes.object.isRequired,
  onSubmitHandler: PropTypes.func
}

export default EditGame
