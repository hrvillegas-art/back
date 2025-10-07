<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Exceptions\ExceptionServer;
class ViewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function isajax()
    {
        if(!$this->ajax())
        {
            throw new ExceptionServer("FactorRequest",["La peticion debe ser enviada mediante ajax"], 400, "Petición invalida", "");
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
        return [
            'tipo_colleccion_id' => 'required|integer|min:1',
            'user_id' => 'sometimes|nullable|integer|min:1',
            'ip_address' => 'sometimes|nullable|ip'
        ];
    }
            public function messages()
        {
            return [
                'tipo_colleccion_id.required' => 'El campo tipo_colleccion_id es obligatorio.',
                'tipo_colleccion_id.integer' => 'El campo tipo_colleccion_id debe ser un número entero.',
                'tipo_colleccion_id.min' => 'El campo tipo_colleccion_id debe ser al menos 1.',
                'user_id.integer' => 'El campo user_id debe ser un número entero.',
                'user_id.min' => 'El campo user_id debe ser al menos 1.',
                'ip_address.ip' => 'El campo ip_address debe ser una dirección IP válida.'
            ];
        }
}