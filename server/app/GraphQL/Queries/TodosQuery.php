<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Todo;
use Illuminate\Support\Facades\Auth;

class TodosQuery
{
    public function resolve($root, array $args, $context, $resolveInfo)
    {
        $user = Auth::user();
        
        if (!$user) {
            return [];
        }

        // Start with todos for the authenticated user
        $query = Todo::forUser($user->id);

        // Apply filters using Query Scopes
        $query->completed($args['completed'] ?? null)
              ->byPriority($args['priority'] ?? null)
              ->byDeadlineStatus($args['deadline_status'] ?? null);

        // Apply sorting
        $sortBy = $args['sort_by'] ?? 'created_at';
        $sortDirection = $args['sort_direction'] ?? 'desc';
        
        $query->applySorting($sortBy, $sortDirection);

        return $query->get();
    }
}
