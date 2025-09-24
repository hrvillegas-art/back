last_page_asignarlineamiento = 1,
totalPages_asignarlineamiento = 2,
visiblePages_asignarlineamiento = 2,
first_load_asignarlineamiento = true,
    
$(document).ready(function()
{
    $("#modal_asignarlineamiento").modal();

    $("#btn_modalasignarlineamiento_cancelar").click(function(){
        $('#modal_asignarlineamiento').modal('close');
    });

    $('#btn-asignarlineamientobuscar').click(function(event){

        var find = $('#find_asignarlineamiento').val();

        find = find.trim();

        if(find.length > 0)
        {
            listarlineamiento();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-asignarlineamientobuscartodo').click(function(event){
        $('#find_asignarlineamiento').val('');
        listarlineamiento();
    });
});


function listarlineamiento()
{
    var numero_items = 5,
    page = last_page_asignarlineamiento,
    find =  $('#find_asignarlineamiento').val();

    $('#body_data_asignarlineamiento').html(loadingPlain(4));

    $.get('/api/listarlineamiento',{find:find, page:page, numero_items:numero_items} ,function(data){
        
        $('#body_data_asignarlineamiento').html('');

        var array_data = data.data;
        totalPages_asignarlineamiento = data.last_page;
        visiblePages_asignarlineamiento = 5;

        if (totalPages_asignarlineamiento < 5)
        {
            visiblePages_asignarlineamiento = totalPages_asignarlineamiento;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_asignarlineamiento').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_asignarlineamiento').data('twbs-pagination')){
            $('#pagination_asignarlineamiento').twbsPagination('destroy');
            first_load_asignarlineamiento = true;
        }

        $('#pagination_asignarlineamiento').twbsPagination({
            totalPages: totalPages_asignarlineamiento,
            visiblePages: visiblePages_asignarlineamiento,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_asignarlineamiento = page;

                if (!first_load_asignarlineamiento)
                { 
                    listarlineamiento();
                }

                first_load_asignarlineamiento = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_data, function (key, val){

            var botonasignar = '<a onclick="asignarLineamiento('+val.id+',\''+val.nombre+'\',\''+val.anio+'\')" id="btn-asignarlineamientobuscar" class="mb-6 btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 34px; line-height:6px" ><i style="margin-left: 2px; margin-right: 2px" class="material-icons left">assignment_turned_in</i>Asignar</a>';

            $('#body_data_asignarlineamiento').append('\
            <tr >\
                <td>'+val.nombre+'</td>\
                <td>'+val.anio+'</td>\
                <td style="width: 230px;">\
                    '+botonasignar+'\
                </td>\
            </tr>');
        });

        if (array_data.length == 0)
        {
            $('#body_data_asignarlineamiento').append('\
            <tr>\
                <td class="center" colspan="4">No se encontraron datos</td>\
            </tr>');
        }

    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}