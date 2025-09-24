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

    $('#modal_persona').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#modal_persona').modal('close');
    });

    $('#numero_items').change(function(event){
        listar();
    });

    $('#btn-buscar').click(function(event){

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
        last_page = 1
        listar();
    });

    $('#btn-agregar').click(function(){
        $('#form_persona')[0].reset();
        $("#titlemodal").html('Crear persona');
        $('#modal_persona').modal('open');
        metodo_save = 'POST';
        $('#id').val(0);
    });

    $('#btn-editar').click(function(){
        metodo_save = 'PUT';
        $("#titlemodal").html('Editar persona');
        $('#form_persona')[0].reset();
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
        $('#form_persona').submit();
    });
    $('#form_persona').validate({ // initialize the plugin
        rules: {
                    id:{
                       required: true,
                        number: true,
                        min: 1}
                        ,
                    tipodocumento_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    identificacion:{
                        required: true,
                        maxlength:255
                        },
                    primernombre:{
                        required: true,
                        maxlength:255
                        },
                    segundonombre:{
                        required: false,
                        maxlength:255
                        },
                    primerapellido:{
                        required: true,
                        maxlength:255
                        },
                    segundoapellido:{
                        required: false,
                        maxlength:255
                        },
                    sexo:{
                        required: true,
                        maxlength:255
                        },
                    municipio_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    direccion:{
                        required: true,
                        maxlength:255
                        },
                    telefonocelular:{
                        required: true,
                        maxlength:255
                        },
                    telefonofijo:{
                        required: false,
                        maxlength:255
                        },
                    correoelectronico:{
                        required: true,
                        maxlength:255,
                        email: true
                        }
        },
        messages: {
                    id:{
                        required: "El campo id es obligatorio",
                        number: "El campo id deber numérico",
                        min: "El campo id deber de mínimo 1"
                        },
                    tipodocumento_id:{
                        required: "El campo Tipo de documento es obligatorio",
                        number: "El campo Tipo de documento deber numérico",
                        min: "El campo Tipo de documento deber de mínimo 1"
                        },
                    identificacion:{
                        required: "El campo Número de identificación es obligatorio",
                        maxlength: "El campo Número de identificación fuera de rango"
                        },
                    primernombre:{
                        required: "El campo Primer nombre es obligatorio",
                        maxlength: "El campo Primer nombre fuera de rango"
                        },
                    segundonombre:{
                        required: "El campo Segundo nombre es obligatorio",
                        maxlength: "El campo Segundo nombre fuera de rango"
                        },
                    primerapellido:{
                        required: "El campo Primer apellido es obligatorio",
                        maxlength: "El campo Primer apellido fuera de rango"
                        },
                    segundoapellido:{
                        required: "El campo Segundo apellido es obligatorio",
                        maxlength: "El campo Segundo apellido fuera de rango"
                        },
                    sexo:{
                        required: "El campo Sexo es obligatorio",
                        maxlength: "El campo Sexo fuera de rango"
                        },
                    municipio_id:{
                        required: "El campo Municipio residencia es obligatorio",
                        number: "El campo Municipio residencia deber numérico",
                        min: "El campo Municipio residencia deber de mínimo 1"
                        },
                    direccion:{
                        required: "El campo Dirección residencia es obligatorio",
                        maxlength: "El campo Dirección residencia fuera de rango"
                        },
                    telefonocelular:{
                        required: "El campo teléfono celular es obligatorio",
                        maxlength: "El campo teléfono celular fuera de rango"
                        },
                    telefonofijo:{
                        required: "El campo teléfono fijo es obligatorio",
                        maxlength: "El campo teléfono fijo fuera de rango"
                        },
                    correoelectronico:{
                        required: "El campo Correo electronico es obligatorio",
                        maxlength: "El campo Correo electronico fuera de rango",
                        email: "Correo electrónico institucional invalido"
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
            url: '/api/persona',  
            type: metodo_save,
            headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: $('#form_persona').serialize(),
            beforeSend: function(){
                $('#btn_modal_guardar').attr('disabled', 'disabled');
            },
            success: function(outserver, textStatus, xhr){

                if (xhr.status == 202) // Operacion exitosa
                {
                    $('#modal_persona').modal('close');
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

        $.get('/api/persona',{find:find, page:page, numero_items:numero_items} ,function(data){
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
                    <td>'+val.tipodocumento_abreviatura+' '+val.identificacion+'</td>\
                    <td>'+val.persona_natural.primernombre+' '+val.persona_natural.segundonombre+' '+val.persona_natural.primerapellido+' '+val.persona_natural.segundoapellido+'</td>\
                    <td>'+val.telefonocelular+'</td>\
                    <td>'+val.persona_natural.correoinstitucional+'</td>\
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
            url: '/api/persona/'+ids+'/activo',  
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

            $.get('/api/persona/'+id,function(data){
                $('#id').val(data.id);
                $('#tipodocumento_id').val(data.tipodocumento_id);
                $('#identificacion').val(data.identificacion);
                $('#municipio_id').val(data.municipio_id);
                $('#direccion').val(data.direccion);
                $('#telefonocelular').val(data.telefonocelular);
                $('#telefonofijo').val(data.telefonofijo);
                $('#correoelectronico').val(data.persona_natural.correoinstitucional);

                $('#primernombre').val(data.persona_natural.primernombre);
                $('#segundonombre').val(data.persona_natural.segundonombre);
                $('#primerapellido').val(data.persona_natural.primerapellido);
                $('#segundoapellido').val(data.persona_natural.segundoapellido);
                $('#sexo').val(data.persona_natural.sexo);

                $('#modal_persona').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function eliminar(array_ids)
    {
        $.ajax({
            url: '/api/persona',  
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

