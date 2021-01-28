import { useReducer, useEffect } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
} from "reducers/application";

const useApplicationData = function () {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // set application data
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((all) => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    });

    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "SET_INTERVIEW") {
        const id = message.id;
        const interview = message.interview;
        dispatch({ type: SET_INTERVIEW, value: { id, interview } });
      }
    };
    return () => {
      webSocket.close();
    };
  }, []);

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  // set interview
  function bookInterview(id, interview) {
    //  if (!state.appointments[id].interview) {
    //    updateSpots(id, true)
    //  }
    return axios.put(`/api/appointments/${id}`, { interview }).then((res) => {
      return dispatch({
        type: SET_INTERVIEW,
        value: {
          id,
          interview,
        },
      });
    });
  }

  // set interview
  function cancelInterview(id, interview) {
    // updateSpots(id, false)
    return axios
      .delete(`/api/appointments/${id}`, { interview })
      .then((res) => {
        return dispatch({
          type: SET_INTERVIEW,
          value: {
            id,
            interview,
          },
        });
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
