import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'



//bbdd: coleccion Reservation tiene studennt, teacher, availability y status

// get al backend pidiendo "todas las reservas de student donde el teacher soy yo", el backend reconoce por el token en header
//middleware isAuth 

//resultado es un array de reservas pendientes que se pueden ver y gestionar
const Requests = () => {

 const queryClient = useQueryClient()


 const  {data, isLoading, isError} = useQuery({
    queryKey: ['reservationList'],
    queryFn: () => fetch('http://localhost:3000/api/v1/reservation', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`}
  }).then(res => res.json())
  })


const mutation = useMutation({
  mutationFn: ({id, status}) => 
    fetch(`http://localhost:3000/api/v1/reservation/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json", Authorization: `Bearer ${localStorage.getItem('token')}`},
      body: JSON.stringify({status})
      }).then(res => res.json()),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reservationList'] })
      }   
}) 


if (isLoading) return <div>...</div>;
if (isError) return <div>...</div>; 

  return (
    <div>
      {data.map(e => (
        <div key={e._id}>
          <p>{e.status}</p>
          <button onClick={() => mutation.mutate({id: e._id, status: 'confirmada'})}>Confirmar</button>
          <button onClick={() => mutation.mutate({id: e._id, status: 'rechazada'})}>Rechazar</button>
        </div>
      ))}
    </div>
   
  )
}

export default Requests
