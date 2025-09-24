$(document).ready(function () {

    $('#checkAll').on('click', function () {
      $(this).closest('table').find('tbody .checkinput')
        .prop('checked', this.checked)
        .closest('tr').toggleClass('selected', this.checked);

        var estado = this.checked;
        var registros = $(".table input[name='id[]']:checked").map(function(){
            return $(this).val();
        }).get();

        $.each( botones, function( key, value ) {

            if(estado && parseInt(value.nroseleccionados) == 0){
                $("#"+value.id).removeAttr("disabled");

            }else if(!estado && parseInt(value.nroseleccionados) == 0){
                $("#"+value.id).attr("disabled", "disabled");
            }else{
                $("#"+value.id).attr("disabled", "disabled");
            }

        });

    });

  });

function checkbox(event, check_id, handler = null)
{
    event.target.click();

    $(event.target).closest('tr').toggleClass('selected', this.checked);

    $(event.target).closest('table').find('#checkAll').prop('checked', ($(event.target).closest('table').find('tbody input:checkbox:checked').length == $(event.target).closest('table').find('tbody input:checkbox').length));

    var registros = $(".table input[name='id[]']:checked").map(function(){  return $(this).val(); }).get();

    $.each( botones, function( key, value ) {
        if(registros.length == 1 && (parseInt(value.nroseleccionados) == 0 || parseInt(value.nroseleccionados) == 1 )){
            $("#"+value.id).removeAttr("disabled");
        }else if(registros.length > 1 && parseInt(value.nroseleccionados) == 0){
            $("#"+value.id).removeAttr("disabled");
        }else{
            $("#"+value.id).attr("disabled", "disabled");
        }
    });

    if (handler != null)
    {
        handler(registros);
    }
}

function validarEliminar(registros)
{
    for (let index = 0; index < registros.length; index++) {
        for (let i = 0; i < array_data.length; i++) {
            var a = (registros[index] == array_data[i].id);
            var b = (array_data[i].estado != "P");

           if ((registros[index] == array_data[i].id) && (array_data[i].estado != "P"))
           {
                $("#btn-eliminar").attr("disabled", "disabled");
           }
        }
    }
}

function bloquearAgendar(registros)
{
    var registros = $(".table input[name='id[]']:checked").map(function(){
        return $(this).val();
    }).get();

    if (registros.length == 1)
    {
        for (let i = 0; i < array_data.length; i++) {
            if(registros[0] == array_data[i].id)
            {
                var estado = array_data[i].estado;
    
                if (estado == 'P' || estado == 'AG')
                {
                    $("#btn-aprobar").removeAttr('disabled');
                }
                else 
                {
                    $("#btn-aprobar").attr('disabled', true);
                }
            }
        }
    }
    else
    {
        $("#btn-aprobar").attr('disabled', true);
    }
}

function radio(event, handler = null)
{
    event.target.click();

    $(event.target).closest('tr').toggleClass('selected', this.checked);
    $(event.target).closest('table').find('#checkAll').prop('checked', ($(event.target).closest('table').find('tbody input:radio:checked').length == $(event.target).closest('table').find('tbody input:radio').length));
    var registros = $(".table input[name='id[]']:checked").map(function(){  return $(this).val(); }).get();

    $.each( botones, function( key, value ) {
        if(registros.length == 1 && (parseInt(value.nroseleccionados) == 0 || parseInt(value.nroseleccionados) == 1 )){
            $("#"+value.id).removeAttr("disabled");
        }else if(registros.length > 1 && parseInt(value.nroseleccionados) == 0){
            $("#"+value.id).removeAttr("disabled");
        }else{
            $("#"+value.id).attr("disabled", "disabled");
        }
    });

    if (handler != null)
    {
        handler();
    }
}

function marcarcheckbox(elementocheckbox){
    $("#"+elementocheckbox).click();
}

function verificaBotones()
{
    var registros = $(".table input[name='id[]']:checked").map(function(){  return $(this).val(); }).get();
    var estado = (registros.length == numero_items.value);
    $.each( botones, function( key, value ) {
        if(!estado){
            if(registros.length == 1 && (parseInt(value.nroseleccionados) == 0 || parseInt(value.nroseleccionados) == 1 )){
                $("#"+value.id).removeAttr("disabled");
            }else if(registros.length > 1 && parseInt(value.nroseleccionados) == 0){
                $("#"+value.id).removeAttr("disabled");
            }else{
                $("#"+value.id).attr("disabled", "disabled");
            }
        }else{
            if(estado && parseInt(value.nroseleccionados) == 0){
                $("#"+value.id).removeAttr("disabled");
            }else {
                $("#"+value.id).attr("disabled", "disabled");
            } 
        }
    });

    if (registros.length == 0)
    {
        $('#checkAll').prop('checked', false);
    }
}

function seleccionarCheckbox(tbody_id = 'body_data')
{
    var array_row =  $("#"+tbody_id).children('tr');

    for (let i = 0; i < array_row.length; i++)
    {
        var a = array_row[i];
        var array_td = a.children;

        for (let j = 1; j < array_td.length; j++)
        {
            if (array_td[0].children.length > 0 && array_td[0].children[0].children.length > 0)
            {
                var id = array_td[0].children[0].children[0].id;
                $(array_td[j]).attr('onClick','marcarcheckbox("'+id+'")');

            }

        }
    }
}
