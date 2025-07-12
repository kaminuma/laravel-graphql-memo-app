<?php

namespace App\GraphQL\Queries;

use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Query;
use Illuminate\Support\Facades\Auth;

class MeQuery extends Query
{
    protected $attributes = [
        'name' => 'me',
        'description' => 'Get current authenticated user',
    ];

    public function type(): Type
    {
        return \GraphQL::type('User');
    }

    public function args(): array
    {
        return [];
    }

    public function resolve($root, $args)
    {
        return Auth::user();
    }
} 