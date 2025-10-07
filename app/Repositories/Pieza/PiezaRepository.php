<?php

namespace App\Repositories\Pieza;

use App\Models\Pieza;
use App\Repositories\Pieza\PiezaInterface;
use App\Models\TipoColleccion;
use App\Exceptions\ExceptionServer;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Log;

class PiezaRepository implements PiezaInterface
{
    protected $model;

    public function __construct(Pieza $pieza)
    {
        $this->model = $pieza;
    }

    /**
     * Guarda o actualiza una pieza en la base de datos.
     */
    public function guardar($data)
    {
        try {
            Log::info('Inicio PiezaRepository@guardar', ['data' => (array)$data]);

            $id = (int) ($data->id ?? 0);
            $obj = $id > 0 ? $this->model->find($id) : null;

            if ($obj) {
                Log::info("Actualizando pieza ID {$id}");
                $obj->usuariomodificacion = $data->usuariomodificacion ?? $obj->usuariomodificacion ?? '1';
                $obj->ipmodificacion      = $data->ipmodificacion ?? $obj->ipmodificacion ?? request()->ip();
            } else {
                Log::info("Creando nueva pieza");
                $obj = new $this->model();
                $obj->usuariocreacion     = $data->usuariocreacion ?? '1';
                $obj->ipcreacion          = $data->ipcreacion ?? request()->ip();
                $obj->usuariomodificacion = $data->usuariomodificacion ?? '1';
                $obj->ipmodificacion      = $data->ipmodificacion ?? request()->ip();
                $obj->fechacreacion       = now();
            }

            $campos = [
                'familia','genero','especie','numeroCatalogo','colector','numeroColector',
                'fechaColeccion','reino','division','clase','orden','determinador','pais','departamento',
                'municipio','localidad','altitud','latitud','datumGeodesico','imagen','estado','tipocolleccion_id'
            ];

            foreach ($campos as $campo) {
                if (isset($data->$campo)) {
                    if ($campo === 'fechaColeccion' && !empty($data->$campo)) {
                        $fecha = date_create($data->$campo);
                        if (!$fecha) {
                            throw new ExceptionServer(
                                basename(__FILE__, ".php"),
                                ["Formato de fecha inválido para fechaColeccion: {$data->$campo}"],
                                422,
                                "Validación de datos",
                                "LOG"
                            );
                        }
                        $obj->$campo = $fecha->format('Y-m-d');
                    } else {
                        $obj->$campo = $data->$campo;
                    }
                }
            }

            $obj->save();
            Log::info("Pieza guardada correctamente", ['id' => $obj->id]);

            return $obj;

        } catch (\Illuminate\Database\QueryException $ex) {
            if (($ex->errorInfo[1] ?? 0) == 1062) {
                throw new ExceptionServer(
                    basename(__FILE__, ".php"),
                    ["El número de catálogo ya existe en la base de datos."],
                    400,
                    "Error de validación",
                    "LOG",
                    $ex->getMessage()
                );
            }
            throw $ex;
        } catch (\Exception $ex) {
            Log::error("Excepción en PiezaRepository@guardar", ['exception' => $ex]);
            throw $ex;
        }
    }

    /**
     * Query base con join directo a tipocolleccion
     */
    public function selectBase()
    {
        return $this->model::orderBy("pieza.id", "desc")
            ->leftJoin("tipocolleccion", "tipocolleccion.id", "=", "pieza.tipocolleccion_id")
            ->select(
                "pieza.id",
                "pieza.familia",
                "pieza.genero",
                "pieza.especie",
                "pieza.numeroCatalogo",
                "pieza.colector",
                "pieza.numeroColector",
                "pieza.fechaColeccion",
                "pieza.reino",
                "pieza.division",
                "pieza.clase",
                "pieza.orden",
                "pieza.determinador",
                "pieza.pais",
                "pieza.departamento",
                "pieza.municipio",
                "pieza.localidad",
                "pieza.altitud",
                "pieza.latitud",
                "pieza.datumGeodesico",
                "pieza.imagen",
                "pieza.is_published",
                "pieza.fechacreacion",
                "pieza.estado",
                "pieza.usuariocreacion",
                "pieza.fechamodificacion",
                "pieza.usuariomodificacion",
                "pieza.ipcreacion",
                "pieza.ipmodificacion",
                "tipocolleccion.id as tipocolleccion_id",
                "tipocolleccion.nombre as tipocolleccion_nombre"
            );
    }

    public function obtenerRecurso($id)
    {
        try {
            return $this->selectBase()->find($id);
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error de consulta"],
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
            $query = $this->selectBase()->where("pieza.numeroCatalogo", "like", "%".$find."%");
            if ($estado !== "") {
                $query = $query->where("pieza.estado", $estado);
            }
            return $query->paginate($numero_items);
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error de consulta"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }

    public function eliminar($array_ids)
    {
        return $this->model::destroy($array_ids);
    }

    public function cambiarEstado($id, $val)
    {
        $pieza = $this->model::find($id);
        if ($pieza) {
            $pieza->estado = $val;
            $pieza->save();
            return $pieza;
        }
        return null;
    }

    /**
     * Devuelve las piezas agrupadas en forma de árbol:
     * TipoColleccion → Piezas
     */
    public function listarArbol()
    {
        try {
            $datos = $this->selectBase()->get();

            return $datos->groupBy("tipocolleccion_nombre")->map(function ($piezas) {
                return $piezas->map(function ($pieza) {
                    return [
                        "id" => $pieza->id,
                        "familia" => $pieza->familia,
                        "genero" => $pieza->genero,
                        "especie" => $pieza->especie,
                        "numeroCatalogo" => $pieza->numeroCatalogo,
                        "imagen" => $pieza->imagen,
                    ];
                });
            });
        } catch (QueryException $ex) {
            throw new ExceptionServer(
                basename(__FILE__, ".php"),
                ["Error al generar árbol de piezas"],
                500,
                "Fallo de servicio",
                "LOG",
                $ex->getMessage()
            );
        }
    }
}
