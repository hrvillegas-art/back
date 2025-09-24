var array_cambios = [];

$(document).ready(function(){

    $('#modal_procedimiento_cambios').modal();

    $('#btn_modal_cancelar_cambios').click(function(){
        $('#modal_procedimiento_cambios').modal('close');
    });

    $('#btn_showmodalprocedimiento_cambios').click(function(){
        $("#title_modalcambioses").html('Agregar cambio');
        $('#modal_procedimiento_cambios').modal('open');
        limpiartextcambios();
        $('#cambios_id').val('-1');
    });

    $('#btn-editar_cambios').click(function(){
        $("#title_modalcambioses").html('Editar cambio');
        $('#modal_procedimiento_cambios').modal('open');
    });

    $('#btn_modal_guardar_cambios').click(function(){
        $('#form_procedimiento_cambios').submit();
    });

    $('#form_procedimiento_cambios').validate({ // initialize the plugin
        rules: {
                    descripcioncambios:{
                        required: true,
                        maxlength:6000
                        },
                    fechacambios:{
                        required: true,
                        date: true
                        },
                    descripcioncambios:{
                        required: true,
                        maxlength:255
                        },
        },
        messages: {
                    descripcioncambios:{
                        required: "El campo descripción es obligatorio",
                        maxlength: "El campo descripción fuera de rango"
                        },
                    fechacambios:{
                        required: "El campo Fecha del cambio es obligatorio",
                        date: "El campo Fecha del cambio deber se una fecha"
                        },
                    versioncambios:{
                        required: "El campo Versión es obligatorio",
                        maxlength: "El campo Versión fuera de rango"
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
            agregarCambios();
            return false; // for demo
        }
    });

});

function listarCambios()
{
    $('#body_procedimiento_cambios').html('');

    var posicion = 0;

    $.each(array_cambios, function (key, val){

        var html_edicion = '<a style="cursor:pointer" onclick="eliminarCambios('+posicion+')" class="secondary-content" title="Clic para Eliminar el concepto">\
                    <i style="color: red;"class="material-icons">delete</i>\
                </a><a style="cursor:pointer" onclick="editarCambios('+posicion+')" class="secondary-content" title="Clic para Editar el concepto">\
                <i style="color: blue;"class="material-icons">edit</i>\
            </a>';

        if (val.id !== undefined && val.id !== null) 
        {
            html_edicion = '';
        }

        $('#body_procedimiento_cambios').append('\
        <tr >\
            <td>'+(posicion+1)+'</td>\
            <td>'+val.version+'</td>\
            <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
            <td>'+val.fecha+'</td>\
            <td>'+html_edicion+'</td>\
        </tr>');
        $('#body_procedimiento_cambios').append('</tbody></table>');
        posicion++;
    });
}

function agregarCambios()
{
    var posicion = $('#cambios_id').val();

    var obj = {
        descripcion: $('#descripcioncambios').val(),
        fecha: $('#fechacambios').val(),
        version: $('#versioncambios').val()
    };

    if (posicion >= 0)
    {
        array_cambios[posicion] = obj;
    }
    else
    {
        array_cambios.push(obj);
    }

    limpiartextcambios();

    $('#modal_procedimiento_cambios').modal('close');

    listarCambios();
}

function limpiartextcambios()
{
    $('#cambios_id').val('-1');
    $('#descripcioncambios').val('');
    $('#fechacambios').val('');
    $('#versioncambios').val('');
}

function eliminarCambios(posicion)
{
    array_cambios.splice(posicion, 1);

    listarCambios();
}

function editarCambios(posicion)
{
    var obj_cambios = array_cambios[posicion];

    $('#cambios_id').val(posicion);
    $('#descripcioncambios').val(obj_cambios.descripcion);
    $('#fechacambios').val(obj_cambios.fecha);
    $('#versioncambios').val(obj_cambios.version);
    $("#title_modalcambioses").html('Editar cambio');
    $('#modal_procedimiento_cambios').modal('open');
}