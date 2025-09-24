var array_otrorequisito = [];

$(document).ready(function(){

    $('#modal_solicitud_otrorequisito').modal();

    $('#btn_modal_cancelar_otrorequisito').click(function(){
        $('#modal_solicitud_otrorequisito').modal('close');
    });

    $('#btn-agregar_otrorequisito').click(function(){
        $("#title_modaldetalle_solicitud_otrorequisito").html('Crear requisito');
        $('#modal_solicitud_otrorequisito').modal('open');
        limpiartextOtrorequisito();
    });

    $('#btn_modal_guardar_otrorequisito').click(function(){
        $('#form_solicitud_otrorequisito').submit();
    });

    $('#form_solicitud_otrorequisito').validate({ // initialize the plugin
        rules: {
                    
                    descripcionotrorequisito:{
                        required: true,
                        maxlength:6000
                        },
                    nombreotrorequisito:{
                        required: true,
                        maxlength:6000
                        }
        },
        messages: {
                    
                    descripcionotrorequisito:{
                        required: "El campo Descripción de la otrorequisito es obligatorio",
                        maxlength: "El campo Descripción de la otrorequisito fuera de rango"
                        },
                    nombreotrorequisito:{
                        required: "El campo nombre de la otrorequisito es obligatorio",
                        maxlength: "El campo nombre de la otrorequisito fuera de rango"
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
            agregarOtrorequisito();
            return false; // for demo
        }
    });

});

function listarotrorequisito()
{
    $('#div_otrosrequisitos').html('');

    var posicion = 0;

    $.each(array_otrorequisito, function (key, val){

        $('#div_otrosrequisitos').append('<tr><td>'+(posicion+1)+'</td><td>\
        '+val.nombre+'</td><td>\
        <div>'+val.descripcion.replaceAll('\n', '<br>')+'</div></td><td>\
                <a style="cursor:pointer" onclick="eliminarOtroRequisito('+posicion+')" class="secondary-content">\
                    <i style="color: red;"class="material-icons">delete</i>\
                </a>\
                <a style="cursor:pointer" onclick="editarOtrorequisito('+posicion+')" class="secondary-content" title="Clic para Editar una actividad">\
                    <i style="color: blue;"class="material-icons">edit</i>\
                </a>\
                </td>\
        </tr>');

        posicion++;
    });
}

function agregarOtrorequisito()
{
    var posicion = $('#otrorequisito_id').val();

    var obj = {
        nombre: $('#nombreotrorequisito').val(),
        descripcion: $('#descripcionotrorequisito').val(),
    };

    if (posicion >= 0)
    {
        array_otrorequisito[posicion] = obj;
    }
    else
    {
        array_otrorequisito.push(obj);
    }

    limpiartextOtrorequisito();

    $('#modal_solicitud_otrorequisito').modal('close');

    listarotrorequisito();
}

function limpiartextOtrorequisito()
{
    $('#nombreotrorequisito').val('');
    $('#descripcionotrorequisito').val('');
}

function eliminarOtroRequisito(posicion)
{
    array_otrorequisito.splice(posicion, 1);

    listarotrorequisito();
}

function editarOtrorequisito(posicion)
{
    var obj_otrorequisito = array_otrorequisito[posicion];

    $('#otrorequisito_id').val(posicion);
    $('#nombreotrorequisito').val(obj_otrorequisito.nombre);
    $('#descripcionotrorequisito').val(obj_otrorequisito.descripcion);
    $("#title_modaldetalle_solicitud_otrorequisito").html('Editar requisito');

    $('#modal_solicitud_otrorequisito').modal('open');
}