<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Exceptions\ExceptionServer;


class StorePostRequest extends FormRequest

    /**
     * Determine if the user is authorized to make this request.
     */
   /*  public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    /* public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'acronimo' => 'required|string|max:255',
            'registro' => 'required|string|max:255',
            'entidad' => 'required|string|max:255', 
            'pais' => 'required|string|max:255',
            'departamento' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
        ];
    }

         public function messages()
    {
        return [
            'nombre.required' => 'El campo nombre es obligatorio.',
            'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
            'nombre.max' => 'El campo nombre no debe exceder los 255 caracteres.',
            'acronimo.string' => 'El campo descripción debe ser una cadena de texto.',
        ];
    }   

    
    } */ 


{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
      
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            "nombre" => "required|string|max:255",
            "descripcion" => "required|string|max:6000",
            // Aseguramos que el campo sea un entero y al menos 1
            "tipocolleccion_id" => "required|integer|min:1"

        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            "id.required" => "El campo ID es obligatorio",
            "id.integer" => "El campo ID debe ser numérico",
            "id.min" => "El campo ID debe ser un número entero mayor a 0",
            "nombre.required" => "El campo Nombre es obligatorio",
            "nombre.string" => "El campo Nombre debe ser una cadena de texto",
            "nombre.max" => "El campo Nombre no debe exceder los 255 caracteres",
            "descripcion.required" => "El campo Descripción es obligatorio",
            "descripcion.string" => "El campo Descripción debe ser una cadena de texto",
            "descripcion.max" => "El campo Descripción no debe exceder los 6000 caracteres",
            "tipocolleccion_id.required" => "El campo ID de tipo de colección es obligatorio",
            "tipocolleccion_id.integer" => "El campo ID de tipo de colección debe ser numérico",
            "tipocolleccion_id.min" => "El campo ID de tipo de colección debe ser mayor a 0"
        ];
    }
}

