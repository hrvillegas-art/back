<?php
namespace App\Helpers;

use App\Exceptions\ExceptionServer;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Session;

class Service
{

    public static function GET($url)
    {
        $client = new Client([
            'headers' => [
                "Content-Type" => "application/json",
                "Accept" => "application/json"
                // "Authorization" => "Bearer ".Session::get('token')
            ],
            'verify' => false
        ]);

        $url_completa = $url;

        try {
            $apiRequest = $client->request("GET",  $url_completa);

            $response = json_decode($apiRequest->getBody());

            return $response;

        }
        catch (\GuzzleHttp\Exception\RequestException $ex)
        {
            self::lanzarException($ex);
        }
   }

    public static function POST($url, $obj_data)
    {
        $client = new Client([
            'headers' => [
                "Content-Type" => "application/json",
                "Accept" => "application/json"
               // "Authorization" => "Bearer ".Session::get('token')
            ],
            'verify' => false
        ]);

        $url_completa = $url;

        try {
            $apiRequest = $client->request("POST",  $url_completa,  $obj_data);

            $response = json_decode($apiRequest->getBody());

            return $response;

        } 
        catch (\GuzzleHttp\Exception\RequestException $ex)
        {
            self::lanzarException($ex);
        }
   }

   public static function PUT($url, $obj_data)
    {
        $client = new Client([
            'headers' => [
                "Content-Type" => "application/json",
                "Accept" => "application/json",
                "Authorization" => "Bearer ".Session::get('token')
            ],
            'verify' => false
        ]);

        $baseurl =   config('app.apiautorizacion');
        $url_completa = $baseurl.$url;

        try {
            $apiRequest = $client->request("PUT",  $url_completa,  $obj_data);

            $response = json_decode($apiRequest->getBody());

            return $response;

        }
        catch (\GuzzleHttp\Exception\RequestException $ex)
        {
            self::lanzarException($ex);
        }
   }

   public static function DELETE($url, $obj_data)
   {
       $client = new Client([
           'headers' => [
               "Content-Type" => "application/json",
               "Accept" => "application/json",
               "Authorization" => "Bearer ".Session::get('token')
           ],
           'verify' => false
       ]);

       $baseurl = config('app.apiautorizacion');
       $url_completa = $baseurl.$url.'/'.implode(",", $obj_data);

       try {
           $apiRequest = $client->request("DELETE",  $url_completa);

           $response = json_decode($apiRequest->getBody());

           return $response;
       }
       catch (\GuzzleHttp\Exception\RequestException $ex)
       {
            self::lanzarException($ex);
       }
    }


    public static function lanzarException($ex)
    {
        if ($ex->hasResponse())
        {
            $response = $ex->getResponse()->getBody()->getContents();

            $response = json_decode( $response);

            throw new ExceptionServer("Service", [$response], 500, "Fallo de servicio", "LOG", $ex->getMessage());
        }
        else
        {
            throw new ExceptionServer("Service",["En el momento no se puede realizar esta operación, comuníquese con el administrador del sistema"],500,"Fallo de servicio","LOG", $ex->getMessage());
        }
    }
}
