/*
 * @Author: Shivam Shah <dev.shivamshah@gmail.com>
 * API to search a location on GMaps using Autocomplete
 *
 * APIs available for interaction
 *   initializeAutocompleteSourceBox: initializes the Autocompletebox to set source,
 *   initializeAutocompleteDestinationBox: initializes the Autocompletebox to set destination
 */
(function(w, map) {
    map.Search = (function() {
        var initializeAutocompleteSourceBox = function(element) {
            map._Details.Autocomplete.source = new google.maps.places.Autocomplete(element, {});
            google.maps.event.addListener(map._Details.Autocomplete.source, 'place_changed', function() {
                onPlaceChanged(element, "source");
            });
        };

        var initializeAutocompleteDestinationBox = function(element) {
            map._Details.Autocomplete.destination = new google.maps.places.Autocomplete(element, {});
            google.maps.event.addListener(map._Details.Autocomplete.destination, 'place_changed', function() {
                onPlaceChanged(element, "destination");
            });
        };

        var search = function() {
            var search = {
                bounds: map._Details.map.getBounds()
            };
            map._Details.places.nearbySearch(search, function(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        map._Details.Autocomplete.results.push(results[i]);
                        //console.log(results[i]);
                    }
                }
            });
        };

        var onPlaceChanged = function(element, type) {
            type = type.toLowerCase();
            var placeDetails = {};

            if (type === "source") {
                placeDetails = {
                    title: "Source",
                    type: type
                };
            } else if (type === "destination") {
                placeDetails = {
                    title: "Destination",
                    type: type
                };
            }

            var place = map._Details.Autocomplete[placeDetails.type].getPlace();
            if (place.geometry) {
                map._Details.map.panTo(place.geometry.location);
                map["clear" + placeDetails.title]();
                map["set" + placeDetails.title](place.geometry.location);
            } else {
                element.placeholder = 'Enter a place';
            }

            // If both Source and Destination is selected, then show the route
            if (map.existsSource() && map.existsDestination()) {
                map.Directions.getDirections(map.getSource().location, map.getDestination().location);
            }
        };

        return {
            initializeAutocompleteSourceBox: initializeAutocompleteSourceBox,
            initializeAutocompleteDestinationBox: initializeAutocompleteDestinationBox
        };

    }());
})(window, window.chanakya.Map);
