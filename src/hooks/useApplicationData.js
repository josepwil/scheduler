import React, { useReducer, useEffect } from 'react'
import axios from 'axios'

const useApplicationData = function() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const UPDATE_SPOTS = "UPDATE_SPOTS"

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
      case UPDATE_SPOTS: {
        return {...state, days:action.value}
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
  function getSpots(state, id, update) {
    const daysCopy = [...state.days]
    const theDay = daysCopy.filter((day) => {
      return day.appointments.includes(id);
    })
    let spotsRemaining = theDay[0].spots;
    const dayId = theDay[0].id
    
    update ? spotsRemaining-- : spotsRemaining++

    const day = {
      ...state.days[dayId - 1],
      spots: spotsRemaining
    }

    const days = [...state.days]
    days.splice(dayId - 1, 1, day)

    return dispatch({ type: SET_INTERVIEW, value: { 
      days}}
    )
  }


  // set interview
  function bookInterview(id, interview) {
   if (!state.appointments[id].interview) {
     getSpots(state, id, true)
   } 
    
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
        appointments}}
      )
    })
  }

  // set interview 
  function cancelInterview(id, interview) {
    getSpots(state, id, false)
 
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
        appointments}}
      )
    })
  }
  

  return {state, setDay, bookInterview, cancelInterview}
}


export default useApplicationData