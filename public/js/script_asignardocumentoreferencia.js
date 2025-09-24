last_page_documentoreferencia = 1,
totalPages_documentoreferencia = 2,
visiblePages_documentoreferencia = 2,
first_load_documentoreferencia = true,
array_documentoreferencia = [];
    
$(document).ready(function()
{
    $("#modal_documentoreferencia").modal();

    $("#btn_modaldocumentoreferencia_cancelar").click(function(){
        $('#modal_documentoreferencia').modal('close');
    });

    $('#btn_showmodalprocedimiento_documentoreferencia').click(function(){
        $("#title_modaldefiniciones").html('Agregar iteración');
        $('#modal_documentoreferencia').modal('open');
        obtenerDocumentoreferencia();
    });

    $('#btn-documentoreferenciabuscar').click(function(event){

        var find = $('#find_documentoreferencia').val();

        find = find.trim();

        if(find.length > 0)
        {
            obtenerDocumentoreferencia();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-documentoreferenciabuscartodo').click(function(event){
        $('#find_documentoreferencia').val('');
        obtenerDocumentoreferencia();
    });
});


function obtenerDocumentoreferencia()
{
    var numero_items = 5,
    page = last_page_documentoreferencia,
    find =  $('#find_documentoreferencia').val();

    $('#body_data_documentoreferencia').html(loadingPlain(4));

    $.get('/api/listardocumentoreferencia',{find:find, estado:true, page:page, numero_items:numero_items} ,function(data){
        
        $('#body_data_documentoreferencia').html('');

        var array_data = data.data;
        totalPages_documentoreferencia = data.last_page;
        visiblePages_documentoreferencia = 5;

        if (totalPages_documentoreferencia < 5)
        {
            visiblePages_documentoreferencia = totalPages_documentoreferencia;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_documentoreferencia').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_documentoreferencia').data('twbs-pagination')){
            $('#pagination_documentoreferencia').twbsPagination('destroy');
            first_load_documentoreferencia = true;
        }

        $('#pagination_documentoreferencia').twbsPagination({
            totalPages: totalPages_documentoreferencia,
            visiblePages: visiblePages_documentoreferencia,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_documentoreferencia = page;

                if (!first_load_documentoreferencia)
                { 
                    obtenerDocumentoreferencia();
                }

                first_load_documentoreferencia = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_data, function (key, val){

            var botonasignar = '<a onclick="asignarDocumento(\''+val.id+'\',\''+val.nombre+'\',\''+val.fechaemision+'\',\''+val.descripcion+'\',\''+val.ente+'\')" id="btn-documentoreferenciabuscar" class="mb-6 btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 34px; line-height:6px" ><i style="margin-left: 2px; margin-right: 2px" class="material-icons left">assignment_turned_in</i>Asignar</a>';

            $('#body_data_documentoreferencia').append('\
            <tr >\
                <td>'+val.nombre+'</td>\
                <td>'+val.descripcion+'</td>\
                <td style="width: 230px;">\
                    '+botonasignar+'\
                </td>\
            </tr>');
        });

        if (array_data.length == 0)
        {
            $('#body_data_documentoreferencia').append('\
            <tr>\
                <td class="center" colspan="4">No se encontraron datos</td>\
            </tr>');
        }

    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}

function asignarDocumento(id, referencia, fecha, descripcion, ente)
{
    if (validarDocumentos(id))
    {
        array_documentoreferencia.push(
            {
                id : id,
                nombre : referencia, 
                fechaemision:fecha, 
                descripcion:descripcion,
                ente: ente
            }
        );
    
        listarDocumentosreferencia();
    }
}

function listarDocumentosreferencia()
{
    $('#body_procedimiento_documentoreferencia').html('');

    var posicion = 0;

    $.each(array_documentoreferencia, function (key, val){
        $('#body_procedimiento_documentoreferencia').append('\
        <tr >\
            <td>'+(posicion+1)+'</td>\
            <td>'+val.nombre+'</td>\
            <td>'+val.fechaemision+'</td>\
            <td>'+val.descripcion+'</td>\
            <td>'+val.ente+'</td>\
            <td><a style="cursor:pointer" onclick="eliminarDocumentoreferecnia('+posicion+')" class="secondary-content" title="Clic para Eliminar el concepto">\
                    <i style="color: red;"class="material-icons">delete</i>\
                </a></td>\
        </tr>');
        $('#body_procedimiento_documentoreferencia').append('</tbody></table>');
        posicion++;
    });
}

function eliminarDocumentoreferecnia(posicion)
{
    array_documentoreferencia.splice(posicion, 1);

    listarDocumentosreferencia();
}

function validarDocumentos(id)
{
    const found = array_documentoreferencia.find(element => element.id == id);
    return typeof found == 'undefined';
}
