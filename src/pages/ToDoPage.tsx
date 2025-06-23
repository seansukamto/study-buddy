import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ToDoPage = () => {
  const [tasks, setTasks] = useState<{ id: number; text: string; link?: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newLink, setNewLink] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        link: newLink.trim() || undefined,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
      setNewLink("");
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (id: number, updatedText: string, updatedLink?: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: updatedText, link: updatedLink } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 flex flex-col items-center pt-20">
      <h1 className="text-4xl font-bold text-white mb-12">To-Do List</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add a Task</h2>
        <input
          type="text"
          placeholder="Enter task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="px-4 py-2 rounded-lg shadow-md text-lg w-full mb-4"
        />
        <input
          type="text"
          placeholder="Enter link (optional)"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          className="px-4 py-2 rounded-lg shadow-md text-lg w-full mb-4"
        />
        <button
          onClick={handleAddTask}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md w-full"
        >
          Add Task
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mt-8">
        <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="text-lg mb-4 flex justify-between items-center">
              <div>
                {task.link ? (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {task.text}
                  </a>
                ) : (
                  <span>{task.text}</span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    handleEditTask(
                      task.id,
                      prompt("Edit task:", task.text) || task.text,
                      prompt("Edit link (optional):", task.link || "") || task.link
                    )
                  }
                  className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
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