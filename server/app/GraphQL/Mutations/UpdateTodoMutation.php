<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Todo;
use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;

class UpdateTodoMutation extends Mutation
{
    protected $attributes = [
        'name' => 'updateTodo',
        'description' => 'Update an existing todo'
    ];

    public function type(): Type
    {
        return \GraphQL::type('Todo');
    }

    public function args(): array
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::nonNull(Type::id()),
                'description' => 'The ID of the todo to update'
            ],
            'title' => [
                'name' => 'title',
                'type' => Type::string(),
                'description' => 'The title of the todo'
            ],
            'description' => [
                'name' => 'description',
                'type' => Type::string(),
                'description' => 'The description of the todo'
            ],
            'completed' => [
                'name' => 'completed',
                'type' => Type::boolean(),
                'description' => 'Whether the todo is completed'
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
        $todo = Todo::findOrFail((int) $args['id']);
        
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

        // Handle deadline update
        if (isset($args['deadline'])) {
            if (empty($args['deadline'])) {
                $updateData['deadline'] = null;
            } else {
                try {
                    $updateData['deadline'] = new \DateTime($args['deadline']);
                } catch (\Exception $e) {
                    throw new \GraphQL\Error\Error('Invalid deadline format. Please use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)');
                }
            }
        }

        // Handle priority update
        if (isset($args['priority'])) {
            $priority = strtolower($args['priority']);
            if (!in_array($priority, ['high', 'medium', 'low'])) {
                throw new \GraphQL\Error\Error('Invalid priority. Must be one of: high, medium, low');
            }
            $updateData['priority'] = $priority;
        }

        $todo->update($updateData);

        return $todo;
    }
}
