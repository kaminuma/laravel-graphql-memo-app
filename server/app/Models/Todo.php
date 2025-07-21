<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Todo extends Model
{
    protected $fillable = [
        'title',
        'description',
        'completed',
        'user_id',
        'deadline',
        'priority',
        'category_id'
    ];

    protected $casts = [
        'completed' => 'boolean',
        'deadline' => 'datetime',
        'priority' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Check if the todo is overdue
     */
    public function isOverdue(): bool
    {
        if (!$this->deadline || $this->completed) {
            return false;
        }
        
        return $this->deadline->isPast();
    }

    /**
     * Get the deadline status of the todo
     */
    public function getDeadlineStatus(): string
    {
        try {
            if (!$this->deadline || $this->completed) {
                return 'normal';
            }
            // Carbonインスタンスでなければnormal
            if (!($this->deadline instanceof \Carbon\Carbon)) {
                return 'normal';
            }
            $now = now();
            if ($this->deadline->isPast()) {
                return 'overdue';
            }
            if ($this->deadline->isToday()) {
                return 'due_today';
            }
            if ($this->deadline->diffInDays($now) <= 3) {
                return 'due_soon';
            }
            return 'normal';
        } catch (\Throwable $e) {
            return 'normal';
        }
    }

    /**
     * GraphQL Enum仕様に合わせてpriorityを大文字で返す
     */
    public function getPriorityAttribute($value)
    {
        return strtoupper($value);
    }

    /**
     * 保存時は小文字でDBに格納
     */
    public function setPriorityAttribute($value)
    {
        $this->attributes['priority'] = strtolower($value);
    }
}
