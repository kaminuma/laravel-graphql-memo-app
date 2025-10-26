<?php

namespace App\GraphQL\Lighthouse;

use App\Models\Category;
use GraphQL\Error\Error;

class CategoryResolver
{
    // createCategoryミューテーション
    public function createCategory($root, array $args)
    {
        $category = Category::create([
            'name' => $args['name'],
            'color' => $args['color'] ?? null,
        ]);

        return $category;
    }

    // updateCategoryミューテーション
    public function updateCategory($root, array $args)
    {
        $category = Category::findOrFail((int) $args['id']);
        
        $updateData = [];
        if (isset($args['name'])) {
            $updateData['name'] = $args['name'];
        }
        if (isset($args['color'])) {
            $updateData['color'] = $args['color'];
        }

        $category->update($updateData);
        return $category;
    }

    // deleteCategoryミューテーション
    public function deleteCategory($root, array $args)
    {
        $category = Category::findOrFail((int) $args['id']);
        
        // カテゴリが使用されているTODOがある場合、それらのcategory_idをnullに設定
        $category->todos()->update(['category_id' => null]);
        
        $deleted = $category->delete();
        return $deleted;
    }
}