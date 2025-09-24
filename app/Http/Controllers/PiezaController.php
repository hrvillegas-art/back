<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pieza;
use App\Http\Requests\StorePostRequestPieza;
use App\Http\Requests\UpdatePostRequestPieza;
use Illuminate\Support\Facades\Storage; // 🔹 Asegúrate de que esta línea esté al inicio

class PiezaController extends Controller
{
   // En tu PiezaController.php

public function index()
{
    $piezas = Pieza::paginate(10);

    foreach ($piezas as $pieza) {
        if ($pieza->imagen) {
            $pieza->imagen_url_full = url('storage/' . $pieza->imagen);
        } else {
            $pieza->imagen_url_full = null;
        }
    }

    return response()->json($piezas);
}

public function show($id)
{
    $pieza = Pieza::find($id);

    if ($pieza) {
        if ($pieza->imagen) {
            $pieza->imagen_url_full = url('storage/' . $pieza->imagen);
        } else {
            $pieza->imagen_url_full = null;
        }
        return response()->json($pieza);
    } else {
        return response()->json(['message' => 'Pieza no encontrada'], 404);
    }
}

    public function store(StorePostRequestPieza $request)
    {
        $data = $request->only([
            'familia',
            'genero',
            'especie',
            'numeroCatalogo',
            'colector',
            'numeroColector',
            'fechaColeccion',
            'reino',
            'division',
            'clase',
            'orden',
            'determinador',
            'pais',
            'departamento',
            'municipio',
            'localidad',
            'altitud',
            'latitud',
            'datumGeodesico',
            'imagen'
        ]);
    
        // Procesar imagen si viene
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('piezas_images', 'public'); // 🔹 Carpeta de almacenamiento consistente
            $data['imagen'] = $path;
        }
    
        $pieza = Pieza::create($data);
    
        return response()->json([
            'success' => true,
            'message' => 'Pieza creada con éxito.',
            'data' => $pieza
        ], 201);
    }
    
    public function update(UpdatePostRequestPieza $request, $id)
    {
        $pieza = Pieza::find($id);
    
        if (!$pieza) {
            return response()->json(['message' => 'Pieza no encontrada'], 404);
        }
    
        // 🔹 Obtener todos los datos del formulario excepto los relacionados con el archivo
        $data = $request->except(['imagen', 'removeImage']);
    
        // 🔹 Lógica para manejar la imagen
        if ($request->has('removeImage')) {
            // Eliminar la imagen del disco
            if ($pieza->imagen && Storage::disk('public')->exists($pieza->imagen)) {
                Storage::disk('public')->delete($pieza->imagen);
            }
            // Establecer el campo 'imagen' a null
            $data['imagen'] = null;
        } else if ($request->hasFile('imagen')) {
            // Eliminar la imagen anterior si se sube una nueva
            if ($pieza->imagen && Storage::disk('public')->exists($pieza->imagen)) {
                Storage::disk('public')->delete($pieza->imagen);
            }
            // Guardar la nueva imagen
            $path = $request->file('imagen')->store('piezas_images', 'public'); // 🔹 Carpeta de almacenamiento consistente
            $data['imagen'] = $path;
        }
    
        // 🔹 Actualizar el registro con los datos procesados
        $pieza->update($data);
    
        return response()->json([
            'message' => 'Pieza actualizada correctamente',
            'data' => $pieza
        ]);
    }
    
    public function destroy($id) {
        $pieza = Pieza::find($id);
        if ($pieza) {
            $pieza->delete();
            return response()->json(['message' => 'Pieza eliminada con éxito']);
        } else {
            return response()->json(['message' => 'Pieza no encontrada'], 404);
        }
    }
    public function togglePublishStatus(Request $request, $id)
{
    $pieza = Pieza::findOrFail($id);
    $pieza->is_published = !$pieza->is_published; // 🔹 Invertir el estado
    $pieza->save();

    $message = $pieza->is_published ? 'Pieza publicada con éxito.' : 'Pieza despublicada con éxito.';

    return response()->json(['message' => $message]);
}
}