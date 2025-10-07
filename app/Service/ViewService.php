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
    // 💡 CORRECCIÓN: Agregar $tipo_colleccion_id a la firma
    public function listarTodo($find = '', $estado = '', $page = 1, $numero_items = 10, $tipo_colleccion_id = null)
    {
        try {
            // 💡 Asegurar que se pase $tipo_colleccion_id al repositorio
            return $this->repository->listarTodo($find, $estado, $page, $numero_items, $tipo_colleccion_id);
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