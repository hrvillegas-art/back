var last_page = 1,
totalPages = 2,
visiblePages = 2,
first_load = true,
send = true,
tipo = 'C',
array_procesos_asociados = [],
array_norma_relacionadas = [],
array_tipodocumental = [];
metodo_save = "POST";

$(document).ready(function(){
    botones = [ //  nroseleccionados: 1 para unos solo y 0 para todos los registros
        {
            id: 'btn_eliminar',
            nombre: 'Eliminar',
            nroseleccionados: 1
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

    $('#modal_documento').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#modal_documento').modal('close');
    });

    $('#numero_items').change(function(event){
        listar();
    });

    $('#tipodocumental_id').change(function(event){
        var tipodocumental_id = $(this).val();

        if (tipodocumental_id != '')
        {
            const obj_tipodocumental = array_tipodocumental.find(element => element.id == tipodocumental_id);

            var array_plantilla = obj_tipodocumental.array_plantilla;

            var text_estenciones = [];

            $("#div_descargaplantilla").html('');

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
        }
        else
        {
            $("#div_descargaplantilla").css('display','none');
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

    $('#btn-agregar').click(function(){
        $('#form_documento')[0].reset();
        $("#titlemodal").html('Crear solicitud de creación');
        $('#modal_documento').modal('open');
        metodo_save = 'POST';
        array_procesos_asociados = [];
        listaProcesosAsociados();
        array_norma_relacionadas = [];
        listaNormasAsociados();
        $('#id').val(0);
        tipo = 'C';
    });

    $('#btn-editar').click(function(){
        metodo_save = 'POST';
        $("#titlemodal").html('Crear solicitud de edición');
        $('#form_documento')[0].reset();
        array_procesos_asociados = [];
        listaProcesosAsociados();
        array_norma_relacionadas = [];
        listaNormasAsociados();
        obternerRecurso();
        tipo = 'A';
    });

    $('#btn_eliminar').click(function(){
        var array_ids = $(".table input[name='id[]']:checked").map(function(){
            return parseInt($(this).val());
        }).get();

        mensajeConfirmacionModal('Solicitar eliminación', '¿Esta seguro que desea enviar la solicitud de eliminación del documento?', function(){
            eliminar(array_ids[0]);
        });
    });

    $('#btn_modal_guardar').click(function(){
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
        return archivofile.size <=  (parseInt(TAMANIOARCHIVO)*1024*1024);
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
                            required: true,
                            maxlength:255,
                            tamanio: true,
                            extension:'pdf'
                        },
                    visualizacion:{
                        required: false
                        },
                    impresion:{
                        required: false
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
                guardar();
            return false; // for demo
        }
    });

    $("#btn_showmodalasignarproceso").click(function(){
        $('#modal_asignarproceso').modal('open');
        $("#btn-asignarprocesobuscartodo").click();
    });

    $("#btn_showmodalasignarnorma").click(function(){
        $('#modal_asignarnorma').modal('open');
        $("#btn-asignarnormabuscartodo").click();
    });

    $("#btn_showmodalasignarfuncionario").click(function(){
        $('#modal_asignarfuncionario').modal('open');
        $("#btn-asignarfuncionariobuscartodo").click();
    });

    listar();
    listarTipoDocumental();
});

    function guardar()
    {
        asignarProceso($("#proceso_id").val(), $('select[name="proceso_id"] option:selected').text(), '');

        var formData = new FormData(document.getElementById("form_documento"));
        formData.append('array_procesos_relacionados', JSON.stringify(array_procesos_asociados));
        formData.append('array_norma_relacionadas', JSON.stringify(array_norma_relacionadas));
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
                    $('#modal_documento').modal('close');
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

        $.get('/api/documento',{find:find, proceso_id:find_proceso_id, page:page, numero_items:numero_items} ,function(data){
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
                    <td><a target="_blank" href="'+BASE_PUBLIC_PATH+'/Evidenciadocumento/'+val.archivo_url_acta+'">Ver evidencia</a></td>\
                    <td><a target="_blank" href="'+BASE_PUBLIC_PATH+'/Evidenciadocumento/'+val.archivo_url+'">Ver evidencia</a></td>\
                    <td style="text-align:center">'+(val.visualizacion == true ? '<i class="material-icons green-text">check</i>': '<i class="material-icons pink-text">clear</i>')+'</td>\
                    <td>'+(val.impresion == true ? '<i class="material-icons green-text">check</i>': '<i class="material-icons pink-text">clear</i>')+'</td>\
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

    function obternerRecurso()
    {
        var registros = $(".table input[name='id[]']:checked").map(function(){
            return $(this).val();
        }).get();

        if (registros.length > 0 && registros.length < 2)
        {
            var id = registros[0];

            $.get('/api/documento/'+id,function(data){
                $('#id').val(0);
                $('#tipodocumental_id').val(data.tipodocumental_id);
                $('#solicitud_id').val(data.solicitud_id);
                $('#proceso_id').val(data.proceso_id);
                $('#persona_id').val(data.persona_id);
                $('#nombre').val(data.nombre);
                $('#descripcion').val(data.descripcion);
                $('#nivelconfidencial').val(data.nivelconfidencial);
                $('#version').val(data.version);
                $('#fechaaprobacion').val(data.fechaaprobacion);
                $('input[name="visualizacion"]').prop("checked", data.visualizacion);
                $('input[name="impresion"]').prop("checked", data.impresion);

                var array_procesos_relacionados = data.array_procesos_relacionados;

                array_procesos_relacionados.forEach(element => {
                    asignarProceso(element.proceso_id, element.obj_proceso.nombre, '');
                });

                var array_norma_relacionadas = data.array_norma_relacionadas;

                array_norma_relacionadas.forEach(element => {
                    asignarNorma(element.norma_id, element.obj_norma.nombre);
                });

                $('#modal_documento').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function eliminar(id)
    {
        $.ajax({
            url: '/api/documento',  
            type: 'DELETE',
            headers:{'X-CSRF-TOKEN': $('input[name="_token"]').val()},
            data: {id:id},
            success: function(outserver, textStatus, xhr){
                mensajeExitosoToasts('La solicitud de eliminación de documento ha sido enviada');
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