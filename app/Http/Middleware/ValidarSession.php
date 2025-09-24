<?php

namespace App\Http\Middleware;

use Closure;
use App\Exceptions\ExceptionServer;

class ValidarSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!$request->session()->has('user'))
        {
            return redirect('/');
        }
        else if ($request->session()->has('user'))
        {
            if ($request->url() == url('/')) {
                return redirect('/home');
            }
        }

        if ($request->url() != url('/home'))
        {
            $autorizado = false;

            
            $array_funcionalidad = $request->session()->get('funcionalidad');
            
            $path = $request->path();
            $array_path = explode('?', $path);
            $url = $array_path[0];
            
            if($request->ajax())
            {
                $url = str_replace('api/','',$url);
            }

            //Pendiente por validación
            foreach ($array_funcionalidad as $key => $value)
            {
                if ($this->analizarUrl($url, $value->url))
                {
                    switch ($request->method())
                    {
                        case 'GET':
                        if($value->lee || $value->exporta || $value->reporte)
                        {
                            $autorizado = true;
                        }
                        break;
                        case 'POST':
                        if($value->crea)
                        {
                            $autorizado = true;
                        }
                        break;
                        case 'PUT':
                        if($value->modifica)
                        {
                            $autorizado = true;
                        }
                        break;
                        case 'DELETE':
                        if($value->elimina)
                        {
                            $autorizado = true;
                        }
                        break;
                        default:
                        # code...
                        break;
                    }
                }
            }
            
            if (!$autorizado)
            {
                if($request->ajax())
                {
                    throw new ExceptionServer("ValidarSession",[$path,$url,"Usted no esta autorizado para realizar esta funcionalidad"], 409, "Usuario no autorizado", "");
                }
                else 
                {
                    return redirect('/home');
                }
            }
        }

        return $next($request);
    }
    
    public function analizarUrl($urlrequest, $urlpermitida)
    {
        $array_urlrequest = explode("/", $urlrequest);
        $array_urlpermitida = explode("/", $urlpermitida);
        
        $permitida = 0;
        
        if (count($array_urlpermitida) == count($array_urlrequest))
        {
            for ($i = 0; $i < count($array_urlpermitida); $i++)
            {
                if ($array_urlpermitida[$i] == '##')
                {
                    $permitida++;
                }
                else if($array_urlpermitida[$i] == $array_urlrequest[$i])
                {
                    $permitida++;
                }
            }
        }

        return $permitida == count($array_urlpermitida);
    }
}
