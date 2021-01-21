const getAppointmentsForDay = function(state, day) {
  const filteredAppointments = state.days.filter(curDay => curDay.name === day)
  
  if (filteredAppointments.length === 0) {
    return filteredAppointments
  }
  
  return filteredAppointments[0].appointments.map((appointment) => {
    return state.appointments[appointment]
  })
}

const getInterview = function(state, interview) {
  if(!interview) {
    return null;
  }
  const interviewerId = interview.interviewer
  for (let interviewInfo in state.interviewers) {
    if(state.interviewers[interviewInfo].id === interviewerId) {
      return {
        student: interview.student,
        interviewer: state.interviewers[interviewInfo]
      }
    }
  }
}

export { getAppointmentsForDay, getInterview }
