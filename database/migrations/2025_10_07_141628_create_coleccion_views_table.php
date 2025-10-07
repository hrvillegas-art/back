<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('colleccion_views', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('colleccion_id');
            $table->unsignedBigInteger('user_id')->nullable(); // Si es público puede ser null
            $table->string('ip_address')->nullable();
            $table->timestamps();

            $table->foreign('colleccion_id')->references('id')->on('tipocolleccion')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('colleccion_views');
    }
};
