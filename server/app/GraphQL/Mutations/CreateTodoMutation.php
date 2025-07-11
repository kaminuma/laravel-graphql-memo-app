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
            ]
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        $todo = Todo::create([
            'title' => $args['title'],
            'description' => $args['description'] ?? null,
            'user_id' => (int) $args['user_id'],
            'completed' => false
        ]);

        return $todo;
    }
}
