export default function getAppointmentsForDay(state, day) {
  const filteredAppointments = state.days.filter(curDay => curDay.name === day)
  
  if (filteredAppointments.length === 0) {
    return filteredAppointments
  }
  
  return filteredAppointments[0].appointments.map((appointment) => {
    return state.appointments[appointment]
  })
}