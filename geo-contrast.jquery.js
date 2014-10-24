/*
geoContrast v0.9 author: https://github.com/lucasfogliarini
*/
$(function(){
    window.geoContrast = {
      options_default: {
        options_gmaps: {//api: http://goo.gl/x3h6o3
          types: ['geocode']//geocode, (regions), (cities), establishment
        },
        address_format: 'formatted',//formatted: formatted_address || friendly: 'long'
        gmaps_through_pin: true,
        assign_through_tab: true,
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
        //props
        $inputs[i].index = i;
        $inputs[i].options = $.extend(true,window.geoContrast.options_default,options);
        $inputs[i].autocomplete_gmaps = new google.maps.places.Autocomplete($inputs[i], $inputs[i].options.options_gmaps);
        $inputs[i].geocoder = new google.maps.Geocoder();
        $inputs[i].autocomplete_gmaps.inputPlace = $inputs[i];//accessibility
        $inputs[i].$pin = $('<span class="pin_geo-contrast"/>');
        $inputs[i].$bounds = $('<input class="bounds_geo-contrast" type="hidden" />');
        $inputs[i].$lat = $('<input class="lat_geo-contrast" type="hidden" />');
        $inputs[i].$lng = $('<input class="lng_geo-contrast" type="hidden" />');
        $inputs[i].$inputPlace = $($inputs[i]);
        //endprops

        //methods
        $inputs[i].toggle = function(assign){
          var input_title, pin, pin_title;

          if (assign){
            pin_img = this.options.assigned.pin_img;
            pin_title = this.options.assigned.pin_title;
            input_title = this.options.assigned.input_title;
            if(input_title){
              this.$inputPlace.attr('title',input_title);
            }
          }
          else{
            this.place_info = undefined;
            this.syncCoords();
            this.syncBounds();
            pin_img = this.options.unassigned.pin_img;
            pin_title = this.options.unassigned.pin_title;
            input_title = this.options.unassigned.input_title;
          }
          this.$pin.css('background','no-repeat url('+pin_img+')');
          this.$pin.attr('title',pin_title);
          this.$inputPlace.attr('title',input_title);
        }

        $inputs[i].placeInfoAssigned = function(){
          return this.place_info !== undefined && this.place_info.formatted_address !== undefined;
        }

        $inputs[i].boundsAssigned = function(){
          return this.placeInfoAssigned() && this.place_info.geometry.bounds !== undefined;
        }

        $inputs[i].syncCoords = function(){
          try{
            var lat;
            var lng;
            if(this.placeInfoAssigned()) {
              lat = this.place_info.geometry.location.lat();
              lng = this.place_info.geometry.location.lng();
            }
            this.$lat.val(lat);
            this.$lng.val(lng);
          } catch(ex){
            throw ex;
          }
        }

        $inputs[i].syncBounds = function(){
          try{
            if (this.$bounds !== undefined){
              var bounds;
              if (this.boundsAssigned()) {
                bounds = this.place_info.geometry.bounds.toUrlValue();
              }
              this.$bounds.val(bounds);
            }
          } catch(ex){
            throw ex;
          }
        }

        $inputs[i].tryAssign = function(place_info){
          if(place_info !== undefined)
            this.place_info = place_info;

          var place_info_assigned = this.placeInfoAssigned();
          if(place_info_assigned){
            this.value = this.options.address_format == 'formatted' ? this.place_info.formatted_address : this.place_info.address_components[0].long_name;
            this.syncCoords();
            this.syncBounds();
          }
          this.toggle(place_info_assigned);
        }

        $inputs[i].findPlaceInfo = function(address, call){
          if(address !== ""){
            var inputPlace = this;
            this.geocoder.geocode({"address": address }, function(results) {
              if (results.length > 0) {
                inputPlace.place_info = results[0];
                if (call !== undefined) {
                  call.call(inputPlace);
                };
              }
            });
          }
        }

        $inputs[i].appendBounds = function(boundsName){
          boundsName = boundsName ? boundsName : "bounds";
          this.$bounds.prop('name',boundsName);
          this.$pin.after(this.$bounds);
        }

        $inputs[i].appendCoords = function(latName,lngName){
          latName = latName ? latName : "latitude";
          lngName = lngName ? lngName : "longitude";
          var firstBracket = this.name.indexOf('[');
          if (firstBracket > 0){
            var inputAttr = this.name.substr(firstBracket);
            latName = this.name.replace(inputAttr,"["+latName+"]");
            lngName = this.name.replace(inputAttr,"["+lngName+"]");
          }

          this.$lat.prop('name',latName);
          this.$lng.prop('name',lngName);

          this.$pin.after(this.$lng);
          this.$pin.after(this.$lat);
        }

        $inputs[i].firstHint = function(){
          var eq = this.index;
          return $('.pac-container:eq('+eq+') > :first').text();
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

        google.maps.event.addListener($inputs[i].autocomplete_gmaps, 'place_changed', function(){
          var place_info = this.getPlace();
          place_info.geometry.bounds = place_info.geometry.viewport;//ble
          this.inputPlace.tryAssign(place_info);
        });

        $(document).on('input','.geo-contrast',function(){
          if(this.placeInfoAssigned()){
            this.toggle(false);
          }
        });

        $(document).on('keydown','.geo-contrast',function(e){
          switch(e.keyCode){
            case 9:
              if (this.options.assign_through_tab){
                this.findPlaceInfo(this.firstHint(), function(){
                  this.tryAssign();
                });
              }
            break;
            case 13:
              e.preventDefault();
            break;
          }
        });

        $(document).on('click','.pin_geo-contrast',function(){
          var input = $(this).prev()[0];
          if (input.placeInfoAssigned() && input.options.gmaps_through_pin)
            window.open('https://www.google.com.br/maps/place/'+input.place_info.formatted_address);
        });
        $inputs[i].toggle(false);
        $inputs[i].findPlaceInfo($inputs[i].value,function(){
          this.tryAssign();
        });
        //endinit
      }
      return $inputs;
    }
});
