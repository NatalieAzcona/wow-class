import React from 'react'
import UserManagement from '../../components/shared/UserManagement'
import PannelAccess from '../../components/shared/PannelAccess'
import CalendarProfessor from '../../components/calendar/CalendarProfessor'

const AdminDashboard = () => {
  return (
    <>
      <UserManagement/>
      <CalendarProfessor/>
      <PannelAccess/>
    </>
  )
}


export default AdminDashboard
