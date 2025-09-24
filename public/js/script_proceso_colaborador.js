var last_page = 1,
totalPages = 2,
visiblePages = 2,
first_load = true,
send = true,
metodo_save = "POST",

last_page_persona = 1,
totalPages_persona = 2,
visiblePages_persona = 2,
first_load_persona = true;

$(document).ready(function(){
    botones = [ //  nroseleccionados: 1 para unos solo y 0 para todos los registros
        {
            id: 'btn-eliminar',
            nombre: 'Eliminar',
            nroseleccionados: 0
        }
    ];

    $('#modal_proceso_colaborador').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#modal_proceso_colaborador').modal('close');
    });

    $('#numero_items').change(function(event){
        listar();
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

    $('#btn-agregar').click(function(){
        $('#form_proceso_colaborador')[0].reset();
        $("#titlemodal").html('Gestionar colaboradores');
        $('#modal_proceso_colaborador').modal('open');
        metodo_save = 'POST';
        $('#id').val(0);
        listarPersona();
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
        $('#form_proceso_colaborador').submit();
    });
    $('#form_proceso_colaborador').validate({ // initialize the plugin
        rules: {
                    id:{
                       required: true,
                        number: true,
                        min: 1}
                        ,
                    proceso_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    persona_id:{
                        required: true,
                        number: true,
                        min: 1
                        }
        },
        messages: {
                    id:{
                        required: "El campo id es obligatorio",
                        number: "El campo id deber numérico",
                        min: "El campo id deber de mínimo 1"
                        },
                    proceso_id:{
                        required: "El campo Proceso es obligatorio",
                        number: "El campo Proceso deber numérico",
                        min: "El campo Proceso deber de mínimo 1"
                        },
                    persona_id:{
                        required: "El campo Colaborador relacionado es obligatorio",
                        number: "El campo Colaborador relacionado deber numérico",
                        min: "El campo Colaborador relacionado deber de mínimo 1"
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

});

    function guardar()
    {
        $.ajax({
            url: '/api/proceso_colaborador',  
            type: metodo_save,
            headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: $('#form_proceso_colaborador').serialize(),
            beforeSend: function(){
                $('#btn_modal_guardar').attr('disabled', 'disabled');
            },
            success: function(outserver, textStatus, xhr){

                if (xhr.status == 202) // Operacion exitosa
                {
                    $('#modal_proceso_colaborador').modal('close');
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
        proceso_id = $("#proceso_id").val(),
        numero_columnas = $(".table").children("thead").children('tr').children('th').length;

        $('#body_data').html(loadingPlain(numero_columnas));

        $.get('/api/proceso_colaborador',{proceso_id:proceso_id, find:find, page:page, numero_items:numero_items} ,function(data){
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
                    <td>'+val.proceso_nombre+'</td>\
                    <td>'+val.persona_nombre+'</td>\
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
            url: '/api/proceso_colaborador/'+ids+'/activo',  
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

    function eliminar(array_ids)
    {
        $.ajax({
            url: '/api/proceso_colaborador',  
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
                    <td><a onclick="Asignar('+val.identificacion+')" id="btn-personabuscar" class="btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 26px; line-height:0px" >Asignar</a></td>\
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

    function Asignar(id)
    {
        $("#persona_id").val(id);

        guardar();
    }