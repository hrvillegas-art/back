var array_iteracion = [];

$(document).ready(function(){

    $('#modal_procedimiento_iteracion').modal();

    $('#btn_modal_cancelar_iteracion').click(function(){
        $('#modal_procedimiento_iteracion').modal('close');
    });

    $('#btn_showmodalprocedimiento_iteracion').click(function(){
        $("#title_modaliteraciones").html('Agregar iteración');
        $('#modal_procedimiento_iteracion').modal('open');
        limpiartextiteracion();
        $('#iteracion_id').val('-1');
        $('#tipo_iteracion').val('iteracion').change();
    });

    $('#btn-editar_iteracion').click(function(){
        $("#title_modaliteraciones").html('Editar iteración');
        $('#modal_procedimiento_iteracion').modal('open');
    });

    $('#btn_modal_guardar_iteracion').click(function(){
        $('#form_procedimiento_iteracion').submit();
    });


    $('#tipo_iteracion').change(function(){
        let tipo = $(this).val();

        if (tipo == 'categoria')
        {
            $("#div_responsableiteracion").addClass('display-none');
            $("#responsableiteracion").val('TITULO');
        }
        else
        {
            $("#div_responsableiteracion").removeClass('display-none');
            $("#responsableiteracion").val('');
        }
    });

    $('#form_procedimiento_iteracion').validate({ // initialize the plugin
        rules: {
                    responsableiteracion:{
                        required: true,
                        maxlength:6000
                        },
                    descripcioniteracion:{
                        required: true,
                        maxlength:6000
                        },
        },
        messages: {
                    responsableiteracion:{
                        required: "El campo responsable es obligatorio",
                        maxlength: "El campo responsable fuera de rango"
                        },
                    descripcioniteracion:{
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
            agregarIteracion();
            return false; // for demo
        }
    });

});

function listarIteracion()
{
    $('#body_procedimiento_iteracion').html('');

    var posicion = 0;
    var index = 0;

    $.each(array_iteracion, function (key, val){

        if (val.responsable == 'TITULO')
        {
            posicion = 0;

            $('#body_procedimiento_iteracion').append('\
                <tr  >\
                    <td colspan="3" style="text-align: center; font-weight: bold; background-color: ghostwhite;" >'+val.descripcion.replaceAll('\n','<br>')+'</td>\
                    <td><a style="cursor:pointer" onclick="eliminarIteracion('+index+')" class="secondary-content" title="Clic para Eliminar una actividad">\
                            <i style="color: red;"class="material-icons">delete</i>\
                        </a><a style="cursor:pointer" onclick="editarIteracion('+index+')" class="secondary-content" title="Clic para Editar una actividad">\
                        <i style="color: blue;"class="material-icons">edit</i>\
                    </a></td>\
                </tr>');
        }
        else
        {
            $('#body_procedimiento_iteracion').append('\
                <tr >\
                    <td>'+(posicion+1)+'</td>\
                    <td>'+val.responsable+'</td>\
                    <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
                    <td><a style="cursor:pointer" onclick="eliminarIteracion('+index+')" class="secondary-content" title="Clic para Eliminar una actividad">\
                            <i style="color: red;"class="material-icons">delete</i>\
                        </a><a style="cursor:pointer" onclick="editarIteracion('+index+')" class="secondary-content" title="Clic para Editar una actividad">\
                        <i style="color: blue;"class="material-icons">edit</i>\
                    </a></td>\
                </tr>');

            posicion++;

        }

        index++;

        $('#body_procedimiento_iteracion').append('</tbody></table>');
    });
}

function agregarIteracion()
{
    var posicion = $('#iteracion_id').val();

    var obj = {
        descripcion: $('#descripcioniteracion').val(),
        responsable: $('#responsableiteracion').val()
    };

    if (posicion >= 0)
    {
        array_iteracion[posicion] = obj;
    }
    else
    {
        array_iteracion.push(obj);
    }

    limpiartextiteracion();

    $('#modal_procedimiento_iteracion').modal('close');

    listarIteracion();
}

function limpiartextiteracion()
{
    $('#iteracion_id').val('-1');
    $('#responsableiteracion').val('');
    $('#descripcioniteracion').val('');

}

function eliminarIteracion(posicion)
{
    array_iteracion.splice(posicion, 1);

    listarIteracion();
}

function editarIteracion(posicion)
{
    var obj_iteracion = array_iteracion[posicion];

    $('#iteracion_id').val(posicion);
    $('#responsableiteracion').val(obj_iteracion.responsable);
    $('#descripcioniteracion').val(obj_iteracion.descripcion);
    $("#title_modaliteraciones").html('Editar iteración');
    $('#modal_procedimiento_iteracion').modal('open');

    if (obj_iteracion.responsable == 'TITULO')
    {
        $("#div_responsableiteracion").addClass('display-none');
        $("#responsableiteracion").val('TITULO');
    }
    else
    {
        $("#div_responsableiteracion").removeClass('display-none');
    }
}