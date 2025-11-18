<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class TodoTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test scopeForUser filters todos by user
     */
    public function test_scope_for_user_filters_by_user()
    {
        $otherUser = User::factory()->create();
        
        Todo::factory()->count(3)->create(['user_id' => $this->user->id]);
        Todo::factory()->count(2)->create(['user_id' => $otherUser->id]);

        $todos = Todo::forUser($this->user->id)->get();

        $this->assertCount(3, $todos);
        $todos->each(fn($todo) => $this->assertEquals($this->user->id, $todo->user_id));
    }

    /**
     * Test scopeCompleted filters by completion status
     */
    public function test_scope_completed_filters_by_status()
    {
        Todo::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'completed' => true
        ]);
        Todo::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'completed' => false
        ]);

        $completedTodos = Todo::forUser($this->user->id)->completed(true)->get();
        $incompleteTodos = Todo::forUser($this->user->id)->completed(false)->get();

        $this->assertCount(2, $completedTodos);
        $this->assertCount(3, $incompleteTodos);
    }

    /**
     * Test scopeByPriority filters by priority level
     */
    public function test_scope_by_priority_filters_correctly()
    {
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'high'
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'medium'
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'low'
        ]);

        $highPriorityTodos = Todo::forUser($this->user->id)->byPriority('HIGH')->get();
        $mediumPriorityTodos = Todo::forUser($this->user->id)->byPriority('MEDIUM')->get();

        $this->assertCount(1, $highPriorityTodos);
        $this->assertCount(1, $mediumPriorityTodos);
    }

    /**
     * Test scopeByDeadlineStatus filters overdue todos
     */
    public function test_scope_by_deadline_status_overdue()
    {
        Carbon::setTestNow('2024-01-15 12:00:00');

        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->subDay(),
            'completed' => false
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->subDay(),
            'completed' => true // 完了済みなので期限切れにならない
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->addDay(),
            'completed' => false
        ]);

        $overdueTodos = Todo::forUser($this->user->id)->byDeadlineStatus('overdue')->get();

        $this->assertCount(1, $overdueTodos);
        $this->assertTrue($overdueTodos->first()->deadline->isPast());
        $this->assertFalse($overdueTodos->first()->completed);

        Carbon::setTestNow(); // リセット
    }

    /**
     * Test scopeByDeadlineStatus filters due_today todos
     */
    public function test_scope_by_deadline_status_due_today()
    {
        Carbon::setTestNow('2024-01-15 12:00:00');

        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::today(),
            'completed' => false
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::today(),
            'completed' => true // 完了済みなので含まれない
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::tomorrow(),
            'completed' => false
        ]);

        $todayTodos = Todo::forUser($this->user->id)->byDeadlineStatus('due_today')->get();

        $this->assertCount(1, $todayTodos);
        $this->assertTrue($todayTodos->first()->deadline->isToday());
        $this->assertFalse($todayTodos->first()->completed);

        Carbon::setTestNow(); // リセット
    }

    /**
     * Test scopeByDeadlineStatus filters due_this_week todos
     */
    public function test_scope_by_deadline_status_due_this_week()
    {
        Carbon::setTestNow('2024-01-15 12:00:00');

        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->addDays(5),
            'completed' => false
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->addDays(8),
            'completed' => false // 1週間の範囲外
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->addDays(3),
            'completed' => true // 完了済みなので含まれない
        ]);

        $weekTodos = Todo::forUser($this->user->id)->byDeadlineStatus('due_this_week')->get();

        $this->assertCount(1, $weekTodos);
        $this->assertFalse($weekTodos->first()->completed);

        Carbon::setTestNow(); // リセット
    }

    /**
     * Test scopeApplySorting with priority
     */
    public function test_scope_apply_sorting_by_priority()
    {
        Todo::factory()->create(['user_id' => $this->user->id, 'priority' => 'low']);
        Todo::factory()->create(['user_id' => $this->user->id, 'priority' => 'high']);
        Todo::factory()->create(['user_id' => $this->user->id, 'priority' => 'medium']);

        $todosDesc = Todo::forUser($this->user->id)->applySorting('priority', 'desc')->get();

        $this->assertEquals('HIGH', $todosDesc->first()->priority);
        $this->assertEquals('LOW', $todosDesc->last()->priority);
    }

    /**
     * Test scopeApplySorting handles null deadlines
     */
    public function test_scope_apply_sorting_handles_null_deadlines()
    {
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => null
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->addDay()
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->subDay()
        ]);

        $todos = Todo::forUser($this->user->id)->applySorting('deadline', 'asc')->get();

        // NULL期限は最後になるべき
        $this->assertNotNull($todos->first()->deadline);
        $this->assertNull($todos->last()->deadline);
    }

    /**
     * Test chaining multiple scopes
     */
    public function test_can_chain_multiple_scopes()
    {
        Carbon::setTestNow('2024-01-15 12:00:00');

        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'high',
            'deadline' => Carbon::today(),
            'completed' => false
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'high',
            'deadline' => Carbon::tomorrow(),
            'completed' => false
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'low',
            'deadline' => Carbon::today(),
            'completed' => false
        ]);

        $todos = Todo::forUser($this->user->id)
            ->byPriority('HIGH')
            ->byDeadlineStatus('due_today')
            ->completed(false)
            ->get();

        $this->assertCount(1, $todos);
        $this->assertEquals('HIGH', $todos->first()->priority);
        $this->assertTrue($todos->first()->deadline->isToday());

        Carbon::setTestNow(); // リセット
    }
}