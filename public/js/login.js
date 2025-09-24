$(document).ready(function () {

    $('#form_login').validate({ // initialize the plugin
        rules: {
            usuario: {
                required: true
            },
            clave: {
                required: true
            }
        },
        messages: {
            usuario:{
                required: "Digite su usuario"
            },
            clave:{
                required: "Digite su contraseña"
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
            Login();
            return false; // for demo
        }
    });
});

function validar(e)
{
    $("#error").css({display: 'none'});    
    $("#error").html(''); 
}

function Login()
{
    $.ajax({
        url: '/login',  
        type: 'GET',
        headers:{'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
        data: {username: $("#usuario").val(), password: $("#clave").val()},
        beforeSend: function(){
            $("#send").attr("disabled", "disabled");
            $("#divloading").removeClass('display-none');
        },
        success: function(outserver){
            if (outserver.state == '202') // Operacion exitosa
            {
                localStorage.clear();

                location.href="/home";
            }
        },
        //si ha ocurrido un error
        error: function(outerror){
        }
    }).fail( function( jqXHR, textStatus, errorThrown ) {
            $("#send").removeAttr("disabled");
            $("#divloading").addClass('display-none');

            $("#error").css({display: ''});    
            $("#success").css({display: 'none'});
            $("#error").html('<strong>Algo salio mal...!</strong>'+jqXHR.responseJSON.msg); 
    });
}