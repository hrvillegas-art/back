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
        $id = (int) ($obj_data->id ?? 0); 
        $obj = null;

        // Buscar si es actualización
        if ($id > 0) {
            $obj = $this->model->find($id);
        }

        if ($obj) {
            // === ACTUALIZACIÓN ===
            $obj->usuariomodificacion = $obj_data->usuariomodificacion ?? $obj->usuariomodificacion;
            $obj->ipmodificacion      = $obj_data->ipmodificacion ?? request()->ip();

            // ✅ permitir cambiar también el usuario de creación
            $obj->usuariocreacion = $obj_data->usuariocreacion ?? $obj->usuariocreacion;
            $obj->ipcreacion      = $obj_data->ipcreacion ?? $obj->ipcreacion;

        } else {
            // === CREACIÓN ===
            $obj = new $this->model();

            $obj->usuariocreacion     = $obj_data->usuariocreacion ?? 'SIN DEFINIR';
            $obj->ipcreacion          = $obj_data->ipcreacion ?? request()->ip();

            $obj->usuariomodificacion = $obj_data->usuariomodificacion ?? $obj->usuariocreacion;
            $obj->ipmodificacion      = $obj_data->ipmodificacion ?? request()->ip();
        }

        // === CAMPOS COMUNES ===
        $obj->nombre       = $obj_data->nombre ?? $obj->nombre;
        $obj->acronimo     = $obj_data->acronimo ?? $obj->acronimo;
        $obj->registro     = $obj_data->registro ?? $obj->registro;
        $obj->entidad      = $obj_data->entidad ?? $obj->entidad;
        $obj->pais         = $obj_data->pais ?? $obj->pais;
        $obj->departamento = $obj_data->departamento ?? $obj->departamento;
        $obj->ciudad       = $obj_data->ciudad ?? $obj->ciudad;
        $obj->estado       = $obj_data->estado ?? $obj->estado;

        $obj->save();
        return $obj;

    } catch (\Exception $ex) {
        throw new ExceptionServer(
            basename(__FILE__, ".php"),
            ["Error al guardar el Tipo de Colección"],
            500,
            "Fallo en repositorio",
            "LOG",
            $ex->getMessage()
        );
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
