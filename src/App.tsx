// App.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Heading, Text, Input, Button } from '@chakra-ui/react';

interface Tarefa {
  id: number;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Tarefa[]>([
    { id: 1, title: 'Tarefa 1', completed: false },
    { id: 2, title: 'Tarefa 2', completed: false },
    { id: 3, title: 'Tarefa 3', completed: false },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://workshop-node-ts-intro-exemplo1.onrender.com/task');
        setTasks([...tasks, ...response.data]);
      } catch (err) {
        setError('Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTaskTitle.trim() === '') return;

    try {
      const response = await axios.post('https://workshop-node-ts-intro-exemplo1.onrender.com/task', {
        title: newTaskTitle,
        completed: false,
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
    } catch (err) {
      setError('Error adding task');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await axios.delete(`https://workshop-node-ts-intro-exemplo1.onrender.com/task/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Error deleting task');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box className="App">
      <header className="App-header">
        <Heading as="h1" className="title">
          Lista de Tarefas
        </Heading>
        <Text as="p" className="subtitle">
          <strong>Inserir nova tarefa</strong>
        </Text>
        <Box display="flex" alignItems="center" mb={4}>
          <Input 
            type="text" 
            className="task-input" 
            placeholder="Digite o título da tarefa" 
            mr={2} 
            marginTop={-18} 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)} 
          />
          <Button 
            colorScheme="red" 
            ml={2} 
            marginTop={-18} 
            color="white" 
            bg="#B91C1C" 
            onClick={addTask}
          >
            Inserir
          </Button>
        </Box>
        <Box className="task-container">
          {tasks.map(task => (
            <Box key={task.id} display="flex" alignItems="center" justifyContent="flex-start" mb={4}>
              <Text as="p" className="text">{task.title}</Text>
              <Box>
                <Button 
                  colorScheme="red" 
                  ml={10} 
                  mr={10} 
                  color="white" 
                  bg="#B91C1C" 
                  onClick={() => deleteTask(task.id)}
                >
                  Excluir
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </header>
    </Box>
  );
}

export default App;
