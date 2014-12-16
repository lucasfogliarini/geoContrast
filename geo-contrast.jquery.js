/*
geoContrast v1.0

https://github.com/lucasfogliarini/geoContrast
*/
$(function(){
    window.geoContrast = {
      options_default: {
        options_gmaps: {//api: http://goo.gl/x3h6o3
          //types: ['geocode','(regions)','(cities)', 'establishment']
        },
        format: 'short',//formatted
        gmaps_through_pin: true,
        assign_through_tab: true,
        assigned:{
          input_title: '',
          pin_title: 'Click to open on Google Maps.',
          pin_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAABBUlEQVQ4jZXTTyuEURQG8F9T/mzGNCjh4yghG8N3MDtZKd+ApfJ12GomZIVEKDakZMHGvBZz3rwz7jt46nTuuc95ntu573v5iWE00cZLRAvrGEr092AWJ8hK4hgzZeJRnEXjHRqYjFjBVXCnGEkZbBbE9QRfx330bKQM2kE2ol7GDa6xFHtr0XOUMngLshp1flqG29irRf2aiyoFg07kLMFV+rhOPwGXkeciN/GIh1jDfOSL1AjbccK59CWO+x5rK2UwjQ+9n7GKMawWxO+YShnAvvKfKI+9MjFM4HmA+ClGGYhF3VvuF39i4Tdxjt2Ewc5fxXRf5GFBfBB7/0JN9xm3Yp3EF8CeW3oneDAyAAAAAElFTkSuQmCC'
        },
        unassigned:{
          input_title: '',
          pin_title: 'Location not assigned.',
          pin_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAACE0lEQVQ4jY2QQWsTURSFv5dMm2xCQFwILoqhIIolJDMpxKAU3WqxQqDoyh8gIhUXVsSNUKobK/QP1J2ICxXqwpWU0sKbgWI2GhzqQqgUoUToi9N5181MmaZFvKv7zj3nvHuuYqBGR0cL5XL5NnATGEngTeClMeZFp9P5k+Wr7KNarZ50HOetiHwDnkdR9BnAcZyxfD5/R0RGrLWTQRD8OGQwMTFR7PV6a8CS1vpZug1At9vtA3ied19Epnd2dpoptm/ged5dEbmktb7aarVKxphZYDsZHy8Wi09WVlZ6ruu+Bz5orRcAnEyCG9baGQBjzL3h4eH51dXVXwDNZvNYv9+fAR4rpZ6KyBywAJBL1SJyJo5jnfQ2FQNk+0KhoIGz6XvfAJBSqZQDUEpl8fQDBbC3t3fg8FniV2NM6rxVq9Wa6aDRaJwHtgCsteeAL+kse4NlYApY01ov1uv1W57nXQGI47jr+/5issk1EVlORfvrjI+Pn4rj2I+i6PTGxsbPwQgAruuWga611guCYPNAhPX19RB4NTQ09OAocVKPROR1Kh68AdbaWeB6kvlA1ev1C0BbKfUwi6tBYq1Wu5jL5ZYAV2u9DdBoNE5Ya7WITPu+/+mfBknWOWCsUqlMAoRh+E5EAq31oXhHGrTb7XwYhm+A70Bkra34vj8F2P8yAGi1WqXd3d2PSikxxlzudDq/j+L9BaBN8gpKSjbcAAAAAElFTkSuQmCC'
        }
      }
    }
    $.fn.geoContrast = function(options){
      var $inputs = this;
      for (var i = 0; i < $inputs.length; i++){
        var current = $inputs[i];
        var $current = $(current);
        //props
        current.index = i;
        current.options = $.extend(true,'¬¬',window.geoContrast.options_default,options);
        current.autocomplete_gmaps = new google.maps.places.Autocomplete(current, current.options.options_gmaps);
        current.geocoder = new google.maps.Geocoder();
        current.autocomplete_gmaps.geocontrast = current;//accessibility
        current.$pin = $('<span class="pin_geocontrast"/>');
        current.$bounds = $('<input class="bounds_geocontrast" type="hidden" />');
        current.$lat = $('<input class="lat_geocontrast" type="hidden" />');
        current.$lng = $('<input class="lng_geocontrast" type="hidden" />');
        current.$formatted = $('<input class="formatted_geocontrast" type="hidden" />');
        //endprops

        //methods
        current.toggle = function(state){
          var input_title, pin, pin_title;

          if (state){
            pin_img = this.options.assigned.pin_img;
            pin_title = this.options.assigned.pin_title;
            input_title = this.options.assigned.input_title;
            if(input_title){
              this.title = input_title;
            }
          }
          else{
            this.place_info = undefined;
            this.sync_coords();
            this.sync_bounds();
            this.$formatted.val("");
            pin_img = this.options.unassigned.pin_img;
            pin_title = this.options.unassigned.pin_title;
            input_title = this.options.unassigned.input_title;
          }
          this.$pin.css('background','no-repeat url('+pin_img+')');
          this.$pin.attr('title',pin_title);
          this.title = input_title;
        }

        current.assigned = function(){
          return this.place_info !== undefined && this.place_info.formatted_address !== undefined;
        }

        current.bounds_assigned = function(){
          return this.assigned() && this.place_info.geometry.bounds !== undefined;
        }

        current.sync_coords = function(){
          try{
            var lat;
            var lng;
            if(this.assigned()) {
              lat = this.place_info.geometry.location.lat();
              lng = this.place_info.geometry.location.lng();
            }
            this.$lat.val(lat);
            this.$lng.val(lng);
          } catch(ex){
            throw ex;
          }
        }

        current.sync_bounds = function(){
          try{
            if (this.$bounds !== undefined){
              var bounds;
              if (this.bounds_assigned()){
                bounds = this.place_info.geometry.bounds.toUrlValue();
              }else if(this.assigned()){
                bounds = "0,0,0,0";
              }
              this.$bounds.val(bounds);
            }
          } catch(ex){
            throw ex;
          }
        }

        current.sync = function(){
          var assigned = this.assigned();
          if(assigned){
            this.place_info.formatted_address = geoContrast.format_address(this.place_info.address_components);
            switch(this.options.format){
              case 'short':
                this.value = this.place_info.name;
                this.$formatted[0].value = this.place_info.formatted_address;
              break;
              case 'formatted':
                this.value = this.place_info.formatted_address;
              break;
            }
            this.sync_coords();
            this.sync_bounds();
          }
          this.toggle(assigned);
        }

        current.find_address = function(address, call){
          if(address !== ""){
            var geocontrast = this;
            this.geocoder.geocode({"address": address }, function(results) {
              if (results.length > 0) {
                geocontrast.place_info = results[0];
                var addresses = geocontrast.place_info.address_components.filter(function(each){
                  return each.types[0] != "street_number";
                });
                geocontrast.place_info.name = addresses[0].long_name;
                if (call !== undefined) {
                  call.call(geocontrast);
                };
              }
            });
          }
        }

        current.append_bounds = function(bounds_name){
          bounds_name = bounds_name ? bounds_name : "bounds";
          this.$bounds.prop('name',bounds_name);
          $(this).before(this.$bounds);
        }

        current.append_coords = function(lat_name,lng_name){
          lat_name = lat_name ? lat_name : "latitude";
          lng_name = lng_name ? lng_name : "longitude";
          lat_name = geoContrast.remake_name(this,function(args){
            args.attribute = lat_name;
          });

          lng_name = geoContrast.remake_name(this,function(args){
            args.attribute = lng_name;
          });

          this.$lat.prop('name',lat_name);
          this.$lng.prop('name',lng_name);

          $(this).before(this.$lng);
          $(this).before(this.$lat);
        }

        current.first_hint = function(){
          var eq = this.index;
          return $('.pac-container:eq('+eq+') > :first').text();
        }
        //endmethods

        //init
        $current = $(current);
        $current.addClass('geocontrast');
        $current.css('padding-right','20px');
        $current.after(current.$pin);

        current.$pin.css({
          position:'absolute',
          left: current.offsetLeft + current.offsetWidth - 18,
          top: current.offsetTop + ((current.offsetHeight - 16) / 2),
          height: '16px',
          width: '16px',
          cursor: 'pointer'
        });

        if (current.options.format == "short") {
          $current.before(current.$formatted);
          var name = geoContrast.remake_name(current,function(args){
            args.attribute += "_formatted";
          });
          current.$formatted.attr("name", name);
        };

        google.maps.event.addListener(current.autocomplete_gmaps, 'place_changed', function(){
          this.geocontrast.place_info = this.getPlace();
          this.geocontrast.place_info.geometry.bounds = this.geocontrast.place_info.geometry.viewport;//:/
          this.geocontrast.sync();
        });

        $(document).on('input','.geocontrast',function(){
          if(this.assigned()){
            this.toggle(false);
          }
        });

        $(document).on('keydown','.geocontrast',function(e){
          switch(e.keyCode){
            case 9:
              if (this.options.assign_through_tab){
                this.find_address(this.first_hint(), function(){
                  this.sync();
                });
              }
            break;
            case 13:
              e.preventDefault();
            break;
          }
        });

        $(document).on('click','.pin_geocontrast',function(){
          var input = $(this).prev()[0];
          if (input.assigned() && input.options.gmaps_through_pin){
            window.open('https://www.google.com.br/maps/place/'+input.place_info.formatted_address);
          }
        });
        current.toggle(false);
        current.find_address($current.data('find-address'),function(){
          this.sync();
        });
        //endinit
      }
      return $inputs;
    }

    window.geoContrast.remake_name = function(input, delegate){
      var args = {
        attribute: input.name
      }, attr_bracket
      var first_bracket = input.name.indexOf('[');
      if (first_bracket > 0){
        attr_bracket = input.name.slice(first_bracket);
        args.attribute = input.name.slice(first_bracket+1,-1);
      }
      delegate(args);
      return first_bracket > 0 ? input.name.replace(attr_bracket,"["+args.attribute+"]") : args.attribute;
    }

    window.geoContrast.format_address = function(address_components){
      var route, street_number, neighborhood, locality, area_lvl_1, country;
      for (var i = 0; i < address_components.length; i++) {
         route = address_components[i].types[0] == "route" ? address_components[i] : route;
         street_number = address_components[i].types[0] == "street_number" ? address_components[i] : street_number;
         neighborhood = address_components[i].types[0] == "neighborhood" ? address_components[i] : neighborhood;
         locality = address_components[i].types[0] == "locality" ? address_components[i] : locality;
         area_lvl_1 = address_components[i].types[0] == "administrative_area_level_1" ? address_components[i] : area_lvl_1;
         country = address_components[i].types[0] == "country" ? address_components[i] : country;
      };
      var route_street_number, neighborhood_locality, area_lvl_1_country, format;

      route_street_number = route ? route.long_name : "";
      route_street_number += street_number ? ", " + street_number.long_name : "";

      neighborhood_locality = neighborhood ? neighborhood.long_name + ', ' : "";
      neighborhood_locality += locality ? locality.long_name : "";

      area_lvl_1_country = neighborhood_locality ? area_lvl_1.short_name + ", " : area_lvl_1 ? area_lvl_1.long_name + ", " : "";
      area_lvl_1_country += country ? country.long_name : "";
      format = route_street_number ? route_street_number + ' - ' : '';
      format += neighborhood_locality ? neighborhood_locality + ' - ' : '';
      format += area_lvl_1_country ? area_lvl_1_country : '';
      return format;
    }
});
