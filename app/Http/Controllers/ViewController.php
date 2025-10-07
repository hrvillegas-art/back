<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Service\ViewService;
use App\Service\TipoColleccionService;

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
        $colleccionId = (int)$colleccionId;
        $userId = Auth::check() ? Auth::id() : null;
        $ipAddress = $request->ip();

        try {
            $output = $this->viewService->guardar((object)[
                'colleccion_id' => $colleccionId,
                'user_id' => $userId,
                'ip_address' => $ipAddress
            ]);

            return response()->json([
                'state' => 202,
                'msg' => ['Vista registrada exitosamente'],
                'obj' => $output
            ], 202);

        } catch (\Exception $ex) {
            return response()->json([
                'state' => 500,
                'msg' => ['Error al registrar la vista'],
                'error' => $ex->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Obtener todas las vistas de una colección específica
     */
    public function obtenerRecurso(Request $request, $colleccionId)
    {
        $validator = Validator::make(
            ['colleccion_id' => $colleccionId],
            ['colleccion_id' => 'required|integer|min:1'],
            [
                'colleccion_id.required' => 'El campo colleccionId es obligatorio',
                'colleccion_id.integer' => 'El campo colleccionId debe ser entero',
                'colleccion_id.min' => 'El campo colleccionId debe ser mínimo 1',
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                'state' => 422,
                'msg' => $validator->errors()->all()
            ], 422);
        }

        try {
            $output = $this->viewService->obtenerRecurso($colleccionId);

            if ($output->isEmpty()) {
                return response()->json([
                    'state' => 404,
                    'msg' => ['No se encontraron registros'],
                    'obj' => null
                ], 404);
            }

            return response()->json([
                'state' => 202,
                'msg' => ['Registros obtenidos exitosamente'],
                'obj' => $output
            ], 202);

        } catch (\Exception $ex) {
            return response()->json([
                'state' => 500,
                'msg' => ['Error al obtener los registros'],
                'error' => $ex->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Listar todas las vistas (paginadas)
     */
    public function listarTodo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:1',
            'numero_items' => 'integer|min:1',
            'find' => 'nullable|string',
            'estado' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'state' => 422,
                'msg' => $validator->errors()->all(),
            ], 422);
        }

        $page = $request->input('page', 1);
        $numero_items = $request->input('numero_items', 10);
        $find = $request->input('find', '');
        $estado = $request->input('estado', '');

        try {
            $result = $this->viewService->listarTodo($find, $estado, $page, $numero_items);

            return response()->json([
                'state' => 202,
                'msg' => ['Registros obtenidos exitosamente'],
                'obj' => $result
            ], 202);

        } catch (\Exception $ex) {
            return response()->json([
                'state' => 500,
                'msg' => ['Error al obtener las estadísticas'],
                'error' => $ex->getMessage()
            ], 500);
        }
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

        try {
            $this->viewService->eliminar($ids);

            return response()->json([
                "state" => 200,
                "msg" => ["Eliminado correctamente"]
            ], 200);

        } catch (\Exception $ex) {
            return response()->json([
                "state" => 500,
                "msg" => ["Error al eliminar el recurso"],
                "error" => $ex->getMessage()
            ], 500);
        }
    }

    /**
     * ✅ Cambiar el estado de una vista
     */
    public function cambiarEstado(Request $request, $id)
    {
        $validator = Validator::make(
            ["id" => $id, "estado" => $request->input("estado")],
            ["id" => "required|integer|min:1", "estado" => "required|in:0,1"],
            [
                "id.required" => "El campo id es obligatorio",
                "id.integer" => "El campo id debe ser entero",
                "id.min" => "El campo id debe ser mínimo 1",
                "estado.required" => "El campo estado es obligatorio",
                "estado.in" => "El estado debe ser 0 o 1"
            ]
        );

        if ($validator->fails()) {
            return response()->json([
                "state" => 422,
                "msg" => $validator->errors()->all()
            ], 422);
        }

        try {
            $obj = $this->viewService->cambiarEstado($id, $request->input("estado"));

            return response()->json([
                "state" => 202,
                "msg" => ["Estado actualizado correctamente"],
                "obj" => $obj
            ], 202);

        } catch (\Exception $ex) {
            return response()->json([
                "state" => 500,
                "msg" => ["Error al cambiar el estado"],
                "error" => $ex->getMessage()
            ], 500);
        }
    }
}
