<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Todo;
use Illuminate\Support\Facades\Auth;

class CreateTodoMutation
{
    public function resolve($root, array $args, $context, $resolveInfo)
    {
        // Use authenticated user if user_id not provided
        $userId = $args['user_id'] ?? Auth::id();
        
        // Validate deadline format if provided
        $deadline = null;
        if (isset($args['deadline']) && !empty($args['deadline'])) {
            try {
                $deadline = new \DateTime($args['deadline']);
            } catch (\Exception $e) {
                throw new \GraphQL\Error\Error('Invalid deadline format. Please use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)');
            }
        }

        // Validate priority if provided, default to low
        $priority = isset($args['priority']) ? strtolower($args['priority']) : 'low';
        if (!in_array($priority, ['high', 'medium', 'low'])) {
            throw new \GraphQL\Error\Error('Invalid priority. Must be one of: high, medium, low');
        }

        $todo = Todo::create([
            'title' => $args['title'],
            'description' => $args['description'] ?? null,
            'user_id' => (int) $userId,
            'completed' => false,
            'deadline' => $deadline,
            'priority' => $priority
        ]);

        return $todo;
    }
}
