<?php

namespace App\Http\Controllers;

use App\Models\ColleccionView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Service\ViewService;
use App\Service\TipoColleccionService;
use Illuminate\Support\Facades\Validator;

class ViewController extends Controller
{
    protected $viewService;
    protected $tipoColleccionService;

    public function __construct(ViewService $viewService, TipoColleccionService $tipoColleccionService)
    {
        $this->viewService = $viewService;
        $this->tipoColleccionService = $tipoColleccionService;
    }

    /**
     * ✅ Registrar una nueva vista de colección
     */
    public function guardar(Request $request, $colleccionId)
    {
        $userId = Auth::check() ? Auth::id() : null;
        $ipAddress = $request->ip();

        $output = $this->viewService->guardar((object)[
            'colleccion_id' => $colleccionId,
            'user_id' => $userId,
            'ip_address' => $ipAddress
        ]);

        return response()->json([
            'msg' => ['Vista registrada exitosamente'],
            'obj' => $output
        ], 202);
    }

    /**
     * ✅ Obtener todas las vistas de una colección específica
     */
    public function obtenerRecurso(Request $request, $colleccionId)
    {
        $array_mensajes = [
            'colleccionId.required' => 'El campo colleccionId es obligatorio',
            'colleccionId.integer' => 'El campo colleccionId debe ser entero',
            'colleccionId.min' => 'El campo colleccionId debe ser mínimo 1'
        ];

        $valid = Validator::make(
            ['colleccionId' => $colleccionId],
            ['colleccionId' => 'required|integer|min:1'],
            $array_mensajes
        );

        if ($valid->fails()) {
            return response()->json([
                'msg' => $valid->errors()->all(),
                'obj' => null
            ], 422);
        }

        $output = ColleccionView::where('colleccion_id', $colleccionId)
            ->with(['coleccion'])
            ->orderBy('created_at', 'desc')
            ->get();

        if ($output->isEmpty()) {
            return response()->json([
                'msg' => ['No se encontraron registros'],
                'obj' => null
            ], 404);
        }

        return response()->json([
            'msg' => ['Registros obtenidos exitosamente'],
            'obj' => $output
        ], 202);
    }

    /**
     * ✅ Listar todas las vistas (paginadas)
     */
     public function listarTodo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'required|integer|min:1',
            'numero_items' => 'required|integer|min:1',
            'find' => 'nullable|string',
            'estado' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'state' => 422,
                'msg' => $validator->errors()->all(),
                'title' => 'Campos inválidos'
            ], 422);
        }

        $page = $request->input('page');
        $numero_items = $request->input('numero_items');
        $find = $request->input('find', '');
        $estado = $request->input('estado', '');

        $result = $this->viewService->listarTodo($find, $estado, $page, $numero_items);

        return response()->json([
            'state' => 202,
            'msg' => ['Registros obtenidos exitosamente'],
            'obj' => $result
        ], 202);
    }


    /**
     * ✅ Eliminar una o varias vistas
     */
    public function eliminar(Request $request, $id = null)
    {
        $ids = $id ? [$id] : $request->input("ids", []);

        if (empty($ids)) {
            return response()->json([
                "state" => 422,
                "msg" => ["Los identificadores son obligatorios"]
            ], 422);
        }

        $this->viewService->eliminar($ids);

        return response()->json([
            "state" => 200,
            "msg" => ["Eliminado correctamente"]
        ]);
    }

    /**
     * ✅ Cambiar el estado de una vista (por ejemplo activar/desactivar)
     */
    public function cambiarEstado(Request $request, $id)
    {
        $valid = Validator::make(
            ["id" => $id],
            ["id" => "required|integer|min:1"],
            [
                "id.required" => "El campo id es obligatorio",
                "id.integer" => "El campo id debe ser entero",
                "id.min" => "El campo id debe ser mínimo 1"
            ]
        );

        if ($valid->fails()) {
            return response()->json([
                "state" => 422,
                "msg" => $valid->errors()->all(),
                "title" => "Campos con valores incorrectos"
            ], 422);
        }

        $obj = $this->viewService->cambiarEstado($id, $request->input("estado"));

        return response()->json($obj, 202);
    }
}
