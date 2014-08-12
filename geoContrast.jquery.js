$(function(){
    window.geoContrast = {
      counter: 0,
      defaultOptions: {
        gmap_options: { componentRestrictions: { country: 'br'} },
        set:{
          input_title: 'Double-click to unset.',
          pin_title: 'gmaps',//'gmaps':'Double-click to gmaps; lat:"lat_number"; lng:"lng_number"';
          pin: 'location-on-16.png'
        },
        nset:{
          input_title: undefined,
          pin_title: 'Unset',
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
          this.input.gmapPlace = this.getPlace();
          var location = this.input.gmapPlace.geometry === undefined ? undefined :
                          this.input.gmapPlace.geometry.location;
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
              var lat = autocomplete.$lat.val();
              var lng = autocomplete.$lng.val();
              window.open('https://www.google.com/maps/@'+lat+','+lng+',12z');
            };
          });
        };
        //endinit
      };
    }
});