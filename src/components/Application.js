import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from './DayList';
import Appointment from './Appointment'

const appointments = [
  {
  "id": 1,
  "time": "12pm",
  "interview": null
  },
  {
  "id": 2,
  "time": "1pm",
  "interview": {
  "student": "Archie Cohen",
  "interviewer": 4
  }
  },
  {
  "id": 3,
  "time": "2pm",
  "interview": null
  },
  {
  "id": 4,
  "time": "3pm",
  "interview": {
  "student": "Chad Takahashi",
  "interviewer": 2
  }
  },
  {
  "id": 5,
  "time": "4pm",
  "interview": {
  "student": "Jamal Jordan",
  "interviewer": 2
  }
  },
  {
  "id": 6,
  "time": "12pm",
  "interview": null
  },
  {
  "id": 7,
  "time": "1pm",
  "interview": null
  },
  {
  "id": 8,
  "time": "2pm",
  "interview": {
  "student": "Leopold Silvers",
  "interviewer": 10
  }
  },
  {
  "id": 9,
  "time": "3pm",
  "interview": {
  "student": "Liam Martinez",
  "interviewer": 10
  }
  },
  {
  "id": 10,
  "time": "4pm",
  "interview": null
  },
  {
  "id": 11,
  "time": "12pm",
  "interview": null
  },
  {
  "id": 12,
  "time": "1pm",
  "interview": null
  },
  {
  "id": 13,
  "time": "2pm",
  "interview": {
  "student": "Lydia Miller-Jones",
  "interviewer": 5
  }
  },
  {
  "id": 14,
  "time": "3pm",
  "interview": null
  },
  {
  "id": 15,
  "time": "4pm",
  "interview": null
  },
  {
  "id": 16,
  "time": "12pm",
  "interview": {
  "student": "Maria Boucher",
  "interviewer": 8
  }
  },
  {
  "id": 17,
  "time": "1pm",
  "interview": null
  },
  {
  "id": 18,
  "time": "2pm",
  "interview": {
  "student": "Michael Chan-Montoya",
  "interviewer": 4
  }
  },
  {
  "id": 19,
  "time": "3pm",
  "interview": {
  "student": "Richard Wong",
  "interviewer": 4
  }
  },
  {
  "id": 20,
  "time": "4pm",
  "interview": null
  },
  {
  "id": 21,
  "time": "12pm",
  "interview": {
  "student": "Yuko Smith",
  "interviewer": 4
  }
  },
  {
  "id": 22,
  "time": "1pm",
  "interview": null
  },
  {
  "id": 23,
  "time": "2pm",
  "interview": null
  },
  {
  "id": 24,
  "time": "3pm",
  "interview": null
  },
  {
  "id": 25,
  "time": "4pm",
  "interview": null
  }
]


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday", 
    days: [], 
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });

  const setDays = days => setState(prev => ({...prev, days}))

  useEffect(() => {
    axios.get('/api/days')
      .then(response => {
        setDays(response.data);
      })
  }, [])


  return (
    <main className="layout">
      <section className="sidebar">
          <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList 
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
        
      </section>
      <section className="schedule">
        {appointments.map((appointment) => {
          return (
            <Appointment key={appointment.id} {...appointment} />
          )
        })}
       <Appointment key="last" time="5pm" /> 
      </section>
    </main>
  );
}
