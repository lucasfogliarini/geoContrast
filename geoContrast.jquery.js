$(function(){
    $.fn.geoContrast = function(options){
      var $autocompletes = this;
      for (var i = 0; i < $autocompletes.length; i++) {
        var $autocomplete = $($autocompletes[i]);

        //props
        $autocompletes[i].defaultOptions = {
          gmap_options: { componentRestrictions: {country: 'br'} },
          pin: {//16x16
            title_on: undefined,
            title_off: 'Not set',
            uri_on:'https://raw.githubusercontent.com/lucasfogliarini/geoContrast/master/location-on-16.png',
            uri_off:'https://raw.githubusercontent.com/lucasfogliarini/geoContrast/master/location-off-16.png'
          }
        }
        $autocompletes[i].options = $.extend(true,$autocompletes[i].defaultOptions,options);
        $autocompletes[i].gmap_autocomplete = new google.maps.places.Autocomplete($autocompletes[i], $autocompletes[i].options.gmap_options);
        $autocompletes[i].gmap_autocomplete.input = $autocompletes[i];
        $autocompletes[i].$pin = $('<label class="pin_geoContrast"/>');
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
          var bg_pin, title;
          this.disabled = valid;
          this.$toggle[0].checked = valid;
          if (valid) {
            bg_pin = this.options.pin.uri_on;
            title = this.options.pin.title_on;
            if(title === undefined){
              title = 'lat: '+this.$lat.val()+'; lng: '+this.$lng.val();
            }
          }else{
            this.$lat.val('');
            this.$lng.val('');
            bg_pin = this.options.pin.uri_off;
            title = this.options.pin.title_off;
          }
          this.$pin.css('background','no-repeat url('+bg_pin+')');
          this.$pin.attr('title',title);
        }

        $autocompletes[i].clearLocation = function(){
          this.toggleInputs(false);
        }
        $autocompletes[i].isValid = function(){
          return this.$lat.val() !== '';
        }
        //endmethods

        //init
        $autocomplete.css('padding-right','20px');
        $autocomplete.width($autocomplete.width() - 20);
        $autocomplete.after($autocompletes[i].$pin);
        $autocomplete.after($autocompletes[i].$lng);
        $autocomplete.after($autocompletes[i].$lat);
        $autocomplete.after($autocompletes[i].$toggle);

        $autocompletes[i].$toggle.attr('id','geoContrast_toggle_'+i);
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
        $autocompletes[i].$pin.attr('for','geoContrast_toggle_'+i);

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