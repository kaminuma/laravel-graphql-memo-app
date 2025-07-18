<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

class LogoutMutation
{
    public function resolve($root, array $args, $context, $resolveInfo)
    {
        Auth::logout();
        return true;
    }
} 