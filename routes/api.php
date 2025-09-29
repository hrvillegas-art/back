<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TipoColleccionController;
use App\Models\Tipocolleccion;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Controllers\ColleccionController;
use App\Models\Colleccion;
use App\Http\Requests\StorePostRequestColleccion;
use App\Http\Requests\UpdatePostRequestColleccion;
use App\Http\Controllers\PiezaController;
use App\Http\Controllers\FactorController;
use App\Models\Pieza;
use App\Http\Requests\StorePostRequestPieza;
use App\Http\Requests\UpdatePostRequestPieza;




/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route::post('/tipocollecciones', [TipoColleccionController::class, 'store']);
// Route::get('/tipocollecciones', [TipoColleccionController::class, 'index']);


Route::get('/tipocollecciones', [TipoColleccionController::class, 'listarTodo']);   // listar
Route::post('/tipocollecciones', [TipoColleccionController::class, 'guardar']); // crear
Route::get('/tipocollecciones/{id}', [TipoColleccionController::class, 'obtenerRecurso']); // obtener uno
Route::put('/tipocollecciones/{id}', [TipoColleccionController::class, 'guardar']); // actualizar
Route::delete('/tipocollecciones/{id}', [TipoColleccionController::class, 'eliminar']); // eliminar uno


//Route::put('/tipocollecciones/{id}', [TipoColleccionController::class, 'cambiarEstado']);
//Route::patch('/tipocollecciones/{id}', [TipoColleccionController::class, 'cambiarEstado']);

;
// Route::get('/tipocollecciones/{id}', [TipoColleccionController::class, 'show']);
// Route::put('/tipocollecciones/{id}', [TipoColleccionController::class, 'update']);
// Route::patch('/tipocollecciones/{id}', [TipoColleccionController::class, 'update']);
// Route::delete('/tipocollecciones/{id}', [TipoColleccionController::class, 'destroy']);
// Route::apiresource('/tipocollecciones', TipoColleccionController::class);

Route::get('/collecciones', [ColleccionController::class, 'listarTodo']);
Route::post('/collecciones', [ColleccionController::class, 'guardar']);
Route::delete('/collecciones', [ColleccionController::class, 'eliminar']);
//Route::put('/collecciones/{id}', [ColleccionController::class, 'cambiarEstado']);
//Route::patch('/collecciones/{id}', [ColleccionController::class, 'cambiarEstado']);


// Route::get('/collecciones', [ColleccionController::class, 'index']);

/* Route::get('/collecciones/{id}', [ColleccionController::class, 'show']);
Route::put('/collecciones/{id}', [ColleccionController::class, 'update']);
Route::patch('/collecciones/{id}', [ColleccionController::class, 'update']);
Route::delete('/collecciones/{id}', [ColleccionController::class, 'destroy']);
Route::apiresource('/collecciones', ColleccionController::class); */

Route::post('/piezas', [PiezaController::class, 'store']);
Route::get('/piezas', [PiezaController::class, 'index']);
Route::get('/piezas/{id}', [PiezaController::class, 'show']);
Route::put('/piezas/{id}', [PiezaController::class, 'update']);
Route::patch('/piezas/{id}', [PiezaController::class, 'update']);
Route::delete('/piezas/{id}', [PiezaController::class, 'destroy']);
Route::apiresource('/piezas', PiezaController::class);
// En routes/api.php
Route::patch('/piezas/{id}/toggle-publish', [PiezaController::class, 'togglePublishStatus']);

Route::get('/tipocollecciones/search/{name}', function ($name) {
    $tipocollecciones = Tipocolleccion::where('name', 'like', '%' . $name . '%')->get();
    return response()->json($tipocollecciones);
}); 

Route::get('/factor', [FactorController::class, 'listarTodo']);
