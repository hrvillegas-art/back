<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class pieza extends Model
{
    
    protected $table = 'pieza';
    protected $connection = 'mysql';

    const CREATE_AT= 'fechacreacion';
    const UDPATE_AT = 'fechamodificacion';
    protected $fillable = [
        'familia',
        'genero',
        'especie',
        'numeroCatalogo',
        'colector',
        'numeroColector',
        'fechaColeccion',
        'reino',
        'division',
        'clase',
        'orden',
        'determinador',
        'pais',
        'departamento',
        'municipio',
        'localidad',
        'altitud',
        'latitud',
        'datumGeodesico',
        'imagen',
        'is_published'
    ];
}
