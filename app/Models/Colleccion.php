<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class Colleccion extends Model
{
    protected $table = 'colleccion';
    
    protected $connection = 'mysql';
    const CREATED_AT = 'fechacreacion';
    const UPDATED_AT = 'fechamodificacion';
  
    protected $fillable = [
        'nombre',
        'descripcion',
        'tipocolleccion_id',
    ];

}
