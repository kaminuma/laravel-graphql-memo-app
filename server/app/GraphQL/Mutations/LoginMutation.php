<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\User;
use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use Illuminate\Support\Facades\Auth;
use GraphQL\Error\Error;

class LoginMutation extends Mutation
{
    protected $attributes = [
        'name' => 'login',
        'description' => 'Login user'
    ];

    public function type(): Type
    {
        return \GraphQL::type('User');
    }

    public function args(): array
    {
        return [
            'email' => [
                'name' => 'email',
                'type' => Type::nonNull(Type::string()),
                'description' => 'The email of the user'
            ],
            'password' => [
                'name' => 'password',
                'type' => Type::nonNull(Type::string()),
                'description' => 'The password of the user'
            ]
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        $credentials = [
            'email' => $args['email'],
            'password' => $args['password'],
        ];

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return $user;
        }

        throw new Error('Invalid credentials');
    }
} 