import React, { useContext, useState } from 'react'
import ProfileCard from './ProfileCard'
import { AuthContext } from '../context/AuthContext'
import './AvatarMenu.scss'


const AvatarMenu = () => {

const {user} = useContext(AuthContext)
const initial = user.name?.charAt(0).toUpperCase()

const [open, setOpen] = useState(false)

  return (
    <div className="avatar-menu">
      <button className="avatar-menu__btn" onClick={() => setOpen(!open)}>{initial}</button>
      {open && (
        <div className="avatar-menu__dropdown">
          <ProfileCard />
        </div>
      )}
    </div>
  )
}

export default AvatarMenu
