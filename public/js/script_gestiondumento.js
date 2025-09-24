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
tipo = 'C',
cantidad_cambios = 0;
habilitar_edicion = true;

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

    $('#btn_modal_cancelar').click(function(){
        $('#div_documento').addClass('display-none');
        $('#div_listardocumento').removeClass('display-none');
    });

    $('#numero_items').change(function(event){
        listar();
    });

    $('#caracteristica').change(function(event){
        var caracter = $(this).val();

        activarFormulario(caracter);
        
    });

    $('#tipodocumental_id').change(function(event){
        var tipodocumental_id = $(this).val();

        $("#div_descargaplantilla").html('');

        if (tipodocumental_id > 2)
        {
            const obj_tipodocumental = array_tipodocumental.find(element => element.id == tipodocumental_id);

            var array_plantilla = obj_tipodocumental.array_plantilla;

            var text_estenciones = [];

            array_plantilla.forEach(element => {
                text_estenciones.push(element.obj_plantilla.tipoextension);

                $("#div_descargaplantilla").append(' <div class="input-field col m6 l6 s12"><a href="'+BASE_PUBLIC_PATH+'/Evidenciaplantilla/'+element.obj_plantilla.archivo_url+'">Clic para descargar '+element.obj_plantilla.nombre+'</a></div>');    
            });

            $("#div_descargaplantilla").css('display','');

            $('#archivo_url').rules( "add", {
                extension: text_estenciones.join(','),
                messages: {
                    extension: "Extensión no permitida, solo se puede adjuntar archivos en formato "+text_estenciones.join(',')
                }
            });

            if (tipodocumental_id == 3)
            {
                $("#div_trd").removeClass('display-none');
            }
            else
            {
                $("#div_trd").addClass('display-none');
            }
        }
        else
        {
            $("#div_descargaplantilla").css('display','none');
        }

        switch (tipodocumental_id) {
            case "1":
                $("#caracteristica").val("MATRIZ");
                activarFormulario("MATRIZ");
                break;
            case "2":
                $("#caracteristica").val("PROCEDIMIENTO");
                activarFormulario("PROCEDIMIENTO");
                break;
            default:
                $("#caracteristica").val("PLANTILLA");
                activarFormulario("PLANTILLA");
                break;
        }
    });
    
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

    $('#btn-editar').click(function(){
        metodo_save = 'POST';
        $("#title_div_documento").html('Editar documento');
        $('#form_documento')[0].reset();
        $("#span_textbtn_id").html('Enviar solicitud de edición');
        limpiarArrrays();
        obternerRecurso();
        tipo = 'A';
        habilitar_edicion = true;
    });

    $('#btn-eliminar').click(function(){
        metodo_save = 'POST';
        $("#title_div_documento").html('Eliminar documento');
        $("#span_textbtn_id").html('Enviar solicitud de eliminación');
        $('#form_documento')[0].reset();
        limpiarArrrays();
        obternerRecurso();
        tipo = 'E';
        habilitar_edicion = false;
    });

    $('#btn_modal_guardar').click(function(){
        validacionArray();
        send = true;
        $('#form_documento').submit();
    });

    $('#fechaaprobacion').bootstrapMaterialDatePicker({ 
        format : 'YYYY-MM-DD',
        lang: 'es', 
        weekStart : 0,
        maxDate: moment(),
        time: false
    });

    $.validator.addMethod( "tamanio", function( value, element ) {
        var archivofile = element.files[0];
        if (archivofile)
        {
            return archivofile.size <=  (parseInt(TAMANIOARCHIVO)*1024*1024);
        }

        return true;
        
    }, "El tamaño del archivo debe ser menor o igual a "+TAMANIOARCHIVO+' MB' );

    $("#archivo_url").change(function()
    {
        $("#archivo_url").blur();
    });

    $('#form_documento').validate({ // initialize the plugin
        rules: {
                    id:{
                       required: true,
                        number: true,
                        min: 1}
                        ,
                    caracteristica:{
                        required: true
                    },
                    tipodocumental_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    solicitud_id:{
                        number: true,
                        min: 1
                        },
                    proceso_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    persona_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    nombre:{
                        required: true,
                        maxlength:255
                        },
                    version:{
                        required: true,
                        maxlength:255
                        },
                    fechaaprobacion:{
                        required: true,
                        date: true
                        },
                    descripcion:{
                        required: true,
                        maxlength:6000
                        },
                    nivelconfidencial:{
                        required: true,
                        maxlength:255
                        },
                    archivo_url:{
                        required: true,
                        maxlength:255,
                        tamanio: true
                        },
                archivo_url_acta:{
                        required: false,
                        maxlength:255,
                        tamanio: true,
                        extension:'pdf'
                        },
                    visualizacion:{
                        required: false
                        },
                    impresion:{
                        required: false
                        },
                    usuariomatriz:{
                        required: true,
                        maxlength:6000
                        },
                    objetivo:{
                        required: true,
                        maxlength:6000
                        },
                    alcance:{
                        required: true,
                        maxlength:6000
                        }
                    
        },
        messages: {
                    id:{
                        required: "El campo id es obligatorio",
                        number: "El campo id deber numérico",
                        min: "El campo id deber de mínimo 1"
                        },
                    tipodocumental_id:{
                        required: "El campo Tipo de documental es obligatorio",
                        number: "El campo Tipo de documental deber numérico",
                        min: "El campo Tipo de documental deber de mínimo 1"
                        },
                    solicitud_id:{
                        number: "El campo Solicitud por medio de la cual fue creado deber numérico",
                        min: "El campo Solicitud por medio de la cual fue creado deber de mínimo 1"
                        },
                    proceso_id:{
                        required: "El campo Proceso al que pertenece es obligatorio",
                        number: "El campo Proceso al que pertenece deber numérico",
                        min: "El campo Proceso al que pertenece deber de mínimo 1"
                        },
                    persona_id:{
                        required: "El campo Identificador de la persona que crea el documento es obligatorio",
                        number: "El campo Identificador de la persona que crea el documento deber numérico",
                        min: "El campo Identificador de la persona que crea el documento deber de mínimo 1"
                        },
                    nombre:{
                        required: "El campo Nombre del documento es obligatorio",
                        maxlength: "El campo Nombre del documento fuera de rango"
                        },
                    descripcion:{
                        required: "El campo Descripción del documento es obligatorio",
                        maxlength: "El campo Descripción del documento fuera de rango"
                        },
                    caracteristica:{
                        required: "El campo Caracteristica del documento es obligatorio",
                        },
                    nivelconfidencial:{
                        required: "El campo Nivel de confidencialidad es obligatorio",
                        maxlength: "El campo Nivel de confidencialidad fuera de rango"
                        },
                    version:{
                        required:"El campo  versión es obligatorio",
                        maxlength: "El campo versión fuera de rango"
                        },
                    fechaaprobacion:{
                        required: "El campo fecha de aprobación es obligatorio",
                        date: "El campo fecha de aprobación debe ser una fecha valida"
                        },
                    archivo_url:{
                        required: "El campo Acta de mejoramiento es obligatorio",
                        maxlength: "El campo Acta de mejoramiento fuera de rango"
                        },
                    archivo_url_acta:{
                        required: "El campo Acta de mejoramiento es obligatorio",
                        maxlength: "El campo Acta de mejoramiento fuera de rango",
                        extension: "Extensión no permitida, solo se puede adjuntar archivos en formato pdf"
                        },
                    visualizacion:{
                        required: "El campo Permitir visualización del documento es obligatorio"
                        },
                    impresion:{
                        required: "El campo Permitir imprimir del documento es obligatorio"
                    },
                    usuariomatriz:{
                        required: "El campo usuarios es obligatorio",
                        maxlength: "El campo usuarios fuera de rango",
                    },
                    objetivo:{
                        required: "El campo objetivo es obligatorio",
                        maxlength: "El campo objetivo fuera de rango",
                        },
                    alcance:{
                        required: "El campo alcance es obligatorio",
                        maxlength: "El campo alcance fuera de rango",
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

            if (validacionArray())
            {
                guardar();
            }
            return false; // for demo
        }
    });

    listar();
    listarTipoDocumental();

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
            url: '/api/guardardocumentoreferencia',  
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

    function limpiarArrrays()
    {
        array_procesos_asociados = [];
        listaProcesosAsociados();
        array_norma_relacionadas = [];
        listaNormasAsociados();
        array_lineamientos_relacionadas = [];
        listaLineamientoAsociados();
        array_actividades = [];
        listaractividad()
        array_otrorequisito = [];
        listarotrorequisito();
        array_iteracion = [];
        listarIteracion();
        array_definicion = [];
        listarDefinicion();
        array_politica = [];
        listarPolitica();
        array_cambios = [];
        listarCambios();
        array_registros = [];
        listarRegistros();
        array_documentoreferencia = [];
        listarDocumentosreferencia();
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

            if (array_cambios.length == cantidad_cambios && tipo == 'A')
            {
                $("#div_error_cambios").html('El procedimiento debe tener la descripción del cambio a realizar');
                valido = false;
            }
            else
            {
                $("#div_error_cambios").html('');
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

    function listar()
    {
        var numero_items = $('#numero_items').val(),
        page = last_page,
        find =  $('#find').val(),
        find_proceso_id =  $('#find_proceso_id').val(),
        numero_columnas = $(".table").children("thead").children('tr').children('th').length;

        $('#body_data').html(loadingPlain(numero_columnas));

        $.get('/api/gestionardocumento',{find:find, proceso_id:find_proceso_id, page:page, numero_items:numero_items, estado: 'A'} ,function(data){
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
                    <td style="text-align:center">'+(val.visualizacion == true ? '<i class="material-icons green-text">check</i>': '<i class="material-icons pink-text">clear</i>')+'</td>\
                    <td>'+(val.impresion == true ? '<i class="material-icons green-text">check</i>': '<i class="material-icons pink-text">clear</i>')+'</td>\
                    <td>'+tipoSolicitud(val.tipo)+'</td>\
                    <td>'+estadoSolicitud(val.estado)+'</td>\
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

    function tooglebutton(id, estado, prefix = 'tooglebutton') {
        textoestado = estado ? 'Activo' : 'Inactivo';
        checked = estado ? 'checked' : '';
        html = `<div class="switch">
                    <label for="${prefix}${id}">

                    <input id="${prefix}${id}" data-id="${id}" ${checked}  type="checkbox" onclick="preActivado(event)">
                    <span class="lever"></span>

                    </label>
                </div>`;

        return html;
    }

    function preActivado(event)
    {
        event.preventDefault();
        ids = [$(event.target).data('id')];
        estado = $(event.target).prop('checked');
        Activado(ids, estado);
    }

    function Activado(ids, estado)
    {
        $.ajax({
            url: '/api/solicitud/'+ids+'/activo',  
            type: 'PUT',
            headers:{'X-CSRF-TOKEN': $('input[name="_token"]').val()},
            data: {estado:estado},
            success: function(outserver, textStatus, xhr){
                mensajeExitosoToasts('El estado fue actualizado correctamente');
                listar();
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function obternerRecurso()
    {
        var registros = $(".table input[name='id[]']:checked").map(function(){
            return $(this).val();
        }).get();

        if (registros.length > 0 && registros.length < 2)
        {
            var id = registros[0];

            $.get('/api/obtenerdocumento/'+id,function(data){
                    $('#div_documento').removeClass('display-none');
                    $('#div_listardocumento').addClass('display-none');

                    $('#id').val(0);
                    $('#solicitud_id').val(data.id);
                    $('#tipodocumental_id').val(data.tipodocumental_id).change();
                    $('#caracteristica').val(data.caracteristica);
                    $('#proceso_id').val(data.proceso_id);
                    $('#persona_id').val(data.persona_id);
                    $('#nombre').val(data.nombre);
                    $('#descripcion').val(data.descripcion);
                    $('#nivelconfidencial').val(data.nivelconfidencial);
                    $('#version').val(data.version);
                    $('#fechaaprobacion').val(data.fechaaprobacion);
                    $('input[name="visualizacion"]').prop("checked", data.visualizacion);
                    $('input[name="impresion"]').prop("checked", data.impresion);
                    $('#usuariomatriz').val(data.usuarios);

                    var array_procesos_relacionados = data.array_procesos_relacionados;

                    array_procesos_relacionados.forEach(element => {
                        asignarProceso(element.proceso_id, element.obj_proceso.nombre, '');
                    });

                    var array_norma_relacionadas = data.array_norma_relacionadas;

                    array_norma_relacionadas.forEach(element => {
                        asignarNorma(element.norma_id, element.obj_norma.nombre);
                    });

                    array_actividades = [];

                    data.array_actividades.forEach(element => {
                        var obj = element;
                        obj.tipoactividad_nombre = element.obj_tipo.nombre;
                        array_actividades.push(obj);
                    });

                    listaractividad();

                    array_lineamientos_relacionadas = [];

                    data.array_lineamientos.forEach(element => {
                        var obj = element;
                        obj.id = element.obj_lineamiento.id;
                        obj.nombre = element.obj_lineamiento.nombre;
                        obj.anio = element.obj_lineamiento.anio;
                        array_lineamientos_relacionadas.push(obj);
                    });

                    listaLineamientoAsociados();

                    array_otrorequisito = data.array_otrosrequisitos;

                    listarotrorequisito();

                    if (data.tipodocumental_id == 3)
                    {
                        var obj_solicitudtrd = data.obj_solicitudtrd;

                        $('#responsableregistro').val(obj_solicitudtrd.responsable);
                        $('#lugararchivo').val(obj_solicitudtrd.lugararchivo);
                        $('#medioarchivo').val(obj_solicitudtrd.medioarchivo);
                        $('#tiempoarchivo').val(obj_solicitudtrd.tiempoarchivo);
                        $('#disposicion').val(obj_solicitudtrd.disposicion);
                    }

                    var obj_procedimiento = data.obj_procedimiento;

                    if (obj_procedimiento != null)
                    {
                        $('#objetivo').val(obj_procedimiento.objetivo);
                        $('#alcance').val(obj_procedimiento.alcance);

                        array_definicion = obj_procedimiento.array_definicion;
                        listarDefinicion();

                        array_politica = obj_procedimiento.array_politica;
                        listarPolitica();

                        array_iteracion =  obj_procedimiento.array_iteracion;
                        listarIteracion();

                        obj_procedimiento.array_documentoreferencia.forEach(element => {
                            array_documentoreferencia.push(
                                {
                                    id : element.obj_documentoreferencia.id,
                                    nombre : element.obj_documentoreferencia.nombre, 
                                    fechaemision:element.obj_documentoreferencia.fechaemision, 
                                    descripcion:element.obj_documentoreferencia.descripcion,
                                    ente: element.obj_documentoreferencia.ente
                                }
                            );
                        });
                       
                        listarDocumentosreferencia();


                        obj_procedimiento.array_registros.forEach(element => {
                            array_registros.push({
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

                        listarRegistros();

                        array_cambios = obj_procedimiento.array_cambios;
                        cantidad_cambios = array_cambios.length;
                        listarCambios();
                    }

                    habilitarEdicion();

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function eliminar(array_ids)
    {
        $.ajax({
            url: '/api/solicitud',  
            type: 'DELETE',
            headers:{'X-CSRF-TOKEN': $('input[name="_token"]').val()},
            data: {array_ids:array_ids},
            success: function(outserver, textStatus, xhr){
                mensajeExitosoToasts('Se eliminaron <span style="color:red;font-size:17px">'+outserver.length+'</span> de <span style="color:blue;font-size:17px">'+array_ids.length+'</span> Registros');
                listar();
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function listarTipoDocumental()
    {
        $("#tipodocumental_id").html('<option value="">Seleccione</option>');

        $.get('/api/listartipodocumental',{find:'', page:1, numero_items:1000},function(data){

            array_tipodocumental = data.data;

            $.each(array_tipodocumental, function (key, val){
                $("#tipodocumental_id").append('<option value="'+val.id+'">'+val.nombre+'</option>');
            });
        });
    }

    function habilitarEdicion()
    {
        if (habilitar_edicion)
        {
            $('td a').show();
            $('li > div > a').show();
        }
        else
        {
            $('td a').hide();
            $('li > div > a').hide();            
        }
    }