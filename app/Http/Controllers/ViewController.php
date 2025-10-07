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
     * Registrar una nueva vista
     */
    public function guardar(Request $request, $colleccionId)
    {
        $colleccionId = (int)$colleccionId;
        $userId = Auth::check() ? Auth::id() : null;
        $ipAddress = $request->ip();

        try {
            $output = $this->viewService->guardar((object)[
                'tipo_colleccion_id' => $colleccionId,
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
     * Obtener vistas por colección
     */
    public function obtenerRecurso(Request $request, $colleccionId)
    {
        $validator = Validator::make(
            ['colleccion_id' => $colleccionId],
            ['colleccion_id' => 'required|integer|min:1']
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
     * Listar todas las vistas (paginadas) compatible con Vue
     */
    // ... (código anterior del controlador)

    /**
     * Listar todas las vistas (paginadas) compatible con Vue
     */
    public function listarTodo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page' => 'integer|min:1',
            'numero_items' => 'integer|min:1',
            // 🚀 Usamos 'tipo_colleccion_id' para el filtro, ya que el frontend lo envía
            'tipo_colleccion_id' => 'nullable|integer|min:1',
            'find' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'state' => 422,
                'msg' => $validator->errors()->all(),
            ], 422);
        }

        $page = $request->input('page', 1);
        $numero_items = $request->input('numero_items', 10);
        $find = $request->input('find', ''); // Se puede usar para buscar por nombre
        
        // 🚀 Capturamos el nuevo filtro que envía Vue
        $tipo_colleccion_id = $request->input('tipo_colleccion_id');

        try {
            // 💡 LLAMAMOS AL MÉTODO DEL SERVICIO QUE YA TIENE LA LÓGICA DE AGRUPACIÓN.
            // Asumiendo que tu ViewService llama a ViewRepository::listarTodo
            $result = $this->viewService->listarTodo(
                $find, // Filtro por nombre (si lo implementas en el servicio)
                '',     // Estado (no usado aquí)
                $page,
                $numero_items,
                $tipo_colleccion_id // El ID de tipo de colección para filtrar
            );

            return response()->json([
                'state' => 202,
                'msg' => ['Registros obtenidos exitosamente'],
                'obj' => $result
            ], 202);

        } catch (\Exception $ex) {
            // Si tu ViewRepository ya lanza el 400 por ID inválido, este catch lo ignora.
            // Si el error es un 500, lo devuelve.
            return response()->json([
                'state' => 500,
                'msg' => ['Error al obtener las estadísticas'],
                'error' => $ex->getMessage()
            ], 500);
        }
    }
// ... (código restante del controlador)
    /**
     * Eliminar vistas
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
}
