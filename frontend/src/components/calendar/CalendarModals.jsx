import React from 'react'
import SlotActionModal from './SlotActionModal'
import DeleteEventModal from './DeleteEventModal'
import ReservedEventModal from './ReservedEventModal'

const CalendarModals = ({ selection, mutations, handlers, googleConnected }) => {
  const { selectedEvent, selectedTimeSlot, setSelectedEvent, setSelectedTimeSlot } = selection
  const { deleteMutation, scheduleMutation, actionMutation, cancelReservationMutation } = mutations
  const { getTimeSlotsInRange, createTimeSlotsFromRange, onScheduleMeeting } = handlers

  return (
    <>
      {selectedTimeSlot && (
        <SlotActionModal
          slot={selectedTimeSlot}
          existingTimeSlots={getTimeSlotsInRange(selectedTimeSlot.start, selectedTimeSlot.end)}
          onMarkAvailable={({ start, end }) => {
            createTimeSlotsFromRange(start, end)
            setSelectedTimeSlot(null)
          }}
          onScheduleMeeting={onScheduleMeeting}
          onDeleteRange={() => {
            getTimeSlotsInRange(selectedTimeSlot.start, selectedTimeSlot.end)
              .forEach(ts => deleteMutation.mutate(ts._id))
            setSelectedTimeSlot(null)
          }}
          onCancel={() => setSelectedTimeSlot(null)}
        />
      )}

      {selectedEvent && !selectedEvent.reserved && !selectedEvent.pending && (
        <DeleteEventModal
          eventData={selectedEvent}
          onConfirm={() => deleteMutation.mutate(selectedEvent.id)}
          onCancel={() => setSelectedEvent(null)}
          onSchedule={({ studentId, mode }) => scheduleMutation.mutate({ studentId, mode })}
        />
      )}

      {selectedEvent && (selectedEvent.reserved || selectedEvent.pending) && (
        <ReservedEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onCancel={(reservationId) => cancelReservationMutation.mutate(reservationId)}
          isPending={selectedEvent.pending}
          onApprove={() => actionMutation.mutate({ id: selectedEvent.reservation._id, status: 'confirmada' })}
          onReject={() => actionMutation.mutate({ id: selectedEvent.reservation._id, status: 'rechazada' })}
          googleConnected={googleConnected}
          isActing={actionMutation.isPending}
        />
      )}
    </>
  )
}

export default CalendarModals
