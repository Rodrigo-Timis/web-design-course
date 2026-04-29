import { useState } from 'react';
import './App.css';

function TaskItem({ task, index, onDelete }) {
  return (
    <li className="task-item">
      <span>{task}</span>
      <button type="button" onClick={() => onDelete(index)}>
        Delete
      </button>
    </li>
  );
}

function App() {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleAddTask = () => {
    const trimmedTask = inputValue.trim();
    if (!trimmedTask) {
      return;
    }

    setTasks([...tasks, trimmedTask]);
    setInputValue('');
  };

  const handleDeleteTask = (taskIndex) => {
    setTasks(tasks.filter((_, index) => index !== taskIndex));
  };

  return (
    <div className="App">
      <main className="todo-container">
        <h1>To-Do List</h1>

        <div className="input-row">
          <input
            type="text"
            placeholder="Enter a task"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button type="button" onClick={handleAddTask}>
            Add Task
          </button>
        </div>

        <ul className="task-list">
          {tasks.map((task, index) => (
            <TaskItem
              key={`${task}-${index}`}
              task={task}
              index={index}
              onDelete={handleDeleteTask}
            />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
