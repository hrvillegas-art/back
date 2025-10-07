<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pieza;
use App\Service\PiezaService;
use App\Http\Requests\StorePostRequestPieza;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PiezaController extends Controller
{
    protected $piezaService;

    public function __construct(PiezaService $piezaService)
    {
        $this->piezaService = $piezaService;
    }
    
    /**
     * Guardar o actualizar una pieza
     */
    public function guardar(StorePostRequestPieza $request)
    {
        $user_id = '1'; // string para coincidir con la migración

        $imagenActual = $request['id'] 
            ? optional($this->piezaService->obtenerRecurso($request['id']))->imagen 
            : null;

        $output = $this->piezaService->guardar((object)[
            'id' => $request['id'],
            'familia' => $request['familia'],
            'genero' => $request['genero'],
            'especie' => $request['especie'],
            'numeroCatalogo' => $request['numeroCatalogo'],
            'colector' => $request['colector'],
            'numeroColector' => $request['numeroColector'],
            'fechaColeccion' => $request['fechaColeccion'],
            'reino' => $request['reino'],
            'division' => $request['division'],
            'clase' => $request['clase'],
            'orden' => $request['orden'],
            'determinador' => $request['determinador'],
            'pais' => $request['pais'],
            'departamento' => $request['departamento'],
            'municipio' => $request['municipio'],
            'localidad' => $request['localidad'],
            'altitud' => $request['altitud'],
            'latitud' => $request['latitud'],
            'datumGeodesico' => $request['datumGeodesico'],
            'imagen' => $request->hasFile('imagen') && $request->file('imagen')->isValid()
                        ? $request->file('imagen')->store('piezas', 'public')
                        : $imagenActual,
            'estado' => $request['estado'],
            'is_published' => 0, 
            'usuariocreacion' => $user_id,
            'usuariomodificacion' => $user_id,
            'ipcreacion' => $request->getClientIp(),
            'ipmodificacion' => $request->getClientIp(),
            'tipocolleccion_id' => $request['tipocolleccion_id']
        ]);

        return response()->json([
            'msg' => $request['id'] > 0 ? ['Datos actualizados exitosamente'] : ['Datos guardados exitosamente'],
            'obj' => $output
        ], 202);
    }

    /**
     * Base para consultas con relación
     */
    public function selectBase()
    {
        return Pieza::with('tipoColleccion') // 👈 relación incluida
            ->orderBy("pieza.id", "desc")
            ->select(
                "pieza.id",
                "pieza.familia",
                "pieza.genero",
                "pieza.especie",
                "pieza.numeroCatalogo",
                "pieza.colector",
                "pieza.numeroColector",
                "pieza.fechaColeccion",
                "pieza.reino",
                "pieza.division",
                "pieza.clase",
                "pieza.orden",
                "pieza.determinador",
                "pieza.pais",
                "pieza.departamento",
                "pieza.municipio",
                "pieza.localidad",
                "pieza.altitud",
                "pieza.latitud",
                "pieza.datumGeodesico",
                "pieza.imagen",
                "pieza.is_published",
                "pieza.fechacreacion",
                "pieza.estado",
                "pieza.usuariocreacion",
                "pieza.fechamodificacion",
                "pieza.usuariomodificacion",
                "pieza.ipcreacion",
                "pieza.ipmodificacion",
                "pieza.tipocolleccion_id"
            )
            ->addSelect(\DB::raw("CONCAT('" . asset('storage') . "/', pieza.imagen) as imagen_url"));
    }

    /**
     * Obtener recurso por ID
     */
    public function obtenerRecurso($id)
    {
        return $this->selectBase()->find($id);
    }

    /**
     * Listar con filtros y paginación o en forma de árbol
     */
    public function listarTodo(Request $request)
    {
        $tipo = $request->input('tipo', 'lista');

        if ($tipo === 'arbol') {
            $data = $this->piezaService->listarArbol();
            return response()->json([
                'state' => 200,
                'msg'   => ['Datos obtenidos correctamente'],
                'data'  => $data
            ], 200);
        }

        $page = $request->input('page', 1);
        $numero_items = $request->input('numero_items', 10);
        $find = $request->input('find', '');
        $estado = $request->input('estado', '');

        $valid = Validator::make([
            'page' => $page,
            'numero_items' => $numero_items
        ], [
            'page' => 'integer|min:1',
            'numero_items' => 'integer|min:1'
        ]);

        if ($valid->fails()) {
            return response()->json([
                'state' => 422,
                'msg' => $valid->errors()->all(),
                'title' => 'Campos con valores incorrectos'
            ], 422);
        }

        $array_data = $this->piezaService->listarTodo($find, $estado, $page, $numero_items);

        return response()->json($array_data, 200);
    }

    /**
     * Eliminar piezas
     */
    public function eliminar($array_ids)
    {
        return Pieza::destroy($array_ids);
    }

    /**
     * Cambiar estado de una pieza
     */
    public function cambiarEstado($id, $val)
    {
        $pieza = Pieza::find($id);
        if ($pieza) {
            $pieza->estado = $val;
            $pieza->save();
            return $pieza;
        }
        return null;
    }

    /**
     * Cambiar estado de publicación
     */
    public function togglePublishStatus($id)
    {
        $pieza = Pieza::findOrFail($id);

        $pieza->is_published = !$pieza->is_published;
        $pieza->save();

        return response()->json([
            'message' => 'Estado de publicación actualizado',
            'data' => $pieza
        ], 200);
    }
}
