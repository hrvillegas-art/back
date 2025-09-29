<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Service\TipoColleccionService;
use App\Http\Requests\StorePostRequestColleccion;
use App\Http\Requests\UpdatePostRequestColleccion;
use Illuminate\Support\Facades\Validator;

class TipoColleccionController extends Controller
{
    protected $tipocolleccionService;

    public function __construct(TipoColleccionService $tipocolleccionService)
    {
        $this->tipocolleccionService = $tipocolleccionService;
    }

    // Guardar o actualizar
 // In TipoColleccionController.php

public function guardar(StorePostRequestColleccion $request, $id = null)
{
    $user_id = 1;
    
   
    $id_from_route = $request->isMethod('put') || $request->isMethod('patch') ? $id : null;
    
    // El ID que se envía al servicio es el de la URL (si es update) o el del cuerpo (si es post/create).
    // Nota: Aunque se envíe null/0 en POST, el servicio lo manejará como creación.
    $resourceId = $id_from_route ?? $request->input('id'); 
    
    // 2. Crear el objeto de datos completo para el servicio
    $data = (object)array_merge(
        $request->all(), // Datos validados del FormRequest
        [
            'id' => $resourceId,
            'usuariocreacion' => $user_id,
            'usuariomodificacion' => $user_id,
            'ipmodificacion' => $request->getClientIp(),
            'ipcreacion' => $request->getClientIp()
        ]
    );

    // 3. Ejecutar la lógica de guardar/actualizar en el servicio
    $output = $this->tipocolleccionService->guardar($data);

    // 4. Determinar el mensaje de respuesta
    // Usamos el ID de la RUTA (o del cuerpo original) para saber si la intención era actualizar.
    // Si el ID de la petición (de la URL o el cuerpo) fue > 0, asumimos que fue una actualización.
    $is_update = (($id_from_route ?? $request->input('id')) ?? 0) > 0;

    $message = $is_update
        ? ['Datos actualizados exitosamente']
        : ['Datos guardados exitosamente'];

    return response()->json([
        'msg' => $message,
        'obj' => $output // Este objeto YA tiene el ID auto-generado si fue creación
    ], 200);
}

    /* public function guardar(StorePostRequestColleccion $request)
    {
        $user_id = 1;

        $output = $this->tipocolleccionService->guardar((object)[
            'id' => $request['id'],
            'nombre' => $request['nombre'],
            'acronimo' => $request['acronimo'],
            'registro' => $request['registro'],
            'entidad' => $request['entidad'],
            'pais' => $request['pais'],
            'departamento' => $request['departamento'],
            'ciudad' => $request['ciudad'],
            'estado' => $request['estado'],
            'usuariocreacion' => $user_id,
            'usuariomodificacion' => $user_id,
            'ipmodificacion' => $request->getClientIp(),
            'ipcreacion' => $request->getClientIp()
        ]);

        return response()->json([
            'msg' => $request['id'] > 0 ? ['Datos actualizados exitosamente'] : ['Datos guardados exitosamente'],
            'obj' => $output
        ], 200);
    }
 */
    // Obtener recurso por ID
    public function obtenerRecurso(Request $request, $id)
    {
        $valid = Validator::make(['id' => $id], ['id' => 'required|integer|min:1'], [
            'id.required' => 'El campo id es obligatorio',
            'id.integer' => 'El campo id debe ser entero',
            'id.min' => 'El campo id debe ser mínimo 1'
        ]);

        if ($valid->fails()) {
            return response()->json([
                'state' => 422,
                'msg' => $valid->errors()->all(),
                'title' => 'Campos inválidos'
            ], 422);
        }

        $obj = $this->tipocolleccionService->obtenerRecurso($id);

        return response()->json($obj, 200);
    }

    // Listar todos
    // Listar todos
public function listarTodo(Request $request)
{
    // Valores por defecto
    $page = $request->input('page', 1);
    $numero_items = $request->input('numero_items', 10);
    $find = $request->input('find', '');
    $estado = $request->input('estado', '');

    // Validación opcional solo para tipos
    $valid = Validator::make([
        'page' => $page,
        'numero_items' => $numero_items
    ], [
        'page' => 'integer|min:1',
        'numero_items' => 'integer|min:1'
    ], [
        'page.integer' => 'El campo página debe ser tipo entero',
        'page.min' => 'El campo página debe ser mínimo 1',
        'numero_items.integer' => 'El campo número de registros debe ser tipo entero',
        'numero_items.min' => 'El campo número de registros debe ser mínimo 1'
    ]);

    if ($valid->fails()) {
        return response()->json([
            'state' => 422,
            'msg' => $valid->errors()->all(),
            'title' => 'Campos con valores incorrectos'
        ], 422);
    }

    $array_data = $this->tipocolleccionService->listarTodo($find, $estado, $page, $numero_items);

    return response()->json($array_data, 200);
}


    // Eliminar recursos
    public function eliminar(Request $request)
    {
        $valid = Validator::make($request->all(), [
            "array_ids" => "required|array|min:1",
            "array_ids.*" => "integer"
        ], [
            "array_ids.required" => "Los identificadores son obligatorios",
            "array_ids.array" => "Los identificadores deben enviarse en array",
            "array_ids.*.integer" => "El identificador :input debe ser un entero"
        ]);

        if ($valid->fails()) {
            return response()->json([
                "state" => 422,
                "msg" => $valid->errors()->all()
            ], 422);
        }

        $out_put = $this->tipocolleccionService->eliminar($request['array_ids']);

        return response()->json($out_put, 200);
    }

    // Cambiar estado
    public function cambiarEstado(UpdatePostRequestColleccion $request, $id)
    {
        $valid = Validator::make(['id' => $id], ['id' => 'required|integer|min:1'], [
            "id.required" => "El campo id es obligatorio",
            "id.integer" => "El campo id debe ser entero",
            "id.min" => "El campo id debe ser mínimo 1"
        ]);

        if ($valid->fails()) {
            return response()->json([
                "state" => 422,
                "msg" => $valid->errors()->all(),
                "title" => "Campos con valores incorrectos"
            ], 422);
        }

        $obj = $this->tipocolleccionService->cambiarEstado($id, $request["estado"]);

        return response()->json($obj, 200);
    }
}
?>
