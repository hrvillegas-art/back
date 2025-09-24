var array_procesos_asociados = [],
array_norma_relacionadas = [],
array_aprobaciones_realizadas = [];

$(document).ready(function(){

    $('#modal_detalledocumento').modal();

    $('#btn_modaldetalledocumento_cancelar').click(function(){
        $('#modal_detalledocumento').modal('close');
    });

    $('.tooltipped').tooltip();

    $('#btn-detalle').click(function(){
        array_procesos_asociados = [];
        listadetalleProcesosAsociados([]);
        array_norma_relacionadas = [];
        listadetalleNormasAsociados([]);
        obternerdetalleRecurso();
    });
});

    function obternerdetalleRecurso()
    {
        var registros = $(".table input[name='id[]']:checked").map(function(){
            return $(this).val();
        }).get();

        array_procesos_asociados = [],
        array_norma_relacionadas = [],
        array_aprobaciones_realizadas = [];

        if (registros.length > 0 && registros.length < 2)
        {
            var id = registros[0];

            $.get('/api/migraciondocumento/'+id,function(data){

                $('#id').val(data.id);
                $('#span_tipodocumental_id').html(data.tipodocumental_nombre);
                $('#span_proceso_id').html(data.proceso_nombre);
                $('#span_persona_id').html(data.persona_id);
                $('#span_nombre').html(data.nombre);
                $('#span_descripcion').html(data.descripcion);
                $('#span_nivelconfidencial').html(data.nivelconfidencial);
                $('#span_version').html(data.version);
                $('#span_fechaaprobacion').html(data.fechaaprobacion);
                $('#span_visualizacion').html((data.visualizacion == true ? '<i class="material-icons green-text">check</i>': '<i class="material-icons pink-text">clear</i>'));
                $('#span_impresion').html((data.impresion == true ? '<i class="material-icons green-text">check</i>': '<i class="material-icons pink-text">clear</i>'));

                $("#a_archivo_url").attr("href", BASE_PUBLIC_PATH+'/Evidenciasolicitud/'+data.archivo_url);
                $("#a_archivo_url_acta").attr("href", BASE_PUBLIC_PATH+'/Evidenciasolicitud/'+data.archivo_url_acta);

                if (data.tipodocumental_id == 3)
                {
                    var obj_documentotrd = data.obj_documentotrd;

                    $('#span_responsableregistro').html(obj_documentotrd.responsable);
                    $('#span_lugararchivo').html(obj_documentotrd.lugararchivo);
                    $('#span_medioarchivo').html(obj_documentotrd.medioarchivo);
                    $('#span_tiempoarchivo').html(obj_documentotrd.tiempoarchivo);
                    $('#span_disposicion').html(obj_documentotrd.disposicion);

                    $("#div_trd_detalle").removeClass('display-none');
                }
                else
                {
                    $("#div_trd_detalle").addClass('display-none');
                }

                var array_procesos_relacionados = data.array_procesos_relacionados;

                listadetalleProcesosAsociados(array_procesos_relacionados);

                var array_norma_relacionadas = data.array_norma_relacionadas;

                listadetalleNormasAsociados(array_norma_relacionadas);

                var array_aprobaciones = data.array_aprobacion;

                listadetalleAprobaciones(array_aprobaciones);


                $('#modal_detalledocumento').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function listadetalleProcesosAsociados(array_procesos_relacionados)
    {
        $("#div_detalleprocesosasociados").html('');

        array_procesos_relacionados.forEach(element =>{
            array_procesos_asociados.push(
                {
                    id: element.proceso_id,
                    nombre: element.obj_proceso.nombre,
                    sistema:''
                });
        });

        array_procesos_asociados.forEach(element => {
            $("#div_detalleprocesosasociados").append('<li class="collection-item">\
                <div>'+element.nombre+'\
                </div>\
        </li>');

        });
    }

    function listadetalleNormasAsociados(array_norma_relacionada)
    {
        $("#div_detallenormaasociadas").html('');

        array_norma_relacionada.forEach(element => {
            array_norma_relacionadas.push(
                {
                    id: element.norma_id,
                    nombre: element.obj_norma.nombre
                }
            );
        });

        array_norma_relacionadas.forEach(element => {
            $("#div_detallenormaasociadas").append('<li class="collection-item">\
                <div>'+element.nombre+'\
                </div>\
        </li>');
        });
    }

    function listadetalleAprobaciones(array_aprobaciones)
    {
        $("#div_detalleaprobaciones").html('');

        array_aprobaciones.forEach(element => {
            array_aprobaciones_realizadas.push(
                {
                    id: element.obj_persona.id,
                    nombre: element.obj_persona.persona_natural.primernombre+' '+element.obj_persona.persona_natural.primerapellido
                }
            );
        });

        array_aprobaciones_realizadas.forEach(element => {

            var obj_aprobacion = validaraprobacion(array_aprobaciones, element.id);

            $("#div_detalleaprobaciones").append('<li class="collection-item">\
                <div><span style="font-weight: bold;">'+element.nombre+'</span>\
                    <span  class="secondary-content">\
                        '+( obj_aprobacion.estado == true ? '<i class="material-icons green-text">check</i>': '<i class="material-icons pink-text">clear</i>')+'\
                    </span>\
                    <p>'+obj_aprobacion.justificacion+'</p>\
                </div>\
        </li>');
        });
    }

    function validaraprobacion(array_aprobaciones, persona_id)
    {
        var estado = false,
        justificacion = '';

        array_aprobaciones.forEach(element => {
            if (element.persona_id == persona_id)
            {
                estado = element.estado;
                justificacion = element.justificacionestado;
            }
        });

        return {estado: estado, justificacion: justificacion};
    }