<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Todo;

class TodoGraphQLTest extends TestCase
{
    use RefreshDatabase;

    public function test_todo_crud_via_graphql()
    {
        $user = User::factory()->create();

        // ユーザーを認証
        $this->actingAs($user);

        // 1. 作成 (user_idは認証されたユーザーから自動設定)
        $createMutation = [
            'query' => 'mutation { createTodo(title: "テストTODO", description: "説明") { id title description completed user_id } }'
        ];
        $createRes = $this->postJson('/graphql', $createMutation);
        $createRes->assertStatus(200)->assertJsonFragment(['title' => 'テストTODO']);
        $todoId = $createRes['data']['createTodo']['id'];

        // 2. 取得
        $query = [
            'query' => '{ todos { id title description completed user_id } }'
        ];
        $getRes = $this->postJson('/graphql', $query);
        $getRes->assertStatus(200)->assertJsonFragment(['title' => 'テストTODO']);

        // 3. 更新
        $updateMutation = [
            'query' => 'mutation { updateTodo(id: ' . $todoId . ', title: "更新後", completed: true) { id title completed } }'
        ];
        $updateRes = $this->postJson('/graphql', $updateMutation);
        $updateRes->assertStatus(200)->assertJsonFragment(['title' => '更新後', 'completed' => true]);

        // 4. 削除
        $deleteMutation = [
            'query' => 'mutation { deleteTodo(id: ' . $todoId . ') }'
        ];
        $deleteRes = $this->postJson('/graphql', $deleteMutation);
        $deleteRes->assertStatus(200);
        $this->assertDatabaseMissing('todos', ['id' => $todoId]);
    }

    public function test_todo_with_priority_and_deadline()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // 優先度と期限を指定してTODOを作成
        $createMutation = [
            'query' => 'mutation { 
                createTodo(
                    title: "緊急タスク", 
                    description: "重要な締切あり", 
                    priority: HIGH,
                    deadline: "2024-12-31T23:59:59Z"
                ) { 
                    id title description priority deadline deadline_status
                } 
            }'
        ];
        $createRes = $this->postJson('/graphql', $createMutation);
        $createRes->assertStatus(200)
                 ->assertJsonFragment(['title' => '緊急タスク'])
                 ->assertJsonFragment(['priority' => 'high']);

        $todoId = $createRes['data']['createTodo']['id'];

        // 優先度フィルターでTODOをクエリ
        $queryWithPriority = [
            'query' => '{ todos(priority: HIGH) { id title priority deadline_status } }'
        ];
        $getRes = $this->postJson('/graphql', $queryWithPriority);
        $getRes->assertStatus(200)->assertJsonFragment(['title' => '緊急タスク']);

        // 優先度をMEDIUMに更新
        $updateMutation = [
            'query' => 'mutation { updateTodo(id: ' . $todoId . ', priority: MEDIUM) { id priority } }'
        ];
        $updateRes = $this->postJson('/graphql', $updateMutation);
        $updateRes->assertStatus(200)->assertJsonFragment(['priority' => 'medium']);
    }

    public function test_authentication_required_for_todos()
    {
        // 認証なしでテスト
        $query = [
            'query' => '{ todos { id title } }'
        ];
        $res = $this->postJson('/graphql', $query);
        
        // 認証エラーが返されるべき
        $res->assertStatus(200); // GraphQLエラーでも200を返す
        $this->assertStringContainsString('Unauthenticated', json_encode($res->json()));
    }
} 