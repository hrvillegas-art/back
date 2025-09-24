var last_page = 1,
totalPages = 2,
visiblePages = 2,
first_load = true,
send = true,
metodo_save = "POST",

last_page_numeral = 1,
totalPages_numeral = 2,
visiblePages_numeral = 2,
first_load_numeral = true,
array_numerales_exitentes = [];

$(document).ready(function(){
    botones = [ //  nroseleccionados: 1 para unos solo y 0 para todos los registros
        {
            id: 'btn-eliminar',
            nombre: 'Eliminar',
            nroseleccionados: 0
        }
    ];

    $('#modal_proceso_numeral').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#modal_proceso_numeral').modal('close');
    });

    $('#numero_items').change(function(event){
        listar();
    });

    $('#checkAll_numeral').on('click', function () {

        $(this).closest('.table_numeral').find('tbody .checkinput_numeral')
          .prop('checked', this.checked)
          .closest('tr').toggleClass('selected', this.checked);
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

    $('#btn-buscar_numeral').click(function(event){

        last_page_numeral = 1;

        var find = $('#find_numeral').val();

        find = find.trim();

        if(find.length > 0)
        {
            listarNumeralesPorSistema();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-buscartodo_numeral').click(function(event){
        $('#find_numeral').val('');
        last_page_numeral = 1;
        listarNumeralesPorSistema();
    });

    $('#btn-agregar').click(function(){
        $('#form_proceso_numeral')[0].reset();
        $("#titlemodal").html('Asignar norma al proceso');
        $('#modal_proceso_numeral').modal('open');
        metodo_save = 'POST';
        $('#id').val(0);
        listarNumeralesPorSistema();
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
        $('#form_proceso_numeral').submit();
    });

    $('#form_proceso_numeral').validate({ // initialize the plugin
        rules: {
                    id:{
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
        var formData = new FormData(document.getElementById("form_proceso_numeral"));
        formData.append('sistema_id', $("#sistema_id").val());
        formData.append('proceso_id', $("#proceso_id").val());

        $.ajax({
            url: '/api/proceso_numeral',  
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
                    $('#modal_proceso_numeral').modal('close');
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

        $.get('/api/proceso_numeral',{proceso_id:proceso_id, find:find, page:page, numero_items:numero_items} ,function(data){
            $('#body_data').html('');

            array_numerales_exitentes = data.data;
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

            $.each(array_numerales_exitentes, function (key, val){
                $('#body_data').append('\
                <tr >\
                    <td>\
                        <label>\
                            <input type="checkbox" id="check'+val.id+'" name="id[]" value="'+val.id+'" class="checkinput" onclick="checkbox(event)">\
                            <span></span> \
                        </label>\
                    </td>\
                    <td>'+val.proceso_nombre+'</td>\
                    <td>'+val.norma_nombre+'</td>\
                    <td>'+val.numeral_nombre+'</td>\
                </tr>');
            });

            if (array_numerales_exitentes.length == 0)
            {
                $('#body_data').html('<tr ><td class="center" colspan="'+numero_columnas+'">No se encontraron datos</td></tr>');
            }

            verificaBotones();
            seleccionarCheckbox();

        }).fail(function(jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function listarNumeralesPorSistema()
    {
        var numero_items = $('#numero_items').val(),
        page = last_page_numeral,
        find =  $('#find_numeral').val(),
        sistema_id =  $('#sistema_id').val(),
        numero_columnas = $(".table_numeral").children("thead").children('tr').children('th').length;

        $('#body_data_numeral').html(loadingPlain(numero_columnas));

        $.get('/api/sistema_numeral',{sistema_id:sistema_id, find:find, page:page, numero_items:numero_items} ,function(data){
            $('#body_data_numeral').html('');

            var array_data = data.data;
            totalPages_numeral = data.last_page;
            visiblePages_numeral = 5;

            if (totalPages_numeral < 5)
            {
                visiblePages_numeral = totalPages_numeral;
            }

            var desde = data.from == null ? 0: data.from;
            var hasta = data.to == null ? 0: data.to;

            $('#registros_numeral').html('Registros de '+desde+' a '+hasta+' de '+data.total);

            if($('#pagination_numeral').data('twbs-pagination')){
                $('#pagination_numeral').twbsPagination('destroy');
                first_load_numeral = true;
            }

            $('#pagination_numeral').twbsPagination({
                totalPages: totalPages_numeral,
                visiblePages: visiblePages_numeral,
                startPage:page,
                first: '<i class="material-icons">first_page</i>',
                prev: '<i class="material-icons">navigate_before</i>',
                next: '<i class="material-icons">navigate_next</i>',
                last: '<i class="material-icons">last_page</i>',
                onPageClick: function (event, page) {
                    last_page_numeral = page;

                    if (!first_load_numeral)
                    {
                        listar();
                    }

                    first_load_numeral = false;
                }
            }).on('page', function (event, page) {

            });

            $.each(array_data, function (key, val){

                if (!validarNumeral(val.numeral_id))
                {
                    $('#body_data_numeral').append('\
                    <tr >\
                        <td>\
                            <label>\
                                <input type="checkbox" id="numeral_'+val.id+'" name="array_numeral[]" value="'+val.numeral_id+'" class="checkinput_numeral" >\
                                <span></span> \
                            </label>\
                        </td>\
                        <td>'+val.norma_nombre+'</td>\
                        <td>'+val.numeral_nombre+'</td>\
                    </tr>');
                }

            });

            if (array_data.length == 0)
            {
                $('#body_data_numeral').html('<tr ><td class="center" colspan="'+numero_columnas+'">No se encontraron datos</td></tr>');
            }

            verificaBotones();
            seleccionarCheckbox();

        }).fail(function(jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function validarNumeral(numeral_id)
    {
        var encontrado = false;

        array_numerales_exitentes.forEach(element => {
            if (element.numeral_id == numeral_id)
            {
                encontrado = true;
            }
        });

        return encontrado;
    }

    function obternerRecurso()
    {
        var registros = $(".table input[name='id[]']:checked").map(function(){
            return $(this).val();
        }).get();

        if (registros.length > 0 && registros.length < 2)
        {
            var id = registros[0];

            $.get('/api/proceso_numeral/'+id,function(data){
                $('#id').val(data.id);
                $('#proceso_id').val(data.proceso_id);
                $('#norma_id').val(data.norma_id);
                $('#numeral_id').val(data.numeral_id);

                $('#modal_proceso_numeral').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function eliminar(array_ids)
    {
        $.ajax({
            url: '/api/proceso_numeral',  
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
