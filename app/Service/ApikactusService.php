<?php
namespace App\Service;

use App\Exceptions\ExceptionServer;
use App\Helpers\Service;

class ApikactusService
{
    protected $repository;

    public function __construct(
    )
    {

    }

    public function obtenerEmpleados($find, $page, $numero_items)
    {
        $array_out = Service::GET(env('API_KACTUS', '').'listarfuncionario?find='.$find.'&page='.$page.'&numero_items='.$numero_items);

        return $array_out;
    }
}