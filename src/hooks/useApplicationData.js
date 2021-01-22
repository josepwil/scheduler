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
  function bookInterview(id, interview) {
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
      setState({...state, appointments})
    })
  }

  function cancelInterview(id, interview) {
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
      setState({...state, appointments})
    })
  }
  
  const setDay = day => setState({ ...state, day });

  return {state, setDay, bookInterview, cancelInterview}
}


export default useApplicationData