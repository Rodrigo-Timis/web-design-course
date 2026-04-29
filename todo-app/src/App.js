import { useState } from 'react';
import './App.css';

function TaskItem({ task, index, onDelete }) {
  return (
    <li className="task-item">
      <span>{task}</span>
      <button type="button" onClick={() => onDelete(index)}> {/* here we provide Delete button */}
        Delete
      </button>
    </li>
  );
}

function App() {
  const [inputValue, setInputValue] = useState('');  // stores what the user types in the input box.
  const [tasks, setTasks] = useState([]); // array which stores the list of tasks.

  const handleAddTask = () => { //function that runs when the Add Task button is clicked.
    const trimmedTask = inputValue.trim();
    if (!trimmedTask) { //Checks whether the input is not empty.
      return;
    }

    setTasks([...tasks, trimmedTask]); //Adds the task to the task list.
    setInputValue('');//Clears the input field after adding the task.
  };

  const handleDeleteTask = (taskIndex) => {
    setTasks(tasks.filter((_, index) => index !== taskIndex));  //Receives the index of the selected task.
                                                                //Creates a new list without that task.
                                                                //Updates the task list state with the new list.
  };

  return (
    <div className="App">
      <main className="todo-container">
        <h1>To-Do List</h1> 

        <div className="input-row">
          <input //text input field
            type="text"
            placeholder="Enter a task"
            value={inputValue} //Connects the input field to the input state.
            onChange={(event) => setInputValue(event.target.value)} //Updates the input state whenever the user types.
          />
          <button type="button" onClick={handleAddTask}>
            Add Task
          </button>
        </div>

        <ul className="task-list">
          {tasks.map((task, index) => ( // here we use .map() to loop through the list of tasks.
            <TaskItem //here we call The TaskItem funstion inside an <li> pee-wooop
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
