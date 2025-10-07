<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ColleccionView extends Model
{
    protected $table = 'colleccion_views';
    protected $connection = 'mysql';

    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    protected $fillable = [
    'colleccion_id',
    'tipo_colleccion_id',
    'user_id',
    'ip_address',
];

public function coleccion()
{
    return $this->belongsTo(Colleccion::class, 'tipo_colleccion_id');
}

}
