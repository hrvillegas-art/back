<?php

namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;



class UpdatePostRequestPieza extends FormRequest
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
        if( $this->isMethod('patch')) {
            return [
            'familia' => 'required|string|max:255',
            'genero' => 'required|string|max:255',
            'especie' => 'required|string|max:255',
            'numeroCatalogo' => 'required|string|max:100',
            'colector' => 'required|string|max:255',
            'numeroColector' => 'required|string|max:100',
            'fechaColeccion' => 'required|date',
            'reino' => 'required|string|max:100',
            'division' => 'required|string|max:100',
            'clase' => 'required|string|max:100',
            'orden' => 'required|string|max:100',
            'determinador' => 'required|string|max:255',
            'pais' => 'required|string|max:100',
            'departamento' => 'required|string|max:100',
            'municipio' => 'required|string|max:100',
            'localidad' => 'required|string|max:255',
            'altitud' => 'required|string|max:50',
            'latitud' => 'required|string|max:50',
            'datumGeodesico' => 'required|string|max:100',
             'imagen' => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',

            ];
        }   return [
            'familia' => 'required|string|max:255',
            'genero' => 'required|string|max:255',
            'especie' => 'required|string|max:255',
            'numeroCatalogo' => 'required|string|max:100',
            'colector' => 'nullable|string|max:255',
            'numeroColector' => 'nullable|string|max:100',
            'fechaColeccion' => 'nullable|date',
            'reino' => 'nullable|string|max:100',
            'division' => 'nullable|string|max:100',
            'clase' => 'nullable|string|max:100',
            'orden' => 'nullable|string|max:100',
            'determinador' => 'nullable|string|max:255',
            'pais' => 'nullable|string|max:100',
            'departamento' => 'nullable|string|max:100',
            'municipio' => 'nullable|string|max:100',
            'localidad' => 'nullable|string|max:255',
            'altitud' => 'nullable|string|max:50',
            'latitud' => 'nullable|string|max:50',
            'datumGeodesico' => 'nullable|string|max:100',
             'imagen' => 'sometimes|nullable|image|mimes:jpg,jpeg,png|max:2048',

        ];
    }   public function messages(){
        return [
            'familia.required' => 'El campo familia es obligatorio.',
            'familia.string' => 'El campo familia debe ser una cadena de texto.',
            'familia.max' => 'El campo familia no debe exceder los 255 caracteres.',
            'genero.required' => 'El campo genero es obligatorio.',
            'genero.string' => 'El campo genero debe ser una cadena de texto.',
            'genero.max' => 'El campo genero no debe exceder los 255 caracteres.',
            'especie.required' => 'El campo especie es obligatorio.',
            'especie.string' => 'El campo especie debe ser una cadena de texto.',
            'especie.max' => 'El campo especie no debe exceder los 255 caracteres.',
            'NumeroCatalogo.required' => 'El campo número de catálogo es obligatorio.',
            'NumeroCatalogo.string' => 'El campo número de catálogo debe ser una cadena de texto.',
            'NumeroCatalogo.max' => 'El campo número de catálogo no debe exceder los 100 caracteres.',
            'NumeroCatalogo.unique' => 'El número de catálogo ya existe en la base de datos.',
            'colector.string' => 'El campo colector debe ser una cadena de texto.',
            'colector.max' => 'El campo colector no debe exceder los 255 caracteres.',
            'NumeroColector.string' => 'El campo número de colector debe ser una cadena de texto.',
            'NumeroColector.max' => 'El campo número de colector no debe exceder los 100 caracteres.',
            'FechaColeccion.date' => 'El campo fecha de colección debe ser una fecha válida.',
            'reino.string' => 'El campo reino debe ser una cadena de texto.',
            'reino.max' => 'El campo reino no debe exceder los 100 caracteres.',
            'division.string' => 'El campo división debe ser una cadena de texto.',
            'division.max' => 'El campo división no debe exceder los 100 caracteres.',
            'clase.string' => 'El campo clase debe ser una cadena de texto.',
            'clase.max' => 'El campo clase no debe exceder los 100 caracteres.',
            'orden.string' => 'El campo orden debe ser una cadena de texto.',
            'orden.max' => 'El campo orden no debe exceder los 100 caracteres.',
            'determinador.string' => 'El campo determinador debe ser una cadena de texto.',
            'determinador.max' => 'El campo determinador no debe exceder los
            255 caracteres.',
            'pais.string' => 'El campo país debe ser una cadena de texto.',
            'pais.max' => 'El campo país no debe exceder los 100 caracteres.',
            'departamento.string' => 'El campo departamento debe ser una cadena de texto.',
            'departamento.max' => 'El campo departamento no debe exceder los 100 caracteres.',
            'municipio.string' => 'El campo municipio debe ser una cadena de texto.',
            'municipio.max' => 'El campo municipio no debe exceder los 100 caracteres.',
            'localidad.string' => 'El campo localidad debe ser una cadena de texto.',
            'localidad.max' => 'El campo localidad no debe exceder los 255 caracteres.',
            'altitud.string' => 'El campo altitud debe ser una cadena de texto.',
            'altitud.max' => 'El campo altitud no debe exceder los 50 caracteres.',
            'latitud.string' => 'El campo latitud debe ser una cadena de texto.',
            'latitud.max' => 'El campo latitud no debe exceder los 50 caracteres.',
            'datumGeodesico.string' => 'El campo datum geodésico debe ser una cadena de texto.',
            'datumGeodesico.max' => 'El campo datum geodésico no debe exceder los 100 caracteres.',
            'imagen.imagen' => 'El archivo debe ser una imagen válida.',
'imagen.mimes' => 'La imagen debe estar en formato JPG o PNG.',
'imagen.max'   => 'La imagen no debe superar los 2MB.',
        ];  
    }
}
    
    