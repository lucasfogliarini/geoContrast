$(function(){
    window.geoContrast = {
      count: 0,
      default_options: {
        gmap_options: { componentRestrictions: { country: 'br'} },
        gmaps: true,
        assigned:{
          input_title: undefined,
          pin_title: 'Click to open on Google Maps.',
          pin_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABBUlEQVQ4jZXTTyuEURQG8F9T/mzGNCjh4yghG8N3MDtZKd+ApfJ12GomZIVEKDakZMHGvBZz3rwz7jt46nTuuc95ntu573v5iWE00cZLRAvrGEr092AWJ8hK4hgzZeJRnEXjHRqYjFjBVXCnGEkZbBbE9QRfx330bKQM2kE2ol7GDa6xFHtr0XOUMngLshp1flqG29irRf2aiyoFg07kLMFV+rhOPwGXkeciN/GIh1jDfOSL1AjbccK59CWO+x5rK2UwjQ+9n7GKMawWxO+YShnAvvKfKI+9MjFM4HmA+ClGGYhF3VvuF39i4Tdxjt2Ewc5fxXRf5GFBfBB7/0JN9xm3Yp3EF8CeW3oneDAyAAAAAElFTkSuQmCC'
        },
        unassigned:{
          input_title: undefined,
          pin_title: 'Location not assigned.',
          pin_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAACE0lEQVQ4jY2QQWsTURSFv5dMm2xCQFwILoqhIIolJDMpxKAU3WqxQqDoyh8gIhUXVsSNUKobK/QP1J2ICxXqwpWU0sKbgWI2GhzqQqgUoUToi9N5181MmaZFvKv7zj3nvHuuYqBGR0cL5XL5NnATGEngTeClMeZFp9P5k+Wr7KNarZ50HOetiHwDnkdR9BnAcZyxfD5/R0RGrLWTQRD8OGQwMTFR7PV6a8CS1vpZug1At9vtA3ied19Epnd2dpoptm/ged5dEbmktb7aarVKxphZYDsZHy8Wi09WVlZ6ruu+Bz5orRcAnEyCG9baGQBjzL3h4eH51dXVXwDNZvNYv9+fAR4rpZ6KyBywAJBL1SJyJo5jnfQ2FQNk+0KhoIGz6XvfAJBSqZQDUEpl8fQDBbC3t3fg8FniV2NM6rxVq9Wa6aDRaJwHtgCsteeAL+kse4NlYApY01ov1uv1W57nXQGI47jr+/5issk1EVlORfvrjI+Pn4rj2I+i6PTGxsbPwQgAruuWga611guCYPNAhPX19RB4NTQ09OAocVKPROR1Kh68AdbaWeB6kvlA1ev1C0BbKfUwi6tBYq1Wu5jL5ZYAV2u9DdBoNE5Ya7WITPu+/+mfBknWOWCsUqlMAoRh+E5EAq31oXhHGrTb7XwYhm+A70Bkra34vj8F2P8yAGi1WqXd3d2PSikxxlzudDq/j+L9BaBN8gpKSjbcAAAAAElFTkSuQmCC'
        }
      }
    }

    $.fn.geoContrast = function(options){
      var $inputs = this;
      for (var i = 0; i < $inputs.length; i++) {
        window.geoContrast.count += 1;

        //props
        $inputs[i].options = $.extend(true,window.geoContrast.default_options,options);
        $inputs[i].gmap_autocomplete = new google.maps.places.Autocomplete($inputs[i], $inputs[i].options.gmap_options);
        $inputs[i].gmap_autocomplete.input = $inputs[i];//accessibility
        $inputs[i].$pin = $('<label class="pin_geo-contrast"/>');
        $inputs[i].$input = $($inputs[i]);
        $inputs[i].$lat = $('<input class="lat_geo-contrast" type="hidden" />');
        $inputs[i].$lng = $('<input class="lng_geo-contrast" type="hidden" />');
        //endprops

        //methods
        $inputs[i].setLocation = function(location){
          try{
            this.$lat.val(location.lat());
            this.$lng.val(location.lng());
          } catch(ex){
            throw ex;
          }
        }

        $inputs[i].toggle = function(assign){
          var input_title, pin, pin_title;

          if (assign) {
            pin_img = this.options.assigned.pin_img;
            pin_title = this.options.assigned.pin_title;
            input_title = this.options.assigned.input_title;
            if(input_title){
              this.$input.attr('title',input_title);
            }
          }else{
            this.$lat.val('');
            this.$lng.val('');
            pin_img = this.options.unassigned.pin_img;
            pin_title = this.options.unassigned.pin_title;
            input_title = this.options.unassigned.input_title;
          }
          this.$pin.css('background','no-repeat url('+pin_img+')');
          this.$pin.attr('title',pin_title);
          this.$input.attr('title',input_title);
        }

        $inputs[i].assigned = function(){
          return this.$lat.val() !== '';
        }
        //endmethods

        //init
        $inputs[i].$input.addClass('geo-contrast');
        $inputs[i].$input.css('padding-right','20px');
        $inputs[i].$input.after($inputs[i].$lng);
        $inputs[i].$input.after($inputs[i].$lat);
        $inputs[i].$input.after($inputs[i].$pin);        

        $inputs[i].$pin.css({
          position:'relative',
          right:'20px',
          top:'1px',
          padding: '0 8px',
          cursor: 'pointer'
        });

        google.maps.event.addListener($inputs[i].gmap_autocomplete, 'place_changed', function(){
          this.input.place_info = this.getPlace();
          var location = this.input.place_info.geometry === undefined ? undefined :
                          this.input.place_info.geometry.location;
          if(location) this.input.setLocation(location);
          this.input.toggle(location);
        });
        $inputs[i].toggle(false);
        if (window.geoContrast.count > 0) {
          $(document).on('input','.geo-contrast',function(){
            if (this.assigned()) {
              this.toggle(false);
            };
          });
          $(document).on('click','.pin_geo-contrast',function(){
            var input = $(this).prev()[0];
            if (input.assigned() && input.options.gmaps) {
              window.open('https://www.google.com.br/maps/place/'+input.place_info.formatted_address);
            };
          });
        };
        //endinit
      };
    }
});
