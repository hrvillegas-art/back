<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use App\Exceptions\ExceptionServer;

class StorePostRequestColleccion extends FormRequest
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
            throw new ExceptionServer("StorePostRequestColleccion",["La peticion debe ser enviada mediante ajax"], 400, "Petición invalida", "");
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
    if ($this->isMethod('post')) { // Crear
        return [
            // No include 'id' here, let the DB handle it.
            "nombre" => "required|max:255",
            "acronimo" => "required|max:20",
            "registro" => "required|max:6000",
            "entidad" => "required|max:255",
            "pais" => "required|max:255",
            "departamento" => "required|max:255",
            "ciudad" => "required|max:255",
            "estado" => "required|in:0,1"
        ];
    }

    if ($this->isMethod('put') || $this->isMethod('patch')) { // Actualizar
        return [
            // The 'id' rule should ideally be on the URL segment, not the body,
            // but if you insist on checking the body ID as 'nullable'/'sometimes'
            // for the update method, it's less critical here.
            "id" => "required|integer|min:1", // It MUST be present for an update
            "nombre" => "sometimes|required|max:255",
            // ... (rest of the rules)
        ];
    }
    return [];

    /* if ($this->isMethod('post')) { // Crear
        return [
            "id" => "nullable|integer|min:1",
            "nombre" => "required|max:255",
            "acronimo" => "required|max:20",
            "registro" => "required|max:6000",
            "entidad" => "required|max:255",
            "pais" => "required|max:255",
            "departamento" => "required|max:255",
            "ciudad" => "required|max:255",
            "estado" => "required|in:0,1"

        ];
    }

    if ($this->isMethod('put') || $this->isMethod('patch')) { // Actualizar
        return [
            "id" => "nullable|integer|min:1",
            "nombre" => "sometimes|required|max:255",
            "acronimo" => "sometimes|required|max:20",
            "registro" => "sometimes|required|max:6000",
            "entidad" => "sometimes|required|max:255",
            "pais" => "sometimes|required|max:255",
            "departamento" => "sometimes|required|max:255",
            "ciudad" => "sometimes|required|max:255",
            "estado" => "required|in:0,1"
        ];
    }

    return [];
}

    public function messages()
    {
        return [
                "id.required" =>"El campo id es obligatorio",
                "id.integer" =>"El campo id de ser númerico",
                "id.min" =>"El campo id debe ser mayor a 0(cero)",
                "nombre.required" =>"El campo Nombre del tipo de factor es obligatorio",
                "nombre.max" =>"El campo Nombre del tipo de factor maximo de 255",
                "acronimo.required" =>"El campo Descripción del tipo de factor es obligatorio",
                "acronimo.max" =>"El campo Descripción del tipo de factor maximo de 6000",
                "registro.required" =>"El campo Descripción del tipo de factor es obligatorio",
                "registro.max" =>"El campo Descripción del tipo de factor maximo de 6000",
                "pais.required" =>"El campo Descripción del tipo de factor es obligatorio",
                "pais.max" =>"El campo Descripción del tipo de factor maximo de 6000" ,
                "departamento.required" =>"El campo Descripción del tipo de factor es obligatorio",
                "departamento.max" =>"El campo Descripción del tipo de factor maximo de 6000" ,
                "ciudad.required" =>"El campo Descripción del tipo de factor es obligatorio",
                "ciudad.max" =>"El campo Descripción del tipo de factor maximo de 6000" 

        ]; */
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* 
    /**
     * Determine if the user is authorized to make this request.
    /*  */
    /* public function authorize(): bool
    {
        return true;
    } */
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    /* public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipocolleccion_id' => 'required|exists:tipocolleccion_id',
        ];
    }

         public function messages()
    {
        return [
            'nombre.required' => 'El campo nombre es obligatorio.',
            'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
            'nombre.max' => 'El campo nombre no debe exceder los 255 caracteres.',
            'descripcion.string' => 'El campo descripción debe ser una cadena de texto.',
        ]; */
    }    
    