<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        schema::create('pieza', function (Blueprint $table) {
            $table->id();
            $table->string('familia');
            $table->string('genero');
            $table->string('especie');
            $table->string('numeroCatalogo');
            $table->string('colector');
            $table->string('numeroColector');
            $table->date('fechaColeccion');
            $table->string('reino');
            $table->string('division');
            $table->string('clase');
            $table->string('orden');
            $table->string('determinador');
            $table->string('pais');
            $table->string('departamento');
            $table->string('municipio');
            $table->string('localidad');
            $table->string('altitud');
            $table->string('latitud');
            $table->string('datumGeodesico');
            $table->string('imagen')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    schema::dropIfExists('pieza');
    }
};
