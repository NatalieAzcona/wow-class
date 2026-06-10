import React, { useEffect, useRef } from 'react'

const AvailabilityModal = ({dateData, onConfirm, onCancel}) => {

const dialogRef = useRef(null)

useEffect(()=> {
dialogRef.current.showModal()
}, [])

//paso a string porque no puedo renderizar objeto
  return (
    <dialog ref={dialogRef}>
     <p>{dateData.start.toLocaleString('es-ES')}</p> 
       <button onClick={onConfirm}>Confirmar disponibilidad</button>
      <button onClick={onCancel}>Cancelar</button>
    </dialog>
  )
}

export default AvailabilityModal
