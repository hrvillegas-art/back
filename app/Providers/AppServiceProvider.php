<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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


    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
