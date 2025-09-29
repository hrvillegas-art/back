<?php
namespace App\Repositories\Colleccion;

use App\Models\Colleccion;
use App\Repositories\Colleccion\ColleccionInterface;
use App\Models\TipoColleccion;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\ExceptionServer;
use Illuminate\Database\QueryException;
use Carbon\Carbon;



class ColleccionRepository implements ColleccionInterface
{
    protected $model;

    public function __construct(Colleccion $colleccion)
    {
        $this->model = $colleccion;
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

        if ($obj) {
            // Lógica de ACTUALIZACIÓN
            $obj->usuariomodificacion = $obj_data->usuariomodificacion;
            $obj->ipmodificacion = $obj_data->ipmodificacion;
        } else {
            // Lógica de CREACIÓN
                $obj = new $this->model();
                $obj->usuariocreacion = $obj_data->usuariocreacion;
                $obj->usuariomodificacion = $obj_data->usuariomodificacion;
                $obj->ipcreacion = $obj_data->ipcreacion;
                $obj->ipmodificacion = $obj_data->ipmodificacion;
            }
             
                // $obj->id = $obj_data->lineamiento_id; 
                // $obj->codigo = $obj_data->codigo; 
                $obj->nombre = $obj_data->nombre; 
                $obj->descripcion = $obj_data->descripcion; 
                $obj->tipocolleccion_id = $obj_data->tipocolleccion_id;

            $obj->save();
            $obj->refresh();

            return $obj;
        } catch (\Exception $ex) {
        // ... (Manejo de excepciones)
    }
}
/*             $error_code = $ex->errorInfo[0];
            $error_msg = $ex->getMessage();

            switch (intval($error_code)) {
    case 1062: // Duplicidad
        throw new ExceptionServer(
            basename(__FILE__, ".php"),
            ["El recurso que desea agregar ya existe", $error_msg],
            409,
            "Duplicidad de recursos"
        );
    break;
    default:
        throw new ExceptionServer(
            basename(__FILE__, ".php"),
            ["No se puede realizar esta operación, comuníquese con el administrador del sistema"],
            500,
            "Fallo de servicio",
            "LOG",
            $error_msg
        );
    break;
}

        }
    }
 */
    public function selectBase()
    {
            return  $this->model::orderBy("colleccion.id", "desc")
                    ->select("colleccion.id",
                    "colleccion.nombre",
                    "colleccion.descripcion",
                    "colleccion.tipocolleccion_id",
                    "colleccion.estado",
                    "colleccion.fechacreacion",
                    "colleccion.usuariocreacion",
                    "colleccion.fechamodificacion",
                    "colleccion.usuariomodificacion",
                    "colleccion.ipcreacion",
                    "colleccion.ipmodificacion");
    }

    public function obtenerRecurso($id)
    {
        $obj = null;

        try
        {
            $obj =  $this->selectBase()->find($id);

            if ($obj == null)
            {
                throw new ExceptionServer(basename(__FILE__, ".php"),["Recurso no encontrado"],404,"Recurso no encontrado");
            }
        }
        catch (QueryException $ex) 
        {
      $error_code = $ex->errorInfo[1]; // en MySQL el código de error está en [1]

            $error_msg = $ex->getMessage();

            throw new ExceptionServer(basename(__FILE__, ".php"),["En el momento no se puede realizar esta operación, comuníquese con el administrador del sistema"],500,"Fallo de servicio","LOG", $error_msg);
        }

        return $obj;

    }

    public function listarTodo($find, $estado, $page, $numero_items)
    {
        try
        {
            $query = $this->selectBase()    
                          ->where("colleccion.nombre", "like", "%".$find."%"); 
       
            if ($estado != ""){
               $query = $query->where("colleccion.estado", $estado);
            }
           
            $array_data = $query->paginate($numero_items);

            return $array_data;
        
        }
        catch (QueryException $ex) 
        {
            $error_code = $ex->errorInfo[0];
            $error_msg = $ex->getMessage();

            throw new ExceptionServer(basename(__FILE__, ".php"),[$ex, "En el momento no se puede realizar esta operación, comuníquese con el administrador del sistema"],500,"Fallo de servicio","LOG", $error_msg);
        }
    }
  
    public function eliminar($array_ids)
    {
        try
        {
            return $this->model->destroy($array_ids);
        }
        catch (QueryException $ex) 
        {
            $error_code = $ex->errorInfo[0];
            $error_msg = $ex->getMessage();

            switch (intval($error_code)) {
    case 1451: // Violación de llave foránea en MySQL
        throw new ExceptionServer(
            basename(__FILE__, ".php"),
            ["Algunos de los datos tienen relaciones y no es posible su eliminación"],
            409,
            "Error al eliminar"
        );
    break;
    default:
        throw new ExceptionServer(
            basename(__FILE__, ".php"),
            ["No se puede realizar esta operación, comuníquese con el administrador del sistema"],
            500,
            "Fallo de servicio",
            "LOG",
            $error_msg
        );
    break;
}

        }

    }

    public function cambiarEstado($id, $val)
    {
        $obj = null;

        try
        {
            if (null == $obj = $this->model->find($id)) {
                throw new ExceptionServer(basename(__FILE__, ".php"),["El recurso no existe"],404,"Recurso no encontrado");
            }

            $obj->estado = $val;

            $obj->save();
            $obj->refresh();
        }
        catch (QueryException $ex) 
        {
            $error_code = $ex->errorInfo[0];
            $error_msg = $ex->getMessage();

            throw new ExceptionServer(basename(__FILE__, ".php"),["En el momento no se puede realizar esta operación, comuníquese con el administrador del sistema"],500,"Fallo de servicio","LOG", $error_msg);
        }

        return $obj;

    }

}
?>
