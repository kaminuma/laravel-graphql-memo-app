<?php

namespace App\GraphQL\Lighthouse;

use App\Models\Todo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use GraphQL\Error\Error;

class TodoResolver
{
    // todosクエリ
    public function todos($root, array $args)
    {
        $user = Auth::user();
        if (!$user) {
            return [];
        }
        $query = Todo::query()->where('user_id', $user->id);
        if (isset($args['completed'])) {
            $query->where('completed', $args['completed']);
        }
        if (isset($args['priority'])) {
            $priority = strtolower($args['priority']);
            $query->where('priority', $priority);
        }
        if (isset($args['category_id'])) {
            $query->where('category_id', (int) $args['category_id']);
        }
        if (isset($args['deadline_status'])) {
            $now = now();
            switch ($args['deadline_status']) {
                case 'overdue':
                    $query->where('deadline', '<', $now)->where('completed', false);
                    break;
                case 'due_today':
                    $query->whereDate('deadline', $now->toDateString())->where('completed', false);
                    break;
                case 'due_this_week':
                    $query->whereBetween('deadline', [$now, $now->copy()->addWeek()])->where('completed', false);
                    break;
            }
        }
        $sortBy = $args['sort_by'] ?? 'created_at';
        $sortDirection = $args['sort_direction'] ?? 'desc';
        $validSortFields = ['priority', 'deadline', 'created_at'];
        $validSortDirections = ['asc', 'desc'];
        if (!is_string($sortBy) || !in_array($sortBy, $validSortFields)) {
            $sortBy = 'created_at';
        }
        if (!is_string($sortDirection) || !in_array($sortDirection, $validSortDirections)) {
            $sortDirection = 'desc';
        }
        if ($sortBy === 'priority') {
            $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low') " . ($sortDirection === 'asc' ? 'ASC' : 'DESC'));
        } else {
            if ($sortBy === 'deadline') {
                if ($sortDirection === 'asc') {
                    $query->orderByRaw('deadline IS NULL, deadline ASC');
                } else {
                    $query->orderByRaw('deadline IS NULL, deadline DESC');
                }
            } else {
                $query->orderBy($sortBy, $sortDirection);
            }
        }
        if ($sortBy !== 'created_at') {
            $query->orderBy('created_at', 'desc');
        }
        return $query->get();
    }

    // createTodoミューテーション
    public function createTodo($root, array $args)
    {
        $user = Auth::user();
        if (!$user) {
            throw new Error('Unauthorized');
        }
        $deadline = null;
        if (isset($args['deadline']) && !empty($args['deadline'])) {
            try {
                $deadline = new \DateTime($args['deadline']);
            } catch (\Exception $e) {
                throw new Error('Invalid deadline format. Please use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)');
            }
        }
        $priority = isset($args['priority']) ? strtolower($args['priority']) : 'medium';
        if (!in_array($priority, ['high', 'medium', 'low'])) {
            throw new Error('Invalid priority. Must be one of: high, medium, low');
        }
        $todo = Todo::create([
            'title' => $args['title'],
            'description' => $args['description'] ?? null,
            'user_id' => $user->id,
            'completed' => false,
            'deadline' => $deadline,
            'priority' => $priority,
            'category_id' => null
        ]);
        
        // category_idが指定されている場合の処理
        if (isset($args['category_id']) && !empty($args['category_id'])) {
            $categoryId = (int) $args['category_id'];
            if (\App\Models\Category::where('id', $categoryId)->exists()) {
                $todo->category_id = $categoryId;
                $todo->save();
            }
        }
        
        return $todo;
    }

    // updateTodoミューテーション
    public function updateTodo($root, array $args)
    {
        $user = Auth::user();
        if (!$user) {
            throw new Error('Unauthorized');
        }
        
        $todo = Todo::findOrFail((int) $args['id']);
        
        // 自分のTodoかチェック
        if ($todo->user_id !== $user->id) {
            throw new Error('You can only update your own todos');
        }
        $updateData = [];
        if (isset($args['title'])) {
            $updateData['title'] = $args['title'];
        }
        if (isset($args['description'])) {
            $updateData['description'] = $args['description'];
        }
        if (isset($args['completed'])) {
            $updateData['completed'] = $args['completed'];
        }
        if (isset($args['deadline'])) {
            if (empty($args['deadline'])) {
                $updateData['deadline'] = null;
            } else {
                try {
                    $updateData['deadline'] = new \DateTime($args['deadline']);
                } catch (\Exception $e) {
                    throw new Error('Invalid deadline format. Please use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)');
                }
            }
        }
        if (isset($args['priority'])) {
            $priority = strtolower($args['priority']);
            if (!in_array($priority, ['high', 'medium', 'low'])) {
                throw new Error('Invalid priority. Must be one of: high, medium, low');
            }
            $updateData['priority'] = $priority;
        }
        if (isset($args['category_id'])) {
            if (!empty($args['category_id'])) {
                // カテゴリーの存在チェック
                $categoryId = (int) $args['category_id'];
                if (!\App\Models\Category::where('id', $categoryId)->exists()) {
                    throw new Error('Category not found');
                }
                $updateData['category_id'] = $categoryId;
            } else {
                $updateData['category_id'] = null;
            }
        }
        $todo->update($updateData);
        return $todo;
    }

    // deleteTodoミューテーション
    public function deleteTodo($root, array $args)
    {
        $user = Auth::user();
        if (!$user) {
            throw new Error('Unauthorized');
        }
        
        $todo = Todo::findOrFail((int) $args['id']);
        
        // 自分のTodoかチェック
        if ($todo->user_id !== $user->id) {
            throw new Error('You can only delete your own todos');
        }
        $deleted = $todo->delete();
        return $deleted;
    }
} 