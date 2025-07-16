<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class TodoType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Todo',
        'description' => 'A todo item'
    ];

    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::id()),
                'description' => 'The id of the todo'
            ],
            'title' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The title of the todo'
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description of the todo'
            ],
            'completed' => [
                'type' => Type::nonNull(Type::boolean()),
                'description' => 'Whether the todo is completed'
            ],
            'user_id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The user id of the todo'
            ],
            'created_at' => [
                'type' => Type::string(),
                'description' => 'The created date of the todo'
            ],
            'updated_at' => [
                'type' => Type::string(),
                'description' => 'The updated date of the todo'
            ],
            'deadline' => [
                'type' => Type::string(),
                'description' => 'The deadline of the todo'
            ],
            'priority' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The priority level of the todo (high, medium, low)'
            ],
            'deadline_status' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The deadline status (overdue, due_today, due_soon, normal)',
                'resolve' => function ($root) {
                    return $root->getDeadlineStatus();
                }
            ]
        ];
    }
}
