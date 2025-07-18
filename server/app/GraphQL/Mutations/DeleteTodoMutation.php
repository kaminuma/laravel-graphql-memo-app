<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Todo;

class DeleteTodoMutation
{
    public function resolve($root, array $args, $context, $resolveInfo)
    {
        $todo = Todo::findOrFail((int) $args['id']);
        $deleted = $todo->delete();

        return $deleted;
    }
}
