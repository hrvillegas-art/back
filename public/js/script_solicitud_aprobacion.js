var last_page = 1,
totalPages = 2,
visiblePages = 2,
first_load = true,
send = true,
array_procesos_asociados = [],
array_norma_relacionadas = [],
array_tipodocumental = [],
array_lineamientos_relacionadas = [],
metodo_save = "POST",
tipo = 'C'
solicitudseleccionada_id = 0,
ordenseleccionada_id = 0;

$(document).ready(function(){
    botones = [ //  nroseleccionados: 1 para unos solo y 0 para todos los registros
        {
            id: 'btn-eliminar',
            nombre: 'Eliminar',
            nroseleccionados: 0
        },
        {
            id: 'btn-editar',
            nombre: 'Modificar',
            nroseleccionados: 1
        },
        {
            id: 'btn-detalle',
            nombre: 'Detalle',
            nroseleccionados: 1
        }
    ];

    $('tabs').tabs();
    $('#modal_aprobacion').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#div_documento').addClass('display-none');
        $('#div_listardocumento').removeClass('display-none');
    });

    $('#numero_items').change(function(event){
        listar();
    });

    listar();
    
    $('#btn-buscar').click(function(event){

        last_page = 1;

        var find = $('#find').val();

        find = find.trim();

        if(find.length > 0)
        {
            listar();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-buscartodo').click(function(event){
        $('#find').val('');
        last_page = 1;
        listar();
    });


    $('#btn_modal_cancelar_cancelar').click(function(){
        $('#modal_aprobacion').modal('close');
    });
    
    $('#btn_modaldetalledocumento_aprobacion').click(function(){
        $('#modal_aprobacion').modal('open');
        $("#solicitud_id").val(solicitudseleccionada_id);
        $("#orden").val(ordenseleccionada_id);
    });

    $('#form_aprobacion').validate({ // initialize the plugin
        rules: {
            justificacionestado:{
                required: true,
                maxlength:255
            }
        },
        messages: {
            justificacionestado:{
                required: "El campo Descripción es obligatorio",
                maxlength: "El campo Descripción fuera de rango"
            }   
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {

            var placement = $(element).data('error');

            if (placement)
            {
                $(placement).append(error)
            }
            else
            {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) { // for demo
                guardarAprobacion();
            return false; // for demo
        }
    });

    $('#btn_modal_guardar_aprobacion').click(function(){
        $("#estado").val(true);
        $('#form_aprobacion').submit();
    });

    $('#btn_modal_rechazar_aprobacion').click(function(){
        $("#estado").val(false);
        $('#form_aprobacion').submit();
    });
});

/*

    $('#caracteristica').change(function(event){
        var caracter = $(this).val();

        activarFormulario(caracter);
        
    });

    $('#btn-agregar').click(function(){
        $('#form_documento')[0].reset();
        $("#title_div_documento").html('Crear solicitud');
        $('#div_documento').removeClass('display-none');
        $('#div_listardocumento').addClass('display-none');
        metodo_save = 'POST';
        limpiarArrrays();
        $('#id').val(0);
        tipo = 'C';
    });

    $('#btn_modal_guardar').click(function(){
        validacionArray();
        send = true;
        $('#form_documento').submit();
    });

    listar();

    $('#btn_modal_guardar_documento').click(function(){
        send = true;
        $('#form_documentoreferencia').submit();
    });

    $('#form_documentoreferencia').validate({ // initialize the plugin
        rules: {
                    id:{
                       required: true,
                        number: true,
                        min: 1}
                        ,
                    nombre:{
                        required: true,
                        maxlength:255
                        },
                    fechaemision:{
                        required: true,
                        maxlength:255
                        },
                    descripcion:{
                        required: true,
                        maxlength:255
                        },
                    ente:{
                        required: true,
                        maxlength:255
                        }
        },
        messages: {
                    id:{
                        required: "El campo id es obligatorio",
                        number: "El campo id deber numérico",
                        min: "El campo id deber de mínimo 1"
                        },
                    nombre:{
                        required: "El campo Referencia es obligatorio",
                        maxlength: "El campo Referencia fuera de rango"
                        },
                    fechaemision:{
                        required: "El campo Fecha de emisión es obligatorio",
                        maxlength: "El campo Fecha de emisión fuera de rango"
                        },
                    descripcion:{
                        required: "El campo Descripción es obligatorio",
                        maxlength: "El campo Descripción fuera de rango"
                        },
                    ente:{
                        required: "El campo Ente que lo expide es obligatorio",
                        maxlength: "El campo Ente que lo expide fuera de rango"
                        }    
        },
        errorElement : 'div',
        errorPlacement: function(error, element) {

            var placement = $(element).data('error');

            if (placement)
            {
                $(placement).append(error)
            }
            else
            {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) { // for demo
                guardarDocumento();
            return false; // for demo
        }
    });
});

    function guardarDocumento()
    {
        $.ajax({
            url: '/api/documentoreferencia',  
            type: metodo_save,
            headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: $('#form_documentoreferencia').serialize(),
            beforeSend: function(){
                $('#btn_modal_guardar').attr('disabled', 'disabled');
            },
            success: function(outserver, textStatus, xhr){

                if (xhr.status == 202) // Operacion exitosa
                {
                    $('#modal_documentoreferencia').modal('close');
                    $('#btn_modal_guardar').removeAttr('disabled');
                    mensajeExitosoToasts(outserver.msg.join('<br>'));
                    asignarDocumento(outserver.obj.id, outserver.obj.nombre, outserver.obj.fechaemision, outserver.obj.descripcion, outserver.obj.ente);
                }
            },
            //si ha ocurrido un error
            error: function(outerror){
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
                $('#btn_modal_guardar').removeAttr('disabled');
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function validacionArray()
    {
        var caracteristica = $('#caracteristica').val(),
        valido = true;

        if (caracteristica == 'PLANTILLA')
        {
            if (array_norma_relacionadas.length == 0)
            {
                $("#div_error_normas").html('El documento debe tener por lo menos una norma asignada');
                valido = false;
            }
            else
            {
                $("#div_error_normas").html('');
            }
        }
        else if (caracteristica == 'MATRIZ')
        {
            if (array_actividades.length == 0)
            {
                $("#div_error_actividades").html('La matriz de proceso debe tener por lo menos una actividad asignada');
                valido = false;
            }
            else
            {
                $("#div_error_actividades").html('');
            }

            if (array_norma_relacionadas.length == 0)
            {
                $("#div_error_normas").html('La matriz de proceso debe tener por lo menos una norma asignada');
                valido = false;
            }
            else
            {
                $("#div_error_normas").html('');
            }

            if (array_lineamientos_relacionadas.length == 0)
            {
                $("#div_error_lineamientos").html('La matriz de proceso debe tener por lo menos un lineamiento relacionado');
                valido = false;
            }
            else
            {
                $("#div_error_lineamientos").html('');
            }

            if (array_otrorequisito.length == 0)
            {
                $("#div_error_otrosrequisitos").html('La matriz de proceso debe tener por lo menos un requisito relacionado');
                valido = false;
            }
            else
            {
                $("#div_error_otrosrequisitos").html('');
            }
        }
        else if (caracteristica == 'PROCEDIMIENTO')
        {
            if (array_iteracion.length == 0)
            {
                $("#div_error_iteracion").html('El procedimiento debe tener por lo menos una iteración relacionado');
                valido = false;
            }
            else
            {
                $("#div_error_iteracion").html('');
            }

            if (array_definicion.length == 0)
            {
                $("#div_error_definicion").html('El procedimiento debe tener por lo menos una definición relacionado');
                valido = false;
            }
            else
            {
                $("#div_error_definicion").html('');
            }

            if (array_politica.length == 0)
            {
                $("#div_error_politica").html('El procedimiento debe tener por lo menos una política relacionado');
                valido = false;
            }
            else
            {
                $("#div_error_politica").html('');
            }

            if (array_registros.length == 0)
            {
                $("#div_error_registros").html('El procedimiento debe tener por lo menos un registro relacionado');
                valido = false;
            }
            else
            {
                $("#div_error_registros").html('');
            }

            if (array_documentoreferencia.length == 0)
            {
                $("#div_error_documentoreferencia").html('El procedimiento debe tener por lo menos un documento de referecnia relacionado');
                valido = false;
            }
            else
            {
                $("#div_error_documentoreferencia").html('');
            }
        }

        return valido;
    }

    function activarFormulario(caracteristica)
    {
        switch (caracteristica) {
            case 'PLANTILLA':
                $("#div_archivo_url").removeClass('display-none');
                $("#div_matriz").addClass('display-none');
                $("#div_procedimiento").addClass('display-none');
                break;
            case 'MATRIZ':
                $("#div_matriz").removeClass('display-none');
                $("#div_archivo_url").addClass('display-none');
                $("#div_procedimiento").addClass('display-none');
                break;
            case 'PROCEDIMIENTO':
                $("#div_matriz").addClass('display-none');
                $("#div_archivo_url").addClass('display-none');
                $("#div_procedimiento").removeClass('display-none');
                break;
            default:
                break;
        }
    }

    function guardar()
    {
        asignarProceso($("#proceso_id").val(), $('select[name="proceso_id"] option:selected').text(), '');

        var formData = new FormData(document.getElementById("form_documento"));
        formData.append('array_procesos_relacionados', JSON.stringify(array_procesos_asociados));
        formData.append('array_norma_relacionadas', JSON.stringify(array_norma_relacionadas));
        formData.append('array_actividades', JSON.stringify(array_actividades));
        formData.append('array_lineamientos_relacionadas', JSON.stringify(array_lineamientos_relacionadas));
        formData.append('array_otrorequisito', JSON.stringify(array_otrorequisito));
        formData.append('array_iteracion', JSON.stringify(array_iteracion));
        formData.append('array_definicion', JSON.stringify(array_definicion));
        formData.append('array_politica', JSON.stringify(array_politica));
        formData.append('array_cambios', JSON.stringify(array_cambios));
        formData.append('array_registros', JSON.stringify(array_registros));
        formData.append('array_documentoreferencia', JSON.stringify(array_documentoreferencia));
        formData.append('tipo', tipo);

        $.ajax({
            url: '/api/solicitud',  
            type: metodo_save,
            headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $('#btn_modal_guardar').attr('disabled', 'disabled');
            },
            success: function(outserver, textStatus, xhr){

                if (xhr.status == 202) // Operacion exitosa
                {
                    $('#div_documento').addClass('display-none');
                    $('#div_listardocumento').removeClass('display-none');
                    $('#btn_modal_guardar').removeAttr('disabled');
                    mensajeExitosoToasts(outserver.msg.join('<br>'));
                    listar();
                }
            },
            //si ha ocurrido un error
            error: function(outerror){
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
                $('#btn_modal_guardar').removeAttr('disabled');
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }
*/

    function preAprobar(socilitud_id, poraprobar, orden)
    {
        solicitudseleccionada_id = socilitud_id;
        ordenseleccionada_id = orden;

        cargarDetalle(false, socilitud_id);

        if (poraprobar)
        {
            $("#btn_modal_guardar_aprobacion").removeClass('display-none');
        }
        else
        {
            $("#btn_modal_guardar_aprobacion").addClass('display-none');
        }
    }

    function guardarAprobacion()
    {
        $.ajax({
            url: '/api/solicitud_aprobacion',  
            type: 'POST',
            headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: $('#form_aprobacion').serialize(),
            beforeSend: function(){
                $('#btn_modal_guardar_aprobacion').attr('disabled', 'disabled');
                $('#btn_modal_rechazar_aprobacion').attr('disabled', 'disabled');
            },
            success: function(outserver, textStatus, xhr){

                if (xhr.status == 202) // Operacion exitosa
                {
                    mensajeExitosoToasts(outserver.msg.join('<br>'));
                    $('#modal_aprobacion').modal('close');
                    $('#modal_detalledocumento').modal('close');
                    $('#btn_modal_guardar_aprobacion').removeAttr('disabled');
                    $('#btn_modal_rechazar_aprobacion').removeAttr('disabled');
                    listar();
                }
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            $('#btn_modal_guardar_aprobacion').removeAttr('disabled');
            $('#btn_modal_rechazar_aprobacion').removeAttr('disabled');

            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function listar()
    {
        var numero_items = $('#numero_items').val(),
        page = last_page,
        find =  $('#find').val(),
        find_proceso_id =  $('#find_proceso_id').val(),
        numero_columnas = $(".table").children("thead").children('tr').children('th').length;

        $('#body_data').html(loadingPlain(numero_columnas));

        $.get('/api/solicitudesporaprobar',{find:find, proceso_id:find_proceso_id, page:page, numero_items:numero_items} ,function(data){
            $('#body_data').html('');

            var array_data = data.data;
            totalPages = data.last_page;
            visiblePages = 5;

            if (totalPages < 5)
            {
                visiblePages = totalPages;
            }

            var desde = data.from == null ? 0: data.from;
            var hasta = data.to == null ? 0: data.to;

            $('#registros').html('Registros de '+desde+' a '+hasta+' de '+data.total);

            if($('#pagination').data('twbs-pagination')){
                $('#pagination').twbsPagination('destroy');
                first_load = true;
            }

            $('#pagination').twbsPagination({
                totalPages: totalPages,
                visiblePages: visiblePages,
                startPage:page,
                first: '<i class="material-icons">first_page</i>',
                prev: '<i class="material-icons">navigate_before</i>',
                next: '<i class="material-icons">navigate_next</i>',
                last: '<i class="material-icons">last_page</i>',
                onPageClick: function (event, page) {
                    last_page = page;

                    if (!first_load)
                    {
                        listar();
                    }

                    first_load = false;
                }
            }).on('page', function (event, page) {

            });

            $.each(array_data, function (key, val){

                var html_documento = '';

                if (val.archivo_url != '')
                {
                    html_documento = '<a target="_blank" href="'+BASE_PUBLIC_PATH+'/Evidenciasolicitud/'+val.archivo_url+'">Ver evidencia</a>';
                }

                $('#body_data').append('\
                <tr >\
                    <td>\
                        <label>\
                            <input type="checkbox" id="check'+val.id+'" name="id[]" value="'+val.id+'" class="checkinput" onclick="checkbox(event)">\
                            <span></span> \
                        </label>\
                    </td>\
                    <td>'+val.tipodocumental_nombre+'</td>\
                    <td>'+val.proceso_nombre+'</td>\
                    <td>'+val.persona_nombre+'</td>\
                    <td>'+val.codificacion+' '+val.nombre+'</td>\
                    <td>'+val.descripcion+'</td>\
                    <td>'+val.nivelconfidencial+'</td>\
                    <td><a target="_blank" href="'+BASE_PUBLIC_PATH+'/Evidenciasolicitud/'+val.archivo_url_acta+'">Ver evidencia</a></td>\
                    <td>'+html_documento+'</td>\
                    <td>'+tipoSolicitud(val.tipo)+'</td>\
                    <td>'+(val.poraprobar == true? '<a title="Aprobar/Rechazar semillero" onClick="preAprobar('+val.id+','+val.poraprobar+', '+val.orden+')" class="mb-6 btn-floating waves-effect waves-light green darken-1"><i class="material-icons">check</i></a>':'<div class="chip gray black-text font-weight-bold">No disponible para aprobación</div>')+'</td>\
                </tr>');
            });

            if (array_data.length == 0)
            {
                $('#body_data').html('<tr ><td class="center" colspan="'+numero_columnas+'">No se encontraron datos</td></tr>');
            }

            verificaBotones();
            seleccionarCheckbox();

        }).fail(function(jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }