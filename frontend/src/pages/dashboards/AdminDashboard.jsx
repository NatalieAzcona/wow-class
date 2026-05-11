import React from 'react'
import Calendar from '../../components/CalendarClass'
import UserManagement from '../../components/UserManagement'
import PannelAccess from '../../components/PannelAccess'

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
