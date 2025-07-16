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
        'priority'
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
        if (!$this->deadline || $this->completed) {
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
    }
}
