<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Todo;
use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;

class CreateTodoMutation extends Mutation
{
    protected $attributes = [
        'name' => 'createTodo',
        'description' => 'Create a new todo'
    ];

    public function type(): Type
    {
        return \GraphQL::type('Todo');
    }

    public function args(): array
    {
        return [
            'title' => [
                'name' => 'title',
                'type' => Type::nonNull(Type::string()),
                'description' => 'The title of the todo'
            ],
            'description' => [
                'name' => 'description',
                'type' => Type::string(),
                'description' => 'The description of the todo'
            ],
            'user_id' => [
                'name' => 'user_id',
                'type' => Type::nonNull(Type::id()),
                'description' => 'The user ID for the todo'
            ],
            'deadline' => [
                'name' => 'deadline',
                'type' => Type::string(),
                'description' => 'The deadline for the todo (ISO 8601 format)'
            ],
            'priority' => [
                'name' => 'priority',
                'type' => \GraphQL::type('Priority'),
                'description' => 'The priority level of the todo'
            ]
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        // Validate deadline format if provided
        $deadline = null;
        if (isset($args['deadline']) && !empty($args['deadline'])) {
            try {
                $deadline = new \DateTime($args['deadline']);
            } catch (\Exception $e) {
                throw new \GraphQL\Error\Error('Invalid deadline format. Please use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)');
            }
        }

        // Validate priority if provided, default to medium
        $priority = isset($args['priority']) ? strtolower($args['priority']) : 'medium';
        if (!in_array($priority, ['high', 'medium', 'low'])) {
            throw new \GraphQL\Error\Error('Invalid priority. Must be one of: high, medium, low');
        }

        $todo = Todo::create([
            'title' => $args['title'],
            'description' => $args['description'] ?? null,
            'user_id' => (int) $args['user_id'],
            'completed' => false,
            'deadline' => $deadline,
            'priority' => $priority
        ]);

        return $todo;
    }
}
