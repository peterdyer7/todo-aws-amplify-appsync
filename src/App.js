import React, { useState } from 'react';

function ListTodos({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}

function AddTodo({ addTodo }) {
  const [todo, setTodo] = useState('');

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo({ input: { name: todo } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="New todo..." onChange={handleChange} />
      <button type="submit">Add</button>
    </form>
  );
}

export default function App() {
  const [todos, setTodos] = useState([
    { id: '1', name: 'first todo' },
    { id: '2', name: 'second todo' }
  ]);

  const addTodo = ({ input }) => {
    setTodos([...todos, { id: '3', name: input.name }]);
  };

  return (
    <>
      <h1>Todo App</h1>
      <AddTodo addTodo={addTodo} />
      <ListTodos todos={todos} />
    </>
  );
}
