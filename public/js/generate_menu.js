    var array_menu = jQuery.parseJSON(jsonMenu);

    $("#ul-horizontal-nav").html('');
    var texthtml = '';

    $.each(array_menu, function (key, val) {
        var classuse = '',
            icon_rigth = '';

        if ((val.menu.length > 0))
        {
            icon_rigth = '<i class="material-icons right">keyboard_arrow_down</i>';
            classuse = 'dropdown-menu';

            texthtml += '<li>\
            <a class="'+classuse+'" data-target="PageDropdown'+val.modulo_id+'">\
              <i class="material-icons">settings_applications</i>\
              <span>'+val.modulo+' '+icon_rigth+'</span>\
            </a>';

                
            texthtml += '<ul class="dropdown-content dropdown-horizontal-list" id="PageDropdown'+val.modulo_id+'" tabindex="0">';

            $.each(val.menu, function (k, v) {
                    texthtml += '<li data-menu="" tabindex="0">\
                            <a class="" href="/'+v.menu.url+'" >'+v.menu.menu+'</a>\
                        </li>';
                    });

            texthtml += '</ul>';
            texthtml += '</li>';
        }
        else if (val.url != '')
        {
            icon_rigth = '';
            classuse = '';

            texthtml += '<li>\
            <a  href="/'+val.url+'" class="'+classuse+'">\
              <i class="material-icons">settings_applications</i>\
              <span>'+val.modulo+' '+icon_rigth+'</span>\
            </a>';
            texthtml += '</li>';
        }
    });

    $("#ul-horizontal-nav").append(texthtml);
    menuConfiguracion();

    function menuConfiguracion()
    {
        $("#slide-out").html('');
        var texthtml = '';

        $.each(array_menu, function (key, val) {
            var classuse = '',
                href = '';
                icon_rigth = '';

                if((val.modulo_id == "SGEC_MIGR"))
                {
                    texthtml += '<div class="collapsible-body">\
                    <ul class="collapsible collapsible-sub" data-collapsible="accordion">';

                        $.each(val.menu, function (k, v) {
                            texthtml += '<li>\
                                    <a data-i18n=""  class="collapsible-body" href="/'+v.menu.url+'" >'+v.menu.menu+'</a>\
                                </li>';
                            });

                    texthtml += '</ul>';
                }

                texthtml += '</li>';
        });

        $("#slide-out").append(texthtml);
    }
