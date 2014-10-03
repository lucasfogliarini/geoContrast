/*
geoContrast v0.9 author: https://github.com/lucasfogliarini

warning! Google places has duplicates.
*/
$(function(){
    window.geoContrast = {
      count: 0,
      options_default: {
        options_gmap: { componentRestrictions: { country: 'br'} },
        gmaps: true,
        assignAfterBlur: true,
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
      for (var i = 0; i < $inputs.length; i++){
        window.geoContrast.count += 1;
        //props
        $inputs[i].options = $.extend(true,window.geoContrast.options_default,options);
        $inputs[i].autocomplete_gmap = new google.maps.places.Autocomplete($inputs[i], $inputs[i].options.options_gmap);
        $inputs[i].geocoder = new google.maps.Geocoder();
        $inputs[i].autocomplete_gmap.inputPlace = $inputs[i];//accessibility
        $inputs[i].$pin = $('<label class="pin_geo-contrast"/>');
        $inputs[i].$inputPlace = $($inputs[i]);
        //endprops

        //methods
        $inputs[i].toggle = function(assign){
          var input_title, pin, pin_title;

          if (assign)
          {
            pin_img = this.options.assigned.pin_img;
            pin_title = this.options.assigned.pin_title;
            input_title = this.options.assigned.input_title;
            if(input_title)
            {
              this.$inputPlace.attr('title',input_title);
            }
          }
          else
          {
            this.place_info  = undefined;
            this.coords('','');
            pin_img = this.options.unassigned.pin_img;
            pin_title = this.options.unassigned.pin_title;
            input_title = this.options.unassigned.input_title;
          }
          this.$pin.css('background','no-repeat url('+pin_img+')');
          this.$pin.attr('title',pin_title);
          this.$inputPlace.attr('title',input_title);
        }

        $inputs[i].assigned = function(){
          return this.place_info !== undefined && this.place_info.formatted_address !== undefined;
        }

        $inputs[i].coords = function(lat,lng){
          if (this.coords_appended) {
            this.$lat.val(lat);
            this.$lng.val(lng);
          };
        }

        $inputs[i].assign = function(place_info){
          this.place_info = place_info;
          var assigned = this.assigned();
          if(assigned){
            this.value = place_info.formatted_address;
          }
          this.toggle(assigned);
          try{
            var location = this.place_info.geometry.location;
            this.coords(location.lat(),location.lng());
          } catch(ex){
            throw ex;
          }
          return this.place_info;
        }

        $inputs[i].findAddress = function(formatted_address, try_assign){
          if (formatted_address !== "") {
            var inputPlace = this;
            this.geocoder.geocode({"address": formatted_address }, function(results) {
                if (results.length > 0) {
                  var place_info = results[0];
                  if (try_assign) {
                    inputPlace.assign(place_info);
                  };
                  return place_info;
                }
            });
          }
          return false;
        }

        $inputs[i].appendCoords = function(latName,lngName)
        {
          latName = latName ? latName : "latitude";
          lngName = lngName ? lngName : "longitude";
          var firstBracket = this.name.indexOf('[');
          if (firstBracket > 0) {
            var inputAttr = this.name.substr(firstBracket);
            latName = this.name.replace(inputAttr,"["+latName+"]");
            lngName = this.name.replace(inputAttr,"["+lngName+"]");
          }

          this.$lat = $('<input class="lat_geo-contrast" type="hidden" />').prop('name',latName);
          this.$lng = $('<input class="lng_geo-contrast" type="hidden" />').prop('name',lngName);

          this.$pin.after(this.$lng);
          this.$pin.after(this.$lat);
          this.coords_appended = true;
        }

        $inputs[i].getFirstHint = function(){
          //fail on multiples
          return $(".pac-container .pac-item:first").text();
        }
        //endmethods

        //init
        $inputs[i].$inputPlace.addClass('geo-contrast');
        $inputs[i].$inputPlace.css('padding-right','20px');
        $inputs[i].$inputPlace.after($inputs[i].$pin);
        $inputs[i].$pin.css({
          position:'relative',
          right:'20px',
          top:'1px',
          padding: '0 8px',
          cursor: 'pointer'
        });


        google.maps.event.addListener($inputs[i].autocomplete_gmap, 'place_changed', function(){
          var place_info = this.getPlace();
          this.inputPlace.assign(place_info);
        });

        $(document).on('input','.geo-contrast',function(){
          if(this.assigned()){
            this.toggle(false);
          }
        });

        $(document).on('blur','.geo-contrast',function(){
          var inputPlace = this;
          if (!inputPlace.assigned()) {
            this.findAddress(this.getFirstHint(), this.options.assignAfterBlur);
          }
        });

        $(document).on('click','.pin_geo-contrast',function(){
          var input = $(this).prev()[0];
          if (input.assigned() && input.options.gmaps)
            window.open('https://www.google.com.br/maps/place/'+input.place_info.formatted_address);
        });

        $inputs[i].findAddress($inputs[i].value, true);
        //endinit
      }
    }
});
