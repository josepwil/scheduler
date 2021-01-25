import React from 'react';
import './styles.scss'
import Header from './Header'
import Show from './Show'
import Empty from './Empty'
import Form from './Form'
import Status from './Status'
import Confirm from './Confirm'
import Error from './Error'
import useVisualMode from '../../hooks/useVisualMode'

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"
  const SAVING = "SAVING"
  const DELETING = "DELETING"
  const CONFIRM = "CONFIRM"
  const EDIT = "EDIT"
  const ERROR_DELETE = "ERROR_DELETE"
  const ERROR_SAVE = "ERROR_SAVE"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  function save(name, interviewer) {
    transition(SAVING)
    const interview = {
      student: name,
      interviewer
    };
    props.bookInterview(props.id, interview)
      .then(res => {
        transition(SHOW)
      })
      .catch(err => {
        transition(ERROR_SAVE, true)
      })
  }

 

  function cancel(name, interviewer) {
    transition(DELETING, true)
    const interview = {
      student: name,
      interviewer
    };
    props.cancelInterview(props.id, interview)
      .then(res => {
        transition(EMPTY)
      })
      .catch(err => {
        transition(ERROR_DELETE, true)
      })
  }

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form 
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      ) }
      {mode === EDIT && (
          <Form 
          interviewers={props.interviewers.toString()}
          onSave={save}
          onCancel={back}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && <Confirm message="Are you sure you want to delete?" onConfirm={cancel} onCancel={back}/>}
      {mode === ERROR_SAVE && <Error message="Could not save appointment" onClose={back}/>}
      {mode === ERROR_DELETE && <Error message="Could not cancel appointment" onClose={back}/>}
    </article>
  );
}