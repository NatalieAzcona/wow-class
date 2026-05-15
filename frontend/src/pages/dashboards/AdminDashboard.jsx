import React from 'react'
import Calendar from '../../components/calendar/CalendarClass'
import UserManagement from '../../components/shared/UserManagement'
import PannelAccess from '../../components/shared/PannelAccess'

const AdminDashboard = () => {
  return (
    <>
      <UserManagement/>
      <Calendar/>
      <PannelAccess/>
    </>
  )
}


export default AdminDashboard
