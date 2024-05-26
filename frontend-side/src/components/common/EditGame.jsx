import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import userServices from '../../services/user'
import variables from '../../variables'

import '../styles/edit-game-modal.css'

import InputList from './InputList'

const EditGame = ({ game, userLogged, onSubmitHandler }) => {
  const [user, setUserData] = useState(null)
  // const [gameUserData, setGameUserData] = useState(null)
  const [selectedList, setSelectedList] = useState(null)

  useEffect(() => {
    async function getUser () {
      const userData = await userServices.getUser(userLogged.id)
      setUserData(userData.UserData)

      // const existingGameData = user.userGamesData.find(gameList => gameList.game_id === game.id)
      Object.keys(userData.UserData.gamesList).forEach(list => {
        const finded = userData.UserData.gamesList[list].includes(game.id)
        if (finded) {
          setSelectedList(list)
        }
      })
      /*
      if (existingGameData) {
        setGameUserData(existingGameData)
      } */
    }
    getUser()
  }, [game, userLogged])

  if (game === undefined || game === null) return null
  if (user === null) return null

  const userLists = user.gamesList

  const onListSelected = async (event) => {
    const list = event.target.value
    // Elimina el juego de todas las listas
    Object.keys(userLists).forEach(
      listI => (((listI !== 'favorites' || list === 'remove') && userLists[listI].includes(game.id)) ? userLists[listI].splice(userLists[listI].indexOf(game.id), 1) : null)
    )
    // Añade el juego a la nueva lista
    if (userLists[list]) userLists[list].push(game.id)
    const newUser = { ...user, gamesList: userLists }
    setSelectedList(list)
    setUserData(newUser)
  }

  const onFavoriteHandler = async () => {
    if (userLists.favorites.includes(game.id)) {
      userLists.favorites = userLists.favorites.filter(id => id !== game.id)
    } else {
      userLists.favorites.push(game.id)
    }
    const newUser = { ...user, gamesList: userLists }
    setUserData(newUser)
  }

  const coverForModal = game.cover.replace('t_cover_big', 't_screenshot_huge')

  const onSubmitMiddleware = (e) => {
    const newData = { ...user }
    delete newData.userGamesData

    onSubmitHandler(e, newData, selectedList, userLists.favorites.includes(game.id))
  }
  return (
        <dialog className='edit-game-modal'>
          <figure className='edit-game-img'>
            <img src={`${coverForModal}`} alt={game.name + ' cover'} />
          </figure>
          <h2>{game.name}</h2>
          <form onSubmit={(e) => onSubmitMiddleware(e)} className='edit-game-form'>
            <InputList inputs={
              [...Object.keys(userLists).map(list => {
                return {
                  id: list,
                  name: variables.LIVE_VARIABLES.GAME_LISTS[list.toUpperCase()].display,
                  isRadio: list !== 'favorites',
                  isChecked: list !== 'favorites' ? selectedList === list : userLists.favorites.includes(game.id),
                  onChangeHandler: list === 'favorites' ? onFavoriteHandler : null
                }
              }), {
                id: 'remove',
                name: 'Remove game',
                isRadio: true,
                isChecked: selectedList === 'remove',
                onChangeHandler: null
              }]
            }
            fieldsetName="edit-game"
            onChangeHandler={onListSelected}
            disableInputs={selectedList === 'remove'} />
            <button type="submit">Add game</button>
            <button onClick={(e) => onSubmitHandler(e, null)}>Cancel</button>
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
