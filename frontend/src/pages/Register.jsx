import React from 'react'
import { API } from '../config/api'
import './Auth.scss'
import { useMutation } from '@tanstack/react-query'
import {useForm} from "react-hook-form"
import {useNavigate, Link} from 'react-router-dom'

const Register = () => {

const navigate = useNavigate()  

const mutation = useMutation({
    mutationFn: (formData) => 
      fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(formData)
      }).then(res=> res.json()),

onSuccess: (data) => {
  navigate("/login")
 }
})


const { register, handleSubmit, formState: { errors } } = useForm()

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
      <div className="auth__consent">
        <label className="auth__consent-label">
          <input type="checkbox" {...register("parentsConsent", { required: true })} />
          <span>El padre, madre o tutor legal ha leído y acepta la <Link to="/privacidad" target="_blank">Política de privacidad</Link> y consiente el tratamiento de los datos del menor.</span>
        </label>
        {errors.parentsConsent && <p className="auth__error">Debes aceptar antes de continuar.</p>}
      </div>
      <button className="auth__btn" type="submit">Registrarse</button>
    </form>
  </div>
)
}

export default Register

