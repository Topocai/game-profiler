/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'

import userServices from '../services/user'

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
  const birthDate = userInfo.UserData.user_birthday ? userInfo.UserData.user_birthday : null
  const gender = userInfo.UserData.user_gender ? userInfo.UserData.user_gender : null

  return (
    <section>
      <article>
        <img src={userAvatar} alt={userName} />
        <h1>{userName}</h1>
        <p>{birthDate || 'Unknown'}</p>
        <p>{gender || 'Unknown'}</p>
        <p>{platforms || 'Unknown'}</p>
      </article>
    </section>
  )
}

export default UserProfile
