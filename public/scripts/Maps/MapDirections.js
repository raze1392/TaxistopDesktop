/*
 * @Author: Shivam Shah <dev.shivamshah@gmail.com>
 * API to get Directions between 2 places
 *
 * APIs available for interaction
 *   getDirections: fetches Directions between 2 places and renders it on the map,
 *   setTravelMode: sets the TravelMode to get the directions for,
 *   getTravelMode: gets the currently set TravelMode - default is DRIVING,
 *   setRouteAlternatives: sets the display of Route alternatives to true/false - default is FALSE,
 *   getRouteAlternatives: gets the currently set Route alternative,
 *   setUnitSystem: sets the UnitSystem to use,
 *   getUnitSystem: gets the currently selected UnitSystem
 */
(function(w, map) {
    map.Directions = (function() {
        var getDirections = function(source, destination) {
            var request = {
                origin: source,
                destination: destination,
                travelMode: map.Directions.getTravelMode(),
                provideRouteAlternatives: map.Directions.getRouteAlternatives(),
                unitSystem: map.Directions.getUnitSystem()
            };

            map._Details.directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    map.clearMarkers();
                    map._Details.directionsDisplay.setMap(map._Details.map);
                    map._Details.directionsDisplay.setDirections(response);
                    $('.centerMarker').hide();
                }
            });
        };

        var setTravelMode = function(travelMode) {
            travelMode = travelMode.toLowerCase();
            if (map._Details.Directions.TravelMode[travelMode]) {
                map._Details.Directions.travelModeSelected = map._Details.Directions.TravelMode[travelMode];
            } else {
                map._Details.Directions.travelModeSelected = map._Details.Directions.TravelMode.driving;
            }

            // If both Source and Destination is selected, then show the route
            if (map.existsSource() && map.existsDestination()) {
                map.getDirections(map.getSource().location, map.getDestination().location);
            }
        };

        var getTravelMode = function() {
            return map._Details.Directions.travelModeSelected;
        };

        var setRouteAlternatives = function(arg) {
            if (typeof arg === "boolean") map._Details.Directions.routeAlternatives = arg;
            else map._Details.Directions.routeAlternatives = false;
        };

        var getRouteAlternatives = function(arg) {
            return map._Details.Directions.routeAlternatives;
        };

        var setUnitSystem = function(unit) {
            unit = unit.toLowerCase();
            if (map._Details.Directions.UnitSystem[unit]) {
                map._Details.Directions.unitSystemSelected = map._Details.Directions.UnitSystem[unit];
            } else {
                map._Details.Directions.unitSystemSelected = map._Details.Directions.UnitSystem.metric;
            }

            // If both Source and Destination is selected, then show the route
            if (map.existsSource() && map.existsDestination()) {
                map.getDirections(map.getSource().location, map.getDestination().location);
            }
        };

        var getUnitSystem = function() {
            return map._Details.Directions.unitSystemSelected;
        };

        var clearDirections = function() {
            map._Details.directionsDisplay.setMap(null);
            map.clearDestination();
            if (map.existsSource()) {
                map._Details.map.setCenter(map.getSource().location);
            }
            $('.centerMarker').show();
        };

        return {
            getDirections: getDirections,
            clearDirections: clearDirections,
            setTravelMode: setTravelMode,
            getTravelMode: getTravelMode,
            setRouteAlternatives: setRouteAlternatives,
            getRouteAlternatives: getRouteAlternatives,
            setUnitSystem: setUnitSystem,
            getUnitSystem: getUnitSystem
        };

    }());
})(window, window.chanakya.Map);
