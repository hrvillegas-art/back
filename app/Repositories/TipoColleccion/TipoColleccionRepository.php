<?php
namespace App\Repositories\TipoColleccion;

use App\Models\TipoColleccion;
use App\Repositories\TipoColleccion\TipoColleccionInterface;
use App\Exceptions\ExceptionServer;
use Illuminate\Database\QueryException;

class TipoColleccionRepository implements TipoColleccionInterface
{
    protected $model;

    public function __construct(TipoColleccion $tipocolleccion)
    {
        $this->model = $tipocolleccion;
    }

    public function guardar($obj_data)
{
    try {
        // 1. Intentar obtener el ID (asegurando que sea un entero > 0)
        $id = (int) ($obj_data->id ?? 0); 
        
        $obj = null;
        
        // 2. Si se proporciona un ID válido, intentar encontrar el registro
        if ($id > 0) {
            $obj = $this->model->find($id);
        }

        // 3. Determinar si es una actualización o una creación
        if ($obj) {
            // Lógica de ACTUALIZACIÓN (ya que $obj fue encontrado)
            $obj->usuariomodificacion = $obj_data->usuariomodificacion ?? $obj->usuariomodificacion ?? 1;
            $obj->ipmodificacion      = $obj_data->ipmodificacion ?? $obj->ipmodificacion ?? request()->ip();

            // Asegurar que no se sobrescriban los campos de creación en una actualización
            $obj_data->usuariocreacion = $obj->usuariocreacion;
            $obj_data->ipcreacion      = $obj->ipcreacion;
        } else {
            // Lógica de CREACIÓN (ya que $obj es null o $id era 0)
            $obj = new $this->model();
            
            // Campos de auditoría de CREACIÓN (no sobrescriben los existentes)
            $obj->usuariocreacion     = $obj_data->usuariocreacion ?? 1;
            $obj->ipcreacion          = $obj_data->ipcreacion ?? request()->ip();

            // Campos de auditoría de MODIFICACIÓN también se establecen en la creación
            $obj->usuariomodificacion = $obj_data->usuariomodificacion ?? 1;
            $obj->ipmodificacion      = $obj_data->ipmodificacion ?? request()->ip();
        }

        // 4. Asignar campos comunes y guardar
        // Aquí puedes usar array_merge o fill para simplificar, 
        // pero mantendremos la asignación directa para claridad:
        $obj->nombre       = $obj_data->nombre ?? $obj->nombre;
        $obj->acronimo     = $obj_data->acronimo ?? $obj->acronimo;
        $obj->registro     = $obj_data->registro ?? $obj->registro;
        $obj->entidad      = $obj_data->entidad ?? $obj->entidad;
        $obj->pais         = $obj_data->pais ?? $obj->pais;
        $obj->departamento = $obj_data->departamento ?? $obj->departamento;
        $obj->ciudad       = $obj_data->ciudad ?? $obj->ciudad;
        $obj->estado       = $obj_data->estado ?? $obj->estado; // Asegúrate de que este campo SIEMPRE venga en el payload

        $obj->save();
        return $obj;

    } catch (\Exception $ex) {
        // ... (Manejo de excepciones)
    }
}

public function selectBase()
    {
       return  $this->model::orderBy("tipocolleccion.id", "desc")
                    ->select("tipocolleccion.id",
                    "tipocolleccion.nombre",
                    "tipocolleccion.acronimo",
                    "tipocolleccion.registro",
                    "tipocolleccion.entidad",
                    "tipocolleccion.pais",
                    "tipocolleccion.departamento",
                    "tipocolleccion.ciudad",
                    "tipocolleccion.estado",
                    "tipocolleccion.fechacreacion",
                    "tipocolleccion.usuariocreacion",
                    "tipocolleccion.fechamodificacion",
                    "tipocolleccion.usuariomodificacion",
                    "tipocolleccion.ipcreacion",
                    "tipocolleccion.ipmodificacion"
                );
    }

    public function obtenerRecurso($id)
    {
        try {
            return $this->selectBase()->find($id); // devuelve null si no existe
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error de consulta, contacte con el administrador"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }

    public function listarTodo($find, $estado, $page, $numero_items)
    {
        try {
            $query = $this->selectBase()
                ->where("nombre", "like", "%".$find."%");

            if ($estado !== "") {
                $query = $query->where("estado", $estado);
            }

            return $query->paginate($numero_items);
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error de consulta, contacte con el administrador"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }

    public function eliminar($array_ids)
    {
        try {
            return $this->model->destroy($array_ids);
        } catch (QueryException $ex) {
            $error_code = $ex->errorInfo[0];
            $error_msg  = $ex->getMessage();
            if (intval($error_code) === 23503) {
                throw new ExceptionServer(
                    basename(__FILE__, ".php"),
                    ["Algunos datos tienen relaciones y no se pueden eliminar"],
                    409,
                    "Error al eliminar"
                );
            }
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error de consulta, contacte con el administrador"],
                500,
                "Fallo de servicio",
                "LOG",
                $error_msg
            );
        }
    }

    public function cambiarEstado($id, $val)
    {
        try {
            $obj = $this->model->find($id);
            if (!$obj) return null;

            $obj->estado = $val;
            $obj->save();
            $obj->refresh();

            return $obj;
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error de consulta, contacte con el administrador"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }
}
?>
