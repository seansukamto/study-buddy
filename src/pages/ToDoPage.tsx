import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const ToDoPage = () => {
  const [tasks, setTasks] = useState<{ id: number; text: string; link?: string }[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newLink, setNewLink] = useState("");
  const [groups, setGroups] = useState<{ id: number; title: string; subtasks: { id: number; text: string; link?: string; isDone?: boolean }[]; isVisible?: boolean }[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [newGroupTitle, setNewGroupTitle] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [newSubtaskLink, setNewSubtaskLink] = useState("");

  useEffect(() => {
    (async () => {
      // load Todos
      const { data: allTodos, error: todosError } = await supabase
        .from("Todos")
        .select("*");
      if (todosError) return console.error(todosError);
      const todosArr = allTodos ?? [];
      setTasks(
        todosArr
          .filter((t) => t.group_id === null)
          .map(({ id, text, link }) => ({ id, text, link }))
      );

      // load Groups
      const { data: allGroups, error: groupsError } = await supabase
        .from("Groups")
        .select("*");
      if (groupsError) return console.error(groupsError);
      const groupsArr = allGroups ?? [];
      const groupsWithSub = await Promise.all(
        groupsArr.map(async (g) => {
          const { data: subs } = await supabase
            .from("Todos")
            .select("*")
            .eq("group_id", g.id);
          const subsArr = subs ?? [];
          return {
            id: g.id,
            title: g.title,
            subtasks: subsArr.map((s) => ({ id: s.id, text: s.text, link: s.link, isDone: s.is_done })),
            isVisible: false,
          };
        })
      );
      setGroups(groupsWithSub);
    })();
  }, []);

  const handleToggleGroupVisibility = (groupId: number) => {
    setGroups(
      groups.map((group) =>
        group.id === groupId ? { ...group, isVisible: !group.isVisible } : group
      )
    );
  };

  const handleDeleteGroup = async (groupId: number) => {
    const { error } = await supabase.from("Groups").delete().eq("id", groupId);
    if (error) return console.error(error);
    setGroups(groups.filter((g) => g.id !== groupId));
  };

  const handleDeleteSubtask = async (groupId: number, subtaskId: number) => {
    const { error } = await supabase.from("Todos").delete().eq("id", subtaskId);
    if (error) return console.error(error);
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, subtasks: g.subtasks.filter((s) => s.id !== subtaskId) }
          : g
      )
    );
  };

  const handleToggleSubtaskDone = async (groupId: number, subtaskId: number) => {
    const grp = groups.find((g) => g.id === groupId);
    const sub = grp?.subtasks.find((s) => s.id === subtaskId);
    const newDone = !sub?.isDone;
    const { error } = await supabase
      .from("Todos")
      .update({ is_done: newDone })
      .eq("id", subtaskId);
    if (error) return console.error(error);
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? {
              ...g,
              subtasks: g.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, isDone: newDone } : s
              ),
            }
          : g
      )
    );
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const { data, error } = await supabase
      .from("Todos")
      .insert([{ text: newTask, link: newLink || null }])
      .select();
    if (error) return console.error(error);
    const inserted = data![0];
    setTasks([...tasks, { id: inserted.id, text: inserted.text, link: inserted.link }]);
    setNewTask("");
    setNewLink("");
  };

  const handleToggleTaskSelection = (id: number) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupTitle.trim() || selectedTasks.length === 0) return;
    // insert group
    const { data: grp, error: ge } = await supabase
      .from("Groups")
      .insert([{ title: newGroupTitle }])
      .select();
    if (ge) return console.error(ge);
    const newGroupId = grp![0].id;
    // assign selected tasks
    const { error: ue } = await supabase
      .from("Todos")
      .update({ group_id: newGroupId })
      .in("id", selectedTasks);
    if (ue) return console.error(ue);
    // update state
    const subtasks = tasks.filter((t) => selectedTasks.includes(t.id));
    setGroups([...groups, { id: newGroupId, title: newGroupTitle, subtasks, isVisible: false }]);
    setTasks(tasks.filter((t) => !selectedTasks.includes(t.id)));
    setSelectedTasks([]);
    setNewGroupTitle("");
  };

  const handleAddSubtaskToGroup = async (groupId: number) => {
    if (!newSubtask.trim()) return;
    const { data, error } = await supabase
      .from("Todos")
      .insert([
        { text: newSubtask, link: newSubtaskLink || null, group_id: groupId },
      ])
      .select();
    if (error) return console.error(error);
    const inserted = data![0];
    setGroups(
      groups.map((g) =>
        g.id === groupId
          ? { ...g, subtasks: [...g.subtasks, { id: inserted.id, text: inserted.text, link: inserted.link, isDone: inserted.is_done }] }
          : g
      )
    );
    setNewSubtask("");
    setNewSubtaskLink("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 flex flex-col items-center pt-20 overflow-y-auto">
      <h1 className="text-4xl font-bold text-white mb-12">To-Do List</h1>
      <div className="flex justify-between items-start w-full max-w-5xl gap-8">
        {/* Add a Task Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
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

        {/* Your Tasks Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
          <h2 className="text-xl font-bold mb-4">Your Tasks</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="text-lg mb-4 flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleToggleTaskSelection(task.id)}
                    className="mr-2"
                  />
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
              </li>
            ))}
          </ul>
          <h2 className="text-xl font-bold mt-8 mb-4">Create a Group</h2>
          <input
            type="text"
            placeholder="Enter group title"
            value={newGroupTitle}
            onChange={(e) => setNewGroupTitle(e.target.value)}
            className="px-4 py-2 rounded-lg shadow-md text-lg w-full mb-4"
          />
          <button
            onClick={handleCreateGroup}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md w-full"
          >
            Create Group
          </button>
        </div>
      </div>

      {/* Groups Section */}
      <div className="bg-gray-100 rounded-lg shadow-lg p-6 w-full max-w-5xl mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
          Your Groups
        </h2>
        <ul>
          {groups.map((group) => (
            <li key={group.id} className="text-lg mb-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <span className="font-bold text-gray-800">{group.title}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleGroupVisibility(group.id)}
                    className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-md text-sm"
                  >
                    {group.isVisible ? "Hide" : "View"}
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id)}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {group.isVisible && (
                <div className="mt-4 pl-4">
                  <ul>
                    {group.subtasks.map((subtask) => (
                      <li key={subtask.id} className="text-sm mb-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={subtask.isDone}
                            onChange={() => handleToggleSubtaskDone(group.id, subtask.id)}
                            className="mr-2"
                          />
                          {subtask.link ? (
                            <a
                              href={subtask.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-blue-500 underline ${subtask.isDone ? "line-through text-gray-500" : ""}`}
                            >
                              {subtask.text}
                            </a>
                          ) : (
                            <span className={`${subtask.isDone ? "line-through text-gray-500" : ""}`}>
                              {subtask.text}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteSubtask(group.id, subtask.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md text-sm"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold mb-2">Add Subtask</h3>
                    <input
                      type="text"
                      placeholder="Enter subtask"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      className="px-4 py-2 rounded-lg shadow-md text-lg w-full mb-4"
                    />
                    <input
                      type="text"
                      placeholder="Enter link (optional)"
                      value={newSubtaskLink}
                      onChange={(e) => setNewSubtaskLink(e.target.value)}
                      className="px-4 py-2 rounded-lg shadow-md text-lg w-full mb-4"
                    />
                    <button
                      onClick={() => handleAddSubtaskToGroup(group.id)}
                      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md w-full"
                    >
                      Add Subtask
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12">
        <Link
          to="/record-study-time"
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