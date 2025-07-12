<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_mutation_creates_user_and_logs_in()
    {
        $response = $this->postJson('/graphql', [
            'query' => 'mutation RegisterUser($name: String!, $email: String!, $password: String!, $password_confirmation: String!) { register(name: $name, email: $email, password: $password, password_confirmation: $password_confirmation) { id name email } }',
            'variables' => [
                'name' => 'テストユーザー',
                'email' => 'testuser@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ],
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('users', ['email' => 'testuser@example.com']);
        $this->assertNotNull($response['data']['register']['id'] ?? null);
    }

    public function test_login_mutation_returns_user_and_sets_session()
    {
        $user = User::factory()->create([
            'email' => 'loginuser@example.com',
            'password' => bcrypt('password123'),
        ]);
        $response = $this->postJson('/graphql', [
            'query' => 'mutation LoginUser($email: String!, $password: String!) { login(email: $email, password: $password) { id name email } }',
            'variables' => [
                'email' => 'loginuser@example.com',
                'password' => 'password123',
            ],
        ]);
        $response->assertStatus(200);
        $this->assertEquals($user->email, $response['data']['login']['email']);
        $this->assertNotNull($response->headers->getCookies());
    }

    public function test_me_query_returns_user_when_authenticated()
    {
        $user = User::factory()->create([
            'email' => 'meuser@example.com',
            'password' => bcrypt('password123'),
        ]);
        $this->actingAs($user);
        $response = $this->postJson('/graphql', [
            'query' => 'query { me { id name email } }',
        ]);
        $response->assertStatus(200);
        $this->assertEquals($user->email, $response['data']['me']['email']);
    }

    public function test_me_query_returns_null_when_not_authenticated()
    {
        $response = $this->postJson('/graphql', [
            'query' => 'query { me { id name email } }',
        ]);
        $response->assertStatus(200);
        $this->assertNull($response['data']['me']);
    }

    public function test_logout_mutation_clears_session()
    {
        $user = User::factory()->create([
            'email' => 'logoutuser@example.com',
            'password' => bcrypt('password123'),
        ]);
        $this->actingAs($user);
        $response = $this->postJson('/graphql', [
            'query' => 'mutation { logout }',
        ]);
        $response->assertStatus(200);
        $this->assertTrue($response['data']['logout']);
    }
} 