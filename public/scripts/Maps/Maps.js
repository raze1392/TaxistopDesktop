/*
 * @Author: Shivam Shah <dev.shivamshah@gmail.com>
 * API to initialize Gmaps and services - Places, InfoWindow, Directions
 * Map._Details -> Object that holds all the Map details - referencs to services and locations
 *
 * Servies in use:
 *   map: stores the current google Map,
 *   places: stores the google map places service reference,
 *   infoWindow: stores the google map InfoWindow service,
 *   directionsService: stores the google map directions service reference,
 *   directionsDisplay: stores the google map directions display reference to draw on map,
 *
 * APIs available for interaction
 *   Details: get all the map details,
 *   intializeGmaps: initialize maps by giving a location,
 *   intializeGmapsUsingNavigator: initialize maps by using navigator,
 *   intializeInfoWindow: initialize the info window,
 *   setSource: ,
 *   clearSource: clears the source location,
 *   setDestination: ,
 *   clearDestination: clears the destination location,
 *   existsSource: checks if source location exists,
 *   existsDestination: checks if destination location exists,
 *   getSource: getSource,
 *   getDestination: getDestination,
 *   setMarker: sets a marker on the map for the location,
 *   clearMarkers: clears a marker on the map for the location,
 *   clearResults: clears the autocomplete results
 */

