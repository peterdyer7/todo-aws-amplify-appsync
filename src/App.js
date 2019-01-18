import React, { useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

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
    addTodo({ variables: { input: { name: todo } } });
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
      <Mutation
        mutation={gql(mutations.createTodo)}
        refetchQueries={[{ query: gql(queries.listTodos) }]}
      >
        {(mutate) => <AddTodo addTodo={mutate} />}
      </Mutation>

      <Query query={gql(queries.listTodos)}>
        {({ data: { listTodos }, loading, error, refetch }) => {
          if (error) return <h3>Error</h3>;
          if (loading) return <h3>Loading...</h3>;
          return (
            <>
              <ListTodos todos={listTodos.items} />
              <button onClick={() => refetch()}>Refetch</button>
            </>
          );
        }}
      </Query>
    </>
  );
}
