<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Colleccion;
use App\Service\ColleccionService;
use App\Models\Tipocolleccion;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Support\Facades\Validator;

class ColleccionController extends Controller
{
 
    /**
     * @var ColleccionService
     */
    protected $colleccionService;
    
    public function __construct(ColleccionService $colleccionService) {

        $this->colleccionService = $colleccionService;
    }

    /**
     * Permite guardar y actualizar un recurso.
     *
     * @return \Illuminate\Http\Response
     */
   public function guardar(StorePostRequest $request)
   {
        $user_id = 1;
        $output =  $this->colleccionService->guardar( (object)
            [  
                'id' => $request['id'] ,   
                'nombre' => $request['nombre'] ,   
                'descripcion' => $request['descripcion'] , 
                'tipocolleccion_id' => $request['tipocolleccion_id'] ,
                'estado' => $request['estado'] ,
                'usuariocreacion' =>$user_id,
                'usuariomodificacion' => $user_id,
                'ipmodificacion' => $request->getClientIp(),
                'ipcreacion' => $request->getClientIp()
                  
            ]
        );

        return \response()->json([
            'msg' => $request['id'] > 0 ? ['Datos actualizados exitosamente'] :['Datos guardados exitosamente'],
            'obj' =>  $output
        ],202);
    }

    
    /**
     * Obtiene un recurso por su ID.
     *
     * @param ManageResourceRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function obtenerRecurso(ManageResourceRequest $request, int $id): JsonResponse
    {
        // La validación del ID se maneja por el FormRequest
        $obj = $this->colleccionService->obtenerRecurso($id);

        return response()->json($obj, 200);
    }

    /**
     * Lista todos los recursos con filtros.
     *
     * 
    /** */
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

    $array_data = $this->colleccionService->listarTodo($find, $estado, $page, $numero_items);

    return response()->json($array_data, 200);
    }

    
    public function eliminar(Request $request, $id = null)
    {
        // Caso 1: eliminar por ID en la URL
        if ($id) {
            $ids = [$id];
        } else {
            $ids = $request->input("ids", []);
        }

        if (empty($ids)) {
            return response()->json([
                "state" => 422,
                "msg"   => ["Los identificadores son obligatorios"]
            ], 422);
        }

        $this->colleccionService->eliminar($ids);

        return response()->json([
            "state" => 200,
            "msg"   => ["Eliminado correctamente"]
        ]);
    }
  public function cambiarEstado(Request $request, $id)
    {
        $array_mensajes = [
            "id.required" => "El campo id es obligatorio",
            "estado.required" => "El campo estado es obligatorio",
            "id.integer" => "El campo id debe ser entero",
            "id.min" => "El campo id debe ser minimo 1"
        ];

        $valid = Validator::make(
            array("id" => $id),
            [
                "id" => "required|integer|min:1"
            ],
            $array_mensajes);

        if ($valid->fails())
        {
            return \response()->json([
                "state" => 422,
                "msg" => $valid->errors()->all(),
                "title" => "Campos con valores incorrectos"
            ],422);
        }

        $obj = $this->colleccionService->cambiarEstado($id, $request["estado"]);

        return \response()->json(
            $obj
        ,202);
    }

}
?>
