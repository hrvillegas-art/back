<?php
namespace App\Service;

use App\Exceptions\ExceptionServer;
use Carbon\Carbon;
use App\Helpers\Service;

class AutorizacionService
{
    protected $repository;
    private $modulo_principal;

    public function __construct()
    {
        $this->modulo_principal = [];
    }

    public function login($obj_data, $tipo)
    {
        $array_out = Service::POST(config('app.apiautorizacion').'login', $obj_data);

        $array_funcionalidad = $array_out->funcionalidades;
        
        foreach ($array_funcionalidad as $key => $value)
        {
            $this->obtenerModuloPrincipal($value->modulo_id, $value->modulo, $value->modulo_url);
        }

        $this->obtenerMenus($array_funcionalidad);

        $array_out->menu = (object) $this->modulo_principal;

        return $array_out;
    }

    public function validarUsuarioGmail($obj_data)
    {
        //$array_out = $this->repository->login($obj_data, 'gmail');
        $array_out = Service::POST(config('app.apiautorizacion').'login_correo', $obj_data);

        $array_funcionalidad = $array_out->funcionalidades;
        
        foreach ($array_funcionalidad as $key => $value)
        {
            $this->obtenerModuloPrincipal($value->modulo_id, $value->modulo, $value->modulo_url);
        }

        $this->obtenerMenus($array_funcionalidad);

        $array_out->menu = (object) $this->modulo_principal;

        return $array_out;
    }

    public function obtenerMenus($array_funcionalidad)
    {
        $array_menus = [];

        foreach ($this->modulo_principal as $key => $value)
        {
            $value->menu = $this->menus($array_funcionalidad, $value->modulo_id);
        }
    }

    public function menus($array_funcionalidad, $modulo_id)
    {
        $menu_modulo = [];
        
        foreach ($array_funcionalidad as $key => $value)
        {
            if($value->modulo_id == $modulo_id && $value->menu != null)
            {
                $array_menu = [];

                if ($value->menu_id != null)
                {
                    $array_menu = $this->submenu($array_funcionalidad, $value->menu_id);
                }

                $menu_modulo[] = (object) ["menu" =>$value, "sub_menu" => $array_menu];
            }
        }

        return $menu_modulo;
    }

    public function submenu($array_funcionalidad, $menu_id)
    {
        $array_submenu = [];

        foreach ($array_funcionalidad as $key => $value)
        {
            if ($value->submenu_id == $menu_id)
            {
                $array_menu = [];

                if ($value->menu_id != null)
                {
                    $array_menu = $this->submenu($array_funcionalidad, $value->menu_id);
                }

                $array_submenu [] = (object) ["menu" =>$value, "sub_menu" => $array_menu];
            }
        }

        return $array_submenu;
    }

    public function obtenerModuloPrincipal($modulo_id, $modulo, $modulo_url)
    {
        $existe = false; 

        foreach ($this->modulo_principal as $key => $value)
        {
            if ($value->modulo_id == $modulo_id)
            {
                $existe = true;
                break;
            }
        }

        if (!$existe)
        {
            $this->modulo_principal[] = (object)["modulo_id" => $modulo_id, "modulo" => $modulo, "url" => $modulo_url,"menu" =>[]];
        }
    }
}
?>
