<?php

namespace App\Repositories\View;

use App\Models\ColleccionView;
use App\Models\Tipocolleccion;
use App\Exceptions\ExceptionServer;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class ViewRepository implements ViewInterface
{
    protected $model;

    public function __construct(ColleccionView $model)
    {
        $this->model = $model;
    }

    /**
     * Guardar nueva vista
     */
    public function guardar($obj_data)
    {
        try {
            if ($obj_data instanceof \stdClass) {
                $obj_data = (array) $obj_data;
            }

            // Validar colleccion_id obligatorio
            if (!isset($obj_data['colleccion_id']) || $obj_data['colleccion_id'] <= 0) {
                // Esta excepción es la que atrapamos más abajo para devolver 400
                throw new \Exception("El colleccion_id {$obj_data['colleccion_id']} no existe");
            }

            Log::info('ViewRepository::guardar - Datos a insertar', $obj_data);

            $vista = $this->model->create($obj_data);

            Log::info('ViewRepository::guardar - Registro guardado correctamente', [
                'id' => $vista->id,
                'datos' => $obj_data
            ]);

            return $vista;

        } catch (\Illuminate\Database\QueryException $ex) {
            Log::error('ViewRepository::guardar - Error de base de datos', [
                'message' => $ex->getMessage(),
                'datos' => $obj_data,
            ]);

            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error al guardar la vista en la base de datos"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );

        } catch (\Exception $ex) {
            // 🚀 MODIFICACIÓN CRUCIAL: Manejo de errores para datos de entrada inválidos (ID 0)
            $errorMessage = $ex->getMessage();

            if (str_contains($errorMessage, 'colleccion_id') && str_contains($errorMessage, 'no existe')) {
                Log::warning('ViewRepository::guardar - ID de colección inválido', [
                    'message' => $errorMessage,
                    'datos' => $obj_data,
                ]);
                
                throw new ExceptionServer(
                    basename(__FILE__, ".php"),
                    ["ID de colección inválido o faltante"],
                    400, // 👈 Devuelve 400 Bad Request: Error del cliente con los datos
                    "Petición Inválida",
                    "LOG",
                    $errorMessage
                );
            }
            
            // Si es cualquier otra excepción desconocida, mantiene el 500 (fallo interno real)
            Log::error('ViewRepository::guardar - Error general', [
                'message' => $errorMessage,
                'datos' => $obj_data,
            ]);

            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error al guardar la vista"],
                500,
                "Fallo de servicio",
                "LOG",
                $errorMessage
            );
        }
    }


    /**
     * Base select
     */
    public function selectBase()
    {
        return $this->model::orderBy('id', 'asc')
            ->select(
                'colleccion_views.id',
                'colleccion_views.colleccion_id',
                'colleccion_views.user_id',
                'colleccion_views.ip_address',
                'colleccion_views.created_at',
                'colleccion_views.updated_at'
            );
    }

    /**
     * Obtener recurso por ID
     */
    public function obtenerRecurso($id)
    {
        $obj = $this->selectBase()->where('colleccion_views.id', $id)->first();

        if (!$obj) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["El recurso no existe"],
                404,
                "Recurso no encontrado"
            );
        }

        return $obj;
    }

    /**
     * Listar estadísticas de vistas
     */
    public function listarTodo($find = '', $estado = '', $page = 1, $numero_items = 10, $tipocolleccion_id = null)
    {
        try {
            $query = $this->model
                ->with(['colleccion' => function($q) use ($find, $estado, $tipocolleccion_id) {
                    if ($tipocolleccion_id) {
                        // Asumo que esta lógica de filtrado es correcta:
                        $q->where('tipocolleccion_id', $tipocolleccion_id);
                    }
                    if ($find !== '') {
                        $q->where('nombre', 'like', "%$find%");
                    }
                    if ($estado !== '') {
                        $q->where('estado', $estado);
                    }
                }])
                ->selectRaw('tipocolleccion_id, COUNT(*) as total_vistas, MAX(created_at) as ultimo_registro')
                ->groupBy('tipocolleccion_id')
                ->orderByDesc('total_vistas');

            return $query->paginate($numero_items, ['*'], 'page', $page);

        } catch (\Exception $ex) {
            Log::error('Error en ViewRepository::listarTodo', [
                'message' => $ex->getMessage(),
            ]);

            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error al obtener las estadísticas de vistas"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }

    /**
     * Eliminar recurso(s)
     */
    public function eliminar($array_ids)
    {
        try {
            return $this->model->destroy($array_ids);
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error al eliminar el recurso, contacte con el administrador"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }

    /**
     * Cambiar estado del recurso
     */
    public function cambiarEstado($id, $val)
    {
        try {
            $obj = $this->model->find($id);
            if ($obj) {
                $obj->estado = $val;
                $obj->save();
                return $obj;
            }

            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["El recurso no existe"],
                404,
                "Recurso no encontrado"
            );
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error al cambiar el estado, contacte con el administrador"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }
}