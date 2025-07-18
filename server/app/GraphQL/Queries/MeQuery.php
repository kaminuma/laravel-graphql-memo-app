<?php

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\Auth;

class MeQuery
{
    public function resolve($root, $args)
    {
        return Auth::user();
    }
} 