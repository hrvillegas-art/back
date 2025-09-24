<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factor extends Model
{
    protected $table = 'factor';

    protected $connection  = 'mysql';
    const CREATED_AT = 'fechacreacion';
    const UPDATED_AT = 'fechamodificacion';
    
    protected $fillable = [
        'lineamiento_id',
        'codigo',
        'nombre',
        'descripcion',
        'estado',
        'fechacreacion',
        'usuariocreacion',
        'fechamodificacion',
        'usuariomodificacion',
        'ipcreacion',
        'ipmodificacion'
    ];
}
    
