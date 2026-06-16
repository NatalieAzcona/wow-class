import React, { useEffect, useRef } from 'react'

const ReservationModal = ({eventData, onConfirm, onCancel}) => {

const dialogRef = useRef(null)

useEffect(()=> {
dialogRef.current.showModal()
}, [])

return (
    <dialog ref={dialogRef}>
      <p>{eventData.start.toLocaleString('es-ES')}</p> 
      <button onClick={onConfirm}>Reservar</button>
      <button onClick={onCancel}>Cancelar</button>
    </dialog>
  )
}

export default ReservationModal