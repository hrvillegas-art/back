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
            // Convertir stdClass a array si es necesario
            if ($obj_data instanceof \stdClass) {
                $obj_data = (array) $obj_data;
            }

            // Validación de campos obligatorios
            if (!isset($obj_data['colleccion_id'])) {
                throw new \Exception('El campo colleccion_id es obligatorio');
            }

            // Verificar que la colección exista
            if (!Tipocolleccion::where('id', $obj_data['colleccion_id'])->exists()) {
                throw new \Exception("El colleccion_id {$obj_data['colleccion_id']} no existe");
            }

            // Log de los datos antes de guardar
            Log::info('ViewRepository::guardar - Datos a insertar', $obj_data);

            // Crear registro
            $vista = $this->model->create([
                'colleccion_id' => $obj_data['colleccion_id'],
                'user_id' => $obj_data['user_id'] ?? null,
                'ip_address' => $obj_data['ip_address'] ?? null,
            ]);

            Log::info('ViewRepository::guardar - Registro guardado correctamente', [
                'id' => $vista->id,
                'datos' => $obj_data
            ]);

            return $vista;

        } catch (QueryException $ex) {
            Log::error('ViewRepository::guardar - Error de base de datos', [
                'message' => $ex->getMessage(),
                'line' => $ex->getLine(),
                'file' => $ex->getFile(),
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
            Log::error('ViewRepository::guardar - Error general', [
                'message' => $ex->getMessage(),
                'line' => $ex->getLine(),
                'file' => $ex->getFile(),
                'datos' => $obj_data,
            ]);

            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error al guardar la vista"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
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
    public function listarTodo($find = '', $estado = '', $page = 1, $numero_items = 10)
    {
        try {
            $query = $this->model
                ->selectRaw('colleccion_id, COUNT(*) as total_vistas, MAX(created_at) as ultimo_registro')
                ->with(['coleccion' => function($q) use ($find, $estado) {
                    if ($find !== '') {
                        $q->where('nombre', 'like', "%$find%");
                    }
                    if ($estado !== '') {
                        $q->where('estado', $estado);
                    }
                }])
                ->groupBy('colleccion_id')
                ->orderByDesc('total_vistas');

            return $query->paginate($numero_items, ['*'], 'page', $page);

        } catch (\Exception $ex) {
            Log::error('ViewRepository::listarTodo - Error', [
                'message' => $ex->getMessage(),
                'line' => $ex->getLine(),
                'file' => $ex->getFile(),
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
