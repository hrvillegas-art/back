var array_procesos_asociados_detalle = [],
array_norma_relacionadas_detalle = [],
array_lineamientos_relacionadas_detalles = [],
array_actividad_relacionadas_detalles = [],
array_otrosrequisitos_relacionadas_detalles = [],
array_aprobaciones_realizadas_detalle = [],
array_definicion_detalle = [],
array_politica_detalle = [],
array_iteracion_detalle = [],
array_documentoreferencia_detalle = [],
array_registros_detalle = [],
array_cambios_detalle = [];

$(document).ready(function(){

    $('#modal_detalledocumento').modal();

    $('#btn_modaldetalledocumento_cancelar').click(function(){
        $('#modal_detalledocumento').modal('close');
    });

    $('.tooltipped').tooltip();

    $('#btn-detalle').click(function(){
        cargarDetalle();
    });
});

    function cargarDetalle(porseleccion = true, id = 0)
    {
        array_procesos_asociados_detalle = [];
        array_norma_relacionadas_detalle = [];
        array_lineamientos_relacionadas_detalles = [];
        array_actividad_relacionadas_detalles = [];
        array_otrosrequisitos_relacionadas_detalles = [];
        array_aprobaciones_realizadas_detalle = [];
        array_definicion_detalle = [];
        array_politica_detalle = [];
        array_iteracion_detalle = [];
        array_documentoreferencia_detalle = [];
        array_registros_detalle = [];
        array_cambios_detalle = [];

        listadetalleProcesosAsociados([]);
        listadetalleNormasAsociados([]);
        listadetalleAprobaciones([], null);
        listadetalleLineamientoAsociados();
        listardetalleactividad();
        listarDetalledefinicion();
        listarDetallePolitica();
        listarDetalleIteracion();
        listardetalleDocumentosreferencia();
        listardetalleRegistros();
        listardetalleCambios();
        obternerdetalleRecurso(porseleccion, id);
    }

    function obternerdetalleRecurso(porseleccion = true, id = 0)
    {
        var registros = [];

        if (porseleccion)
        {
            registros = $(".table input[name='id[]']:checked").map(function(){
                return $(this).val();
            }).get();
        }
        else
        {
            registros.push(id);
        }

        if (registros.length > 0 && registros.length < 2)
        {
            var id = registros[0];

            $('.classmatriz').addClass('display-none');

            $.get('/api/obtenersolicitud/'+id,function(data){

                switch (data.caracteristica) {
                    case 'MATRIZ':
                        $('.classmatriz').removeClass('display-none');
                        $('.classprocedimiento').addClass('display-none');
                        $("#div_arachivo_url").addClass('display-none');
                        break;
                    case 'PROCEDIMIENTO':
                        $('.classmatriz').addClass('display-none');
                        $('.classprocedimiento').removeClass('display-none');
                        $("#div_arachivo_url").addClass('display-none');
                        break;
                    case 'PLANTILLA':
                        $('.classmatriz').addClass('display-none');
                        $('.classprocedimiento').addClass('display-none');
                        $("#div_arachivo_url").removeClass('display-none');
                        break;
                    default:
                        break;
                }

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
                $("#span_tipo").html(tipoSolicitud(data.tipo));
                $("#div_justificacion").html(data.justificacion);

                var array_procesos_relacionados = data.array_procesos_relacionados;

                listadetalleProcesosAsociados(array_procesos_relacionados);

                var array_norma_relacionadas = data.array_norma_relacionadas;

                listadetalleNormasAsociados(array_norma_relacionadas);

                var obj_flujoaprobacion = data.obj_flujoaprobacion;
                var array_aprobaciones = data.array_aprobacion;

                listadetalleAprobaciones(array_aprobaciones, obj_flujoaprobacion);

                array_actividades = [];

                data.array_actividades.forEach(element => {
                    var obj = element;
                    obj.tipoactividad_nombre = element.obj_tipo.nombre;
                    array_actividad_relacionadas_detalles.push(obj);
                });

                listardetalleactividad();

                array_lineamientos_relacionadas_detalles = [];

                data.array_lineamientos.forEach(element => {
                    var obj = element;
                    obj.nombre = element.obj_lineamiento.nombre;
                    obj.anio = element.obj_lineamiento.anio;
                    obj.tipo_nombre = element.obj_lineamiento.obj_tipo.nombre;
                    array_lineamientos_relacionadas_detalles.push(obj);
                });

                listadetalleLineamientoAsociados();

                array_otrosrequisitos_relacionadas_detalles = data.array_otrosrequisitos;

                listadetalleotrosrequisitoAsociados();

                if (data.tipodocumental_id == 3)
                {
                    var obj_solicitudtrd = data.obj_solicitudtrd;

                    $('#span_responsableregistro').html(obj_solicitudtrd.responsable);
                    $('#span_lugararchivo').html(obj_solicitudtrd.lugararchivo);
                    $('#span_medioarchivo').html(obj_solicitudtrd.medioarchivo);
                    $('#span_tiempoarchivo').html(obj_solicitudtrd.tiempoarchivo);
                    $('#span_disposicion').html(obj_solicitudtrd.disposicion);

                    $("#div_trd_detalle").removeClass('display-none');
                }
                else
                {
                    $("#div_trd_detalle").addClass('display-none');
                }

                var obj_procedimiento = data.obj_procedimiento;

                if (obj_procedimiento != null)
                {
                    $('#objetivo').val(obj_procedimiento.objetivo);
                    $('#alcance').val(obj_procedimiento.alcance);

                    array_definicion_detalle = obj_procedimiento.array_definicion;
                    listarDetalledefinicion();

                    array_politica_detalle = obj_procedimiento.array_politica;
                    listarDetallePolitica();

                    array_iteracion_detalle =  obj_procedimiento.array_iteracion;
                    listarDetalleIteracion();

                    obj_procedimiento.array_documentoreferencia.forEach(element => {
                        array_documentoreferencia_detalle.push(
                            {
                                id : element.obj_documentoreferencia.id,
                                nombre : element.obj_documentoreferencia.nombre, 
                                fechaemision:element.obj_documentoreferencia.fechaemision, 
                                descripcion:element.obj_documentoreferencia.descripcion,
                                ente: element.obj_documentoreferencia.ente
                            }
                        );
                    });
                    
                    listardetalleDocumentosreferencia();


                    obj_procedimiento.array_registros.forEach(element => {
                        array_registros_detalle.push({
                            documento_id: element.documento_id,
                            documento_nombre: element.obj_documento.nombre,
                            codigo: element.obj_documento.codificacion,
                            responsable: element.responsable,
                            lugararchivo: element.lugararchivo,
                            medioarchivo: element.medioarchivo,
                            tiempoarchivo: element.tiempoarchivo,
                            disposicion:element.disposicion 
                        });
                    });

                    listardetalleRegistros();

                    array_cambios_detalle = obj_procedimiento.array_cambios;
                    listardetalleCambios();
                }

                $('#div_usuariosasociados').html(data.usuarios);

                if (data.poraprobar)
                {
                    $("#btn_modaldetalledocumento_aprobacion").removeClass('display-none');
                }
                else
                {
                    $("#btn_modaldetalledocumento_aprobacion").addClass('display-none');
                }


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
            array_procesos_asociados_detalle.push(
                {
                    id: element.proceso_id,
                    nombre: element.obj_proceso.nombre,
                    sistema:''
                });
        });

        array_procesos_asociados_detalle.forEach(element => {
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
            array_norma_relacionadas_detalle.push(
                {
                    id: element.norma_id,
                    nombre: element.obj_norma.nombre
                }
            );
        });

        array_norma_relacionadas_detalle.forEach(element => {
            $("#div_detallenormaasociadas").append('<li class="collection-item">\
                <div>'+element.nombre+'\
                </div>\
        </li>');
        });
    }

    function listadetalleAprobaciones(array_aprobaciones, obj_flujoaprobacion)
    {
        $("#div_detalleaprobaciones").html('');

        if (obj_flujoaprobacion != null)
        {

            obj_flujoaprobacion.array_usuarios.forEach(element => {
                array_aprobaciones_realizadas_detalle.push(
                    {
                        id: element.obj_persona.id,
                        nombre: element.obj_persona.persona_natural.primernombre+' '+element.obj_persona.persona_natural.primerapellido
                    }
                );
            });
        }

        array_aprobaciones_realizadas_detalle.forEach(element => {

            var obj_aprobacion = validaraprobacion(array_aprobaciones, element.id);

            var html_aprobacion = '<span class="material-icons">question_mark</span>';

            var html_aprobacion = '';

            if (obj_aprobacion.estado == true)
            {
                html_aprobacion = '<i class="material-icons green-text">check</i>'
            }
            else if (obj_aprobacion.estado == false)
            {
                html_aprobacion = '<i class="material-icons pink-text">clear</i>';
            }
            else if (obj_aprobacion.estado == null)
            {
                html_aprobacion = '<span class="material-icons">watch_later</span>';
            }

            $("#div_detalleaprobaciones").append('<li class="collection-item">\
                <div><span style="font-weight: bold;">'+element.nombre+'</span>\
                    <span  class="secondary-content">\
                        '+html_aprobacion+'\
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

    function listardetalleactividad(array_detalle_actividades)
    {
        $("#div_detalleactividades").html('');

        array_actividad_relacionadas_detalles.forEach(val => {
            $("#div_detalleactividades").append('\
            <tr >\
                <td>'+val.tipoactividad_nombre.replaceAll('\n','<br>')+'</td>\
                <td>'+val.descripcion.replaceAll('/n','<br>')+'</td>\
                <td>'+val.insumo.replaceAll('\n','<br>')+'</td>\
                <td>'+val.proveedor.replaceAll('\n','<br>')+'</td>\
                <td>'+val.responsable.replaceAll('\n','<br>')+'</td>\
                <td>'+val.producto.replaceAll('\n','<br>')+'</td>\
                <td>'+val.cliente.replaceAll('\n','<br>')+'</td>\
            </tr>');
        });
    }

    function  listadetalleLineamientoAsociados()
    {
        $("#div_detallelineamientosasociadas").html('');

        array_lineamientos_relacionadas_detalles.forEach(element => {
            $("#div_detallelineamientosasociadas").append('<li class="collection-item">\
                <div>'+element.nombre+'<br><b>Tipo:</b> '+element.tipo_nombre+'<br><b>Año:</b> '+element.anio+'\
                </div>\
        </li>');
        });
    }

    function  listadetalleotrosrequisitoAsociados()
    {
        $("#div_detalleotrorequisitos").html('');

        array_otrosrequisitos_relacionadas_detalles.forEach(element => {
            $("#div_detalleotrorequisitos").append('<li class="collection-item">\
                <div><b>Nombre: </b>'+element.nombre+'<br><b>Descripción: </b> '+element.descripcion+'\
                </div>\
        </li>');
        });
    }

    function listarDetalledefinicion()
    {
        $('#tbody_detalleaprobaciones').html('');

        var posicion = 0;

        $.each(array_definicion_detalle, function (key, val){
            $('#tbody_detalleaprobaciones').append('\
            <tr >\
                <td>'+val.nombre+'</td>\
                <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
            </tr>');
            $('#tbody_detalleaprobaciones').append('</tbody></table>');
            posicion++;
        });
    }


    function listarDetallePolitica()
    {
        $('#body_detalleprocedimiento_politica').html('');

        $.each(array_politica_detalle, function (key, val){
            $('#body_detalleprocedimiento_politica').append('\
            <tr >\
                <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
            </tr>');

            $('#body_detalleprocedimiento_politica').append('</tbody></table>');
        });
    }

    function listarDetalleIteracion()
    {
        $('#body_detalleprocedimiento_iteracion').html('');

        var posicion = 0;

        $.each(array_iteracion_detalle, function (key, val){
            
            if (val.responsable == 'TITULO')
            {
                posicion = 0;

                $('#body_detalleprocedimiento_iteracion').append('\
                    <tr>\
                        <td colspan="3" style="text-align: center; font-weight: bold; background-color: ghostwhite;">'+val.descripcion.replaceAll('\n','<br>')+'</td>\
                    </tr>');
            }
            else
            {
                $('#body_detalleprocedimiento_iteracion').append('\
                    <tr >\
                        <td>'+(posicion+1)+'</td>\
                        <td>'+val.responsable+'</td>\
                        <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
                </tr>');
    
                posicion++;
            }

            $('#body_detalleprocedimiento_iteracion').append('</tbody></table>');
        });
    }

    function listardetalleDocumentosreferencia()
    {
        $('#body_detalleprocedimiento_documentoreferencia').html('');

        $.each(array_documentoreferencia_detalle, function (key, val){
            $('#body_detalleprocedimiento_documentoreferencia').append('\
            <tr >\
                <td>'+val.nombre+'</td>\
                <td>'+val.fechaemision+'</td>\
                <td>'+val.descripcion+'</td>\
                <td>'+val.ente+'</td>\
            </tr>');
            $('#body_detalleprocedimiento_documentoreferencia').append('</tbody></table>');
        });
    }

    function listardetalleRegistros()
    {
        $('#body_detalleprocedimiento_registros').html('');

        $.each(array_registros_detalle, function (key, val){
            $('#body_detalleprocedimiento_registros').append('\
            <tr >\
                <td>'+val.codigo+'</td>\
                <td>'+val.documento_nombre+'</td>\
                <td>'+val.responsable+'</td>\
                <td>'+val.lugararchivo+'</td>\
                <td>'+val.medioarchivo+'</td>\
                <td>'+val.tiempoarchivo+'</td>\
                <td>'+val.disposicion+'</td>\
            </tr>');
            $('#body_detalleprocedimiento_registros').append('</tbody></table>');
        });
    }

    function listardetalleCambios()
    {
        $('#body_detalleprocedimiento_cambios').html('');

        $.each(array_cambios_detalle, function (key, val){
            $('#body_detalleprocedimiento_cambios').append('\
            <tr >\
                <td>'+val.version+'</td>\
                <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
                <td>'+val.fecha+'</td>\
            </tr>');
            $('#body_detalleprocedimiento_cambios').append('</tbody></table>');
        });
    }