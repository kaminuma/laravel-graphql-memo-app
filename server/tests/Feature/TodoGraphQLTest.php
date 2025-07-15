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

        // 1. 作成
        $createMutation = [
            'query' => 'mutation { createTodo(title: "テストTODO", description: "説明", user_id: ' . $user->id . ') { id title description completed user_id } }'
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
} 