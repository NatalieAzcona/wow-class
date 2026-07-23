import React from 'react'
import { API } from '../config/api'
import './Auth.scss'
import { useMutation } from '@tanstack/react-query'
import {useForm} from "react-hook-form"
import {useNavigate, Link} from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'


const Register = () => {

const navigate = useNavigate()  
const { login } = useContext(AuthContext)
const { register, handleSubmit, formState: { errors }, getValues } = useForm()


const mutation = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(formData)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      return json
    },
    onSuccess: async (data) => {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: getValues('password') })
      })
      const json = await res.json()
      login(json.token, json.user)
      navigate('/dashboard')
    }
  })

const submit = (formData) => {
  mutation.mutate(formData)

};
  
return (
  <div className="auth">
    <form className="auth__form" onSubmit={handleSubmit(submit)}>
      <h1 className="auth__title">Crear cuenta</h1>
      <div className="auth__field">
        <label className="auth__label">Nombre</label>
        <input className="auth__input" type='text' {...register("name", { required: true })} />
        {errors.name && <p className="auth__error">El nombre es obligatorio.</p>}
      </div>
      <div className="auth__field">
        <label className="auth__label">Email</label>
        <input className="auth__input" type='email' {...register("email", { required: true })} />
        {errors.email && <p className="auth__error">El email es obligatorio.</p>}
      </div>
      <div className="auth__field">
        <label className="auth__label">Contraseña</label>
        <input className="auth__input" type='password' {...register("password", { required: true, minLength: 8 })} />
        <p className="auth__hint">Mínimo 8 caracteres.</p>
        {errors.password?.type === 'required' && <p className="auth__error">La contraseña es obligatoria.</p>}
        {errors.password?.type === 'minLength' && <p className="auth__error">La contraseña debe tener al menos 8 caracteres.</p>}
      </div>
      <div className="auth__consent">
        <label className="auth__consent-label">
          <input type="checkbox" {...register("parentsConsent", { required: true })} />
          <span>El padre, madre o tutor legal ha leído y acepta la <Link to="/privacidad" target="_blank">Política de privacidad</Link> y consiente el tratamiento de los datos del menor.</span>
        </label>
        {errors.parentsConsent && <p className="auth__error">Debes aceptar antes de continuar.</p>}
      </div>
      {mutation.isError && (
        <p className="auth__error">
          {mutation.error.message === 'Este email ya está registrado en la base de datos'
            ? 'Este email ya está registrado.'
            : 'No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo.'}
        </p>
      )}
      <button className="auth__btn" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creando cuenta...' : 'Registrarse'}
      </button>
    </form>
  </div>
)
}

export default Register

