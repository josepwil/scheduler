import React, { useReducer, useEffect } from 'react'
import axios from 'axios'

const useApplicationData = function() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday", 
    days: [], 
    appointments: {},
    interviewers: {}
  });

  
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day:action.value }
      case SET_APPLICATION_DATA:
        return { ...state, ...action.value}
      case SET_INTERVIEW: {
        return {...state, ...action.value}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  // set application data 
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ])
      .then(all => {
        dispatch({ type: SET_APPLICATION_DATA, value: {
          days: all[0].data, 
          appointments: all[1].data,
          interviewers: all[2].data
        } });
      })
  }, [])

  const setDay = day => dispatch({ type: SET_DAY, value:day });

  // helper functions
  function getSpots(state, id) {
    const daysCopy = [...state.days]
    const theDay = daysCopy.filter((day) => {
      return day.appointments.includes(id);
    })
    return theDay[0]
  }


  // set interview
  function bookInterview(id, interview) {
    const dayData = getSpots(state, id)
    let spotsRemaining = dayData.spots;
    const dayId = dayData.id

    if(!state.appointments[id].interview) {
      spotsRemaining--;
    }

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
      return dispatch({ type: SET_INTERVIEW, value: { 
        appointments, days }}
      )
    })
  }

  // set interview 
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
      return dispatch({ type: SET_INTERVIEW, value: { 
        appointments, days }}
      )
    })
  }
  

  return {state, setDay, bookInterview, cancelInterview}
}


export default useApplicationData