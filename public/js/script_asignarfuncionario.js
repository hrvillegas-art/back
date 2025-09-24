last_page_asignarfuncionario = 1,
totalPages_asignarfuncionario = 2,
visiblePages_asignarfuncionario = 2,
first_load_asignarfuncionario = true,
    
$(document).ready(function()
{
    $("#modal_asignarfuncionario").modal();

    $("#btn_modalasignarfuncionario_cancelar").click(function(){
        $('#modal_asignarfuncionario').modal('close');
    });

    $('#btn-asignarfuncionariobuscar').click(function(event){

        var find = $('#find_asignarfuncionario').val();

        find = find.trim();

        if(find.length > 0)
        {
            listarFuncionario();
        }
        else
        {
            mensajeErrorModal('Error de busqueda','Debe ingresar al menos un criterio de busqueda');
        }
    });

    $('#btn-asignarfuncionariobuscartodo').click(function(event){
        $('#find_asignarfuncionario').val('');
        listarFuncionario();
    });
});


function listarFuncionario()
{
    var numero_items = 5,
    page = last_page_asignarfuncionario,
    find =  $('#find_asignarfuncionario').val();

    $('#body_data_asignarfuncionario').html(loadingPlain(4));

    $.get('/api/listarfuncionario',{find:find, page:page, numero_items:numero_items} ,function(data){
        
        $('#body_data_asignarfuncionario').html('');

        var array_data = data.data;
        totalPages_asignarfuncionario = data.last_page;
        visiblePages_asignarfuncionario = 5;

        if (totalPages_asignarfuncionario < 5)
        {
            visiblePages_asignarfuncionario = totalPages_asignarfuncionario;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_asignarfuncionario').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_asignarfuncionario').data('twbs-pagination')){
            $('#pagination_asignarfuncionario').twbsPagination('destroy');
            first_load_asignarfuncionario = true;
        }

        $('#pagination_asignarfuncionario').twbsPagination({
            totalPages: totalPages_asignarfuncionario,
            visiblePages: visiblePages_asignarfuncionario,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_asignarfuncionario = page;

                if (!first_load_asignarfuncionario)
                { 
                    listarFuncionario();
                }

                first_load_asignarfuncionario = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_data, function (key, val){
            var nombre = val.nombres +' '+val.apellidos;
            var botonasignar = '<a onclick="asignarFuncionario('+val.identificacion +',\''+nombre+'\', true)" id="btn-asignarfuncionariobuscar" class="mb-6 btn waves-effect waves-light gradient-45deg-light-blue-cyan right" style="padding: inherit;height: 34px; line-height:6px" ><i style="margin-left: 2px; margin-right: 2px" class="material-icons left">assignment_turned_in</i>Asignar</a>';

            $('#body_data_asignarfuncionario').append('\
            <tr >\
                <td>'+nombre+'</td>\
                <td>'+val.correo_institucional+'</td>\
                <td style="width: 230px;">\
                    '+botonasignar+'\
                </td>\
            </tr>');
        });

        if (array_data.length == 0)
        {
            $('#body_data_asignarfuncionario').append('\
            <tr>\
                <td class="center" colspan="4">No se encontraron datos</td>\
            </tr>');
        }

    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}