<?php
namespace App\Service;

use App\Repositories\TipoColleccion\TipoColleccionInterface;

class TipoColleccionService
{
    protected $repository;

    public function __construct(TipoColleccionInterface $tipocolleccioninterface)
    {
        $this->repository = $tipocolleccioninterface;
    }

    public function guardar($obj_data)
    {
        return $this->repository->guardar($obj_data);
    }

    public function obtenerRecurso($id)
    {
        return $this->repository->obtenerRecurso($id);
    }

    public function listarTodo($find, $estado, $page, $numero_items)
    {
        return $this->repository->listarTodo($find, $estado, $page, $numero_items);
    }

    public function eliminar($array_ids)
    {
        return $this->repository->eliminar($array_ids);
    }

    public function cambiarEstado($id, $val)
    {
        return $this->repository->cambiarEstado($id, $val);
    }
}
?>
