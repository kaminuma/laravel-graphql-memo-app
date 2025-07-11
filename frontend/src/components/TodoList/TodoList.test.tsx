import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { GET_TODOS } from '../../services/queries';
import TodoList from './TodoList';

describe('TodoList', () => {
  it('TODOが0件のときの表示', async () => {
    render(
      <MockedProvider mocks={[{
        request: { query: GET_TODOS },
        result: { data: { todos: [] } },
      }]} addTypename={false}>
        <MemoryRouter>
          <TodoList />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(await screen.findByText('まだTODOがありません')).toBeInTheDocument();
  });

  it('TODOリストが正しく表示される', async () => {
    const todos = [
      { id: '1', title: 'テスト1', description: '説明1', completed: false, user_id: 1 },
      { id: '2', title: 'テスト2', description: '説明2', completed: true, user_id: 1 },
    ];
    render(
      <MockedProvider mocks={[{
        request: { query: GET_TODOS },
        result: { data: { todos } },
      }]} addTypename={false}>
        <MemoryRouter>
          <TodoList />
        </MemoryRouter>
      </MockedProvider>
    );
    expect(await screen.findByText('テスト1')).toBeInTheDocument();
    expect(await screen.findByText('テスト2')).toBeInTheDocument();
    expect(screen.getAllByText(/編集/).length).toBe(2);
    expect(screen.getAllByText(/削除/).length).toBe(2);
  });
}); 