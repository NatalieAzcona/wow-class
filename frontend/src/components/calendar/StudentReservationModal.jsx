import React, { useEffect, useRef } from 'react'
import './StudentReservationModal.scss'

const WHATSAPP_NUMBER = '34600000000'

const StudentReservationModal = ({ slot, reservation, onClose, onCancel }) => {
  const dialogRef = useRef(null)
  const isPending = reservation.status === 'pendiente'
  const formattedDate = new Date(slot.startTime).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })
  const waText = `Hola, tengo una clase presencial agendada el ${formattedDate}`

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  return (
    <dialog ref={dialogRef} className="student-modal" onClose={onClose}>
      <div className="student-modal__header">
        <span>{isPending ? 'Solicitud pendiente' : 'Clase confirmada'}</span>
      </div>
      <div className="student-modal__body">
        <div className="student-modal__row">
          <span className="student-modal__key">Formato</span>
          <span className={`student-modal__mode student-modal__mode--${reservation.mode}`}>
            {reservation.mode === 'online' ? 'Online' : 'Presencial'}
          </span>
        </div>
        <div className="student-modal__row">
          <span className="student-modal__key">Fecha</span>
          <span className="student-modal__date">{formattedDate}</span>
        </div>
        {isPending && (
          <p className="student-modal__note">Tu solicitud está en revisión. El profesor la confirmará pronto.</p>
        )}
      </div>
      <div className="student-modal__footer">
        {!isPending && reservation.mode === 'online' && reservation.meetLink && (
          <a className="student-modal__meet" href={reservation.meetLink} target="_blank" rel="noreferrer">
            Unirse a la clase
          </a>
        )}
        {!isPending && reservation.mode === 'presencial' && (
          <a
            className="student-modal__whatsapp"
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`}
            target="_blank"
            rel="noreferrer"
          >
            Escríbenos al WhatsApp
          </a>
        )}
        <button className="student-modal__cancel" onClick={() => onCancel(reservation._id)}>
          {isPending ? 'Cancelar solicitud' : 'Cancelar clase'}
        </button>
        <button className="student-modal__close" onClick={onClose}>Cerrar</button>
      </div>
    </dialog>
  )
}

export default StudentReservationModal
