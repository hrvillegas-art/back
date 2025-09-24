<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Enviarcorreo extends Mailable
{
    use Queueable, SerializesModels;

    public $obj_correo;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($obj_correo)
    {
        $this->obj_correo = $obj_correo;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from( $this->obj_correo->correoremitente, $this->obj_correo->nombreremitente)
        ->view($this->obj_correo->plantilla)
        ->subject($this->obj_correo->asunto)
        ->with(
          [
            'mensaje' => $this->obj_correo->mensaje,
            'nombredestinatario' => $this->obj_correo->nombredestinatario
          ]);
    }
}
