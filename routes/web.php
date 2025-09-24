<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TipoColleccionController;
use Illuminate\Http\Request;
use App\Models\Tipocolleccion;
use App\Http\Controllers\ColleccionController;
use App\Models\Colleccion;
use App\Http\Controllers\PiezaController;
use App\Models\Pieza;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::Resource('/tipocollecciones', TipoColleccionController::class);
Route::Resource('/collecciones', ColleccionController::class);
Route::Resource('/piezas', PiezaController::class);