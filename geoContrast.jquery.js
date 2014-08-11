$(function(){
    window.geoContrast = {
      counter: 0,
      defaultOptions: {
        gmap_options: { componentRestrictions: { country: 'br'} },
        set:{
          input_title: undefined,//'Wanna change? click on the pin!',
          pin_title: 'coords',//'coords':'lat:"lat_number"; lng:"lng_number"';
          pin: 'location-on-16.png'
        },
        nset:{
          input_title: undefined,
          pin_title: 'Not set',
          pin: 'location-off-16.png'
        }
      }
    }

    $.fn.geoContrast = function(options){
      var $autocompletes = this;

      for (var i = 0; i < $autocompletes.length; i++) {
        window.geoContrast.counter += 1;

        //props
        $autocompletes[i].options = $.extend(true,window.geoContrast.defaultOptions,options);
        $autocompletes[i].gmap_autocomplete = new google.maps.places.Autocomplete($autocompletes[i], $autocompletes[i].options.gmap_options);
        $autocompletes[i].gmap_autocomplete.input = $autocompletes[i];
        $autocompletes[i].$pin = $('<label class="pin_geoContrast"/>');
        $autocompletes[i].$autocomplete = $($autocompletes[i]);
        $autocompletes[i].$toggle = $('<input class="toggle_geoContrast" type="checkbox" />');
        $autocompletes[i].$lat = $('<input class="lat_geoContrast" type="hidden" />');
        $autocompletes[i].$lng = $('<input class="lng_geoContrast" type="hidden" />');
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

        $autocompletes[i].toggleInputs = function(valid){
          var input_title, input_cursor, pin, pin_title;

          this.disabled = valid;
          this.$toggle[0].checked = valid;
          if (valid) {
            pin = this.options.set.pin;
            pin_title = this.options.set.pin_title;
            pin_title = pin_title === 'coords' ? 'lat: '+this.$lat.val()+'; lng: '+this.$lng.val() : pin_title;
            input_title = this.options.set.input_title;
            input_cursor = 'not-allowed';
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

        $autocompletes[i].clearLocation = function(){
          this.toggleInputs(false);
        }
        $autocompletes[i].isValid = function(){
          return this.$lat.val() !== '';
        }
        //endmethods

        //init
        $autocompletes[i].$autocomplete.css('padding-right','20px');
        $autocompletes[i].$autocomplete.width($autocompletes[i].$autocomplete.width() - 20);
        $autocompletes[i].$autocomplete.after($autocompletes[i].$pin);
        $autocompletes[i].$autocomplete.after($autocompletes[i].$lng);
        $autocompletes[i].$autocomplete.after($autocompletes[i].$lat);
        $autocompletes[i].$autocomplete.after($autocompletes[i].$toggle);

        $autocompletes[i].$toggle.attr('id','geoContrast_toggle_'+window.geoContrast.counter);
        $autocompletes[i].$toggle.hide().change(function(){
          $(this).prev()[0].clearLocation();
        });

        $autocompletes[i].$pin.css({
          position:'relative',
          right:'20px',
          top:'1px',
          padding: '0 8px',
          cursor: 'pointer'
        });
        $autocompletes[i].$pin.attr('for','geoContrast_toggle_'+window.geoContrast.counter);

        google.maps.event.addListener($autocompletes[i].gmap_autocomplete, 'place_changed', function(){
          this.input.gmapPlace = this.getPlace();
          var location = this.input.gmapPlace.geometry === undefined ? undefined :
                          this.input.gmapPlace.geometry.location;
          if(location) this.input.setLocation(location);
          this.input.toggleInputs(location);
        });
        $autocompletes[i].clearLocation();
        //endinit
      };
    }
});