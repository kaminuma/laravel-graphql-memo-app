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
     * Todoが期限切れかチェックする
     */
    public function isOverdue(): bool
    {
        if (!$this->deadline || $this->completed) {
            return false;
        }

        return $this->deadline->isPast();
    }

    /**
     * Todoの期限ステータスを取得する
     */
    public function getDeadlineStatus(): string
    {
        try {
            if (!$this->deadline || $this->completed) {
                return 'normal';
            }
            // Carbonインスタンスでなければnormalを返す
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

    /**
     * スコープ: ユーザーでフィルタリング
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * スコープ: 完了ステータスでフィルタリング
     */
    public function scopeCompleted($query, ?bool $completed = null)
    {
        if ($completed !== null) {
            return $query->where('completed', $completed);
        }
        return $query;
    }

    /**
     * スコープ: 優先度でフィルタリング
     */
    public function scopeByPriority($query, ?string $priority = null)
    {
        if ($priority) {
            // GraphQLから来る大文字の値を小文字に変換
            return $query->where('priority', strtolower($priority));
        }
        return $query;
    }

    /**
     * スコープ: 期限ステータスでフィルタリング
     * 期限フィルタリングロジックを実装
     */
    public function scopeByDeadlineStatus($query, ?string $status = null)
    {
        if ($status) {
            $now = now();
            if ($status === 'overdue') {
                return $query->where('deadline', '<', $now)->where('completed', false);
            } elseif ($status === 'due_today') {
                return $query->whereDate('deadline', $now->toDateString())->where('completed', false);
            } elseif ($status === 'due_this_week') {
                $weekEnd = $now->copy()->addWeek();
                return $query->whereBetween('deadline', [$now, $weekEnd])->where('completed', false);
            } elseif ($status === 'normal') {
                return $query->where(function ($q) use ($now) {
                    $q->whereNull('deadline')
                      ->orWhere('deadline', '>', $now)
                      ->orWhere('completed', true);
                });
            }
        }
        return $query;
    }

    /**
     * スコープ: NULLを適切に処理してソートを適用
     */
    public function scopeApplySorting($query, string $sortBy = 'created_at', string $sortDirection = 'desc')
    {
        // ソートパラメータのバリデーション
        $validSortFields = ['priority', 'deadline', 'created_at'];
        $validSortDirections = ['asc', 'desc'];

        if (!in_array($sortBy, $validSortFields)) {
            $sortBy = 'created_at';
        }
        if (!in_array($sortDirection, $validSortDirections)) {
            $sortDirection = 'desc';
        }

        // 優先度ソートの特別処理
        if ($sortBy === 'priority') {
            $query->orderByRaw("FIELD(priority, 'high', 'medium', 'low') " . ($sortDirection === 'asc' ? 'ASC' : 'DESC'));
        } elseif ($sortBy === 'deadline') {
            // 期限ソート時のNULL値処理
            if ($sortDirection === 'asc') {
                $query->orderByRaw('deadline IS NULL, deadline ASC');
            } else {
                $query->orderByRaw('deadline IS NULL, deadline DESC');
            }
        } else {
            $query->orderBy($sortBy, $sortDirection);
        }

        // 一貫した順序のための二次ソート
        if ($sortBy !== 'created_at') {
            $query->orderBy('created_at', 'desc');
        }

        return $query;
    }
}
