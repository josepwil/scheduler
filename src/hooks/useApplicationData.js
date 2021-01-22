import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useApplicationData = function() {

  const [state, setState] = useState({
    day: "Monday", 
    days: [], 
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ])
      .then(all => {
        setState(prev => ({
          ...prev, 
          days: all[0].data, 
          appointments: all[1].data,
          interviewers: all[2].data
        }))
      })
  }, [])

  // helper functions
  function getSpots(state, id) {
    const daysCopy = [...state.days]
    const theDay = daysCopy.filter((day) => {
      return day.appointments.includes(id);
    })
    return theDay[0]
  }



  function bookInterview(id, interview) {
    const dayData = getSpots(state, id)
    const spotsRemaining = dayData.spots - 1
    const dayId = dayData.id

    const day = {
      ...state.days[dayId - 1],
      spots: spotsRemaining
    }

    const days = [...state.days]
    days.splice(dayId - 1, 1, day)
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      setState(prev => {
        return {...prev, appointments, days}
      })
    })
  }

  function cancelInterview(id, interview) {
    const dayData = getSpots(state, id)
    const spotsRemaining = dayData.spots + 1
    const dayId = dayData.id
    const day = {
      ...state.days[dayId - 1],
      spots: spotsRemaining
    }
    const days = [...state.days]
    days.splice(dayId - 1, 1, day)

    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    return axios.delete(`/api/appointments/${id}`, { interview })
    .then(res => {
      setState(prev => {
        return {...prev, appointments, days}
      })
    })
  }
  
  const setDay = day => setState({ ...state, day });

  return {state, setDay, bookInterview, cancelInterview}
}


export default useApplicationData