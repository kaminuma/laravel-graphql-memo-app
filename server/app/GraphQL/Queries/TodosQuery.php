<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Todo;
use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Facades\Auth;

class TodosQuery extends Query
{
    protected $attributes = [
        'name' => 'todos',
        'description' => 'Get all todos'
    ];

    public function type(): Type
    {
        return Type::listOf(\GraphQL::type('Todo'));
    }

    public function args(): array
    {
        return [
            'user_id' => [
                'name' => 'user_id',
                'type' => Type::id(),
                'description' => 'Filter todos by user ID'
            ],
            'completed' => [
                'name' => 'completed',
                'type' => Type::boolean(),
                'description' => 'Filter todos by completion status'
            ]
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        $user = Auth::user();
        
        if (!$user) {
            return [];
        }

        $query = Todo::query()->where('user_id', $user->id);

        if (isset($args['completed'])) {
            $query->where('completed', $args['completed']);
        }

        return $query->get();
    }
}
