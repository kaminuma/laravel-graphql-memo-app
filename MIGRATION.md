# GraphQL Migration: rebing/graphql-laravel → nuwave/lighthouse

This document outlines the migration from `rebing/graphql-laravel` to `nuwave/lighthouse` for improved GraphQL implementation.

## Migration Summary

### ✅ What Was Changed

1. **Dependencies**
   - Removed: `rebing/graphql-laravel: ^9.10`
   - Added: `nuwave/lighthouse: ^6.0`

2. **Configuration**
   - Removed: `config/graphql.php`
   - Added: `config/lighthouse.php`
   - Registered `LighthouseServiceProvider` in `bootstrap/app.php`

3. **Schema Definition**
   - **Before**: PHP-based type definitions in `app/GraphQL/Types/`
   - **After**: SDL (Schema Definition Language) in `graphql/schema.graphql`

4. **Resolvers**
   - Converted all query and mutation classes to work with Lighthouse
   - Removed inheritance from `Rebing\GraphQL\Support\Query` and `Rebing\GraphQL\Support\Mutation`
   - Simplified resolver methods to only include business logic

5. **Type Definitions**
   - Removed: `app/GraphQL/Types/` directory (TodoType, UserType, PriorityType)
   - Replaced with SDL definitions in `graphql/schema.graphql`

### 🎯 Key Benefits Achieved

1. **Schema Definition Language (SDL)**
   - Clean, readable GraphQL schema in `.graphql` files
   - Better tooling support and syntax highlighting
   - Easier schema splitting and imports

2. **Rich Directive Support**
   - `@auth` - Authentication requirement
   - `@belongsTo` / `@hasMany` - Automatic Eloquent relationships
   - `@method` - Call model methods directly
   - `@enum` - Enum value mapping
   - `@field` - Custom field resolvers

3. **Better Eloquent Integration**
   - Automatic relationship resolution
   - Reduced boilerplate code
   - Model-based field resolution

4. **Improved Developer Experience**
   - Better error handling
   - Enhanced introspection
   - Built-in pagination support
   - Type safety improvements

### 📁 File Structure

```
graphql/
└── schema.graphql          # Main GraphQL schema (SDL)

app/GraphQL/
├── Queries/
│   ├── TodosQuery.php      # ✅ Converted
│   ├── UsersQuery.php      # ✅ Converted
│   └── MeQuery.php         # ✅ Converted
├── Mutations/
│   ├── CreateTodoMutation.php  # ✅ Converted
│   ├── UpdateTodoMutation.php  # ✅ Converted
│   ├── DeleteTodoMutation.php  # ✅ Converted
│   ├── RegisterMutation.php    # ✅ Converted
│   ├── LoginMutation.php       # ✅ Converted
│   └── LogoutMutation.php      # ✅ Converted
└── Types/                  # ❌ Removed (replaced by SDL)

config/
├── lighthouse.php          # ✅ New Lighthouse configuration
└── graphql.php            # ❌ Removed (old rebing config)
```

### 🔄 API Compatibility

All existing GraphQL queries and mutations remain **100% compatible**:
- Same endpoint: `/graphql`
- Same query/mutation names and arguments
- Same response structures
- Same authentication requirements

### 🧪 Testing

Updated tests to work with new Lighthouse implementation:
- Basic CRUD operations
- Priority and deadline functionality  
- Authentication requirements
- Enum value handling

### 🚀 Next Steps

The migration is complete and maintains full backward compatibility. Future enhancements can leverage Lighthouse's advanced features:

- Pagination with `@paginate`
- Field-level authorization with `@can`
- Input validation with `@rules`
- Custom scalars and directives
- GraphQL subscriptions
- Advanced caching strategies

### 📚 Resources

- [Lighthouse Documentation](https://lighthouse-php.com/)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [Lighthouse GitHub Repository](https://github.com/nuwave/lighthouse)