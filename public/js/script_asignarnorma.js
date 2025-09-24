last_page_asignarnorma = 1,
totalPages_asignarnorma = 2,
visiblePages_asignarnorma = 2,
first_load_asignarnorma = true,
    
$(document).ready(function()
{
    $("#modal_asignarnorma").modal();

    $("#btn_modalasignarnorma_cancelar").click(function(){
        $('#modal_asignarnorma').modal('close');
    });

    $('#btn-asignarnormabuscar').click(function(event){

        var find = $('#find_asignarnorma').val();

        find = find.trim();

        if(find.length > 0)
        {
            listarnorma();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-asignarnormabuscartodo').click(function(event){
        $('#find_asignarnorma').val('');
        listarnorma();
    });
});


function listarnorma()
{
    var numero_items = 5,
    page = last_page_asignarnorma,
    find =  $('#find_asignarnorma').val(),
    proceso_id = $('#proceso_id').val();
    $('#body_data_asignarnorma').html(loadingPlain(4));

    $.get('/api/listarnormaporproceso',{find:find, proceso_id:proceso_id, page:page, numero_items:numero_items} ,function(data){
        
        $('#body_data_asignarnorma').html('');

        var array_data = data.data;
        totalPages_asignarnorma = data.last_page;
        visiblePages_asignarnorma = 5;

        if (totalPages_asignarnorma < 5)
        {
            visiblePages_asignarnorma = totalPages_asignarnorma;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_asignarnorma').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_asignarnorma').data('twbs-pagination')){
            $('#pagination_asignarnorma').twbsPagination('destroy');
            first_load_asignarnorma = true;
        }

        $('#pagination_asignarnorma').twbsPagination({
            totalPages: totalPages_asignarnorma,
            visiblePages: visiblePages_asignarnorma,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_asignarnorma = page;

                if (!first_load_asignarnorma)
                { 
                    listarnorma();
                }

                first_load_asignarnorma = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_data, function (key, val){

            var botonasignar = '<a onclick="asignarNorma('+val.norma_id+',\''+val.norma_nombre+'\',true)" id="btn-asignarnormabuscar" class="mb-6 btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 34px; line-height:6px" ><i style="margin-left: 2px; margin-right: 2px" class="material-icons left">assignment_turned_in</i>Asignar</a>';

            $('#body_data_asignarnorma').append('\
            <tr >\
                <td>'+val.norma_nombre+'</td>\
                <td style="width: 230px;">\
                    '+botonasignar+'\
                </td>\
            </tr>');
        });

        if (array_data.length == 0)
        {
            $('#body_data_asignarnorma').append('\
            <tr>\
                <td class="center" colspan="4">No se encontraron datos</td>\
            </tr>');
        }

    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}