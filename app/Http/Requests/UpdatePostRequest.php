<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
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

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        // PATCH = update parcial
        if ($this->isMethod('patch')) {
            return [
                'nombre' => 'sometimes|required|string|max:255',
                'descripcion' => 'sometimes|required|string',
                'tipocolleccion_id' => 'sometimes|required|exists:tipocolleccions,id',
                        'estado' => 'required|boolean',

            ];
        }

        // PUT = update completo
        return [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'tipocolleccion_id' => 'required|exists:tipocolleccions,id',
                    'estado' => 'required|boolean',

        ];
    }

    /**
     * Mensajes personalizados de validación
     */
    public function messages()
    {
        return [
            'nombre.required' => 'El campo nombre es obligatorio.',
            'nombre.string' => 'El campo nombre debe ser una cadena de texto.',
            'nombre.max' => 'El campo nombre no debe exceder los 255 caracteres.',

            'descripcion.required' => 'El campo descripción es obligatorio.',
            'descripcion.string' => 'El campo descripción debe ser una cadena de texto.',

            'tipocolleccion_id.required' => 'Debe seleccionar un tipo de colección.',
            'tipocolleccion_id.exists' => 'El tipo de colección seleccionado no es válido.',
        ];
    }
}
?>