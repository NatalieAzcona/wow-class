import React, { useContext } from 'react'
import { API } from '../config/api'
import './Auth.scss'
import { useMutation } from '@tanstack/react-query'
import {useForm} from "react-hook-form"
import { AuthContext } from '../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Login = () => {

const { login } = useContext(AuthContext)

const navigate = useNavigate()
const location = useLocation()
const registered = location.state?.registered

const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      return json
    },
    onSuccess: (data) => {
      const { token, user } = data
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
        {registered && <p className="auth__success">Cuenta creada con éxito. Haz login para continuar.</p>}
        <div className="auth__field">
          <label className="auth__label">Email</label>
          <input className="auth__input" type='email' {...register("email")} />
        </div>
        <div className="auth__field">
          <label className="auth__label">Contraseña</label>
          <input className="auth__input" type='password' {...register("password")} />
        </div>
        {mutation.isError && <p className="auth__error">Email o contraseña incorrectos.</p>}
        <button className="auth__btn" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}

export default Login
