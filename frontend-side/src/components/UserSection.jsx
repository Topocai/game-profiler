/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

import userServices from '../services/user'
import UserProfile from './UserProfile'

const UserSection = forwardRef(function UserSection (props, ref) {
  const [userInfo, setUserInfo] = useState(null)
  const { userId } = props

  useEffect(() => {
    async function getUser () {
      const user = await userServices.getUser(userId)
      setUserInfo(user)
    }
    getUser()
  }, [userId])

  const updateLists = (newListsObject) => {
    if (!userInfo) return
    setUserInfo({ ...userInfo, UserData: { ...userInfo.UserData, gamesList: newListsObject } })
  }

  useImperativeHandle(ref, () => {
    return {
      updateLists
    }
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
    </section>

  )
})

UserSection.propTypes = {
  userId: PropTypes.string.isRequired
}

export default UserSection
