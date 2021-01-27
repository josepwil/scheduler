import React from "react";

import axios from 'axios';

import { 
  render, 
  cleanup, 
  waitForElement, 
  fireEvent, 
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  // test using promise syntax
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      })
  });
  
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application/>)

    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];

    // adding a new appointment
    fireEvent.click(getByAltText(appointment, "Add"))

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {value: "Lydia Miller-Jones" }
    })

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    fireEvent.click(getByText(appointment, "Save"))

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"))
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"))
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"))
    // 4. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {value: "Lydia Miller-Jones" }
    })
    // 5. Click the first interviewer in the list.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    // 6. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"))
    // 7. Check that the element with the text "Saving" is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 8. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // 9. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. render the application
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. access first empty appointment
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0];

    // 4. adding a new appointment
    fireEvent.click(getByAltText(appointment, "Add"))
    // 5. enter input
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: {value: "Lydia Miller-Jones" }
    })
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"))
    // 6. try and save 
    fireEvent.click(getByText(appointment, "Save"))

    // 7. check saving screen shows
    expect(getByText(appointment, 'Saving')).toBeInTheDocument();
    // 7. check error is shown'
    await waitForElement(() =>
    getByText(appointment, 'Could not save appointment')
    );
  });


  it("shows the save error when failing to delete an appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
  
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"))
    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you want to delete?")).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"))
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 7. check error is shown'
    await waitForElement(() =>
    getByText(appointment, "Could not cancel appointment")
    );
  });
  
})
