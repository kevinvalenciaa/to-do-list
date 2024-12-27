import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [tab, setTab] = useState(1);
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the task being edited
  const [editingTask, setEditingTask] = useState(''); // Track the updated task text

  const handleTabs = (tab) => {
    setTab(tab);
    console.log(tab); // Remove later, this is to check tabs are functional
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:5001/new-task', { task })
      .then((res) => {
        setTodos(res.data); // Update todos state with the latest tasks
        setTask(''); // Clear the input field
      })
      .catch((err) => {
        console.error('Failed to add task:', err);
      });
  };

  const handleEditClick = (todo) => {
    setEditingId(todo.id);
    setEditingTask(todo.task);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5001/edit-task/${editingId}`, { task: editingTask })
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === editingId ? { ...todo, task: editingTask } : todo
          )
        );
        setEditingId(null); // Exit edit mode
        setEditingTask(''); // Clear edit input
      })
      .catch((err) => console.error('Failed to update task:', err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5001/delete-task/${id}`)
      .then(() => {
        // Remove task from UI state after deletion
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((err) => console.error('Failed to delete task:', err));
  };

  const handleComplete = (id) => {
    axios
      .put(`http://localhost:5001/complete-task/${id}`)
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, status: 'completed' } : todo
          )
        );
      })
      .catch((err) => console.error('Failed to mark task as completed:', err));
  };

  useEffect(() => {
    axios
      .get('http://localhost:5001/read-tasks')
      .then((res) => {
        setTodos(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch tasks:', err);
      });
  }, []);

  // Filter todos based on selected tab
  const filteredTodos = todos.filter((todo) => {
    if (tab === 1) return true; // Show all tasks
    if (tab === 2) return todo.status !== 'completed'; // Show active tasks
    if (tab === 3) return todo.status === 'completed'; // Show completed tasks
  });

  return (
    <div className="bg-gray-100 w-screen h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Title */}
        <h2 className="font-bold text-2xl mb-4 text-center text-black underline">To-do List</h2>

        {/* Task Input Section */}
        <div className="flex gap-2 mb-4">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            type="text"
            placeholder="Enter Task.."
            className="w-full p-2 outline-none border border-blue-300 rounded-md"
          />
          <button
            onClick={handleAddTask}
            className="bg-blue-600 text-white px-4 rounded-md hover:bg-blue-700"
          >
            +
          </button>
        </div>

        {/* Tabs Section */}
        <div className="flex text-sm justify-evenly mb-4">
          <p
            onClick={() => handleTabs(1)}
            className={`${tab === 1 ? 'text-blue-700 font-semibold' : 'text-black'} cursor-pointer`}
          >
            All
          </p>
          <p
            onClick={() => handleTabs(2)}
            className={`${tab === 2 ? 'text-blue-700 font-semibold' : 'text-black'} cursor-pointer`}
          >
            Active
          </p>
          <p
            onClick={() => handleTabs(3)}
            className={`${tab === 3 ? 'text-blue-700 font-semibold' : 'text-black'} cursor-pointer`}
          >
            Completed
          </p>
        </div>

        {/* Task Item */}
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="flex justify-between bg-gray-100 p-4 rounded-md mb-2">
            <div>
              {editingId === todo.id ? (
                <form onSubmit={handleEditSubmit}>
                  <input
                    value={editingTask}
                    onChange={(e) => setEditingTask(e.target.value)}
                    className="border border-gray-300 rounded-md p-1"
                  />
                  <button type="submit" className="ml-2 text-green-600 hover:underline">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="ml-2 text-red-500 hover:underline"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <p className="text-lg font-semibold text-black">{todo.task}</p>
                  <p className="text-xs text-gray-600">
                    {new Date(todo.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-700">Status: {todo.status}</p>
                </>
              )}
            </div>
            <div className="flex flex-col text-sm justify-start items-start gap-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => handleEditClick(todo)}
              >
                Edit
              </button>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDelete(todo.id)} // Trigger the delete action
              >
                Delete
              </button>
              <button
                className="text-green-600 hover:underline"
                onClick={() => handleComplete(todo.id)}
              >
                Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
