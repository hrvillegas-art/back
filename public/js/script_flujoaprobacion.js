var last_page = 1,
totalPages = 2,
visiblePages = 2,
first_load = true,
send = true,
metodo_save = "POST",
array_usuario = [],
array_proceso = [],
array_sistemas = [],

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
        },
        {
            id: 'btn-editar',
            nombre: 'Modificar',
            nroseleccionados: 1
        }
    ];

    listarSistema();

    var example1 = document.getElementById('example1');

    new Sortable(example1, {
        animation: 150,
        ghostClass: 'blue-background-class',
        filter: ".disabled",
        onEnd: function(/**Event*/evt) {
            var item = evt.item;
            var lastIndex = example1.childElementCount - 1;

            if (evt.newIndex === lastIndex)
            {
            example1.insertBefore(item, example1.children[evt.oldIndex]);
            }
            else
            {
                actualizarOrden();
            }
        }
    });

    $('#modal_flujoaprobacion, #modal_persona').modal();

    $('#btn_modal_cancelar').click(function(){
        $('#modal_flujoaprobacion').modal('close');
    });

    $('#numero_items').change(function(event){
        listar();
    });

    $('#btn_modalpersona_cancelar').click(function(event){
        $('#modal_persona').modal('close');
    });

    $('#proceso_id').change(function(event){
        $("#example1").html('');
        actualizarOrden();
        procesarFuncionarios($(this).val(), 'PROCESO');
        procesarFuncionarios($('#sistema_id').val(), 'SISTEMA');
    });

    $('#sistema_id').change(function(event){
        listarProceso();
        $("#example1").html('');
        actualizarOrden();
        procesarFuncionarios($(this).val(), 'SISTEMA');
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

    $('#input_usuario').click(function(event){
        $('#modal_persona').modal('open');
        $("#body_data_persona").html('');
        $("#titlemodalpersona").html('Buscar usuario');
        listarPersona();
    });

    $('#btn-agregar').click(function(){
        $('#form_flujoaprobacion')[0].reset();
        $("#titlemodal").html('Crear flujo de aprobación');
        $('#modal_flujoaprobacion').modal('open');
        $("#example1").html('');
        array_usuario = [];
        metodo_save = 'POST';
        $('#id').val(0);
    });

    $('#btn-editar').click(function(){
        metodo_save = 'PUT';
        $("#titlemodal").html('Editar flujo de aprobación');
        $('#form_flujoaprobacion')[0].reset();
        $("#example1").html('');
        array_usuario = [];
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
        $('#form_flujoaprobacion').submit();
    });
    $('#form_flujoaprobacion').validate({ // initialize the plugin
        rules: {
                   
                    tipodocumental_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    sistema_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    proceso_id:{
                        required: true,
                        number: true,
                        min: 1
                        }
        },
        messages: {
                    tipodocumental_id:{
                        required: "El campo Tipo documental es obligatorio",
                        number: "El campo Tipo documental deber numérico",
                        min: "El campo Tipo documental deber de mínimo 1"
                        },
                    sistema_id:{
                        required: "El campo Sistema es obligatorio",
                        number: "El campo Sistema deber numérico",
                        min: "El campo Sistema deber de mínimo 1"
                        },
                    proceso_id:{
                        required: "El campo Proceso es obligatorio",
                        number: "El campo Proceso deber numérico",
                        min: "El campo Proceso deber de mínimo 1"
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
        if (array_usuario.length > 2)
        {
            var formData = new FormData(document.getElementById("form_flujoaprobacion"));
            formData.append('array_usuario',   JSON.stringify(array_usuario));

            $.ajax({
                url: '/api/flujoaprobacion',  
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
                        $('#modal_flujoaprobacion').modal('close');
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
                    $('#modal_flujoaprobacion').modal('close');
            });
        }
        else
        {
            mensajeErrorModal('Error de usuarios', 'Debe asignar por lo menos tres usuarios');
        }
    }

    listar();

    function listar()
    {
        var numero_items = $('#numero_items').val(),
        page = last_page,
        find =  $('#find').val(),
        numero_columnas = $(".table").children("thead").children('tr').children('th').length;

        $('#body_data').html(loadingPlain(numero_columnas));

        $.get('/api/flujoaprobacion',{find:find, page:page, numero_items:numero_items} ,function(data){
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

                var array_temp = val.array_usuarios,
                array_usuarios = [];

                array_temp.forEach(element => {
                    array_usuarios.push(element.obj_persona.persona_natural.primernombre+' '+element.obj_persona.persona_natural.primerapellido+ ' ('+element.rol+')');
                });

                $('#body_data').append('\
                <tr >\
                    <td>\
                        <label>\
                            <input type="checkbox" id="check'+val.id+'" name="id[]" value="'+val.id+'" class="checkinput" onclick="checkbox(event)">\
                            <span></span> \
                        </label>\
                    </td>\
                    <td>'+val.tipodocumental_nombre+'</td>\
                    <td>'+val.sistema_nombre+'<br><b>'+val.proceso_nombre+'</b></td>\
                    <td>'+array_usuarios.join('<br>')+'</td>\
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
            url: '/api/flujoaprobacion/'+ids+'/activo',  
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

            $.get('/api/flujoaprobacion/'+id,function(data){
                $('#id').val(data.id);
                $('#tipodocumental_id').val(data.tipodocumental_id);
                $('#sistema_id').val(data.sistema_id);
                listarProceso(data.proceso_id);

                var array_usuarios = data.array_usuarios;

                array_usuarios.forEach(element => {
                    Asignar(element.id, element.obj_persona.identificacion, element.obj_persona.persona_natural.primernombre+' '+element.obj_persona.persona_natural.primerapellido, element.rol, true, false);
                });

                $('#modal_flujoaprobacion').modal('open');

            }).fail(function(jqXHR, textStatus, errorThrown ) {
                mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
            });
        }
    }

    function eliminar(array_ids)
    {
        $.ajax({
            url: '/api/flujoaprobacion',  
            type: 'DELETE',
            headers:{'X-CSRF-TOKEN': $('input[name="_token"]').val()},
            data: {array_ids:array_ids},
            success: function(outserver, textStatus, xhr){
                mensajeExitosoToasts('Los items eliminados exitosamente');
                listar();
                actualizarOrden();
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
                var nombre = val.nombres.trim() +' '+val.apellidos.trim();

                $('#body_data_persona').append('\
                <tr >\
                    <td>'+nombre+'</td>\
                    <td>'+val.correo_institucional+'</td>\
                    <td><a onclick="Asignar(0, '+val.identificacion+',\''+nombre+'\',\'Otro\', true, true)" id="btn-personabuscar" class="btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 26px; line-height:0px" >Asignar</a></td>\
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

    function Asignar(id, identificacion, nombre, rol, eliminacion = true, msn = false)
    {
        if (validarUsuario(identificacion))
        {
            var eliminar_html = '';

            if (eliminacion)
            {
                eliminar_html = '<a class="right" onclick="eliminarUsuario('+identificacion+')"><i class="material-icons" style="margin-right: 4px; color:red; cursor:pointer">delete</i></a>';
            }

            if (msn)
            {
                if (rol == 'Coordinador')
                {
                    $("#example1").append('<li data-flujopersona_id='+id+' id="div_'+identificacion+'" class="ui-state-default '+(rol == 'Coordinador' ? 'disabled' : '')+' cursor ml-2" data-rol="'+rol+'" data-id="'+identificacion+'"><span id="n_'+identificacion+'" class="tooltipped" data-position="bottom" data-tooltip="Arrastrar para ordenar">'+nombre+' ('+rol+')</span>'+eliminar_html+'<hr></li>');
                }
                else
                {
                    if (array_usuario.length > 0)
                    {
                        $("#example1 li:last-child").before('<li data-flujopersona_id='+id+' id="div_'+identificacion+'" class="ui-state-default '+(rol == 'Coordinador' ? 'disabled' : '')+' cursor ml-2" data-rol="'+rol+'" data-id="'+identificacion+'"><span id="n_'+identificacion+'" class="tooltipped" data-position="bottom" data-tooltip="Arrastrar para ordenar">'+nombre+' ('+rol+')</span>'+eliminar_html+'<hr></li>');
                    }
                    else
                    {
                        $("#example1").prepend('<li data-flujopersona_id='+id+' id="div_'+identificacion+'" class="ui-state-default '+(rol == 'Coordinador' ? 'disabled' : '')+' cursor ml-2" data-rol="'+rol+'" data-id="'+identificacion+'"><span id="n_'+identificacion+'" class="tooltipped" data-position="bottom" data-tooltip="Arrastrar para ordenar">'+nombre+' ('+rol+')</span>'+eliminar_html+'<hr></li>');
                    }
                }
            }
            else
            {
                if (rol == 'Coordinador')
                {
                    $("#example1").append('<li data-flujopersona_id='+id+' id="div_'+identificacion+'" class="ui-state-default '+(rol == 'Coordinador' ? 'disabled' : '')+' cursor ml-2" data-rol="'+rol+'" data-id="'+identificacion+'"><span id="n_'+identificacion+'" class="tooltipped" data-position="bottom" data-tooltip="Arrastrar para ordenar">'+nombre+' ('+rol+')</span>'+eliminar_html+'<hr></li>');
                }
                else
                {
                    $("#example1").append('<li data-flujopersona_id='+id+' id="div_'+identificacion+'" class="ui-state-default  cursor ml-2" data-rol="'+rol+'" data-id="'+identificacion+'"><span id="n_'+identificacion+'" class="tooltipped" data-position="bottom" data-tooltip="Arrastrar para ordenar">'+nombre+' ('+rol+')</span>'+eliminar_html+'<hr></li>');
                }
            }

            $('.tooltipped').tooltip();

            array_usuario.push({
                id:id,
                identificacion: identificacion,
                nombres: nombre,
                orden: array_usuario.length,
                rol: rol
            });

            if (msn)
            {
                mensajeExitosoToasts('Funcionario(s) agregado(s) al flujo de aprobación exitosamente');
            }
        }
        else
        {
            mensajeErrorModal('Error de duplicidad','El usuario que intenta agregar ya esta en la lista');
        }
    }

    function actualizarOrden()
    {
        var registros = $("#example1 li").map(function(){
            return $(this).data('id');
        }).get();

        array_usuario = [];
        registros.forEach(element => {
            var nombre = $("#n_"+element).html();
            var rol = $("#div_"+element).data('rol');
            var flujopersona_id = $("#div_"+element).data('flujopersona_id');

            array_usuario.push(
                {
                    id: flujopersona_id,
                    identificacion: element,
                    nombres: nombre,
                    orden: array_usuario.length,
                    rol: rol
                }
            ); 
        });
    }

    function eliminarUsuario(identificacion)
    {
        $("#div_"+identificacion).remove();

        actualizarOrden();
    }

    function validarUsuario(identificacion)
    {
        const found = array_usuario.find(element => element.identificacion == identificacion);
        return typeof found == 'undefined';
    }

    function listarProceso(proceso_id = null)
    {
        $("#proceso_id").html('<option value="">Seleccione</option>');
        var sistema_id = $("#sistema_id").val();

        $.ajax({
            url: '/api/listarprocesoporsistema',
            type: 'GET',
            async: false,
            data: {find:'', sistema_id: sistema_id, estado:true, page:1, numero_items:1000},
            success: function(data) {
                array_proceso = data.data;

                $.each(array_proceso, function (key, val){
                    $("#proceso_id").append('<option value="'+val.id+'">'+val.nombre+'</option>');
                });

                if (proceso_id != null)
                {
                    $('#proceso_id').val(proceso_id);
                }
            }
        }).fail( function( jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function listarSistema()
    {
        $("#sistema_id").html('<option value="">Seleccione</option>');

        $.get('/api/sistema',{find:'', estado:true, page:1, numero_items:1000},function(data){

            array_sistemas = data.data;

            $.each(array_sistemas, function (key, val){
                $("#sistema_id").append('<option value="'+val.id+'">'+val.nombre+'</option>');
            });
        }).fail(function(jqXHR, textStatus, errorThrown ) {
            mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
        });
    }

    function procesarFuncionarios(id, tipo)
    {
        if (id > 0)
        {
            switch (tipo) {
                case 'PROCESO':
                    const obj_proceso = array_proceso.find(element => element.id == id);

                    Asignar(0, obj_proceso.lider_identificacion, obj_proceso.lider_primernombre+' '+obj_proceso.lider_segundonombre+' '+obj_proceso.lider_primerapellido+' '+obj_proceso.lider_segundoapellido, 'Lider', true, true);
                    Asignar(0, obj_proceso.gestor_identificacion, obj_proceso.gestor_primernombre+' '+obj_proceso.gestor_segundonombre+' '+obj_proceso.gestor_primerapellido+' '+obj_proceso.gestor_segundoapellido, 'Gestor',true, true);
                    Asignar(o, obj_proceso.asesor_identificacion, obj_proceso.asesor_primernombre+' '+obj_proceso.asesor_segundonombre+' '+obj_proceso.asesor_primerapellido+' '+obj_proceso.asesor_segundoapellido, 'Asesor', true, true);
                    break;
                case 'SISTEMA':
                    const obj_sistema = array_sistemas.find(element => element.id == id);
                    Asignar(0, obj_sistema.coordinador_identificacion, obj_sistema.coordinador_primernombre+' '+obj_sistema.coordinador_segundonombre+' '+obj_sistema.coordinador_primerapellido+' '+obj_sistema.coordinador_segundoapellido, 'Coordinador', true, true);
                    break;
                default:
                    break;
            }
        }
    }
