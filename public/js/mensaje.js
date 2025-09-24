
/**
 * 
 * @param {string} msg Descripción del mensaje
 */
function mensajeExitosoToasts(msg)
{
    Swal.fire({
        type: 'success', 
        toast: true, 
        position: 'bottom-end',
        title: 'Notificación',
        html: '<b>'+msg+'</b>',
        showConfirmButton: false, 
        timer: 5000,
    });
}

function mensajeInfoToasts(msg)
{
    Swal.fire({
        type: 'info', 
        toast: true, 
        position: 'bottom-end',
        title: 'Notificación',
        html: '<b>'+msg+'</b>',
        showConfirmButton: false, 
        timer: 5000,
    });
}

/**
 * Mensaje de error modal informativo
 * 
 * @param {string} title  Representa el titulo de la ventana
 * @param {string} msg    Representa el mensaje
 */
function mensajeErrorModal(title, msg)
{
    Swal.fire({
        type: 'error',
        title: title,
        html: msg,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#009688',
    });
}

/**
 * Mensaje modal de advertencia 
 * 
 * @param {*} title 
 * @param {*} msg 
 */
function mensajeAdvertenciaModal(title, msg)
{
    Swal.fire({
        type: 'warning',
        title: title,
        html: msg,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#009688',
    });
}

/**
 * Mesaje modal de exito con function callback
 * 
 * @param {*} title    Representa el titulo de la ventana
 * @param {*} msgHtml  Representa el mensaje
 * @param {*} callback Representa la función a ejecutar al pulsar el boton entendido
 */
function mensajeExitosoModal(title, msgHtml, callback)
{
    Swal.fire({
        title: title,
        html: msgHtml,
        type: 'success',
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Entendido'
      }).then((result) => {
           callback();
      });
}

/**
 * Mensaje modal de espera
 * 
 * @param {*} title    Representa el titulo de la ventana
 * @param {*} msgHtml  Representa el mensaje
 */
function loadingModal(title = '', msgHtml = '')
{
    var modalloading = Swal.fire({
        title: title,
        html: msgHtml,
        allowEscapeKey: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading()
        }
      });

      return modalloading;
}

/**
 * Mensaje modal de confirmacion de acciones
 * 
 * @param {text} title Representa le titulo del mensaje
 * @param {text_html} msgHtml Representa el cuerpo del mensaje con soporte de html
 * @param {function} callbackAcept  Representa la funcion a ejecutar al pulsar el aceptar
 * @param {function} callbackCancel Representa la funcion a ejecutar al pulsar el cancelar
 */
function mensajeConfirmacionModal(title, msgHtml, callbackAcept, callbackCancel = function (){})
{
    Swal.fire({
        title: title,
        html: msgHtml,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#009688',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value)
        {
            callbackAcept();
        }
        else
        {
            callbackCancel();
        }
    });
}

/**
 * Generar css cargando
 * 
 * @returns Un div con un css cargando datos
 */
function loadingPlain(colspan = 5)
{
    return '<tr><td colspan="'+colspan+'" style="text-align:center"><div class="preloader-wrapper big active">\
            <div class="spinner-layer spinner-green-only">\
            <div class="circle-clipper left">\
                <div class="circle"></div>\
            </div><div class="gap-patch">\
                <div class="circle"></div>\
            </div><div class="circle-clipper right">\
                <div class="circle"></div>\
            </div>\
            </div>\
        </div><br>Cargando datos, por favor espere</td></tr>';
}

/**
 * Generar css cargando
 * 
 * @returns Un div con un css cargando datos
 */
 function loadingPlainDiv()
 {
     return '<div style="text-align: center;"><div class="preloader-wrapper big active">\
             <div class="spinner-layer spinner-green-only">\
             <div class="circle-clipper left">\
                 <div class="circle"></div>\
             </div><div class="gap-patch">\
                 <div class="circle"></div>\
             </div><div class="circle-clipper right">\
                 <div class="circle"></div>\
             </div>\
             </div>\
         </div><br>Cargando datos, por favor espere</div>';
 }

 function estadoSolicitud(estado)
 {
    var textoestado = '';

    switch (estado) {
        case 'P':
            textoestado = '<div class="chip orange white-text">\
                                Pendiente\
                            </div>';
            break;
        case 'R':
            textoestado = '<div class="chip red white-text">\
                                Rechazada\
                            </div>';
            break;
        case 'A':
            textoestado = '<div class="chip green white-text">\
                                Aprobado\
                            </div>';
            break;
        case 'AP':
            textoestado = '<div class="chip blue white-text">\
                                En_aprobación\
                            </div>';
            break;
        case 'RV':
            textoestado = '<div class="chip green white-text">\
                                En revisión\
                            </div>';
            break;
        default:
            break;
    }

    return textoestado;
 }

 function estadoSolicitudTexto(estado)
 {
    var textoestado = '';

    switch (estado) {
        case 'Pendiente':
            textoestado = '<div class="chip orange white-text">\
                                Pendiente\
                            </div>';
            break;
        case 'Rechazada':
            textoestado = '<div class="chip red white-text">\
                                Rechazada\
                            </div>';
            break;
        case 'Registrado':
            textoestado = '<div class="chip green white-text">\
                                Registrado\
                            </div>';
            break;
        case 'Agendada':
            textoestado = '<div class="chip blue white-text">\
                                Agendada\
                            </div>';
            break;
        case 'En revisión':
            textoestado = '<div class="chip green white-text">\
                                En revisión\
                            </div>';
            break;
        default:
            break;
    }

    return textoestado;
 }

 function tipoSolicitud(tiposolicitud)
 {
    var texto = '';

    switch (tiposolicitud) {
        case 'C':
            texto = '<span style="font-weight: bold;" class="badge green lighten-2">Creación</span>';
            break;
        case 'A':
            texto = '<span style="font-weight: bold;" class="badge blue lighten-2">Edición</span>';
            break;
        case 'E':
            texto = '<span style="font-weight: bold;" class="badge red lighten-2">Eliminación</span>';
            break;
        default:
            break;
    }

    return texto;
 }