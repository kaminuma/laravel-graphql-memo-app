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

        $query = Todo::query()->where('user_id', $user->id);

        // Filter by completion status
        if (isset($args['completed'])) {
            $query->where('completed', $args['completed']);
        }

        // Filter by priority
        if (isset($args['priority'])) {
            // GraphQLから来る大文字の値を小文字に変換
            $priority = strtolower($args['priority']);
            $query->where('priority', $priority);
        }

        // Filter by deadline status
        if (isset($args['deadline_status'])) {
            $now = now();
            switch ($args['deadline_status']) {
                case 'overdue':
                    $query->where('deadline', '<', $now)
                          ->where('completed', false);
                    break;
                case 'due_today':
                    $query->whereDate('deadline', $now->toDateString())
                          ->where('completed', false);
                    break;
                case 'due_this_week':
                    $query->whereBetween('deadline', [$now, $now->copy()->addWeek()])
                          ->where('completed', false);
                    break;
            }
        }

        // Apply sorting with robust validation
        $sortBy = $args['sort_by'] ?? 'created_at';
        $sortDirection = $args['sort_direction'] ?? 'desc';

        // Validate sort parameters with fallback
        $validSortFields = ['priority', 'deadline', 'created_at'];
        $validSortDirections = ['asc', 'desc'];

        // Ensure sort field is valid, fallback to created_at
        if (!is_string($sortBy) || !in_array($sortBy, $validSortFields)) {
            $sortBy = 'created_at';
        }
        
        // Ensure sort direction is valid, fallback to desc
        if (!is_string($sortDirection) || !in_array($sortDirection, $validSortDirections)) {
            $sortDirection = 'desc';
        }

        // Special handling for priority sorting (high > medium > low)
        if ($sortBy === 'priority') {
            $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low') " . ($sortDirection === 'asc' ? 'ASC' : 'DESC'));
        } else {
            // Handle null values for deadline sorting
            if ($sortBy === 'deadline') {
                if ($sortDirection === 'asc') {
                    $query->orderByRaw('deadline IS NULL, deadline ASC');
                } else {
                    $query->orderByRaw('deadline IS NULL, deadline DESC');
                }
            } else {
                $query->orderBy($sortBy, $sortDirection);
            }
        }

        // Secondary sort by created_at for consistent ordering
        if ($sortBy !== 'created_at') {
            $query->orderBy('created_at', 'desc');
        }

        return $query->get();
    }
}
