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

const getInterviewersForDay = function(state, day) {
  const filteredInterviews = state.days.filter(curDay => curDay.name === day)
  
  if (filteredInterviews.length === 0) {
    return filteredInterviews
  }
  
  return filteredInterviews[0].interviewers.map((interviewer) => {
    return state.interviewers[interviewer]
  })
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay }
