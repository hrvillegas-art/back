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
    'tipocolleccion_id',
    'user_id',
    'ip_address',
];

 public function coleccion()
    {
        // 💡 VERIFICA ESTA RELACIÓN:
        // Debe apuntar al modelo que contiene el nombre de la colección que se muestra en Vue
        return $this->belongsTo(Tipocolleccion::class, 'tipocolleccion_id', 'id');
    }

}
