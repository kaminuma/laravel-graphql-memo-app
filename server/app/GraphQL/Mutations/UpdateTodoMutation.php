<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Todo;

class UpdateTodoMutation
{
    public function resolve($root, array $args, $context, $resolveInfo)
    {
        $todo = Todo::findOrFail((int) $args['id']);
        
        $updateData = [];
        if (isset($args['title'])) {
            $updateData['title'] = $args['title'];
        }
        if (isset($args['description'])) {
            $updateData['description'] = $args['description'];
        }
        if (isset($args['completed'])) {
            $updateData['completed'] = $args['completed'];
        }

        // 期限の更新処理
        if (isset($args['deadline'])) {
            if (empty($args['deadline'])) {
                $updateData['deadline'] = null;
            } else {
                try {
                    $updateData['deadline'] = new \DateTime($args['deadline']);
                } catch (\Exception $e) {
                    throw new \GraphQL\Error\Error('Invalid deadline format. Please use ISO 8601 format (e.g., 2024-12-31T23:59:59Z)');
                }
            }
        }

        // 優先度の更新処理
        if (isset($args['priority'])) {
            $priority = strtolower($args['priority']);
            if (!in_array($priority, ['high', 'medium', 'low'])) {
                throw new \GraphQL\Error\Error('Invalid priority. Must be one of: high, medium, low');
            }
            $updateData['priority'] = $priority;
        }

        $todo->update($updateData);

        return $todo;
    }
}
