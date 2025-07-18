<?php

namespace App\GraphQL\Lighthouse;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use GraphQL\Error\Error;

class AuthResolver
{
    // registerミューテーション
    public function register($root, array $args)
    {
        $validator = Validator::make($args, [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);
        if ($validator->fails()) {
            throw new Error($validator->errors()->first());
        }
        $user = User::create([
            'name' => $args['name'],
            'email' => $args['email'],
            'password' => Hash::make($args['password']),
        ]);
        Log::info('User registered: ' . $user->email);
        return $user;
    }

    // loginミューテーション
    public function login($root, array $args)
    {
        $credentials = [
            'email' => $args['email'],
            'password' => $args['password'],
        ];
        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return $user;
        }
        throw new Error('Invalid credentials');
    }

    // logoutミューテーション
    public function logout($root, array $args)
    {
        Auth::logout();
        return true;
    }
} 