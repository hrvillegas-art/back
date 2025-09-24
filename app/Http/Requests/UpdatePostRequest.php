<?php

namespace App\Http\Controllers\Request;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;


class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
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
if ($this->isMethod('patch')) {
            return [
                'nombre' => 'sometimes|required|string|max:255',
                'acronimo' => 'sometimes|nullable|string',
                'registro' => 'sometimes|nullable|string|max:255',
                'entidad' => 'sometimes|nullable|string|max:255',
                'pais' => 'sometimes|nullable|string|max:255',
                'departamento' => 'sometimes|nullable|string|max:255',
                'ciudad' => 'sometimes|nullable|string|max:255',
            ];
        }   
        
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
            'name.required' => 'El campo nombre es obligatorio.',
            'name.string' => 'El campo nombre debe ser una cadena de texto.',
            'name.max' => 'El campo nombre no debe exceder los 255 caracteres.',
            'acronimo.string' => 'El campo descripción debe ser una cadena de texto.',
        ];
    }   
    }
