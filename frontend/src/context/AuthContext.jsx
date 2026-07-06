import React, { createContext, useState } from 'react'


const AuthContext = createContext()


const AuthProvider = ({children}) => {

const [token, setToken] = useState(localStorage.getItem('token') || null)
const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
})

const login = (token, user) => {
    setToken(token)
    setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
}

const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}

const updateUser = (updatedUser) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
}

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
        {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
export default AuthProvider


