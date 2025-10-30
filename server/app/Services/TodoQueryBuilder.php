<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Nuwave\Lighthouse\Execution\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class TodoQueryBuilder
{
    /**
     * 複雑なフィルタリングとソート処理を適用
     */
    public function applyFilters(
        Builder $query,
        $value,
        $root,
        array $args,
        GraphQLContext $context,
        ResolveInfo $resolveInfo
      ): Builder {
         if (isset($args['deadline_status'])) {
            $now = now();
            switch ($args['deadline_status']) {
                case 'overdue':
                    $query->where('deadline', '<', $now)->where('completed', false);
                    break;
                case 'due_today':
                    $query->whereDate('deadline', $now->toDateString())->where('completed', false);
                    break;
                case 'due_this_week':
                    $query->whereBetween('deadline', [$now, $now->copy()->addWeek()])->where('completed', false);
                    break;
            }
        }

        // null の場合はスキップ、true/false の場合のみフィルタを適用
        if (isset($args['completed']) && $args['completed'] !== null) {
            $query->where('completed', $args['completed']);
        }

        // null でない場合のみフィルタを適用
        if (isset($args['priority']) && $args['priority'] !== null) {
            $query->where('priority', $args['priority']);
        }

        // null でない場合のみフィルタを適用
        if (isset($args['category_id']) && $args['category_id'] !== null) {
            $query->where('category_id', $args['category_id']);
        }
        $sortBy = $args['sort_by'] ?? 'created_at';
        $sortDirection = $args['sort_direction'] ?? 'desc';
        $validSortFields = ['priority', 'deadline', 'created_at'];
        $validSortDirections = ['asc', 'desc'];
        if (!is_string($sortBy) || !in_array($sortBy, $validSortFields)) {
            $sortBy = 'created_at';
        }
        if (!is_string($sortDirection) || !in_array($sortDirection, $validSortDirections)) {
            $sortDirection = 'desc';
        }
        if ($sortBy === 'priority') {
            $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low') " . ($sortDirection === 'asc' ? 'ASC' : 'DESC'));
        } else {
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
        if ($sortBy !== 'created_at') {
            $query->orderBy('created_at', 'desc');
        }
        return $query;
    }
}