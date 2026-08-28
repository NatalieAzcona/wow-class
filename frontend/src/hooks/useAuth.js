import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

const useAuth = () => {
  const { user, token, login, logout, updateUser } = useContext(AuthContext)
  const isTeacher = user?.role === 'teacher'
  const isStudent = user?.role === 'student'
  return { user, token, login, logout, updateUser, isTeacher, isStudent }
}

export default useAuth
