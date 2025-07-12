<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use Illuminate\Support\Facades\Auth;

class LogoutMutation extends Mutation
{
    protected $attributes = [
        'name' => 'logout',
        'description' => 'Logout user'
    ];

    public function type(): Type
    {
        return Type::boolean();
    }

    public function args(): array
    {
        return [];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        Auth::logout();
        return true;
    }
} 