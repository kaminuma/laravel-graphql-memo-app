<?php

namespace Tests\Feature\GraphQL;

use Tests\TestCase;
use App\Models\User;
use App\Models\Todo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Carbon\Carbon;

class TodosQueryTest extends TestCase
{
    use RefreshDatabase;

    protected $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /**
     * Test todos query returns only authenticated user's todos
     */
    public function test_todos_query_returns_user_todos()
    {
        Sanctum::actingAs($this->user);
        
        $otherUser = User::factory()->create();
        Todo::factory()->count(3)->create(['user_id' => $this->user->id]);
        Todo::factory()->count(2)->create(['user_id' => $otherUser->id]);

        $response = $this->graphQL('
            query {
                todos {
                    id
                    title
                }
            }
        ');

        $response->assertJson([
            'data' => [
                'todos' => [
                    ['id' => 1],
                    ['id' => 2],
                    ['id' => 3],
                ]
            ]
        ]);
        
        $this->assertCount(3, $response->json('data.todos'));
    }

    /**
     * Test todos query filters by completed status
     */
    public function test_todos_query_filters_by_completed()
    {
        Sanctum::actingAs($this->user);
        
        Todo::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'completed' => true
        ]);
        Todo::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'completed' => false
        ]);

        $response = $this->graphQL('
            query {
                todos(completed: true) {
                    id
                    completed
                }
            }
        ');

        $todos = $response->json('data.todos');
        $this->assertCount(2, $todos);
        foreach ($todos as $todo) {
            $this->assertTrue($todo['completed']);
        }
    }

    /**
     * Test todos query filters by priority
     */
    public function test_todos_query_filters_by_priority()
    {
        Sanctum::actingAs($this->user);
        
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

        $response = $this->graphQL('
            query {
                todos(priority: HIGH) {
                    id
                    priority
                }
            }
        ');

        $todos = $response->json('data.todos');
        $this->assertCount(1, $todos);
        $this->assertEquals('HIGH', $todos[0]['priority']);
    }

    /**
     * Test todos query filters by deadline status - overdue
     */
    public function test_todos_query_filters_overdue()
    {
        Sanctum::actingAs($this->user);
        Carbon::setTestNow('2024-01-15 12:00:00');
        
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->subDays(2),
            'completed' => false,
            'title' => 'Overdue task'
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::now()->addDay(),
            'completed' => false,
            'title' => 'Future task'
        ]);

        $response = $this->graphQL('
            query {
                todos(deadline_status: "overdue") {
                    id
                    title
                    deadline
                }
            }
        ');

        $todos = $response->json('data.todos');
        $this->assertCount(1, $todos);
        $this->assertEquals('Overdue task', $todos[0]['title']);

        Carbon::setTestNow();
    }

    /**
     * Test todos query filters by deadline status - due_today
     */
    public function test_todos_query_filters_due_today()
    {
        Sanctum::actingAs($this->user);
        Carbon::setTestNow('2024-01-15 12:00:00');
        
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::today(),
            'completed' => false,
            'title' => 'Today task'
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'deadline' => Carbon::tomorrow(),
            'completed' => false,
            'title' => 'Tomorrow task'
        ]);

        $response = $this->graphQL('
            query {
                todos(deadline_status: "due_today") {
                    id
                    title
                }
            }
        ');

        $todos = $response->json('data.todos');
        $this->assertCount(1, $todos);
        $this->assertEquals('Today task', $todos[0]['title']);

        Carbon::setTestNow();
    }

    /**
     * Test todos query with sorting
     */
    public function test_todos_query_sorts_by_priority()
    {
        Sanctum::actingAs($this->user);
        
        Todo::factory()->create(['user_id' => $this->user->id, 'priority' => 'low', 'title' => 'Low']);
        Todo::factory()->create(['user_id' => $this->user->id, 'priority' => 'high', 'title' => 'High']);
        Todo::factory()->create(['user_id' => $this->user->id, 'priority' => 'medium', 'title' => 'Medium']);

        $response = $this->graphQL('
            query {
                todos(sort_by: "priority", sort_direction: "desc") {
                    id
                    title
                    priority
                }
            }
        ');

        $todos = $response->json('data.todos');
        $this->assertEquals('High', $todos[0]['title']);
        $this->assertEquals('Medium', $todos[1]['title']);
        $this->assertEquals('Low', $todos[2]['title']);
    }

    /**
     * Test todos query with multiple filters
     */
    public function test_todos_query_with_multiple_filters()
    {
        Sanctum::actingAs($this->user);
        Carbon::setTestNow('2024-01-15 12:00:00');
        
        // 様々なTODOを作成
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'high',
            'deadline' => Carbon::today(),
            'completed' => false,
            'title' => 'Target todo'
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'low',
            'deadline' => Carbon::today(),
            'completed' => false,
            'title' => 'Wrong priority'
        ]);
        Todo::factory()->create([
            'user_id' => $this->user->id,
            'priority' => 'high',
            'deadline' => Carbon::tomorrow(),
            'completed' => false,
            'title' => 'Wrong deadline'
        ]);

        $response = $this->graphQL('
            query {
                todos(
                    priority: HIGH,
                    deadline_status: "due_today",
                    completed: false
                ) {
                    id
                    title
                }
            }
        ');

        $todos = $response->json('data.todos');
        $this->assertCount(1, $todos);
        $this->assertEquals('Target todo', $todos[0]['title']);

        Carbon::setTestNow();
    }

    /**
     * Test todos query returns empty array for unauthenticated user
     */
    public function test_todos_query_returns_empty_for_unauthenticated()
    {
        Todo::factory()->count(5)->create();

        $response = $this->graphQL('
            query {
                todos {
                    id
                }
            }
        ');

        $this->assertEquals([], $response->json('data.todos'));
    }

    /**
     * Helper method for GraphQL queries
     */
    protected function graphQL($query, $variables = [])
    {
        return $this->postJson('/graphql', [
            'query' => $query,
            'variables' => $variables,
        ]);
    }
}