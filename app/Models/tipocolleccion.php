<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class tipocolleccion extends Model
{

    protected $table = 'tipocolleccion';
     protected $connection = 'mysql';
    const CREATED_AT = 'fechacreacion';
    const UPDATED_AT = 'fechamodificacion';
    protected $fillable = [
        'nombre',
        'acronimo',
        'registro',
        'entidad',
        'pais',
        'departamento',
        'ciudad',
         'estado',
        'fechacreacion',
        'usuariocreacion',
        'fechamodificacion',
        'usuariomodificacion',
        'ipcreacion',
        'ipmodificacion'
    ];
    
}
