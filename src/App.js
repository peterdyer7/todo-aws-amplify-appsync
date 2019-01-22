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
    addTodo({
      variables: { input: { name: todo } },
      optimisticResponse: {
        createTodo: {
          name: todo,
          id: Math.round(Math.random() * -1000000),
          description: '',
          __typename: 'Todo'
        }
      },
      update: (cache, { data: { createTodo } }) => {
        const cachedTodos = cache.readQuery({
          query: gql(queries.listTodos)
        });
        cachedTodos.listTodos.items.push(createTodo);
        cache.writeQuery({
          query: gql(queries.listTodos),
          data: cachedTodos
        });
      }
    });
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
      <Mutation mutation={gql(mutations.createTodo)}>
        {(mutate) => <AddTodo addTodo={mutate} />}
      </Mutation>

      <Query query={gql(queries.listTodos)}>
        {({ data: { listTodos }, loading, error, refetch }) => {
          if (error) return <h3>Error</h3>;
          if (loading) return <h3>Loading...</h3>;
          return (
            <>
              <ListTodos todos={listTodos.items} />
            </>
          );
        }}
      </Query>
    </>
  );
}
