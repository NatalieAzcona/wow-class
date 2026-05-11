import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const ProfileCard = () => {

const { user } = useContext(AuthContext)

  return (
    <div>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  )
}

export default ProfileCard
