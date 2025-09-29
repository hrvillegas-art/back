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
        schema::create('colleccion', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('nombre');
            $table->text('descripcion');
            $table->unsignedBigInteger('tipocolleccion_id');
             $table->boolean('estado')->default(true)->comment('');
            $table->timestamp('fechacreacion')->nullable()->default(null);
            $table->integer('usuariocreacion');
            $table->timestamp('fechamodificacion')->nullable()->default(null);
            $table->integer('usuariomodificacion');
            $table->string('ipcreacion',255);
            $table->string('ipmodificacion',255);
            $table->foreign('tipocolleccion_id')->references('id')->on('tipocolleccion')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    schema::dropIfExists('colleccion');
    }
};
