<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// アプリケーションがメンテナンスモードかどうかを判定
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Composerオートローダーを登録
require __DIR__.'/../vendor/autoload.php';

// Laravelをブートストラップしてリクエストを処理
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
