import React, { useEffect, useRef } from 'react'

const DeleteEventModal = ({eventData, onConfirm, onCancel}) => {

const dialogRef = useRef(null)

useEffect(()=> {
dialogRef.current.showModal()
}, [])

//paso a string porque no puedo renderizar objeto
  return (
    <dialog ref={dialogRef}>
      <p>{eventData.start.toLocaleString('es-ES')}</p> 
      <button onClick={onConfirm}>Eliminar disponibilidad</button>
      <button onClick={onCancel}>Cancelar</button>
    </dialog>
  )
}

export default DeleteEventModal
