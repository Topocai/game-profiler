/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'

import userServices from '../services/user'
import './styles/user-profile.css'

const UserProfile = ({ userId }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    async function getUser () {
      const user = await userServices.getUser(userId)
      setUserInfo(user)
    }
    getUser()
  }, [])
  if (userInfo === null) return null
  console.log(userInfo.UserData)

  const userAvatar = userInfo.UserData.user_avatar ? userInfo.UserData.user_avatar : 'https://placehold.co/500x500'
  const userName = userInfo.UserData.user_name
  const platforms = userInfo.UserData.user_platform.length > 0 ? userInfo.UserData.user_platform : null
  const gender = userInfo.UserData.user_gender ? userInfo.UserData.user_gender : null

  const gamesLists = userInfo.UserData.gamesList ? userInfo.UserData.gamesList : null

  return (
    <section>
      <article className='user-profile-container'>
        <section className='user-profile-display'>
          <figure className='user-profile-avatar'>
            <img src={userAvatar} alt={userName} />
          </figure>
        </section>
        <section className='user-profile-info'>
          <div className='user-profile-name'>
            <h2>{userName}</h2>
            <p>{gender || 'Unknown'}</p>
          </div>
          <div>
            <h3>Platforms</h3>
            <div className='user-profile-platform'>
              {platforms.map(platform => <span key={platform}>{platform}</span>)}
            </div>
          </div>
          <div>
            <h3>Games</h3>
            <div>
              {Object.keys(gamesLists).map(list => {
                return (
                  <span key={list}>{list}: {gamesLists[list].length}</span>
                )
              })}
            </div>
          </div>
        </section>
      </article>
    </section>
  )
}

export default UserProfile
