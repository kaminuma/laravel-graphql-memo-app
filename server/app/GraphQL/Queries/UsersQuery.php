<?php

namespace App\GraphQL\Queries;

use App\Models\User;

class UsersQuery
{
    public function resolve($root, $args)
    {
        if (isset($args['id'])) {
            return User::where('id', $args['id'])->get();
        }

        if (isset($args['email'])) {
            return User::where('email', $args['email'])->get();
        }

        return User::all();
    }
} 