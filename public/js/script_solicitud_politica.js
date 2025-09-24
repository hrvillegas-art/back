var array_politica = [];

$(document).ready(function(){

    $('#modal_procedimiento_politica').modal();

    $('#btn_modal_cancelar_politica').click(function(){
        $('#modal_procedimiento_politica').modal('close');
    });

    $('#btn_showmodalprocedimiento_politica').click(function(){
        $("#title_modalpoliticaes").html('Agregar política');
        $('#modal_procedimiento_politica').modal('open');
        limpiartextpolitica();
        $('#politica_id').val('-1');
    });

    $('#btn-editar_politica').click(function(){
        $("#title_modalpoliticaes").html('Editar iteración');
        $('#modal_procedimiento_politica').modal('open');
    });

    $('#btn_modal_guardar_politica').click(function(){
        $('#form_procedimiento_politica').submit();
    });

    $('#form_procedimiento_politica').validate({ // initialize the plugin
        rules: {
                    descripcionpolitica:{
                        required: true,
                        maxlength:6000
                        },
        },
        messages: {
                    descripcionpolitica:{
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
            agregarPolitica();
            return false; // for demo
        }
    });

});

function listarPolitica()
{
    $('#body_procedimiento_politica').html('');

    var posicion = 0;

    $.each(array_politica, function (key, val){
        $('#body_procedimiento_politica').append('\
        <tr >\
            <td>'+(posicion+1)+'</td>\
            <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
            <td><a style="cursor:pointer" onclick="eliminarPolitica('+posicion+')" class="secondary-content" title="Clic para Eliminar el concepto">\
                    <i style="color: red;"class="material-icons">delete</i>\
                </a><a style="cursor:pointer" onclick="editarPolitica('+posicion+')" class="secondary-content" title="Clic para Editar el concepto">\
                <i style="color: blue;"class="material-icons">edit</i>\
            </a></td>\
        </tr>');
        $('#body_procedimiento_politica').append('</tbody></table>');
        posicion++;
    });
}

function agregarPolitica()
{
    var posicion = $('#politica_id').val();

    var obj = {
        descripcion: $('#descripcionpolitica').val()
    };

    if (posicion >= 0)
    {
        array_politica[posicion] = obj;
    }
    else
    {
        array_politica.push(obj);
    }

    limpiartextpolitica();

    $('#modal_procedimiento_politica').modal('close');

    listarPolitica();
}

function limpiartextpolitica()
{
    $('#politica_id').val('-1');
    $('#descripcionpolitica').val('');

}

function eliminarPolitica(posicion)
{
    array_politica.splice(posicion, 1);

    listarPolitica();
}

function editarPolitica(posicion)
{
    var obj_politica = array_politica[posicion];

    $('#politica_id').val(posicion);
    $('#descripcionpolitica').val(obj_politica.descripcion);
    $("#title_modalpoliticaes").html('Editar política');
    $('#modal_procedimiento_politica').modal('open');
}