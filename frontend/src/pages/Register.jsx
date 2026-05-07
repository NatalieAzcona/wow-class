import React from 'react'
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
  <form onSubmit={handleSubmit(submit)}> 
    <div>
      <label> Name: </label>
      <input type='text' {...register("name")} />
    </div>
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

export default Register

