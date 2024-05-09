import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import userServices from '../services/user'
import UserProfile from './UserProfile'
import UserLists from './UserLists'

const UserSection = ({ userId }) => {
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    async function getUser () {
      const user = await userServices.getUser(userId)
      setUserInfo(user)
    }
    getUser()
  }, [])

  if (userInfo === null) return null

  const userAvatar = userInfo.UserData.user_avatar ? userInfo.UserData.user_avatar : 'https://placehold.co/500x500'
  const userName = userInfo.UserData.user_name
  const platforms = userInfo.UserData.user_platform.length > 0 ? userInfo.UserData.user_platform : null
  const gender = userInfo.UserData.user_gender ? userInfo.UserData.user_gender : null

  const gamesLists = userInfo.UserData.gamesList ? userInfo.UserData.gamesList : null

  const userProfile = {
    userAvatar,
    userName,
    platforms,
    gender,
    gamesLists
  }

  return (
    <section>
        <UserProfile userProfile={userProfile} />
        <UserLists listsData={gamesLists} />
    </section>

  )
}

UserSection.propTypes = {
  userId: PropTypes.string.isRequired
}

export default UserSection
