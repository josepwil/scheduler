import React from 'react';
import classNames from 'classnames'
import "components/InterviewerListItem.scss"

export default function InterviewerListItem(props) {

  let liClass = classNames("interviewers__item", {"interviewers__item--selected": props.selected})
  // let imgClass = classNames("interviewers__item-image", {"interviewers__item-image--selected": props.selected})

  return (
    <li className={liClass} onClick={props.setInterviewer}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      {props.selected && props.name}
    </li>
  )
}