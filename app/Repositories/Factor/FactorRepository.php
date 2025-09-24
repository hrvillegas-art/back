<?php
namespace App\Repositories\Factor;

use App\Models\Factor;
use App\Repositories\Factor\FactorInterface;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Exceptions\ExceptionServer;
use Illuminate\Database\QueryException;
use Carbon\Carbon;

class FactorRepository implements FactorInterface
{
    protected $model;

    public function __construct(Factor $factor)
    {
        $this->model = $factor;
    }

    public function guardar($obj_data)
    {
        $error_code = "";
        $error_msg = "";

        try {

            if ($obj_data->id > 0)
            {
                if (null == $obj = $this->model->find($obj_data->id)) {
                    throw new ExceptionServer(basename(__FILE__, ".php"),["El recurso a actualizar no existe"],404,"Recurso no encontrado");
                }

                $obj->usuariomodificacion = $obj_data->usuariomodificacion;
                $obj->ipmodificacion = $obj_data->ipmodificacion;
            }
            else
            {
                $obj = new $this->model();
                $obj->usuariocreacion = $obj_data->usuariocreacion;
                $obj->usuariomodificacion = $obj_data->usuariomodificacion;
                $obj->ipcreacion = $obj_data->ipcreacion;
                $obj->ipmodificacion = $obj_data->ipmodificacion;
            }
             
                $obj->lineamiento_id = $obj_data->lineamiento_id; 
                $obj->codigo = $obj_data->codigo; 
                $obj->nombre = $obj_data->nombre; 
                $obj->descripcion = $obj_data->descripcion; 

            $obj->save();
            $obj->refresh();

            return $obj;
        }
        catch (QueryException $ex) 
        {
            $error_code = $ex->errorInfo[0];
            $error_msg = $ex->getMessage();

            switch(intval($error_code))
            {
                case 23505: // Llave unique violada
                    throw new ExceptionServer(basename(__FILE__, ".php"),["El recurso que desea agregar ya existe",$error_msg],409,"Duplicidad de recursos");
                break;
                default:
                    throw new ExceptionServer(basename(__FILE__, ".php"),["En el momento no se puede realizar esta operación, comuníquese con el administrador del sistema"],500,"Fallo de servicio","LOG", $error_msg);
                break;
            }
        }
    }

    public function selectBase()
    {
            return  $this->model::orderBy("factor.id", "desc")
                    ->select("factor.id",
                    "factor.lineamiento_id",
                    "factor.codigo",
                    "factor.nombre",
                    "factor.descripcion",
                    "factor.estado",
                    "factor.fechacreacion",
                    "factor.usuariocreacion",
                    "factor.fechamodificacion",
                    "factor.usuariomodificacion",
                    "factor.ipcreacion",
                    "factor.ipmodificacion");
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
            $error_code = $ex->errorInfo[0];
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
                          ->where("factor.nombre", "like", "%".$find."%"); 
       
            if ($estado != ""){
               $query = $query->where("factor.estado", $estado);
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

            switch(intval($error_code))
            {
                case 23503: // Violacion de llave foranea
                    throw new ExceptionServer(basename(__FILE__, ".php"),["Algunos de los datos tienen ralaciones y no es posible su eliminación"],409,"Error al eliminar");
                break;
                default:
                    throw new ExceptionServer(basename(__FILE__, ".php"),["En el momento no se puede realizar esta operación, comuníquese con el administrador del sistema"],500,"Fallo de servicio","LOG", $error_msg);
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
