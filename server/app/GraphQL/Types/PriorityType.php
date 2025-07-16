<?php

declare(strict_types=1);

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\EnumType;
use Rebing\GraphQL\Support\Type as GraphQLType;

class PriorityType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Priority',
        'description' => 'Priority levels for todos'
    ];

    public function toType(): EnumType
    {
        return new EnumType([
            'name' => $this->attributes['name'],
            'description' => $this->attributes['description'],
            'values' => [
                'HIGH' => [
                    'value' => 'high',
                    'description' => 'High priority'
                ],
                'MEDIUM' => [
                    'value' => 'medium',
                    'description' => 'Medium priority'
                ],
                'LOW' => [
                    'value' => 'low',
                    'description' => 'Low priority'
                ]
            ]
        ]);
    }
}