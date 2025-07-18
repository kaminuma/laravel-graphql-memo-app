<?php

return [
    /*
    |--------------------------------------------------------------------------
    | GraphQL endpoint
    |--------------------------------------------------------------------------
    |
    | Set the endpoint to which GraphQL requests are sent.
    |
    */

    'route' => [
        /*
         * The URI the endpoint responds to, e.g. mydomain.com/graphql.
         */
        'uri' => 'graphql',

        /*
         * Lighthouse creates a named route for convenience.
         * It is set to `lighthouse` by default.
         */
        'name' => 'graphql',

        /*
         * Beware that middleware defined here runs before the GraphQL execution phase,
         * make sure to return spec-compliant responses in case an error is thrown.
         */
        'middleware' => [
            \Illuminate\Http\Middleware\HandleCors::class,
            \Nuwave\Lighthouse\Support\Http\Middleware\LogGraphQLQueries::class,
        ],

        /*
         * The `prefix` and `domain` configuration options are optional.
         */
        // 'prefix' => '',
        // 'domain' => '',
    ],

    /*
    |--------------------------------------------------------------------------
    | GraphQL schema
    |--------------------------------------------------------------------------
    |
    | File path of the GraphQL schema to be used, defaults to null so it uses
    | the default location `graphql/schema.graphql` or `graphql/schema.graphqls`.
    |
    */

    'schema' => [
        /*
         * Path to the schema file.
         */
        'register' => base_path('graphql/schema.graphql'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Schema Cache
    |--------------------------------------------------------------------------
    |
    | A large part of the schema generation consists of parsing and AST manipulation.
    | This operation is very expensive, so it is highly recommended enabling
    | caching in production.
    |
    */

    'cache' => [
        /*
         * Setting to true enables schema caching.
         */
        'enable' => env('LIGHTHOUSE_CACHE_ENABLE', env('APP_ENV') !== 'local'),

        /*
         * Allowed values:
         * - null: uses default driver from config/cache.php
         * - false: disables caching completely
         * - string: cache store name
         */
        'store' => env('LIGHTHOUSE_CACHE_STORE', null),
    ],

    /*
    |--------------------------------------------------------------------------
    | Namespaces
    |--------------------------------------------------------------------------
    |
    | These are the default namespaces where Lighthouse looks for classes to
    | extend functionality of the schema. You may pass either a string or an
    | array, they are tried in order and the first match is used.
    |
    */

    'namespaces' => [
        'models' => ['App', 'App\\Models'],
        'queries' => 'App\\GraphQL\\Queries',
        'mutations' => 'App\\GraphQL\\Mutations',
        'subscriptions' => 'App\\GraphQL\\Subscriptions',
        'interfaces' => 'App\\GraphQL\\Interfaces',
        'unions' => 'App\\GraphQL\\Unions',
        'scalars' => 'App\\GraphQL\\Scalars',
        'directives' => 'App\\GraphQL\\Directives',
        'validators' => 'App\\GraphQL\\Validators',
    ],

    /*
    |--------------------------------------------------------------------------
    | Security
    |--------------------------------------------------------------------------
    |
    | Control how Lighthouse handles security related query validation.
    | Read more at https://lighthouse-php.com/master/security/security.html
    |
    */

    'security' => [
        'max_query_complexity' => \GraphQL\Validator\Rules\QueryComplexity::DISABLED,
        'max_query_depth' => \GraphQL\Validator\Rules\QueryDepth::DISABLED,
        'disable_introspection' => \GraphQL\Validator\Rules\DisableIntrospection::DISABLED,
    ],

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    |
    | Lighthouse uses cursor-based pagination by default. You may configure
    | the default pagination type and the maximum count of the paginated
    | results here.
    |
    */

    'pagination' => [
        'default_count' => 20,
        'max_count' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Debug
    |--------------------------------------------------------------------------
    |
    | Control the debug level as described in https://lighthouse-php.com/master/getting-started/configuration.html
    |
    */

    'debug' => env('LIGHTHOUSE_DEBUG', \Nuwave\Lighthouse\Debug\DebugFlag::INCLUDE_DEBUG_MESSAGE),

    /*
    |--------------------------------------------------------------------------
    | Error Handlers
    |--------------------------------------------------------------------------
    |
    | Register error handlers that receive the Errors that occur during execution and
    | handle them. You may use this to log, filter or format the errors.
    | The classes must implement \Nuwave\Lighthouse\Execution\ErrorHandler
    |
    */

    'error_handlers' => [
        \Nuwave\Lighthouse\Execution\AuthenticationErrorHandler::class,
        \Nuwave\Lighthouse\Execution\AuthorizationErrorHandler::class,
        \Nuwave\Lighthouse\Execution\ValidationErrorHandler::class,
        \Nuwave\Lighthouse\Execution\ReportingErrorHandler::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Field Middleware
    |--------------------------------------------------------------------------
    |
    | Register global field middleware directives that wrap around every field.
    | Execution happens in the defined order, before other field middleware.
    | The classes must implement \Nuwave\Lighthouse\Support\Contracts\FieldMiddleware
    |
    */

    'field_middleware' => [
        \Nuwave\Lighthouse\Schema\Directives\TrimDirective::class,
        \Nuwave\Lighthouse\Schema\Directives\SanitizeDirective::class,
        \Nuwave\Lighthouse\Validation\ValidateDirective::class,
        \Nuwave\Lighthouse\Schema\Directives\TransformArgsDirective::class,
        \Nuwave\Lighthouse\Schema\Directives\SpreadDirective::class,
        \Nuwave\Lighthouse\Schema\Directives\RenameArgsDirective::class,
        \Nuwave\Lighthouse\Schema\Directives\DropArgsDirective::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | Global ID
    |--------------------------------------------------------------------------
    |
    | The name that is used for the global id field on the Node interface.
    | When creating a Relay compliant server, this must be named "id".
    |
    */

    'global_id_field' => 'id',

    /*
    |--------------------------------------------------------------------------
    | Batched Queries
    |--------------------------------------------------------------------------
    |
    | GraphQL query batching means sending multiple queries to the server in one request,
    | You may set this flag to either process or deny batched queries.
    |
    */

    'batched_queries' => true,

    /*
    |--------------------------------------------------------------------------
    | Transactional Mutations
    |--------------------------------------------------------------------------
    |
    | If set to true, mutations such as @create, @update, @upsert, @delete
    | will be automatically wrapped in a database transaction.
    |
    */

    'transactional_mutations' => true,

    /*
    |--------------------------------------------------------------------------
    | Mass Assignment Protection
    |--------------------------------------------------------------------------
    |
    | If set to true, mutations will use forceFill() over fill() when populating
    | a model with arguments in mutation directives. Since GraphQL constrains
    | the allowed arguments, this is fine unless you're mixing in other input.
    |
    */

    'force_fill' => true,

    /*
    |--------------------------------------------------------------------------
    | Batchload Relations
    |--------------------------------------------------------------------------
    |
    | If set to true, relations marked with directives like @hasMany or @belongsTo
    | will be optimized by combining the queries through the BatchLoader.
    |
    */

    'batchload_relations' => true,

    /*
    |--------------------------------------------------------------------------
    | GraphQL Subscriptions
    |--------------------------------------------------------------------------
    |
    | Here you can define GraphQL subscription broadcaster and storage drivers
    | as well their required connection parameters.
    |
    */

    'subscriptions' => [
        /*
         * Determines if broadcasts should be queued by default.
         */
        'queue_broadcasts' => env('LIGHTHOUSE_QUEUE_BROADCASTS', true),

        /*
         * Determines the queue to use for broadcasting queue jobs.
         */
        'broadcasts_queue_name' => env('LIGHTHOUSE_BROADCASTS_QUEUE_NAME'),

        /*
         * Default subscription storage.
         * Any Laravel supported cache driver is available here.
         */
        'storage' => env('LIGHTHOUSE_SUBSCRIPTION_STORAGE', 'redis'),

        /*
         * Default subscription broadcaster.
         */
        'broadcaster' => env('LIGHTHOUSE_BROADCASTER', 'log'),

        /*
         * Subscription broadcasting drivers with config.
         */
        'broadcasters' => [
            'log' => [
                'driver' => 'log',
            ],
            'pusher' => [
                'driver' => 'pusher',
                'routes' => \Nuwave\Lighthouse\Subscriptions\Pusher\PusherMixin::routes(),
                'connection' => 'pusher',
            ],
            'echo' => [
                'driver' => 'echo',
                'connection' => env('LIGHTHOUSE_SUBSCRIPTION_REDIS_CONNECTION', 'default'),
                'routes' => \Nuwave\Lighthouse\Subscriptions\Echo\EchoMixin::routes(),
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Defer
    |--------------------------------------------------------------------------
    |
    | Configuration for the experimental @defer directive.
    | This feature requires subscribing to the development releases of Lighthouse.
    |
    */

    'defer' => [
        /*
         * Maximum number of nested fields that can be deferred in one query.
         * Once reached, remaining fields will be resolved synchronously.
         * 0 means unlimited.
         */
        'max_nested_fields' => 0,

        /*
         * Maximum execution time for deferred queries in seconds.
         * Once reached, remaining fields will be resolved synchronously.
         * 0 means unlimited.
         */
        'max_execution_time' => 10,
    ],
];