(function(w) {
    w.chanakya = w.chanakya || {};
    w.chanakya.Map = (function() {
        var Details = {
            map: null,
            map_container: null,
            places: null,
            infoWindow: null,
            directionsService: null,
            geoLocation: null,
            directionsDisplay: null,
            Source: {
                location: null,
                marker: null,
                container: null,
                city: null
            },
            Destination: {
                location: null,
                marker: null,
                container: null,
                city: null
            },
            Autocomplete: {
                source: null,
                destination: null,
                results: []
            },
            Directions: {
                TravelMode: {
                    transit: google.maps.TravelMode.TRANSIT,
                    walking: google.maps.TravelMode.WALKING,
                    driving: google.maps.TravelMode.DRIVING
                },
                UnitSystem: {
                    metric: google.maps.UnitSystem.METRIC,
                    imperial: google.maps.UnitSystem.IMPERIAL
                },
                waypoints: [],
                routeAlternatives: false,
                travelModeSelected: google.maps.TravelMode.DRIVING,
                unitSystemSelected: google.maps.UnitSystem.METRIC
            },
            Markers: [],
            Events: {
                sourceLocationChangedEvent: null,
            }
        };

        var initializeMaps = function(element, sourceElem, destinationElem, location) {
            chanakya.Map._Details.map_container = element;

            // Initializing Maps, Place and Direction Services
            var mapOptions = {
                center: location,
                zoom: 14,
                disableDefaultUI: true,
                mapTypeControl: false,
                zoomControl: false,
                scaleControl: false,
                streetViewControl: false
            };

            chanakya.Map._Details.map = new google.maps.Map(element, mapOptions);

            chanakya.Map.setContainer('source', sourceElem);
            chanakya.Map.setContainer('destination', destinationElem);

            // Adding a marker at the center;
            addVirtualSourceMarker();

            chanakya.Map._Details.places = new google.maps.places.PlacesService(chanakya.Map._Details.map);
            chanakya.Map._Details.directionsService = new google.maps.DirectionsService();
            chanakya.Map._Details.directionsDisplay = new google.maps.DirectionsRenderer();
            chanakya.Map._Details.geoLocation = new google.maps.Geocoder();
            chanakya.Map._Details.directionsDisplay.setMap(chanakya.Map._Details.map);
        };

        var addVirtualSourceMarker = function() {
            $('<div id="centerMark"/>').addClass('centerMarker').appendTo(chanakya.Map._Details.map.getDiv());

            // On dragging Map, source should be redrawn
            google.maps.event.addListener(chanakya.Map._Details.map, 'dragend', function() {
                if (chanakya.Map.existsSource() && chanakya.Map.existsDestination()) return;
                chanakya.Map.setSource(chanakya.Map._Details.map.getCenter());
            });
        };

        var setContainer = function(type, element) {
            if (type && element && type.toLowerCase() === 'source') {
                chanakya.Map._Details.Source.container = element;
                chanakya.Map._Details.Source.container.value = "";
            } else if (type && element && type.toLowerCase() === 'destination') {
                chanakya.Map._Details.Destination.container = element;
                chanakya.Map._Details.Destination.container.value = "";
            }
        };

        var setSource = function(location) {
            chanakya.Map._Details.Source.location = location;
            //chanakya.Map._Details.Source.marker = chanakya.Map.setMarker(location, "Source");
            chanakya.Map.getGeoLocation(location, function(city, address) {
                chanakya.Map.setSourceCity(city.toLowerCase());
                chanakya.Map._Details.Source.container.value = address;
            }, function() {
                chanakya.Map._Details.Source.container.value = "Dropped pin location";
            });
            chanakya.Map._Details.map.setCenter(location);

            //Creating SourceLocationChanged event
            chanakya.Map._Details.sourceLocationChangedEvent = new CustomEvent('sourceLocationChanged', {
                'detail': {
                    'lat': chanakya.Map.getSourceLatitude(),
                    'lng': chanakya.Map.getSourceLongitude()
                }
            });
            chanakya.Map._Details.Source.container.dispatchEvent(chanakya.Map._Details.sourceLocationChangedEvent);
        };

        var clearSource = function() {
            chanakya.Map._Details.Source.location = null;
            chanakya.Map._Details.Source.city = null;
            chanakya.Map._Details.Source.container.value = '';
            chanakya.Map.clearMarkers("source");
        };

        var setDestination = function(location) {
            chanakya.Map._Details.Destination.location = location;
            //chanakya.Map._Details.Destination.marker = chanakya.Map.setMarker(location, "Destination");
            chanakya.Map.getGeoLocation(location, function(city, address) {
                chanakya.Map.setDestinationCity(city.toLowerCase());
                chanakya.Map._Details.Destination.container.value = address;
            }, function() {
                //chanakya.Map._Details.Destination.container.value = "Dropped pin location";
            });

            //Creating DestinationLocationChanged event
            // #### Check google latitude|longitude key - A|F
            chanakya.Map._Details.destinationLocationChangedEvent = new CustomEvent('destinationLocationChanged', {
                'detail': {
                    'lat': chanakya.Map.getDestination().location.A,
                    'lng': chanakya.Map.getDestination().location.F
                }
            });
            chanakya.Map._Details.Destination.container.dispatchEvent(chanakya.Map._Details.destinationLocationChangedEvent);
        };

        var clearDestination = function() {
            chanakya.Map._Details.Destination.location = null;
            chanakya.Map._Details.Destination.city = null;
            chanakya.Map._Details.Destination.container.value = '';
            chanakya.Map.clearMarkers("destination");
        };

        var intializeGmaps = function(element, sourceElem, destinationElem, loc, callback) {
            var location = new google.maps.LatLng(loc.latitude, loc.longitude);
            initializeMaps(element, sourceElem, destinationElem, location);
            // Setting Source
            chanakya.Map.setSource(location);
            callback();
            return true;
        };

        var intializeGmapsUsingNavigator = function(element, sourceElem, destinationElem, callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    // Initializing Maps, Place and Direction Services
                    var location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    initializeMaps(element, sourceElem, destinationElem, location);
                    // Setting Source
                    chanakya.Map.setSource(location, sourceElem);
                    callback();
                    return true;
                });
            }
            return false;
        };

        var intializeInfoWindow = function(element) {
            chanakya.Map._Details.infoWindow = new google.maps.InfoWindow({
                content: element
            });
        };

        var setMarker = function(location, title, icon) {
            var marker = new google.maps.Marker({
                position: location,
                title: title,
                icon: (icon) ? icon : '',
            });
            marker.setMap(chanakya.Map._Details.map);
            chanakya.Map._Details.Markers.push(marker);
            return marker;
        };

        var clearMarkers = function(type) {
            type = (type) ? type.toLowerCase() : undefined;
            // Remove the source marker
            if ((!type || type === 'source') && (chanakya.Map.existsSource() && chanakya.Map.getSource().marker)) {
                chanakya.Map._Details.Source.marker.setMap(null);
                chanakya.Map._Details.Source.marker = null;
            }
            // Remove the destination marker
            if ((!type || type === 'destination') && (chanakya.Map.existsDestination() && chanakya.Map.getDestination().marker)) {
                chanakya.Map._Details.Destination.marker.setMap(null);
                chanakya.Map._Details.Destination.marker = null;
            }

            // Remove the cab markers
            if ((!type || type === 'cabs')) {
                for (var i = chanakya.Map._Details.Markers.length - 1; i >= 0; i--) {
                    chanakya.Map._Details.Markers[i].setMap(null);
                    chanakya.Map._Details.Markers[i] = null;
                }
                chanakya.Map._Details.Markers = [];
            }
        };

        var clearResults = function() {
            for (var i = 0; i < chanakya.Map._Details.Autocomplete.results.length; i++) {
                if (chanakya.Map._Details.Autocomplete.results[i]) {
                    chanakya.Map._Details.Autocomplete.results[i] = null;
                }
            }
            chanakya.Map._Details.Autocomplete.results = [];
        };

        var existsSource = function() {
            if (!chanakya.Map._Details.Source) return false;
            if (chanakya.Map._Details.Source.location) return true;
            return false;
        };

        var existsDestination = function() {
            if (!chanakya.Map._Details.Destination) return false;
            if (chanakya.Map._Details.Destination.location) return true;
            return false;
        };

        var getGeoLocation = function(location, onSuccess, onError) {
            chanakya.Map._Details.geoLocation.geocode({
                'latLng': location
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
                        var city = null;
                        for (var i = results[0].address_components.length - 1; i > 0; i--) {
                            if (results[0].address_components[i].types[0] == 'locality') {
                                city = results[0].address_components[i].long_name;
                            }
                        }
                        onSuccess(city, results[0].formatted_address);
                    } else {
                        onError();
                    }
                } else {
                    onError();
                }
            });
        };

        var getSource = function() {
            return chanakya.Map._Details.Source;
        };

        var getDestination = function() {
            return chanakya.Map._Details.Destination;
        };

        var getSourceCity = function() {
            return chanakya.Map._Details.Source.city;
        };

        var getDestinationCity = function() {
            return chanakya.Map._Details.Destination.city;
        };

        var setSourceCity = function(city) {
            chanakya.Map._Details.Source.city = city;
        };

        var setDestinationCity = function(city) {
            chanakya.Map._Details.Destination.city = city;
        };

        // #### Check google latitude key - A
        var getSourceLatitude = function() {
            if (chanakya.Map.existsSource()) {
                return chanakya.Map.getSource().location.A;
            }
            return null;
        };

        // #### Check google longitude key - F
        var getSourceLongitude = function() {
            if (chanakya.Map.existsSource()) {
                return chanakya.Map.getSource().location.F;
            }
            return null;
        };

        var convertLatLngToLocation = function(latitude, longitude) {
            return new google.maps.LatLng(latitude, longitude);
        };

        var getMap = function(latitude, longitude) {
            return chanakya.Map._Details.map;
        };

        var resizeMap = function(height) {
            height = (parseInt(height) ? height : (height.split('px')[0] ? height.split('px')[0] : -1));
            chanakya.Map._Details.map_container.style.height = ((height == -1) ? "100%" : height + "px");
            // map canvas hick since it was getting a position of relative which was causing the div to collapse;
            chanakya.Map._Details.map_container.style.position = "fixed";
            google.maps.event.trigger(chanakya.Map.getMap(), "resize");
        };

        return {
            _Details: Details,
            getMap: getMap,
            intializeGmaps: intializeGmaps,
            intializeGmapsUsingNavigator: intializeGmapsUsingNavigator,
            intializeInfoWindow: intializeInfoWindow,
            setContainer: setContainer,
            setSource: setSource,
            clearSource: clearSource,
            setDestination: setDestination,
            clearDestination: clearDestination,
            existsSource: existsSource,
            existsDestination: existsDestination,
            getGeoLocation: getGeoLocation,
            getSource: getSource,
            getDestination: getDestination,
            getSourceCity: getSourceCity,
            getDestinationCity: getDestinationCity,
            setSourceCity: setSourceCity,
            setDestinationCity: setDestinationCity,
            setMarker: setMarker,
            clearMarkers: clearMarkers,
            clearResults: clearResults,
            getSourceLatitude: getSourceLatitude,
            getSourceLongitude: getSourceLongitude,
            convertLatLngToLocation: convertLatLngToLocation,
            resize: resizeMap
        };

    }());
})(window);
