var last_page = 1,
totalPages = 2,
visiblePages = 2,

last_page_persona = 1,
totalPages_persona = 2,
visiblePages_persona = 2,
first_load_persona = true,

first_load = true,
send = true,
metodo_save = "POST",
array_numerales_existentes = [];

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
        }
    ];

    $('#modal_sistema, #modal_persona').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#modal_sistema').modal('close');
    });

    $('#numero_items').change(function(event){
        listar();
    });

    $('#input_coordinador').click(function(event){
        $('#modal_persona').modal('open');
        $("#body_data_persona").html('');
        $("#titlemodalpersona").html('Buscar lider');
        tipoasignacion = 'L';
        listarPersona();
    });

    $('#btn-personabuscartodo').click(function(event){
        $('#find_persona').val('');
        listarPersona();
    });

    $('#btn-personabuscar').click(function(event){

        var find = $('#find_persona').val();

        find = find.trim();

        if(find.length > 0)
        {
            listarPersona();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
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
        $('#form_sistema')[0].reset();
        $("#titlemodal").html('Crear sistema');
        $('#modal_sistema').modal('open');
        metodo_save = 'POST';
        $('#id').val(0);
        array_numerales_existentes = [];
        $('#body_data_normasasignadas').html('');
        listarNormas();
    });

    $('#btn-editar').click(function(){
        metodo_save = 'PUT';
        $("#titlemodal").html('Editar sistema');
        $('#form_sistema')[0].reset();
        array_numerales_existentes = [];
        $('#body_data_normasasignadas').html('');
        obternerRecurso();
    });

    $('#btn-eliminar').click(function(){
        var array_ids = $(".table input[name='id[]']:checked").map(function(){
            return parseInt($(this).val());
        }).get();

        mensajeConfirmacionModal('Eliminar recurso', '¿Esta seguro que desea eliminar los recursos?', function(){
            eliminar(array_ids);
        });

    });

    $('#btn_modal_guardar').click(function(){
        send = true;
        $('#form_sistema').submit();
    });

    $('#form_sistema').validate({ // initialize the plugin
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
                    abreviatura:{
                        required: true,
                        maxlength:255
                        },
                    descripcion:{
                        required: true,
                        maxlength:255
                        },
                    input_coordinador:{
                        required: true
                        }
        },
        messages: {
                    id:{
                        required: "El campo id es obligatorio",
                        number: "El campo id deber numérico",
                        min: "El campo id deber de mínimo 1"
                        },
                    nombre:{
                        required: "El campo Nombre es obligatorio",
                        maxlength: "El campo Nombre fuera de rango"
                        },
                    abreviatura:{
                        required: "El campo Abreviatura es obligatorio",
                        maxlength: "El campo Abreviatura fuera de rango"
                        },
                    descripcion:{
                        required: "El campo Descripción es obligatorio",
                        maxlength: "El campo Descripción fuera de rango"
                        },
                    input_coordinador:{
                        required: "El campo coordinador del sistema es obligatorio"
                        },
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

});

    function guardar()
    {
        var formData = new FormData(document.getElementById("form_sistema"));
        formData.append('array_numerales', JSON.stringify(array_numerales_existentes));

        $.ajax({
            url: '/api/sistema',  
            type: 'POST',
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
                    $('#modal_sistema').modal('close');
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

    listar();

    function listar()
    {
        var numero_items = $('#numero_items').val(),
        page = last_page,
        find =  $('#find').val(),
        numero_columnas = $(".table").children("thead").children('tr').children('th').length;

        $('#body_data').html(loadingPlain(numero_columnas));

        $.get('/api/sistema',{find:find, page:page, numero_items:numero_items} ,function(data){
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

            $.each(array_data, function (key, val)
            {
                const coordinador_nombre = val.coordinador_primernombre+" "+val.coordinador_segundonombre+" "+val.coordinador_primerapellido+" "+val.coordinador_segundoapellido;

                $('#body_data').append('\
                <tr >\
                    <td>\
                        <label>\
                            <input type="checkbox" id="check'+val.id+'" name="id[]" value="'+val.id+'" class="checkinput" onclick="checkbox(event)">\
                            <span></span> \
                        </label>\
                    </td>\
                    <td>'+val.nombre+'</td>\
                    <td>'+val.abreviatura+'</td>\
                    <td>'+val.descripcion+'</td>\
                    <td>'+coordinador_nombre+'</td>\
                    <td>'+tooglebutton(val.id, val.estado)+'</td>\
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
            url: '/api/sistema/'+ids+'/activo',  
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
        array_numerales_existentes = [];

        var registros = $(".table input[name='id[]']:checked").map(function(){
            return $(this).val();
        }).get();

        if (registros.length > 0 && registros.length < 2)
        {
            var id = registros[0];

            listarNormas();

            $.get('/api/sistema/'+id,function(data){
                $('#id').val(data.id);
                $('#nombre').val(data.nombre);
                $('#abreviatura').val(data.abreviatura);
                $('#descripcion').val(data.descripcion);
                $('#coordinador_id').val(data.coordinador_identificacion);
                $('#input_coordinador').val(data.coordinador_primernombre+' '+data.coordinador_segundonombre+' '+data.coordinador_primerapellido+' '+data.coordinador_segundoapellido);

                array_numerales_existentes = data.array_numerales;
                listarNormasAsignadas();
                $('#modal_sistema').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function eliminar(array_ids)
    {
        $.ajax({
            url: '/api/sistema',  
            type: 'DELETE',
            headers:{'X-CSRF-TOKEN': $('input[name="_token"]').val()},
            data: {array_ids:array_ids},
            success: function(outserver, textStatus, xhr){
                mensajeExitosoToasts('Los items eliminados exitosamente');
                listar();
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function listarPersona()
    {
        var numero_items = 10,
        page = last_page_persona,
        find =  $('#find_persona').val();

        $('#body_data_persona').html(loadingPlain(4));

        $.get('/api/listarfuncionario',{find:find, page:page, numero_items:numero_items} ,function(data){
            $('#body_data_persona').html('');

            var array_data_persona = data.data;
            totalPages_persona = data.last_page;
            visiblePages_persona = 5;

            if (totalPages_persona < 5)
            {
                visiblePages_persona = totalPages_persona;
            }

            var desde = data.from == null ? 0: data.from;
            var hasta = data.to == null ? 0: data.to;

            $('#registros_persona').html('Registros de '+desde+' a '+hasta+' de '+data.total);

            if($('#pagination_persona').data('twbs-pagination')){
                $('#pagination_persona').twbsPagination('destroy');
                first_load_persona = true;
            }

            $('#pagination_persona').twbsPagination({
                totalPages: totalPages_persona,
                visiblePages: visiblePages_persona,
                startPage:page,
                first: '<i class="material-icons">first_page</i>',
                prev: '<i class="material-icons">navigate_before</i>',
                next: '<i class="material-icons">navigate_next</i>',
                last: '<i class="material-icons">last_page</i>',
                onPageClick: function (event, page) {
                    last_page_persona = page;

                    if (!first_load_persona)
                    {
                        listarPersona();
                    }

                    first_load_persona = false;
                }
            }).on('page', function (event, page) {

            });

            $.each(array_data_persona, function (key, val){
                var nombre = val.nombres +' '+val.apellidos;

                $('#body_data_persona').append('\
                <tr >\
                    <td>'+nombre+'</td>\
                    <td>'+val.correo_institucional+'</td>\
                    <td><a onclick="Asignar('+val.identificacion+',\''+nombre+'\')" id="btn-personabuscar" class="btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 26px; line-height:0px" >Asignar</a></td>\
                </tr>');
            });

            if (array_data_persona.length == 0)
            {
                $('#body_data_persona').html('<tr ><td class="center" colspan="4">No se encontraron datos</td></tr>');
            }

        }).fail(function(jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function Asignar(id, nombre)
    {
        $("#coordinador_id").val(id);
        $("#input_coordinador").val(nombre);

        $('#modal_persona').modal('close');
    }
