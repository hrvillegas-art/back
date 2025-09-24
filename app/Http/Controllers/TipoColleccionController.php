<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tipocolleccion;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;

class TipoColleccionController extends Controller
{
    public function index()
    {
        $tipocollecciones = Tipocolleccion::paginate(10);
        return response()->json($tipocollecciones);
    }
    public function show($id)
    {
        $tipocolleccion = Tipocolleccion::find($id);
        if ($tipocolleccion) {
            return response()->json($tipocolleccion);
        } else {
            return response()->json(['message' => 'Tipo de colección no encontrado'], 404);
        }
    }

    public function store(StorePostRequest $request)
    {
      TipoColleccion::create($request->only(['nombre', 'acronimo','registro','entidad','pais','departamento','ciudad']  ));

    return response()->json([
        'success' => true,
        'message' => 'Tipo de colección creado con éxito.',
        'data' => $request->only(['nombre', 'acronimo','registro','entidad','pais','departamento','ciudad'])
    ], 201);
    }
      /*   $request->validate([
            'nombre' => 'required|string|max:255',
            'acronimo' => 'required|string|max:50',
            'registro' => 'required|string|max:100',
            'entidad' => 'required|string|max:100',
            'pais' => 'required|string|max:100',
            'departamento' => 'required|string|max:100',
            'ciudad' => 'required|string|max:100',
        ]);

        $tipocolleccion = Tipocolleccion::create($request->all());
        return response()->json($tipocolleccion, 201); */
       
    public function update(Request $request, $id)
    {
        $tipocolleccion = Tipocolleccion::find($id);
        if ($tipocolleccion) {
            $tipocolleccion->update($request->only([
                'nombre',
                'acronimo',
                'registro',
                'entidad',
                'pais',
                'departamento',
                'ciudad'
            ]));
            return response()->json($tipocolleccion);
        } else {
            return response()->json(['message' => 'Tipo de colección no encontrado'], 404);
        }

    }   
    public function destroy($id)
    {
        $tipocolleccion = Tipocolleccion::find($id);
        if ($tipocolleccion) {
            $tipocolleccion->delete();
            return response()->json(['message' => 'Tipo de colección eliminado exitosamente']);
        } else {
            return response()->json(['message' => 'Tipo de colección no encontrado'], 404);
        }   
    }   

}
