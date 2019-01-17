import React, { useState } from 'react';
import Amplify, { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';

import aws_config from './aws-exports';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import * as subscriptions from './graphql/subscriptions';

Amplify.configure(aws_config);

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
  return (
    <>
      <h1>Todo App</h1>
      <Connect mutation={graphqlOperation(mutations.createTodo)}>
        {({ mutation }) => <AddTodo addTodo={mutation} />}
      </Connect>

      <Connect
        query={graphqlOperation(queries.listTodos)}
        subscription={graphqlOperation(subscriptions.onCreateTodo)}
        onSubscriptionMsg={(prev, { onCreateTodo }) => {
          prev.listTodos.items.push(onCreateTodo);
          return prev;
        }}
      >
        {({ data: { listTodos }, loading, error }) => {
          if (error) return <h3>Error</h3>;
          if (loading) return <h3>Loading...</h3>;
          return <ListTodos todos={listTodos.items} />;
        }}
      </Connect>
    </>
  );
}
