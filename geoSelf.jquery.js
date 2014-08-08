$(function(){
    $.fn.geoSelf = function(options){
      var inputElement = this[0];
      //props
      inputElement.defaultOptions = {
        gmap_options: { componentRestrictions: {country: 'br'} },
        pin: {//16x16
          title_on: undefined,
          title_off: 'Not set',
          uri_on:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABGlBMVEUAAADUaj/dckbcckbdcUTdc0Tdc0bcckXlf0zfckbccUbdc0TdckPicUbdcUTbc0Tdd0REREDdc0bdckZEREBEREDbcka5XDa8ZD7TXjrIXzXbcEZEREBEREDUf1XEZDfOZzbLbERMQT2kcj/RbkTNaTzKa0RNQT3PbUXHYTbKYjTIXzTKbUXJbETZcUTJbT/bc0bbcUbheEvbckbdcUbdckXcc0W/fz/ZckbdcUb/VVVERECFWELJa0Pdc0TabUhEREC1ZUTcc0Tdc0jedEbdckTdc0bcc0bYcUbXcUbcc0bScEbRb0bbckbMbkS9Yju3WjPCXjLNZjrdckXNbkW9YjvOZjrLbUW3WzPEXjLBXTLEXTPNZjvNZzvDI0H4AAAARnRSTlMADHjP+fjOdgoo3tsmEuPfDwGJgwIJ4egoI+XaEgoGLSr9FQX9LvoT2Ocs6NOKfBbv7BFXU4+LBMG9AwMu5uIVFET4NWVk2KWgzgAAAAlwSFlzAAALEwAACxMBAJqcGAAAANJJREFUGNM1julWwlAMhKOCyqJY6UVU6gZVAcWVxX1BAxSiAqG1Cu//GuSWMr/mmzMnGQDRwuJSJLq8sgqhYnFstTvtViI547V1dLq9roOY2gBDgk2kr++f/mCImDaVBBni0VZ2e8dF3M1ZAHsOe7/7AAc+0uGRNPIFj/9sAPuf+PhEbqhTJrdol8pj9s5MOWGdEw5d35+wxxX9VV1cooiEr651YMBNyHQ7n1qdcW3OUG9ovrsP+loPj09Mzy/igqVg5l7f3qPNwFm6pSxlfHyGbgqvGia1ZLgLuwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNC0wNS0yMlQwNDo0MzowMy0wNTowMAD2X3QAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTQtMDUtMjJUMDQ6NDM6MDMtMDU6MDBxq+fIAAAAAElFTkSuQmCC',
          uri_off:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABbklEQVQ4T3WSPSiGURTHvZIoySKrMigmk1LESspnPidFIgazhbIpg2IwGORbhEkpgyibkkHKajEYSAYfv//Ted6u476nfp3nnnvP/55zz5PJi1sV4X6ose17/A48+eMZFyhgvQDlsAa3tl+HH4NnmIWvNC8U0PcqnMNBjspUVRNMxARaCeomVSBrgSHIhw24sPg8/grOtA4r2GU9Au+WWI/X4R+Yg2vYglJQe31eYJ9Ar91yjO+wZIVUxSm02f4RvtML6JXVo0zVJDcEdsh3l631Rj1eIEzSgXF4sYQK/Ap02zorFr7BHpsDoBFVwzKcgM60wyQ8QiFsp2KhwDTBB0heFyuCRtAjXsKnxSVWaRf8mUIZwXVQn0qKmS7UYw7Dqw74P3GK2JsJxQRGrTK1l5gX0Lg06yW4cQoNrNXmIHznElC8BDZhEdS7rBlmLFkVZs1XkG4U86Gx3YGqqgX9/x+uqn8teHGNVaaxRR/2F4ZRRRH92+TJAAAAAElFTkSuQmCC'
        }
      }
      inputElement.options = $.extend(inputElement.defaultOptions,options);
      inputElement.gmap_autocomplete = new google.maps.places.Autocomplete(inputElement, inputElement.options.gmap_options);
      inputElement.$pin = $('<label id="geoSelf_pin" for="geoSelf_toggle"/>');
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
        //init
        this.css('padding-right','20px');
        var new_width = this.width() - 20;
        this.width(new_width);
        
        this.after(inputElement.$pin);
        inputElement.$pin.css({
          position:'relative',
          right:'20px',
          top:'1px',
          padding: '0 8px',
          cursor: 'pointer'
        });
        this.after(inputElement.$toggle);
          inputElement.$toggle.hide().change(inputElement.clearLocation);
        this.after(inputElement.$lng);
        this.after(inputElement.$lat);

        inputElement.clearLocation();
        //endinit

        //methods
        function toggleInputs(valid){
          var bg_pin, title;
          inputElement.disabled = valid;
          inputElement.$toggle[0].checked = valid;
          if (valid) {
            bg_pin = inputElement.options.pin.uri_on;
            title = inputElement.options.pin.title_on;
            if(title === undefined){
              title = 'lat: '+inputElement.$lat.val()+'; lng: '+inputElement.$lng.val();
            }
          }else{
            inputElement.$lat.val('');
            inputElement.$lng.val('');
            bg_pin = inputElement.options.pin.uri_off;
            title = inputElement.options.pin.title_off;
          }
          inputElement.$pin.css('background','no-repeat url('+bg_pin+')');
          inputElement.$pin.attr('title',title);
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
        google.maps.event.addListener(inputElement.gmap_autocomplete, 'place_changed', function(){
          inputElement.gmapPlace = inputElement.gmap_autocomplete.getPlace();
          var location = inputElement.gmapPlace.geometry === undefined ? undefined :
                          inputElement.gmapPlace.geometry.location;
          if(location) setLocation(location);
          toggleInputs(location);
        });
        //endevents
      //endprivates
    }
});