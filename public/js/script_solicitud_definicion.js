var array_definicion = [];

$(document).ready(function(){

    $('#modal_procedimiento_definicion').modal();

    $('#btn_modal_cancelar_definicion').click(function(){
        $('#modal_procedimiento_definicion').modal('close');
    });

    $('#btn_showmodalprocedimiento_definicion').click(function(){
        $("#title_modaldefiniciones").html('Agregar iteración');
        $('#modal_procedimiento_definicion').modal('open');
        limpiartextdefinicion();
        $('#definicion_id').val('-1');
    });

    $('#btn-editar_definicion').click(function(){
        $("#title_modaldefiniciones").html('Editar iteración');
        $('#modal_procedimiento_definicion').modal('open');
    });

    $('#btn_modal_guardar_definicion').click(function(){
        $('#form_procedimiento_definicion').submit();
    });

    $('#form_procedimiento_definicion').validate({ // initialize the plugin
        rules: {
                    nombredefinicion:{
                        required: true,
                        maxlength:255
                        },
                    descripciondefinicion:{
                        required: true,
                        maxlength:6000
                        },
        },
        messages: {
                    nombredefinicion:{
                        required: "El campo responsable es obligatorio",
                        maxlength: "El campo responsable fuera de rango"
                        },
                    descripciondefinicion:{
                        required: "El campo descripción es obligatorio",
                        maxlength: "El campo descripción fuera de rango"
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
            agregarDefinicion();
            return false; // for demo
        }
    });

});

function listarDefinicion()
{
    $('#body_procedimiento_definicion').html('');

    var posicion = 0;

    $.each(array_definicion, function (key, val){
        $('#body_procedimiento_definicion').append('\
        <tr >\
            <td>'+(posicion+1)+'</td>\
            <td>'+val.nombre+'</td>\
            <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
            <td><a style="cursor:pointer" onclick="eliminarDefinicion('+posicion+')" class="secondary-content" title="Clic para Eliminar el concepto">\
                    <i style="color: red;"class="material-icons">delete</i>\
                </a><a style="cursor:pointer" onclick="editarDefinicion('+posicion+')" class="secondary-content" title="Clic para Editar el concepto">\
                <i style="color: blue;"class="material-icons">edit</i>\
            </a></td>\
        </tr>');
        $('#body_procedimiento_definicion').append('</tbody></table>');
        posicion++;
    });
}

function agregarDefinicion()
{
    var posicion = $('#definicion_id').val();

    var obj = {
        descripcion: $('#descripciondefinicion').val(),
        nombre: $('#nombredefinicion').val()
    };

    if (posicion >= 0)
    {
        array_definicion[posicion] = obj;
    }
    else
    {
        array_definicion.push(obj);
    }

    limpiartextdefinicion();

    $('#modal_procedimiento_definicion').modal('close');

    listarDefinicion();
}

function limpiartextdefinicion()
{
    $('#definicion_id').val('-1');
    $('#nombredefinicion').val('');
    $('#descripciondefinicion').val(''); 

}

function eliminarDefinicion(posicion)
{
    array_definicion.splice(posicion, 1);

    listarDefinicion();
}

function editarDefinicion(posicion)
{
    var obj_definicion = array_definicion[posicion];

    $('#definicion_id').val(posicion);
    $('#nombredefinicion').val(obj_definicion.nombre);
    $('#descripciondefinicion').val(obj_definicion.descripcion);
    $("#title_modaldefiniciones").html('Editar definición');
    $('#modal_procedimiento_definicion').modal('open');
}