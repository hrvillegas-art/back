var last_page_normas = 1,
totalPages_normas = 2,
visiblePages_normas = 2,
first_load_normas = true,


last_page_numeral = 1,
totalPages_numeral = 2,
visiblePages_numeral = 2,
first_load_numeral = true

norma_seleccionda = 0,
array_numerales_filtrados = [];

$(document).ready(function(){
    $('#modal_agregarnorma').modal();

    $('#btn_modal_agregarnorma').click(function(){
        $('#modal_agregarnorma').modal('open');
        
    });

    $('#btn_modal_norma_cancelar').click(function(){
        $('#modal_agregarnorma').modal('close');
    });

    $('#checkAll_numeral').on('click', function () {

        $(this).closest('.table_numeral').find('tbody .checkinput_numeral')
          .prop('checked', this.checked)
          .closest('tr').toggleClass('selected', this.checked);
    });

    $("#find_numeral").keyup(function(){
        if (norma_seleccionda > 0)
        {
            listarnumerales();
        }
    });

    $("#find_norma").keyup(function(){
        listarNormas();
    });
});

listarNormas();

function listarNormas()
{
    var numero_items =10,
    page = last_page_normas,
    find =  $('#find_norma').val();

    $('#body_data_normas').html(loadingPlain(1));

    $.get('/api/norma',{find:find, page:page, numero_items:numero_items, estado:true} ,function(data){
        $('#body_data_normas').html('');

        var array_data = data.data;
        totalPages_normas = data.last_page;
        visiblePages_normas = 5;

        if (totalPages < 5)
        {
            visiblePages_normas = totalPages_normas;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_normas').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_normas').data('twbs-pagination')){
            $('#pagination_normas').twbsPagination('destroy');
            first_load_normas = true;
        }

        $('#pagination_normas').twbsPagination({
            totalPages: totalPages_normas,
            visiblePages: visiblePages_normas,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_normas = page;

                if (!first_load_normas)
                {
                    listarNormas();
                }

                first_load_normas = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_data, function (key, val){
            $('#body_data_normas').append('\
            <tr >\
                <td>\
                    <label>\
                        <input type="radio" id="radio_norma_'+val.id+'" name="radio_norma[]" value="'+val.id+'" class="checkinput" onclick="filtrarNumerales('+val.id+')">\
                        <span></span> \
                    </label>\
                </td>\
                <td>'+val.nombre+'</td>\
            </tr>');
        });

        if (array_data.length == 0)
        {
            $('#body_data_normas').html('<tr ><td class="center" >No se encontraron datos</td></tr>');
        }
    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}

function filtrarNumerales(norma_id)
{
    norma_seleccionda = norma_id;

    if (norma_seleccionda >0 )
    {
        listarnumerales();
    }
}

function listarnumerales()
{
    var numero_items = 10,
    page = last_page_numeral,
    find =  $('#find_numeral').val();

    $('#body_data_numeral').html(loadingPlain(1));

    array_numerales_filtrados = [];

    $.get('/api/numeral',{find:find, norma_id:norma_seleccionda, page:page, numero_items:numero_items} ,function(data){
        $('#body_data_numeral').html('');

        array_numerales_filtrados = data.data;
        totalPages_numeral = data.last_page;
        visiblePages_numeral = 5;

        if (totalPages_numeral < 5)
        {
            visiblePages_numeral = totalPages_numeral;
        }

        var desde = data.from == null ? 0: data.from;
        var hasta = data.to == null ? 0: data.to;

        $('#registros_numeral').html('Registros de '+desde+' a '+hasta+' de '+data.total);

        if($('#pagination_numeral').data('twbs-pagination')){
            $('#pagination_numeral').twbsPagination('destroy');
            first_load_numeral = true;
        }

        $('#pagination_numeral').twbsPagination({
            totalPages: totalPages_numeral,
            visiblePages: visiblePages_numeral,
            startPage:page,
            first: '<i class="material-icons">first_page</i>',
            prev: '<i class="material-icons">navigate_before</i>',
            next: '<i class="material-icons">navigate_next</i>',
            last: '<i class="material-icons">last_page</i>',
            onPageClick: function (event, page) {
                last_page_numeral = page;

                if (!first_load_numeral)
                {
                    listarnumerales();
                }

                first_load_numeral = false;
            }
        }).on('page', function (event, page) {

        });

        $.each(array_numerales_filtrados, function (key, val){
            $('#body_data_numeral').append('\
            <tr >\
                <td>\
                    <label>\
                        <input type="checkbox" data-norma_id="'+val.norma_id+'" id="numeral_'+val.id+'" name="id[]" value="'+val.id+'" class="checkinput_numeral" onclick="asignar('+val.norma_id+','+val.id+')">\
                        <span></span> \
                    </label>\
                </td>\
                <td>'+val.numeral+' - '+val.nombre+'</td>\
            </tr>');
        });

        validarNumerales(array_numerales_filtrados);

        if (array_numerales_filtrados.length == 0)
        {
            $('#body_data_numeral').html('<tr ><td class="center" >No se encontraron datos</td></tr>');
        }
    }).fail(function(jqXHR, textStatus, errorThrown ) {
        mensajeErrorModal(jqXHR.responseJSON.title, jqXHR.responseJSON.msg.join('<br>'));
    });
}

function formatearNumerales()
{
    var temp = 0,
    obj_norma = {},
    array_out = [],
    array_numerales = [];

    array_numerales_existentes.forEach(val => {
        if (temp == 0)
        {
            temp = val.norma_id;
        }

        if (temp == val.norma_id)
        {
            obj_norma = {
                nombre: val.obj_norma.nombre,
                id: val.norma_id
            };

            array_numerales.push({
                id: val.obj_numeral.id,
                nombre: val.obj_numeral.nombre,
                numeral: val.obj_numeral.numeral
            });

        }
        else
        {
            temp = val.norma_id;
            obj_norma.array_numeral = array_numerales;
            array_out.push(obj_norma);
            obj_norma = {};
            array_numerales = [];

            obj_norma = {
                nombre: val.obj_norma.nombre,
                id: val.norma_id
            };

            array_numerales.push({
                id: val.obj_numeral.id,
                nombre: val.obj_numeral.nombre,
                numeral: val.obj_numeral.numeral
            });
        }
    });

    if (array_numerales_existentes.length > 0)
    {
        obj_norma.array_numeral = array_numerales;
        array_out.push(obj_norma);
    }

    return array_out;
}

function listarNormasAsignadas()
{
    $('#body_data_normasasignadas').html('');

    array_numerales_existentes.sort(function (a, b){
        return (b.norma_id - a.norma_id)
    });

    var array_numerales = formatearNumerales();

    array_numerales.forEach(val => {

        var array_temp = [];

        val.array_numeral.forEach(element => {
            array_temp.push(element.numeral);
        });

          $('#body_data_normasasignadas').append('\
            <tr >\
                <td>'+val.nombre+'</td>\
                <td>'+array_temp.join(', ')+'</td>\
            </tr>');
    });

    if (array_numerales.length == 0)
    {
        $('#body_data_normasasignadas').html('<tr ><td class="center" colspan="2">No se encontraron datos</td></tr>');
    }
}

function validarNumerales(array_data)
{
    array_numerales_existentes.forEach(val_existente => {
        array_data.forEach(val => {
            if (val_existente.numeral_id ==  val.id)
            {
                $("#numeral_"+val.id).attr('checked', true);
            }
        });    
    });
}

function asignar(norma_id, numeral_id)
{

    element  = {
        numeral_id: numeral_id, 
        norma_id: norma_id
    };

    // Validar estado anterior
    if(!$("#numeral_"+numeral_id).prop('checked') )
    {
        eliminarPorNumeral(numeral_id)
    }
    else
    {
        var norma_nombre = '',
        numeral_nombre = '',
        numeral_numeral = '';

        array_numerales_filtrados.forEach(value_nf => {
            if(element.norma_id == value_nf.norma_id)
            {
                norma_nombre = value_nf.norma_nombre;
            }
        });

        array_numerales_filtrados.forEach(value_nf => {
            if(element.numeral_id == value_nf.id)
            {
                numeral_numeral = value_nf.numeral;
                numeral_nombre = value_nf.nombre
            }
        });

        array_numerales_existentes.push(
            {
                id:0,
                norma_id: element.norma_id,
                numeral_id: element.numeral_id,
                obj_norma: {
                    id:element.norma_id,
                    nombre: norma_nombre
                },
                obj_numeral: {
                    id: element.numeral_id,
                    nombre: numeral_nombre,
                    numeral: numeral_numeral
                }
            }
        );
    }

    listarNormasAsignadas();
}

function eliminarPorNumeral(numeral_id)
{
    var array_temp = [];

    array_numerales_existentes.forEach(val_existente => {
        if (val_existente.numeral_id !=  numeral_id)
        {
            array_temp.push(val_existente);
        }
    });

    array_numerales_existentes = array_temp;
}