<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use GraphQL\Error\Error;

class RegisterMutation
{
    public function resolve($root, array $args, $context, $resolveInfo)
    {
        // バリデーション
        $validator = Validator::make($args, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            // GraphQLの例外として投げる
            throw new Error($validator->errors()->first());
        }

        // ユーザー作成
        $user = User::create([
            'name' => $args['name'],
            'email' => $args['email'],
            'password' => Hash::make($args['password']),
        ]);

        // デバッグ用ログ: ユーザー登録完了
        \Log::info('ユーザー登録完了: ' . $user->email);

        return $user;
    }
} 