import React from 'react'
import { Outlet } from 'react-router-dom'
import './Dashboard.scss'

const Dashboard = () => (
  <div className="dashboard">
    <div className="dashboard__content">
      <Outlet />
    </div>
  </div>
)

export default Dashboard
