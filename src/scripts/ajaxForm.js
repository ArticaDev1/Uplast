var AjaxForm = {

  initialize: function (afConfig) {
    //add jquery script
    let script;
    if (!jQuery().ajaxForm) {
      script = document.createElement('script');
      script.src = afConfig['assetsUrl'] + 'js/lib/jquery.form.min.js';
      document.body.appendChild(script);
    }

    //submit event
    $(document).off('submit', afConfig['formSelector']).on('submit', afConfig['formSelector'], function (e) {
      
      let $form = e.target;
      if (!Validation.check_prevalidation($form)) return;

      $(this).ajaxSubmit({
        dataType: 'json',
        data: {
          pageId: afConfig['pageId']
        },
        url: afConfig['actionUrl'],
        beforeSerialize: function (form) {
          form.find(':submit').each(function () {
            if (!form.find('input[type="hidden"][name="' + $(this).attr('name') + '"]').length) {
              $(form).append(
                $('<input type="hidden">').attr({
                  name: $(this).attr('name'),
                  value: $(this).attr('value')
                })
              );
            }
          })
        },
        beforeSubmit: function (fields, form) {
          
          form[0].dispatchEvent(new CustomEvent("ajaxForm:beforeSubmit", {
            bubbles: true
          }));

        },
        success: function (response, status, xhr, form) {

          form[0].dispatchEvent(new CustomEvent("ajaxForm:afterSubmit", {
            bubbles: true,
            detail: { 
              response: response 
            }
          }));

          //success
          if (response.success) {

            form[0].dispatchEvent(new CustomEvent("ajaxForm:success", {
              bubbles: true,
              detail: { 
                response: response 
              }
            }));

          } 
          
          //error
          else {
            //если будет какая-то ошибка, глянем в консоли что случилось
            console.log(response)
          }
        }
      });


      e.preventDefault();
      return false;
    });
  }
};