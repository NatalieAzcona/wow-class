import React, { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { API } from '../../config/api'
import './NotificationBell.scss'

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const menuRef = useRef(null)
  const token = localStorage.getItem('token')

  const unread = notifications.filter(n => !n.read).length

  const fetchNotifications = async () => {
    const res = await fetch(`${API}/notification`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (Array.isArray(data)) setNotifications(data)
  }

  const handleOpen = async () => {
    setOpen(prev => !prev)
    if (!open && unread > 0) {
      await fetch(`${API}/notification/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

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
    <div className="notification-bell" ref={menuRef}>
      <button className="notification-bell__btn" onClick={handleOpen}>
        <FontAwesomeIcon icon={faBell} />
        {unread > 0 && <span className="notification-bell__badge">{unread}</span>}
      </button>
      {open && (
        <div className="notification-bell__dropdown">
          {notifications.length === 0 ? (
            <p className="notification-bell__empty">Sin notificaciones</p>
          ) : (
            notifications.map(n => (
              <div key={n._id} className={`notification-bell__item${n.read ? '' : ' notification-bell__item--unread'}`}>
                {n.message.split('|').map((part, i) => (
                  <p key={i} className={i === 0 ? 'notification-bell__message' : 'notification-bell__detail'}>{part}</p>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
