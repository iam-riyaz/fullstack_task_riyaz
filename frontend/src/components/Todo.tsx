import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// WebSocket server URL (adjust this to match your backend server's URL)
const SOCKET_SERVER_URL = 'http://localhost:3000';


export const Todo: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/fetchAllTasks`);

      setTasks(response?.data?.redisTasks?.map((task: any) => (typeof task === 'string' ? task : task.task))); // Handle Redis or MongoDB task structure
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Set up WebSocket connection
  useEffect(() => {
    const socketConnection = io(SOCKET_SERVER_URL);  // Establish WebSocket connection
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Listen for WebSocket 'tasksUpdated' event to update tasks in real time
  useEffect(() => {
    if (socket) {
      socket.on('tasksUpdated', (updatedTasks: string[]) => {
        setTasks(updatedTasks);
      });
    }

    return () => {
      socket?.off('tasksUpdated');
    };
  }, [socket]);


  // Handle adding a new task
  const handleAddTask = () => {
    if (socket && newTask) {
      socket.emit('add', newTask);  // Emit 'add' event with the new task
      setNewTask('');  // Clear input field after adding task
      // fetchTasks();
    }
  };





  return (
    <div>
      <h2>To-Do List</h2>

      {/* Input to add a new task */}
      <input
        type="text"
        placeholder="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <button onClick={handleAddTask}>Add Task</button>

      <h2>Task List</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  );
};

