last_page_asignarproceso = 1,
totalPages_asignarproceso = 2,
visiblePages_asignarproceso = 2,
first_load_asignarproceso = true,
    
$(document).ready(function()
{
    $("#modal_asignarproceso").modal();

    $("#btn_modalasignarproceso_cancelar").click(function(){
        $('#modal_asignarproceso').modal('close');
    });

    $('#btn-asignarprocesobuscar').click(function(event){

        var find = $('#find_asignarproceso').val();

        find = find.trim();

        if(find.length > 0)
        {
            listarprocesos();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-asignarprocesobuscartodo').click(function(event){
        $('#find_asignarproceso').val('');
        listarprocesos();
    });
});


function listarprocesos()
{
    var numero_items = 20,
    page = last_page_asignarproceso,
    find =  $('#find_asignarproceso').val();

    $('#body_data_asignarproceso').html(loadingPlain(4));

    $.get('/api/listarproceso',{find:find, page:page, numero_items:numero_items} ,function(data){
        
        $('#body_data_asignarproceso').html('');

        var array_data = data.data;
        totalPages_asignarproceso = data.last_page;
        visiblePages_asignarproceso = 5;

        if (totalPages_asignarproceso < 5)
        {
            visiblePages_asignarproceso = totalPages_asignarproceso;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_asignarproceso').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_asignarproceso').data('twbs-pagination')){
            $('#pagination_asignarproceso').twbsPagination('destroy');
            first_load_asignarproceso = true;
        }

        $('#pagination_asignarproceso').twbsPagination({
            totalPages: totalPages_asignarproceso,
            visiblePages: visiblePages_asignarproceso,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_asignarproceso = page;

                if (!first_load_asignarproceso)
                { 
                    listarprocesos();
                }

                first_load_asignarproceso = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_data, function (key, val){

            var botonasignar = '<a onclick="asignarProceso('+val.id+',\''+val.nombre+'\',\''+val.sistema_nombre+'\')" id="btn-asignarprocesobuscar" class="mb-6 btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 34px; line-height:6px" ><i style="margin-left: 2px; margin-right: 2px" class="material-icons left">assignment_turned_in</i>Asignar</a>';

            $('#body_data_asignarproceso').append('\
            <tr >\
                <td>'+val.nombre+'</td>\
                <td>'+val.sistema_nombre+'</td>\
                <td style="width: 230px;">\
                    '+botonasignar+'\
                </td>\
            </tr>');
        });

        if (array_data.length == 0)
        {
            $('#body_data_asignarproceso').append('\
            <tr>\
                <td class="center" colspan="4">No se encontraron datos</td>\
            </tr>');
        }

    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}