<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateFactorTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('factor', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('lineamiento_id')->comment('Tipo de lineamiento');
            $table->string('codigo', 255)->comment('Código del tipo de factor');
            $table->string('nombre', 255)->comment('Nombre del tipo de factor');
            $table->text('descripcion')->comment('Descripción del tipo de factor');
            $table->boolean('estado')->default(true)->comment('');

            //Datos de auditoria
            $table->timestamp('fechacreacion')->nullable()->default(null);
            $table->integer('usuariocreacion');
            $table->timestamp('fechamodificacion')->nullable()->default(null);
            $table->integer('usuariomodificacion');
            $table->string('ipcreacion',255);
            $table->string('ipmodificacion',255);

            $table->unique(['lineamiento_id', 'codigo']);
        });   
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('factor');
    }
}
