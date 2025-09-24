var last_page = 1,
totalPages = 2,
visiblePages = 2,
first_load = true,

last_page_documento = 1,
totalPages_documento = 2,
visiblePages_documento = 2,
first_load_documento = true,

send = true,
metodo_save = "POST";

$(document).ready(function(){
    botones = [ //  nroseleccionados: 1 para unos solo y 0 para todos los registros
        {
            id: 'btn-editar',
            nombre: 'Modificar',
            nroseleccionados: 1
        }
    ];

    $('#modal_solicitudasociacion').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#modal_solicitudasociacion').modal('close');
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

    $('#btn-editar').click(function(){
        metodo_save = 'PUT';
        $("#titlemodal").html('Gestión de solicitud asociación');
        $('#form_solicitudasociacion')[0].reset();
        obternerRecurso();
    });

    $('#btn_modal_guardar').click(function(){
        send = true;
        $('#form_solicitudasociacion').submit();
    });

    $('#form_solicitudasociacion').validate({ // initialize the plugin
        rules: {
                    id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    justificacion:{
                        required: true,
                        maxlength:6000
                        },
                    estadosolicitud:{
                        required: true
                        }
        },
        messages: {
                    id:{
                        required: "El campo id es obligatorio",
                        number: "El campo id deber numérico",
                        min: "El campo id deber de mínimo 1"
                        },
                    justificacion:{
                        required: "El campo Justificación de la asociación es obligatorio",
                        maxlength: "El campo Justificación de la asociación fuera de rango"
                        },
                    estadosolicitud:{
                        required: "El campo  estado es obligatorio",
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

    listar();
});

    function guardar()
    {
        $.ajax({
            url: '/api/aprobarsolicitudasociacion',  
            type: 'POST',
            headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: $('#form_solicitudasociacion').serialize(),
            beforeSend: function(){
                $('#btn_modal_guardar').attr('disabled', 'disabled');
            },
            success: function(outserver, textStatus, xhr){

                if (xhr.status == 202) // Operacion exitosa
                {
                    $('#modal_solicitudasociacion').modal('close');
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
        numero_columnas = $(".table").children("thead").children('tr').children('th').length;

        $('#body_data').html(loadingPlain(numero_columnas));

        $.get('/api/aprobarsolicitudasociacion',{find:find, page:page, numero_items:numero_items, estado: 'P'} ,function(data){
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
                    <td>'+val.documento_nombre+'</td>\
                    <td>'+val.procesopropietario_nombre+'</td>\
                    <td>'+val.procesosolicitante_nombre+'</td>\
                    <td>'+val.justificacion+'</td>\
                    <td>'+val.persona_nombre+'</td>\
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

    function obternerRecurso()
    {
        var registros = $(".table input[name='id[]']:checked").map(function(){
            return $(this).val();
        }).get();

        if (registros.length > 0 && registros.length < 2)
        {
            var id = registros[0];

            $.get('/api/obtenersolicitudasociacion/'+id,function(data){
                $('#id').val(data.id);
                $('#div_documento_nombre').html(data.documento_nombre);

                $('#modal_solicitudasociacion').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }
