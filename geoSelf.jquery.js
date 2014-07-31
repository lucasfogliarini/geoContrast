$(function(){
    $.fn.geoSelf = function(options){
      var inputElement = this[0];
      //props
      inputElement.defaultOptions = {
        gmapOptions: { componentRestrictions: {country: 'br'} }
      }
      inputElement.options = $.extend(inputElement.defaultOptions,options);
      inputElement.gmapAutocomplete = new google.maps.places.Autocomplete(inputElement, inputElement.options);
      inputElement.$toggle = $('<input id="geoSelf_toggle" type="checkbox" />');
      inputElement.$lat = $('<input id="geoSelf_lat" type="hidden" />');
      inputElement.$lng = $('<input id="geoSelf_lng" type="hidden" />');
      //endprops

      //methods
      inputElement.clearLocation = function(){
        toggleInputs(false);
      }
      inputElement.isValid = function(){
        return inputElement.$lat.val() !== '';
      }
      //endmethods

      //privates
        //mounter
        this.after(inputElement.$toggle);
          inputElement.$toggle.change(inputElement.clearLocation);
        this.after(inputElement.$lat);
        this.after(inputElement.$lng);
        //endmounter
        //methods
        function toggleInputs(valid){
          inputElement.disabled = valid;
          inputElement.$toggle[0].checked = valid;
          if(!valid){
            inputElement.$lat.val('');
            inputElement.$lng.val('');
          }
        }

        function setLocation(location){
          try{
            inputElement.$lat.val(location.lat());
            inputElement.$lng.val(location.lng());
          } catch(ex){
            throw ex;
          }
        }
        //endmethods
        //events
        google.maps.event.addListener(inputElement.gmapAutocomplete, 'place_changed', function(){
          inputElement.gmapPlace = inputElement.gmapAutocomplete.getPlace();
          var location = inputElement.gmapPlace.geometry === undefined ? undefined :
                          inputElement.gmapPlace.geometry.location;
          toggleInputs(location);
          if(location) setLocation(location);
        });
        //endevents
      //endprivates
    }
});