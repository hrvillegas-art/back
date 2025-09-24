$(document).ready(function(){

    $("#btn_showmodalasignarproceso").click(function(){
        $('#modal_asignarproceso').modal('open');
        $("#btn-asignarprocesobuscartodo").click();
    });

    $("#btn_showmodalasignarnorma").click(function(){
        $('#modal_asignarnorma').modal('open');
        $("#btn-asignarnormabuscartodo").click();
    });

    $("#btn_showmodalasignarlineamiento").click(function(){
        $('#modal_asignarlineamiento').modal('open');
        $("#btn-asignarlineamientobuscartodo").click();
    });

    $("#btn_showmodalasignarfuncionario").click(function(){
        $('#modal_asignarfuncionario').modal('open');
        $("#btn-asignarfuncionariobuscartodo").click();
    });
});

function asignarProceso(proceso_id, nombre_proceso, nombre_sistema)
{
    if (validarProceso(proceso_id))
    {
        array_procesos_asociados.push(
            {
                id: proceso_id,
                nombre:nombre_proceso,
                sistema:nombre_sistema
            }
        );

        listaProcesosAsociados();
    }
}

function asignarNorma(norma_id, nombre_norma)
{
    if (validarNorma(norma_id))
    {
        array_norma_relacionadas.push(
            {
                id: norma_id,
                nombre:nombre_norma
            }
        );

        listaNormasAsociados();
    }
}

function asignarLineamiento(lineamiento_id, nombre_lineamiento, anio)
{
    if (validarLineamiento(lineamiento_id))
    {
        array_lineamientos_relacionadas.push(
            {
                id: lineamiento_id,
                nombre:nombre_lineamiento,
                anio: anio
            }
        );

        listaLineamientoAsociados();
    }
}

function eliminarProceso(posicion)
{
    array_procesos_asociados.splice(posicion, 1);

    listaProcesosAsociados();
}

function eliminarNorma(posicion)
{
    array_norma_relacionadas.splice(posicion, 1);

    listaNormasAsociados();
}

function eliminarLineamiento(posicion)
{
    array_lineamientos_relacionadas.splice(posicion, 1);

    listaLineamientoAsociados();
}

function listaProcesosAsociados()
{
    $("#div_procesosasociados").html('');
    var posicion = 0;

    array_procesos_asociados.forEach(element => {
        $("#div_procesosasociados").append('<tr><td>'+(posicion+1)+'</td><td>\
            '+element.nombre+'</td><td>\
            <a style="cursor:pointer" onclick="eliminarProceso('+posicion+')" class="secondary-content">\
                <i style="color: red;"class="material-icons">delete</i>\
            </a>\
            </td>\
    </tr>');

    posicion++;

    });
}

function listaNormasAsociados()
{
    $("#div_normaasociadas").html('');
    var posicion = 0;

    array_norma_relacionadas.forEach(element => {
        $("#div_normaasociadas").append('<tr><td>'+(posicion+1)+'</td><td>\
        '+element.nombre+'</td><td>\
        <a style="cursor:pointer" onclick="eliminarNorma('+posicion+')" class="secondary-content">\
            <i style="color: red;"class="material-icons">delete</i>\
        </a>\
        </td>\
</tr>');

    posicion++;

    });
}

function listaLineamientoAsociados()
{
    $("#div_lineamientoasociadas").html('');
    var posicion = 0;

    array_lineamientos_relacionadas.forEach(element => {
        $("#div_lineamientoasociadas").append('<tr><td>'+(posicion+1)+'</td><td>\
                '+element.nombre+'</td><td>\
                    '+element.anio+'</td><td>\
                    <a style="cursor:pointer" onclick="eliminarLineamiento('+posicion+')" class="secondary-content">\
                        <i style="color: red;"class="material-icons">delete</i>\
                    </a>\
                    </td>\
            </tr>');

    posicion++;

    });
}

function validarProceso(proceso_id)
{
    const found = array_procesos_asociados.find(element => element.id == proceso_id);
    return typeof found == 'undefined';
}

function validarNorma(norma_id)
{
    const found = array_norma_relacionadas.find(element => element.id == norma_id);
    return typeof found == 'undefined';
}

function validarLineamiento(lineamiento_id)
{
    const found = array_lineamientos_relacionadas.find(element => element.id == lineamiento_id);
    return typeof found == 'undefined';
}