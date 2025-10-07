<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Factor\FactorInterface;
use App\Repositories\TipoColleccion\TipoColleccionInterface;
use App\Repositories\Colleccion\ColleccionInterface;
use App\Repositories\Pieza\PiezaInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            'App\Repositories\Factor\FactorInterface',
            'App\Repositories\Factor\FactorRepository',
            'App\Service\FactorService'            
        );

        $this->app->bind(
            'App\Repositories\TipoColleccion\TipoColleccionInterface',
            'App\Repositories\TipoColleccion\TipoColleccionRepository',
            'App\Service\TipoColleccionService'            
        );

        $this->app->bind(
            'App\Repositories\Colleccion\ColleccionInterface',
            'App\Repositories\Colleccion\ColleccionRepository',
            'App\Service\ColleccionService'            
        );
         $this->app->bind(
            'App\Repositories\Pieza\PiezaInterface',
            'App\Repositories\Pieza\PiezaRepository',
            'App\Service\PiezaService'            
        );
        $this->app->bind(
            'App\Repositories\View\ViewInterface',
            'App\Repositories\View\ViewRepository',
            'App\Service\ViewService'            
        );

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
