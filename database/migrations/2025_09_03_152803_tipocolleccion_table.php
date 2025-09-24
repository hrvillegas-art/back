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
        Schema::create('tipocolleccion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('acronimo');
            $table->string('registro');
            $table->string('entidad');
            $table->string('pais');
            $table->string('departamento');
            $table->string('ciudad');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipocolleccion');
    }
};

