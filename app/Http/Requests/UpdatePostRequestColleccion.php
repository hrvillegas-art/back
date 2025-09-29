<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Exceptions\ExceptionServer;

class UpdatePostRequestColleccion extends FormRequest
{
    private $maximotamanio;

    public function __construct()
    {
        // Tamaño máximo de subida de archivos en bytes
        $this->maximotamanio = intval(ini_get('upload_max_filesize')) * 1024 * 1024;
    }

    /**
     * Verifica que la petición sea AJAX
     */
    public function isajax()
    {
        if (!$this->ajax()) {
            throw new ExceptionServer(
                "UpdatePostRequestColleccion",
                ["La petición debe ser enviada mediante AJAX"],
                400,
                "Petición inválida",
                ""
            );
        }
    }

    /**
     * Determina si el usuario está autorizado a realizar la petición
     */
    public function authorize()
    {
        // Cambiar según lógica de autorización
        return true;
    }

    /**
     * Reglas de validación para update
     */
    public function rules()
    {
        return [
            "id" => "sometimes|integer|min:1",
            "nombre" => "sometimes|max:255",
            "acronimo" => "sometimes|max:20",
            "registro" => "sometimes|max:20",
            "entidad" => "sometimes|max:30",
            "pais" => "sometimes|max:30",
            "departamento" => "sometimes|max:30",
            "ciudad" => "sometimes|max:30",
            
        ];
    }

    /**
     * Mensajes personalizados
     */
    public function messages()
    {
        return [
            "id.integer" => "El campo id debe ser numérico si se envía",
            "id.min" => "El campo id debe ser mayor a 0 si se envía",

            "nombre.max" => "El campo Nombre máximo de 255 caracteres",
            "acronimo.max" => "El campo Acrónimo máximo de 20 caracteres",
            "registro.max" => "El campo Registro máximo de 20 caracteres",
            "entidad.max" => "El campo Entidad máximo de 30 caracteres",
            "pais.max" => "El campo País máximo de 30 caracteres",
            "departamento.max" => "El campo Departamento máximo de 30 caracteres",
            "ciudad.max" => "El campo Ciudad máximo de 30 caracteres",
        ];
    }
}
