import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVideo, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import './SlotActionModal.scss'
import './ReservedEventModal.scss'

const ReservedEventModal = ({ event, onClose, onCancel, isPending, onApprove, onReject, googleConnected, isActing }) => {
  const dialogRef = useRef(null)
  const { reservation, start } = event
  const student = reservation?.student
  const mode = reservation?.mode
  const meetLink = reservation?.meetLink

  useEffect(() => {
    dialogRef.current.showModal()
  }, [])

  const mapsUrl = student?.address
    ? `https://maps.google.com/?q=${encodeURIComponent(student.address)}`
    : null

  const blockedByGoogle = isPending && mode === 'online' && !googleConnected

  return (
    <dialog ref={dialogRef} className="slot-action-modal" onClose={onClose}>
      <div className="slot-action-modal__header">
        <span>{isPending ? 'Solicitud pendiente' : 'Clase reservada'}</span>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="slot-action-modal__body">
        <div className="reserved-modal__row">
          <span className="reserved-modal__key">Estudiante</span>
          <span className="reserved-modal__val">{student?.name || '—'}</span>
        </div>
        <div className="reserved-modal__row">
          <span className="reserved-modal__key">Formato</span>
          {!isPending && mode === 'online' && meetLink ? (
            <a
              className="reserved-modal__mode reserved-modal__mode--online"
              href={meetLink}
              target="_blank"
              rel="noreferrer"
            >
              <FontAwesomeIcon icon={faVideo} /> Online →
            </a>
          ) : (
            <span className={`reserved-modal__mode reserved-modal__mode--${mode}`}>
              <FontAwesomeIcon icon={mode === 'online' ? faVideo : faLocationDot} />
              {mode === 'online' ? 'Online' : 'Presencial'}
            </span>
          )}
        </div>
        <div className="reserved-modal__row">
          <span className="reserved-modal__key">Fecha</span>
          <span className="reserved-modal__date-val">
            {start.toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}
          </span>
        </div>
        {mode === 'presencial' && student?.address && (
          <div className="reserved-modal__address-block">
            <p className="reserved-modal__address-label">Dirección</p>
            <p className="reserved-modal__address">{student.address}</p>
            <a className="reserved-modal__maps" href={mapsUrl} target="_blank" rel="noreferrer">
              Ver en Google Maps
            </a>
          </div>
        )}
        {mode === 'presencial' && !student?.address && (
          <p className="reserved-modal__no-address">El estudiante no ha guardado su dirección aún</p>
        )}
      </div>
      <div className="slot-action-modal__footer">
        {isPending ? (
          <>
            <div className="reserved-modal__approve-wrap">
              <button
                className="reserved-modal__approve"
                onClick={onApprove}
                disabled={isActing || blockedByGoogle}
              >
                Aprobar
              </button>
              {blockedByGoogle && (
                <span className="reserved-modal__hint">Conecta Google para aprobar clases online</span>
              )}
            </div>
            <button
              className="reserved-modal__reject"
              onClick={onReject}
              disabled={isActing}
            >
              Rechazar
            </button>
          </>
        ) : (
          <button className="reserved-modal__cancel" onClick={() => onCancel(reservation._id)}>
            Cancelar cita
          </button>
        )}
      </div>
    </dialog>
  )
}

export default ReservedEventModal
