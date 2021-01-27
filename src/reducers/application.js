const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.value };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    case SET_INTERVIEW: {
      const { id, interview } = action.value;
      const theDay = [...state.days].filter((day) =>
        day.appointments.includes(id)
      );

      let spots = theDay[0].spots;
      const dayId = theDay[0].id;

      if (!state.appointments[id].interview) {
        // for adding an appointment
        if (interview) {
          spots--;
        }
      } else {
        // for deleting an appointment
        if (interview === null) {
          spots++;
        }
      }

      const updatedDay = {
        ...state.days[dayId - 1],
        spots,
      };
      // add new day into days array
      const days = [...state.days];
      days.splice(dayId - 1, 1, updatedDay);

      return {
        ...state,
        appointments: {
          ...state.appointments,
          [id]: {
            ...state.appointments[id],
            interview,
          },
        },
        days,
      };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

export { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW };
