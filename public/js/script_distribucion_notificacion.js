var last_page = 1,
totalPages = 2,
visiblePages = 2,
first_load = true,
send = true,
metodo_save = "POST";

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

    $('#modal_distribucion_notificacion').modal();

    $('#persona_id').select2({
        dropdownParent: $('#modal_distribucion_notificacion'),
        placeholder: 'Buscar funcionario',
        minimumInputLength: 1, // Inicia la búsqueda después de 1 carácter
        ajax: {
            url: '/api/listarfuncionario',
            dataType: 'json',
            delay: 250, // Retardo en milisegundos para las solicitudes AJAX
            data: function (params) {
                return {
                    find: params.term, // El término de búsqueda
                    page: 1, // Página actual
                    numero_items: 10// Número de elementos por página
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
    
                // Devuelve los datos formateados para Select2
                return {
                    results: $.map(data.data, function (item) {
                        return {
                            id: item.identificacion,
                            text: item.nombres + ' ' + item.apellidos
                        };
                    }),
                    pagination: {
                        more: data.more // Indica si hay más páginas
                    }
                };
            },
            cache: true
        }
    });
    

    $('#btn_modal_cancelar').click(function(){
        $('#modal_distribucion_notificacion').modal('close');
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

    $('#btn-agregar').click(function(){
        $('#form_distribucion_notificacion')[0].reset();
        $("#titlemodal").html('Agregrar funcionario a lista de notificación');
        $('#modal_distribucion_notificacion').modal('open');
        metodo_save = 'POST';
        $('#id').val(0);
    });

    $('#btn-editar').click(function(){
        metodo_save = 'PUT';
        $("#titlemodal").html('Editar funcionario a lista de notificación');
        $('#form_distribucion_notificacion')[0].reset();
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
        $('#form_distribucion_notificacion').submit();
    });
    $('#form_distribucion_notificacion').validate({ // initialize the plugin
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
                    tipodocumental_id:{
                        required: "El campo Identificador del documento tipo formato es obligatorio",
                        number: "El campo Identificador del documento tipo formato deber numérico",
                        min: "El campo Identificador del documento tipo formato deber de mínimo 1"
                        },
                    persona_id:{
                        required: "El campo Identificador de la persona es obligatorio",
                        number: "El campo Identificador de la persona deber numérico",
                        min: "El campo Identificador de la persona deber de mínimo 1"
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
            url: '/api/distribucion_notificacion',  
            type: metodo_save,
            headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: $('#form_distribucion_notificacion').serialize(),
            beforeSend: function(){
                $('#btn_modal_guardar').attr('disabled', 'disabled');
            },
            success: function(outserver, textStatus, xhr){

                if (xhr.status == 202) // Operacion exitosa
                {
                    $('#modal_distribucion_notificacion').modal('close');
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

        $.get('/api/distribucion_notificacion',{find:find, page:page, numero_items:numero_items} ,function(data){
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
                    <td>'+val.primer_nombre+' '+val.segundo_nombre+' '+val.primer_apellido+' '+val.segundo_apellido+'</td>\
                    <td>'+val.correoinstitucional+'</td>\
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
            url: '/api/distribucion_notificacion/'+ids+'/activo',  
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

            $.get('/api/distribucion_notificacion/'+id,function(data){
                $('#id').val(data.id);
                $('#tipodocumental_id').val(data.tipodocumental_id);

                const personaId = data.identificacion; // El ID de la persona en el registro
                const personaNombre = data.primer_nombre+' '+data.segundo_nombre+' '+data.primer_apellido+' '+data.segundo_apellido; // El nombre que debe aparecer seleccionado

                // Agregar la opción al Select2 si no está presente
                const option = new Option(personaNombre, personaId, true, true);
                $('#persona_id').append(option).trigger('change');

                $('#modal_distribucion_notificacion').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function eliminar(array_ids)
    {
        $.ajax({
            url: '/api/distribucion_notificacion',  
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

    function listarFuncionario()
    {
        $.get('/api/listarfuncionario',{find:'', page:1, numero_items:15} ,function(data){
            
            var array_data = data.data;

            $.each(array_data, function (key, val){
                $('#persona_id').append('\
                <option value="'+val.id+'">\
                    '+val.nombres+' '+val.apellidos+'\
                </option>');
            });

        }).fail(function(jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }
