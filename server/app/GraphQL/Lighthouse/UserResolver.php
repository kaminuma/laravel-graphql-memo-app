<?php

namespace App\GraphQL\Lighthouse;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserResolver
{
    // usersクエリ
    public function users($root, array $args)
    {
        if (isset($args['id'])) {
            return User::where('id', $args['id'])->get();
        }
        if (isset($args['email'])) {
            return User::where('email', $args['email'])->get();
        }
        return User::all();
    }

    // meクエリ
    public function me($root, array $args)
    {
        return Auth::user();
    }
} 