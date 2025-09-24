last_page_buscardocumento = 1,
totalPages_buscardocumento = 2,
visiblePages_buscardocumento = 2,
first_load_buscardocumento = true,
array_buscardocumento = [],
array_documentoportipo = [];
    
$(document).ready(function()
{
    $("#modal_buscardocumento").modal();

    $("#btn_modalbuscardocumento_cancelar").click(function(){
        $('#modal_buscardocumento').modal('close');
    });

    $('#btn_showmodalprocedimiento_registros').click(function(){
        $("#title_modalregistroses").html('Agregar registro');
        $('#modal_buscardocumento').modal('open');
    });

    $('#documento_nombreregistro').click(function(){
        $('#modal_buscardocumento').modal('open');
        obtenerbuscardocumento();
    });

    $('#btn-buscardocumentobuscar').click(function(event){

        var find = $('#find_buscardocumento').val();

        find = find.trim();

        if(find.length > 0)
        {
            obtenerbuscardocumento();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-buscardocumentobuscartodo').click(function(event){
        $('#find_buscardocumento').val('');
        obtenerbuscardocumento();
    });
});


function obtenerbuscardocumento()
{
    var numero_items = 5,
    page = last_page_buscardocumento,
    find =  $('#find_buscardocumento').val();

    $('#body_data_buscardocumento').html(loadingPlain(4));

    $.get('/api/documentoportipo',{find:find, tipodocumental_id:3, page:page, numero_items:numero_items} ,function(data){

        $('#body_data_buscardocumento').html('');

        array_documentoportipo = data.data;
        totalPages_buscardocumento = data.last_page;
        visiblePages_buscardocumento = 5;

        if (totalPages_buscardocumento < 5)
        {
            visiblePages_buscardocumento = totalPages_buscardocumento;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_buscardocumento').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_buscardocumento').data('twbs-pagination')){
            $('#pagination_buscardocumento').twbsPagination('destroy');
            first_load_buscardocumento = true;
        }

        $('#pagination_buscardocumento').twbsPagination({
            totalPages: totalPages_buscardocumento,
            visiblePages: visiblePages_buscardocumento,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_buscardocumento = page;

                if (!first_load_buscardocumento)
                { 
                    obtenerbuscardocumento();
                }

                first_load_buscardocumento = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_documentoportipo, function (key, val){

            var botonasignar = '<a onclick="asignarBuscardocumento(\''+val.id+'\')" id="btn-buscardocumentobuscar" class="mb-6 btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 34px; line-height:6px" ><i style="margin-left: 2px; margin-right: 2px" class="material-icons left">assignment_turned_in</i>Asignar</a>';

            $('#body_data_buscardocumento').append('\
            <tr >\
                <td>'+val.codificacion+'-'+val.nombre+'</td>\
                <td>'+val.descripcion+'</td>\
                <td style="width: 230px;">\
                    '+botonasignar+'\
                </td>\
            </tr>');
        });

        if (array_documentoportipo.length == 0)
        {
            $('#body_data_buscardocumento').append('\
            <tr>\
                <td class="center" colspan="4">No se encontraron datos</td>\
            </tr>');
        }

    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}

function asignarBuscardocumento(id)
{
    var obj_documento = array_documentoportipo.find(element => element.id == id);
    
    var posicion = $('#registros_id').val();

    var obj = {
        documento_id: obj_documento.id,
        documento_nombre: obj_documento.nombre,
        codigo: obj_documento.codificacion,
        responsable: obj_documento.obj_solicitudtrd.responsable,
        lugararchivo: obj_documento.obj_solicitudtrd.lugararchivo,
        medioarchivo: obj_documento.obj_solicitudtrd.medioarchivo,
        tiempoarchivo: obj_documento.obj_solicitudtrd.tiempoarchivo,
        disposicion: obj_documento.obj_solicitudtrd.disposicion
    };

    if (validarRegistros(obj.documento_id))
    {
        array_registros.push(obj);
        mensajeExitosoToasts('Documento de agregado exitosamente');
    }

    listarRegistros();
}


function listarRegistros()
{
    $('#body_procedimiento_registros').html('');

    var posicion = 0;

    $.each(array_registros, function (key, val){
        $('#body_procedimiento_registros').append('\
        <tr >\
            <td>'+(posicion+1)+'</td>\
            <td>'+val.codigo+'</td>\
            <td>'+val.documento_nombre+'</td>\
            <td>'+val.responsable+'</td>\
            <td>'+val.lugararchivo+'</td>\
            <td>'+val.medioarchivo+'</td>\
            <td>'+val.tiempoarchivo+'</td>\
            <td>'+val.disposicion+'</td>\
            <td><a style="cursor:pointer" onclick="eliminarRegistros('+posicion+')" class="secondary-content" title="Clic para Eliminar el concepto">\
                    <i style="color: red;"class="material-icons">delete</i>\
                </td>\
        </tr>');
        $('#body_procedimiento_registros').append('</tbody></table>');
        posicion++;
    });
}


function eliminarRegistros(posicion)
{
    array_registros.splice(posicion, 1);

    listarRegistros();
}

function validarRegistros(id)
{
    const found = array_registros.find(element => element.documento_id == id);
    return typeof found == 'undefined';
}
  