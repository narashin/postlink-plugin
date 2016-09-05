(function($) {
  $.fn.postlink = function(options) {
    var settings = $.extend({
      callback: function(data, status) {},
      confirm: true
    }, options);

    $(this).on('click', function() {
      var selected = $(this);
      var data_attr;
      var forms_data = {};
      var data_attr_arr = {
        'data-method': 'post',
        'data-via': 'form',
      };

      var pl = function() {
        selected.each(function() {
          $(this.attributes).each(function() {
            if (this.specified) {
              if (this.name.indexOf("data-") !== -1) {
                data_attr = this.name.substring(5, this.name.length);
                if (data_attr !== 'method' && data_attr !== 'via') {
                  data_attr_arr[data_attr] = selected.attr(this.name);
                  forms_data[data_attr] = selected.attr(this.name);
                } else
                  data_attr_arr["data-" + data_attr] = selected.attr(this.name);
              }
            }
          });
        });

        var inputs = $.map(forms_data, function(value, key) {
          return $('<input />', {
            type: 'hidden',
            name: key,
            value: value
          });
        });

        var forms = $('<form/>', {
          method: data_attr_arr['data-method'],
          action: selected.href
        }).append(inputs);

        $('body').append(forms);

        if (data_attr_arr['data-via'] == 'ajax') {
          $.ajax({
            type: data_attr_arr['data-method'],
            url: selected.attr('href'),
            cache: false,
            data: forms.serialize(),
            success: function(data, status) {
              settings.callback(data, status);
            },
            error: function(data, status) {
              alert(data + status + " -> failed.");
            }
          });
        } else if (data_attr_arr['data-via'] == 'form') {
          forms.submit();
        }
      };

      if (settings.confirm === true) {
        if (confirm('Are you sure?') === false) {
          return false;
        } else {
          pl();
        }
      } else if (settings.confirm === false) {
        pl();
      }
      return false;
    }); // click event
  };
}(jQuery));
