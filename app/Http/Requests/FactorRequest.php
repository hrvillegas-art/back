<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Exceptions\ExceptionServer;

class FactorRequest extends FormRequest
{
    private $maximotamanio;

    public function __construct()
    {
       $this->maximotamanio = intval(ini_get('upload_max_filesize'))*1020*1020;
    }

    public function isajax()
    {
        if(!$this->ajax())
        {
            throw new ExceptionServer("FactorRequest",["La peticion debe ser enviada mediante ajax"], 400, "Petición invalida", "");
        }
    }

    /**
    * Determine if the user is authorized to make this request.
    *
    * @return bool
    */
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [ 
                    "id" => "required|integer|min:0",
                    "lineamiento_id" => "required|integer|min:0",
                    "codigo" => "required|max:255",
                    "nombre" => "required|max:255",
                    "descripcion" => "required|max:6000" 
        ];
    }

    public function messages()
    {
        return [
                "id.required" =>"El campo id es obligatorio",
                "id.integer" =>"El campo id de ser númerico",
                "id.min" =>"El campo id debe ser mayor a 0(cero)",
                "lineamiento_id.required" =>"El campo de lineamiento es obligatorio",
                "lineamiento_id.integer" =>"El campo de lineamiento de ser númerico",
                "lineamiento_id.min" =>"El campo de lineamiento debe ser mayor a 0(cero)",
                "codigo.required" =>"El campo Código del tipo de factor es obligatorio",
                "codigo.max" =>"El campo Código del tipo de factor maximo de 255",
                "nombre.required" =>"El campo Nombre del tipo de factor es obligatorio",
                "nombre.max" =>"El campo Nombre del tipo de factor maximo de 255",
                "descripcion.required" =>"El campo Descripción del tipo de factor es obligatorio",
                "descripcion.max" =>"El campo Descripción del tipo de factor maximo de 6000" 
        ];
    }

}
?>
