import React, { useContext } from 'react'
import StudentDashboard from './dashboards/studentDashboard'
import AdminDashboard from './dashboards/adminDashboard'
import ProfessorDashboard from './dashboards/professorDashboard'
import { AuthContext } from '../context/AuthContext'



const Dashboard = () => {

const {user} = useContext(AuthContext)

if(user.role === "admin") return <AdminDashboard/>
else if (user.role === "professor") return <ProfessorDashboard/>
else return <StudentDashboard/>

}

export default Dashboard;
