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
            $table->bigIncrements('id');
            $table->string('nombre');
            $table->string('acronimo');
            $table->string('registro');
            $table->string('entidad');
            $table->string('pais');
            $table->string('departamento');
            $table->string('ciudad');
              $table->boolean('estado')->default(true)->comment('');
            $table->timestamp('fechacreacion')->nullable()->default(null);
            $table->integer('usuariocreacion');
            $table->timestamp('fechamodificacion')->nullable()->default(null);
            $table->integer('usuariomodificacion');
            $table->string('ipcreacion',255);
            $table->string('ipmodificacion',255);
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

