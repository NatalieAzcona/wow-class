import useAuth from '../../hooks/useAuth'
import React, { useState, useRef, useEffect } from 'react'
import ProfileCard from './ProfileCard'

import './AvatarMenu.scss'

const AvatarMenu = () => {
  const { user } = useAuth()
  const initial = user?.name?.charAt(0).toUpperCase() || '?'
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="avatar-menu" ref={menuRef}>
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
