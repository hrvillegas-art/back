<?php
namespace App\Service;

use App\Helpers\Service;

class UsuarioService
{
    protected $base_url;
    protected $base_url_cambiarpassword;

    public function __construct()
    {
        $this->base_url = 'usuario';
        $this->base_url_cambiarpassword = 'cambiarpassword';
    }

    public function guardar($obj_data)
    {
        $url = $this->base_url;
        $url_completa = config('app.apiautorizacion').$url;

        return  Service::POST($url_completa, $obj_data);
    }

    public function cambiarpassword($obj_data)
    {
        $url = $this->base_url_cambiarpassword;
        return  Service::POST($url, $obj_data);
    }
    
    public function actualizar($obj_data)
    {
        $url = $this->base_url;
        return  Service::PUT($url, $obj_data);
    }

    public function obtenerRecurso($id)
    {
        $url = $this->base_url.'/'.$id;
        return  Service::GET($url);
    }

    public function listarTodo($find, $page, $numero_items)
    {
        $url = $this->base_url.'?find='.$find.'&page='.$page.'&numero_items='.$numero_items;
        return  Service::GET($url);
    }

    public function eliminar($obj_data)
    {
        $url = $this->base_url;

        return Service::DELETE($url, $obj_data);
    }

    public function cambiarEstado($id, $obj_data)
    {
        $url = $this->base_url.'/'.$id.'/activo';
        return  Service::PUT($url, $obj_data);
    }

    public function cambiarEstadoBloqueado($id, $obj_data)
    {
        $url = $this->base_url.'/'.$id.'/bloqueado';
        return  Service::PUT($url, $obj_data);
    }
    
    public function validarUsuario($correoelectronico)
    {
        $url = 'validarusuario/'.$correoelectronico;

        $url_completa = config('app.apiautorizacion').$url;

        return  Service::GET($url_completa);
    }
}
?>
