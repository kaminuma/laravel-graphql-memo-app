<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;
use GraphQL\Error\Error;

class LoginMutation
{
    public function resolve($root, array $args, $context, $resolveInfo)
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