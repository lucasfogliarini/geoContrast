$(function(){
    window.geoContrast = {
      counter: 0,
      default_options: {
        gmap_options: { componentRestrictions: { country: 'br'} },
        set:{
          input_title: 'Double-click to unset.',
          pin_title: 'gmaps',//'gmaps':'Double-click to gmaps; lat:"lat_number"; lng:"lng_number"';
          pin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABBUlEQVQ4jZXTTyuEURQG8F9T/mzGNCjh4yghG8N3MDtZKd+ApfJ12GomZIVEKDakZMHGvBZz3rwz7jt46nTuuc95ntu573v5iWE00cZLRAvrGEr092AWJ8hK4hgzZeJRnEXjHRqYjFjBVXCnGEkZbBbE9QRfx330bKQM2kE2ol7GDa6xFHtr0XOUMngLshp1flqG29irRf2aiyoFg07kLMFV+rhOPwGXkeciN/GIh1jDfOSL1AjbccK59CWO+x5rK2UwjQ+9n7GKMawWxO+YShnAvvKfKI+9MjFM4HmA+ClGGYhF3VvuF39i4Tdxjt2Ewc5fxXRf5GFBfBB7/0JN9xm3Yp3EF8CeW3oneDAyAAAAAElFTkSuQmCC'
        },
        nset:{
          input_title: undefined,
          pin_title: 'Unset',
          pin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAACE0lEQVQ4jY2QQWsTURSFv5dMm2xCQFwILoqhIIolJDMpxKAU3WqxQqDoyh8gIhUXVsSNUKobK/QP1J2ICxXqwpWU0sKbgWI2GhzqQqgUoUToi9N5181MmaZFvKv7zj3nvHuuYqBGR0cL5XL5NnATGEngTeClMeZFp9P5k+Wr7KNarZ50HOetiHwDnkdR9BnAcZyxfD5/R0RGrLWTQRD8OGQwMTFR7PV6a8CS1vpZug1At9vtA3ied19Epnd2dpoptm/ged5dEbmktb7aarVKxphZYDsZHy8Wi09WVlZ6ruu+Bz5orRcAnEyCG9baGQBjzL3h4eH51dXVXwDNZvNYv9+fAR4rpZ6KyBywAJBL1SJyJo5jnfQ2FQNk+0KhoIGz6XvfAJBSqZQDUEpl8fQDBbC3t3fg8FniV2NM6rxVq9Wa6aDRaJwHtgCsteeAL+kse4NlYApY01ov1uv1W57nXQGI47jr+/5issk1EVlORfvrjI+Pn4rj2I+i6PTGxsbPwQgAruuWga611guCYPNAhPX19RB4NTQ09OAocVKPROR1Kh68AdbaWeB6kvlA1ev1C0BbKfUwi6tBYq1Wu5jL5ZYAV2u9DdBoNE5Ya7WITPu+/+mfBknWOWCsUqlMAoRh+E5EAq31oXhHGrTb7XwYhm+A70Bkra34vj8F2P8yAGi1WqXd3d2PSikxxlzudDq/j+L9BaBN8gpKSjbcAAAAAElFTkSuQmCC'
        }
      }
    }

    $.fn.geoContrast = function(options){
      var $autocompletes = this;
      for (var i = 0; i < $autocompletes.length; i++) {
        window.geoContrast.counter += 1;

        //props
        $autocompletes[i].options = $.extend(true,window.geoContrast.default_options,options);
        $autocompletes[i].gmap_autocomplete = new google.maps.places.Autocomplete($autocompletes[i], $autocompletes[i].options.gmap_options);
        $autocompletes[i].gmap_autocomplete.input = $autocompletes[i];//accessibility
        $autocompletes[i].$pin = $('<label class="pin_geo-contrast"/>');
        $autocompletes[i].$autocomplete = $($autocompletes[i]);
        $autocompletes[i].$lat = $('<input class="lat_geo-contrast" type="hidden" />');
        $autocompletes[i].$lng = $('<input class="lng_geo-contrast" type="hidden" />');
        //endprops

        //methods
        $autocompletes[i].setLocation = function(location){
          try{
            this.$lat.val(location.lat());
            this.$lng.val(location.lng());
          } catch(ex){
            throw ex;
          }
        }

        $autocompletes[i].toggle = function(set){
          var input_title, input_cursor, pin, pin_title;

          this.disabled = set;
          if (set) {
            pin = this.options.set.pin;
            pin_title = this.options.set.pin_title;
            pin_title = pin_title === 'gmaps' ? 'Double-click to gmaps; lat: '+this.$lat.val()+'; lng: '+this.$lng.val() : pin_title;
            input_title = this.options.set.input_title;
            input_cursor = 'pointer';
            if(input_title){
              this.$autocomplete.attr('title',input_title);
            }
          }else{
            this.$lat.val('');
            this.$lng.val('');
            pin = this.options.nset.pin;
            pin_title = this.options.nset.pin_title;
            input_title = this.options.nset.autocomplete_title;
            input_cursor = 'auto';
            if(input_title){
              this.$autocomplete.attr('title',input_title);
            }
          }
          this.$pin.css('background','no-repeat url('+pin+')');
          this.$pin.attr('title',pin_title);
          this.$autocomplete.css('cursor',input_cursor);
        }

        $autocompletes[i].isValid = function(){
          return this.$lat.val() !== '';
        }
        //endmethods

        //init
        $autocompletes[i].$autocomplete.addClass('geo-contrast');
        $autocompletes[i].$autocomplete.css('padding-right','20px');
        $autocompletes[i].$autocomplete.after($autocompletes[i].$lng);
        $autocompletes[i].$autocomplete.after($autocompletes[i].$lat);
        $autocompletes[i].$autocomplete.after($autocompletes[i].$pin);

        $autocompletes[i].$pin.css({
          position:'relative',
          right:'20px',
          top:'1px',
          padding: '0 8px',
          cursor: 'pointer'
        });


        google.maps.event.addListener($autocompletes[i].gmap_autocomplete, 'place_changed', function(){
          this.input.place_info = this.getPlace();
          var location = this.input.place_info.geometry === undefined ? undefined :
                          this.input.place_info.geometry.location;
          if(location) this.input.setLocation(location);
          this.input.toggle(location);
        });
        $autocompletes[i].toggle(false);
        if (window.geoContrast.counter > 0) {
          $(document).on('dblclick','.geo-contrast',function(){
            this.toggle(false);
          });
          $(document).on('dblclick','.pin_geo-contrast',function(){
            var autocomplete = $(this).prev()[0];
            if (autocomplete.isValid()) {
              window.open('https://www.google.com.br/maps/place/'+autocomplete.place_info.formatted_address);
            };
          });
        };
        //endinit
      };
    }
});
