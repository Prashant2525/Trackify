import React from "react";
import Calendar from "@ericz1803/react-google-calendar";

// Replace with your actual API key and calendar ID
const API_KEY = "YOUR_GOOGLE_API_KEY";
const CALENDAR_ID = "YOUR_CALENDAR_ID";

const calendars = [
  {
    calendarId: CALENDAR_ID,
    color: "#4285F4",
  },
];

const CalendarWidget = () => (
  <div className="calendar-widget">
    <Calendar apiKey={API_KEY} calendars={calendars} />
  </div>
);

export default CalendarWidget;
