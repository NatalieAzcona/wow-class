import React from 'react'
import './Auth.scss'
import { useMutation } from '@tanstack/react-query'
import {useForm} from "react-hook-form"
import {useNavigate} from 'react-router-dom'

const Register = () => {

const navigate = useNavigate()  

const mutation = useMutation({
    mutationFn: (formData) => 
      fetch("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(formData)
      }).then(res=> res.json()),

onSuccess: (data) => {
  navigate("/login")
 }
})


const {register, handleSubmit} = useForm()

const submit = (formData) => {
  mutation.mutate(formData)

};
  
return (
  <div className="auth">
    <form className="auth__form" onSubmit={handleSubmit(submit)}>
      <h1 className="auth__title">Crear cuenta</h1>
      <div className="auth__field">
        <label className="auth__label">Nombre</label>
        <input className="auth__input" type='text' {...register("name")} />
      </div>
      <div className="auth__field">
        <label className="auth__label">Email</label>
        <input className="auth__input" type='email' {...register("email")} />
      </div>
      <div className="auth__field">
        <label className="auth__label">Contraseña</label>
        <input className="auth__input" type='password' {...register("password")} />
      </div>
      <button className="auth__btn" type="submit">Registrarse</button>
    </form>
  </div>
)
}

export default Register

