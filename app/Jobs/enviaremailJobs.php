<?php

namespace App\Jobs;

use App\Mail\Enviarcorreo;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class enviaremailJobs implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $obj_correo;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($obj_correo)
    {
        $this->obj_correo = $obj_correo;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        //  Mail::to($this->obj_correo->correodestinatario)->send(new Enviarcorreo($this->obj_correo));
        Mail::to('jorgediazp@correo.unicordoba.edu.co')->send(new Enviarcorreo($this->obj_correo));
    }
}
