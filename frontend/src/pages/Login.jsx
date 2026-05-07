import React, { useContext } from 'react'
import { useMutation } from '@tanstack/react-query'
import {useForm} from "react-hook-form"
import { AuthContext } from '../context/AuthContext'


const Login = () => {

  const { login } = useContext(AuthContext)

const mutation = useMutation({
    mutationFn: (formData) => 
      fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(formData)
      }).then(res=> res.json()),

    onSuccess: (data) => {
     const {token, user} = data
      login(token, user)
    }
  })
  
const {register, handleSubmit} = useForm()

const submit = (formData) => {
  mutation.mutate(formData)

};

  return (
      <form onSubmit={handleSubmit(submit)}> 
        <div>
          <label> Email: </label>
          <input type='email' {...register("email")} />
        </div>
        <div>
          <label> Password: </label>
          <input type='password' {...register("password")} />
        </div>
        <button type="submit">Enviar</button>
      </form>
  )
}

export default Login
/* {
  "name": "Test User",
  "email": "test@test.com",
  "password": "12345678"
} */