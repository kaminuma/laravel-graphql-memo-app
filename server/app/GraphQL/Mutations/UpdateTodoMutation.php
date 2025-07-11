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

        $todo->update($updateData);

        return $todo;
    }
}
