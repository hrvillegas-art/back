<?php
namespace App\Repositories;

interface RepositoryInterface
{
    public function listarTodo($find, $estado, $page, $numero_items);

    public function guardar($obj_data);

    public function eliminar($array_ids);

    public function obtenerRecurso($id);

    public function cambiarEstado($id, $val);
}

