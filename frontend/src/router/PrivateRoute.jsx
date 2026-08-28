import useAuth from '../hooks/useAuth'
import React from 'react'
import { Navigate } from 'react-router-dom'



const PrivateRoute = ({children}) => {

const {token} = useAuth()

  return (
    <>
      {token ? children : <Navigate to="/" />}
    </>
  )
}

export default PrivateRoute
