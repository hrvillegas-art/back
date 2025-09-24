<?php

namespace App\Rules;

use App\Caracteristicas;
use Illuminate\Contracts\Validation\Rule;
use phpDocumentor\Reflection\Types\This;

class Arrayvacio implements Rule
{
    protected $caracteristica;
    protected $array_tipo;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($caracteristica, $array_tipo)
    {
        $this->caracteristica = $caracteristica;
        $this->array_tipo = $array_tipo;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $array_data = json_decode($value);

        if (in_array($this->caracteristica, $this->array_tipo))
        {
            return count($array_data) > 0;
        }
        else
        {
            return true;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'El arreglo :attribute debe tener al menos un elemento';
    }
}
