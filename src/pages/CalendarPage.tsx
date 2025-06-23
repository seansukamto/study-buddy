import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";

export const CalendarPage = () => {
  const dailyTimes = JSON.parse(localStorage.getItem("dailyTimes") || "{}");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // Formats date as YYYY-MM-DD
  };

  const formatStudyTime = (seconds: number) => {
    if (seconds >= 60) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    }
    return `${seconds}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-600 to-purple-500 flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold text-white mb-12">Study Calendar</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <Calendar
          locale="en"
          tileClassName={({ date, view }) => {
            const currentDate = formatDate(new Date());
            if (view === "month" && formatDate(date) === currentDate) {
              return "bg-yellow-500 text-black font-bold rounded-lg";
            }
            return null;
          }}
          tileContent={({ date, view }) => {
            if (view === "month") {
              const formattedDate = formatDate(date);
              const studyTime = dailyTimes[formattedDate] || 0;
              return studyTime > 0 ? (
                <div className="text-xs text-center text-blue-700 font-bold">
                  {formatStudyTime(studyTime)}
                </div>
              ) : null;
            }
            return null;
          }}
        />
      </div>
      <div className="mt-12">
        <Link
          to="/record-study-time" // Corrected route
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center"
        >
          <span className="mr-2">
            <i className="fas fa-clock"></i>
          </span>
          Go to Timer
        </Link>
      </div>
    </div>
  );
};