var array_actividades = [];

$(document).ready(function(){

    $('#modal_solicitud_actividad').modal();

    $('#btn_modal_cancelar_actividad').click(function(){
        $('#modal_solicitud_actividad').modal('close');
    });

    $('#btn-agregar_actividad').click(function(){
        $("#title_modaldetalle_solicitud_actividad").html('Crear actividad');
        $('#modal_solicitud_actividad').modal('open');
        limpiartextactividad();
        $('#actividad_id').val('-1');
    });

    $('#btn-editar_actividad').click(function(){
        $("#titlemodal").html('Editar actividad');
        $('#modal_solicitud_actividad').modal('open');
    });

    $('#btn_modal_guardar_actividad').click(function(){
        $('#form_solicitud_actividad').submit();
    });

    $('#form_solicitud_actividad').validate({ // initialize the plugin
        rules: {
                    id:{
                       required: true,
                        number: true,
                        min: 1}
                        ,
                    tipoactividad_id:{
                        required: true,
                        number: true,
                        min: 1
                        },
                    descripcionactividad:{
                        required: true,
                        maxlength:6000
                        },
                    insumo:{
                        required: true,
                        maxlength:6000
                        },
                    proveedor:{
                        required: true,
                        maxlength:6000
                        },
                    responsable:{
                        required: true,
                        maxlength:6000
                        },
                    producto:{
                        required: true,
                        maxlength:6000
                        },
                    cliente:{
                        required: true,
                        maxlength:6000
                        }
        },
        messages: {
                    id:{
                        required: "El campo id es obligatorio",
                        number: "El campo id deber numérico",
                        min: "El campo id deber de mínimo 1"
                        },
                    tipoactividad_id:{
                        required: "El campo Tipo de actividad PHVA es obligatorio",
                        number: "El campo Tipo de actividad PHVA deber numérico",
                        min: "El campo Tipo de actividad PHVA deber de mínimo 1"
                        },
                    descripcionactividad:{
                        required: "El campo Descripción de la actividad es obligatorio",
                        maxlength: "El campo Descripción de la actividad fuera de rango"
                        },
                    insumo:{
                        required: "El campo Insumo de la actividad es obligatorio",
                        maxlength: "El campo Insumo de la actividad fuera de rango"
                        },
                    proveedor:{
                        required: "El campo Proveedor de la actividad es obligatorio",
                        maxlength: "El campo Proveedor de la actividad fuera de rango"
                        },
                    responsable:{
                        required: "El campo Responsable de la actividad es obligatorio",
                        maxlength: "El campo Responsable de la actividad fuera de rango"
                        },
                    producto:{
                        required: "El campo Producto de la actividad es obligatorio",
                        maxlength: "El campo Producto de la actividad fuera de rango"
                        },
                    cliente:{
                        required: "El campo Cliente de la actividad es obligatorio",
                        maxlength: "El campo Cliente de la actividad fuera de rango"
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
            agregarActividad();
            return false; // for demo
        }
    });

});

function listaractividad()
{
    $('#body_data_actividad').html('');

    var posicion = 0;

    $.each(array_actividades, function (key, val){
        $('#body_data_actividad').append('\
        <tr >\
            <td>'+val.tipoactividad_nombre+'</td>\
            <td>'+val.descripcion.replaceAll('\n','<br>')+'</td>\
            <td>'+val.insumo.replaceAll('\n','<br>')+'</td>\
            <td>'+val.proveedor.replaceAll('\n','<br>')+'</td>\
            <td>'+val.responsable.replaceAll('\n','<br>')+'</td>\
            <td>'+val.producto.replaceAll('\n','<br>')+'</td>\
            <td>'+val.cliente.replaceAll('\n','<br>')+'</td>\
            <td><a style="cursor:pointer" onclick="eliminarActividad('+posicion+')" class="secondary-content" title="Clic para Eliminar una actividad">\
                    <i style="color: red;"class="material-icons">delete</i>\
                </a><a style="cursor:pointer" onclick="editarActividad('+posicion+')" class="secondary-content" title="Clic para Editar una actividad">\
                <i style="color: blue;"class="material-icons">edit</i>\
            </a></td>\
        </tr>');
        $('#body_data_actividad').append('</tbody></table>');
        posicion++;
    });
}

function agregarActividad()
{
    var posicion = $('#otrorequisito_id').val();

    var obj = {
        tipoactividad_id: $('#tipoactividad_id').val(),
        tipoactividad_nombre: $('select[name="tipoactividad_id"] option:selected').text(),
        descripcion: $('#descripcionactividad').val(),
        insumo: $('#insumo').val(),
        proveedor: $('#proveedor').val(),
        responsable: $('#responsable').val(),
        producto: $('#producto').val(),
        cliente: $('#cliente').val()
    };

    if (posicion >= 0)
    {
        array_actividades[posicion] = obj;
    }
    else
    {
        array_actividades.push(obj);
    }

    limpiartextactividad();

    $('#modal_solicitud_actividad').modal('close');

    listaractividad();
}

function limpiartextactividad()
{
    $('#actividad_id').val('-1');
    $('#tipoactividad_id').val('');
    $('#descripcionactividad').val('');
    $('#insumo').val('');
    $('#proveedor').val('');
    $('#responsable').val('');
    $('#producto').val('');
    $('#cliente').val('');

}

function eliminarActividad(posicion)
{
    array_actividades.splice(posicion, 1);

    listaractividad();
}

function editarActividad(posicion)
{
    var obj_actividad = array_actividades[posicion];

    $('#actividad_id').val(posicion);
    $('#tipoactividad_id').val(obj_actividad.tipoactividad_id);
    $('#descripcionactividad').val(obj_actividad.descripcion);
    $('#insumo').val(obj_actividad.insumo);
    $('#proveedor').val(obj_actividad.proveedor);
    $('#responsable').val(obj_actividad.responsable);
    $('#producto').val(obj_actividad.producto);
    $('#cliente').val(obj_actividad.cliente);
    $("#title_modaldetalle_solicitud_actividad").html('Editar actividad');
    $('#modal_solicitud_actividad').modal('open');
}