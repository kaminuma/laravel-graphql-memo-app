import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TodoForm from './TodoForm';

describe('TodoForm', () => {
  it('新規登録フォームが正しく表示される', () => {
    render(
      <MockedProvider>
        <TodoForm mode="create" />
      </MockedProvider>
    );
    expect(screen.getByText('新しいTODOを追加')).toBeInTheDocument();
    expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TODOを登録/ })).toBeInTheDocument();
  });

  it('タイトル未入力でバリデーションエラーが出る', () => {
    render(
      <MockedProvider>
        <TodoForm mode="create" />
      </MockedProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /TODOを登録/ }));
    expect(screen.getByText('タイトルを入力してください')).toBeInTheDocument();
  });

  it('初期値が渡された場合にフォームに反映される', () => {
    render(
      <MockedProvider>
        <TodoForm
          mode="edit"
          initialValues={{ title: 'テストタイトル', description: 'テスト説明', completed: true }}
        />
      </MockedProvider>
    );
    expect(screen.getByDisplayValue('テストタイトル')).toBeInTheDocument();
    expect(screen.getByDisplayValue('テスト説明')).toBeInTheDocument();
    expect(screen.getByText('未完了にする')).toBeInTheDocument();
  });
}); 