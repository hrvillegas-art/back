<?php

namespace App\Service;

use App\Repositories\View\ViewInterface;
use App\Exceptions\ExceptionServer;

class ViewService
{
    protected $repository;

    public function __construct(ViewInterface $Viewinterface)
    {
        $this->repository = $Viewinterface;
    }

    /**
     * Guardar nueva vista
     */
    public function guardar($obj_data)
    {
        try {
            return $this->repository->guardar($obj_data);
        } catch (ExceptionServer $ex) {
            throw $ex;
        }
    }

    /**
     * Obtener recurso por ID
     */
    public function obtenerRecurso($id)
    {
        return $this->repository->obtenerRecurso($id);
    }

    /**
     * Listar todas las vistas
     */
  public function listarTodo($find = '', $estado = '', $page = 1, $numero_items = 10)
    {
        try {
            return $this->repository->listarTodo($find, $estado, $page, $numero_items);
        } catch (ExceptionServer $ex) {
            throw $ex;
        }
    }

    /**
     * Eliminar recurso(s)
     */
    public function eliminar($array_ids)
    {
        return $this->repository->eliminar($array_ids);
    }

    /**
     * Cambiar estado de recurso
     */
    public function cambiarEstado($id, $val)
    {
        return $this->repository->cambiarEstado($id, $val);
    }
}
