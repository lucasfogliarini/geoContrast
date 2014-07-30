$(function(){
    $.fn.geoSelf = function(options){
      var _inputElem = this[0];
      $.fn.geoSelf.defaultOptions = {
        gmapOptions: { componentRestrictions: {country: 'br'} },
        validation: { code: 01010101010, valid: false, message: 'geometry fail'}
      }

      $.fn.geoSelf.options = $.extend($.fn.geoSelf.defaultOptions,options);
      //validation
      _inputElem.validation = Array.isArray(_inputElem.validation) ? _inputElem.validation : [];
      _inputElem.validation.push($.fn.geoSelf.options.validation);
      //endvalidation

      _inputElem.gmapAutocomplete = new google.maps.places.Autocomplete(_inputElem, $.fn.geoSelf.options);
      _inputElem.gmapPlace = {};

      function validate(valid){
         _inputElem.validation.filter(function(elem){
            if(elem.code == $.fn.geoSelf.options.validation.code) return elem;
          })[0].valid = valid;
      }

      var $toggle = $('<input id="geoSelf_toggle" type="checkbox" />');
      this.after($toggle);
      $toggle.change(function(){
        _inputElem.gmapPlace = {};
        _inputElem.disabled = false;
        validate(false);
      });

      google.maps.event.addListener(_inputElem.gmapAutocomplete, 'place_changed', function(){
        _inputElem.gmapPlace = _inputElem.gmapAutocomplete.getPlace();
        var invalid = _inputElem.gmapPlace.geometry === undefined;
        validate(!invalid);
        _inputElem.disabled = !invalid;
        $toggle[0].checked = !invalid;
      });
    }
});