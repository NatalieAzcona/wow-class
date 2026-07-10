import React, { useContext } from 'react'
import './Auth.scss'
import { useMutation } from '@tanstack/react-query'
import {useForm} from "react-hook-form"
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {

const { login } = useContext(AuthContext)

const navigate = useNavigate()

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
      navigate('/dashboard')
    }
  })
  
const {register, handleSubmit} = useForm()

const submit = (formData) => {
  mutation.mutate(formData)

};

  return (
    <div className="auth">
      <form className="auth__form" onSubmit={handleSubmit(submit)}>
        <h1 className="auth__title">Iniciar sesión</h1>
        <div className="auth__field">
          <label className="auth__label">Email</label>
          <input className="auth__input" type='email' {...register("email")} />
        </div>
        <div className="auth__field">
          <label className="auth__label">Contraseña</label>
          <input className="auth__input" type='password' {...register("password")} />
        </div>
        <button className="auth__btn" type="submit">Entrar</button>
      </form>
    </div>
  )
}

export default Login
