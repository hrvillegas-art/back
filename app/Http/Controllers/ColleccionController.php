<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Colleccion;
use App\Models\Tipocolleccion;
use App\Http\Requests\StorePostRequestColleccion;
use App\Http\Requests\UpdatePostRequestColleccion;

class ColleccionController extends Controller
{
    public function index()
    {
        $collecciones = Colleccion::paginate(10);
        return response()->json($collecciones);
    }   

    public function show($id)
    {
        $colleccion = Colleccion::find($id);
        if ($colleccion) {
            return response()->json($colleccion);
        } else {
            return response()->json(['message' => 'Colección no encontrada'], 404);
        }
    }   

    public function store(Request $request)
    {
       Colleccion::create($request->only(['nombre', 'descripcion', 'tipocolleccion_id']  ));

    return response()->json([
        'success' => true,
        'message' => 'Tipo de colección creado con éxito.',
        'data' => $request->only(['nombre', 'descripcion', 'tipocolleccion_id'])
    ], 201);
    }

    public function update(Request $request, $id)
    {
        $colleccion = Colleccion::find($id);
        if ($colleccion) {
            $colleccion->update($request->only(['nombre', 'descripcion', 'tipocolleccion_id'] ));
            return response()->json($colleccion);
        } else {
            return response()->json(['message' => 'Colección no encontrada'], 404);
        }
    }
    public function destroy($id)
    {
       $colleccion = Colleccion::find($id);
        if ($colleccion) {
            $colleccion->delete();
            return response()->json(['message' => 'Colección eliminada con éxito']);
        } else {
            return response()->json(['message' => 'Colección no encontrada'], 404);
        }           

}
}
