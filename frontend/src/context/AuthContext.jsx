import React, { createContext, useState } from 'react'


const AuthContext = createContext()


const AuthProvider = ({children}) => {

const [user, setUser] = useState(null)
const [token, setToken] = useState(null)

const login = (token, user) => {
    setToken(token)
    setUser(user)

    localStorage.setItem('token', token)
}

const logout = () => {
    setToken(null) 
    setUser(null)
    localStorage.removeItem('token')
}

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
        {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
export default AuthProvider


