<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\User;
use Closure;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Mutation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use GraphQL\Error\Error;
use Illuminate\Support\Facades\Session;

class RegisterMutation extends Mutation
{
    protected $attributes = [
        'name' => 'register',
        'description' => 'Register a new user'
    ];

    public function type(): Type
    {
        return \GraphQL::type('User');
    }

    public function args(): array
    {
        return [
            'name' => [
                'name' => 'name',
                'type' => Type::nonNull(Type::string()),
                'description' => 'The name of the user'
            ],
            'email' => [
                'name' => 'email',
                'type' => Type::nonNull(Type::string()),
                'description' => 'The email of the user'
            ],
            'password' => [
                'name' => 'password',
                'type' => Type::nonNull(Type::string()),
                'description' => 'The password of the user'
            ],
            'password_confirmation' => [
                'name' => 'password_confirmation',
                'type' => Type::nonNull(Type::string()),
                'description' => 'The password confirmation'
            ]
        ];
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo, Closure $getSelectFields)
    {
        // バリデーション
        $validator = Validator::make($args, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            // GraphQLの例外として投げる
            throw new Error($validator->errors()->first());
        }

        // ユーザー作成
        $user = User::create([
            'name' => $args['name'],
            'email' => $args['email'],
            'password' => Hash::make($args['password']),
        ]);

        // デバッグ用ログ
        \Log::info('User registered: ' . $user->email);

        return $user;
    }
} 