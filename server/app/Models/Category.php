<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = [
        'name',
        'color',
    ];

    protected $casts = [
        'name' => 'string',
        'color' => 'string',
    ];

    public function todos(): HasMany
    {
        return $this->hasMany(Todo::class);
    }
}