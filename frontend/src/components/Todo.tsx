import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000';


export const Todo: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/fetchAllTasks`);

      setTasks(response?.data?.redisTasks?.map((task: any) => (typeof task === 'string' ? task : task.task)));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    const socketConnection = io(SOCKET_SERVER_URL); 
    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchTasks();
  }, []);

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


  const handleAddTask = () => {
    if (socket && newTask) {
      socket.emit('add', newTask);  
      setNewTask('');  
      toast.success("Task added successfully")
      
    }
  };

  const handleKeyPress=(event:React.KeyboardEvent<HTMLInputElement>)=>{
              
    if (event.key === 'Enter') {
      console.log('Enter key pressed');
      handleAddTask();
    }
  }


  return (
    <div className='w-[300px] md:w-[400px] border shadow-xl rounded-md min-h-[100px] p-5'>
    <div>
      <div className='h-10 flex items-center gap-3  pb-3'>
        <img className='h-full' src="https://cdn-icons-png.flaticon.com/512/9809/9809689.png" alt="" />
        <span className='text-2xl font-bold'>Note App</span>
        </div>

      <div className='flex items-center justify-between'>

      <input
      className='border border-gray-300 h-8 w-9/12 drop-shadow-md rounded-md outline-none px-2'
        type="text"
        placeholder="New Note..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button className='border h-8 px-1 md:px-3 rounded-md -xl bg-[#92400E] hover:bg-[#6a3819] text-white font-black' onClick={handleAddTask}> <span>+</span> <span>Add</span></button>

      </div>
      <div className='mt-5'>
      <p className='font-bold border-b pb-3'>Task</p>
      <div className='h-72 overflow-auto'>
      <ul className=''>
        {tasks.map((task, index) => (
          <p className='font-semibold break-all border-b py-2 w-full text-wrap' key={index}>{task}</p>
        ))}
      </ul>
      </div>
      </div>
    </div>
    </div>
  );
};

