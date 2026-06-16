import React, { useContext } from 'react'
import StudentDashboard from './dashboards/StudentDashboard'
import AdminDashboard from './dashboards/AdminDashboard'
import ProfessorDashboard from './dashboards/ProfessorDashboard'
import { AuthContext } from '../context/AuthContext'



const Dashboard = () => {

const {user} = useContext(AuthContext)

if(user.role === "admin") return <AdminDashboard/>
else if (user.role === "teacher") return <ProfessorDashboard/>
else return <StudentDashboard/>

}

export default Dashboard;
