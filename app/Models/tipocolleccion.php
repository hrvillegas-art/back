<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tipocolleccion extends Model
{
    use HasFactory;
    protected $table = 'tipocolleccion';
    protected $fillable = [
        'nombre',
        'acronimo',
        'registro',
        'entidad',
        'pais',
        'departamento',
        'ciudad',
    ];
    public function colecciones()
    {
        return $this->hasMany(Colleccion::class, 'tipocolleccion_id');
    }
}
