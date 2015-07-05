(function(w, a, crypto, utils, map, user, undefined) {
    var app = a.module('chanakyaApp', ['ngSanitize', 'ui.router', 'ui.bootstrap', 'firebase']);

    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/app/now");
        $urlRouterProvider.when("/app", "/app/now");

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "login.html"
            })
            .state('app', {
                url: "/app",
                templateUrl: "content.html",
                abstract: true
            })
            .state('app.profile', {
                url: "/profile",
                data: {
                    selectedTab: 'profile'
                }
            })
            .state('app.now', {
                url: "/now",
                data: {
                    selectedTab: 'now'
                }
            })
            .state('app.later', {
                url: "/later",
                data: {
                    selectedTab: 'later'
                }
            })
            .state('app.options', {
                url: "/options",
                data: {
                    selectedTab: 'options'
                }
            });
    }]);

    app.controller('ChanakyaMainCtrl', ['$scope', '$rootScope', '$http', '$interval', '$location', "$firebaseAuth",
        function($scope, $rootScope, $http, $interval, $location, $firebaseAuth) {
            var URL_HOST = "";

            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                if (toState.data && toState.data.selectedTab)
                    $scope.serviceRadio = toState.data.selectedTab;
            });

            $scope.serviceRadio = window.location.hash.split('/')[2];
            $scope.$watch('serviceRadio', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $location.path('/app/' + newValue);
                }
            });

            $scope.optionList = [{
                id: 'about',
                title: 'About',
                content: "<p>Check available taxis and cabs in your area and their prices for making better judgement about travel time and money.</p><p>Currently it checks for Ola, Uber, Taxi for sure and Meru cabs.</p> <p>Click on the cab detail from the list to go to vendor's app to book yourself a ride.</p>",
                open: false,
                smallText: true,
                action: null
            }, {
                id: 'coupons',
                title: 'Coupons',
                content: "here are the coupons",
                action: null,
                subAction: true
            }, {
                id: 'share',
                abstract: true,
                title: 'Share',
                action: function() {
                    $scope.promoteApp('share');
                }
            }, {
                id: 'like',
                abstract: true,
                title: 'Like',
                action: function() {
                    $scope.promoteApp('like');
                }
            }];

            $scope.dummyAction = function() {
                console.log("dummy");
            };

            $scope.options = {};
            $scope.options.opened = "";
            $scope.optionAction = function(option) {
                option.open = true;
                if (option.action)
                    option.action();
            };

            $scope.source = {
                lat: undefined,
                lng: undefined
            };
            $scope.cabs = {
                selected: 'all'
            };
            $scope.loading = true;
            $scope.loadingMsg = "loading...";

            var map_container = document.getElementById('map-canvas');
            var source_container = document.getElementById('searchSource');
            var destination_container = document.getElementById('searchDestination');

            $scope.services = [{
                name: "ola",
                icon: w.CDN_IMAGE_PREFIX + "/images/ola-icon-50x50.png"
            }, {
                name: "uber",
                icon: w.CDN_IMAGE_PREFIX + "/images/uber-icon-50x50.png"
            }, {
                name: "tfs",
                icon: w.CDN_IMAGE_PREFIX + "/images/tfs-icon-50x50.jpg"
            }, {
                name: "meru",
                icon: w.CDN_IMAGE_PREFIX + "/images/meru-icon-50x50.jpg"
            }];

            $scope.getCabImg = function(name) {
                name = _l(name);
                if (name == 'auto')
                    return w.CDN_IMAGE_PREFIX + '/images/auto.png';
                else if (name == 'mini' || name == 'hatchback' || name == 'genie' || name == 'nano' || name == 'kaali peeli' || name == 'uberx')
                    return w.CDN_IMAGE_PREFIX + '/images/mini.png';
                else if (name == 'sedan' || name == 'meru' || name == 'uberblack')
                    return w.CDN_IMAGE_PREFIX + '/images/sedan.png';
                else
                    return w.CDN_IMAGE_PREFIX + '/images/prime.png';
            };

            $scope.getCabTypeImg = function(type) {
                if (_l(type) == 'ola') return $scope.services[0].icon;
                if (_l(type) == 'uber') return $scope.services[1].icon;
                if (_l(type) == 'tfs') return $scope.services[2].icon;
                if (_l(type) == 'meru') return $scope.services[3].icon;
            };

            $scope.getTravelTime = function(cab) {
                if (!map.existsDestination() || !cab.available)
                    return "";
                if ($scope.travelInfoLoadFailed) return "failed";
                if ($scope.travelTime === 0) return "wait";
                var totalTravelTime = Math.floor(cab.duration) + $scope.travelTime;
                return Math.floor(totalTravelTime) + " mins";
            };

            $scope.getArrivalTime = function(cab) {
                if (cab.available)
                    return Math.floor(cab.duration) + " mins away";
                return "Not available";
            };

            $scope.uberCost = {
                uberGO: "",
                uberX: "",
                UberBLACK: "",
                multipliers: {
                    uberGO: 1,
                    uberX: 1,
                    UberBLACK: 1
                }
            };
            $scope.getTravelCost = function(cab) {
                if (!map.existsDestination() || !cab.available)
                    return "";
                if ($scope.travelDistance === 0) return "calculating";
                if (_l(cab.type) == "ola" || _l(cab.type) == "tfs" || _l(cab.type) == "meru") {
                    if ($scope.travelInfoLoadFailed) return "failed";
                    return "apx &#8377;" + Math.ceil(w.chanakya.cost.calculate(cab.type, cab.name, $scope.travelDistance));
                }
                if (_l(cab.type) == "uber") {
                    if ($scope.uberCost[cab.name] === "") {
                        return "calculating";
                    }
                    var multiplier = "";
                    if ($scope.uberCost.multipliers[cab.name] != 1) {
                        multiplier = "<span class='multiplier'>" + $scope.uberCost.multipliers[cab.name] + "x</span>";
                    }
                    return multiplier + " &#8377;" + $scope.uberCost[cab.name];
                }

            };

            $scope.showFilter = function(cab) {
                if (!cab.available)
                    return false;
                if ($scope.cabs.selected === "all")
                    return true;
                if (_l(cab.type) !== $scope.cabs.selected)
                    return false;
                return true;
            };

            $scope.sortNowList = function(cab) {
                return cab.cheapest ? 0 : (cab.closest ? 1 : (cab.recommended ? 2 : 3));
            };

            $scope.typingOn = false;
            $scope.isShownDetails = function() {
                if (!$scope.isMobile) return true;
                return $scope.serviceRadio != 'now' || !$scope.typingOn;
            };

            $scope.clearSource = function() {
                $scope.source = undefined;
                // $scope.destination = undefined;
                map.clearSource();
                map.Directions.clearDirections();
            };

            $scope.clearDestination = function() {
                $scope.destination = undefined;
                map.clearDestination();
                map.Directions.clearDirections();
            };

            $scope.openApp = function(type) {
                if ($scope.isAndroidApp) {
                    Android.openApp(_l(type));
                }
            };

            $scope.promoteApp = function(promotion) {
                if ($scope.isAndroidApp && promotion) {
                    Android.promoteTaxiStop(promotion);
                } else if (promotion === "like" || promotion === "share") {
                    window.open('//bit.ly/TaxiStop');
                }
            };

            $scope.logout = function() {
                user.logout($location);
            };

            $scope.mask = false;
            $scope.availableTypes = {
                ola: 0,
                uber: 0,
                tfs: 0,
                meru: 0,
                all: 0
            };

            function clearData() {
                $scope.cabs.selected = "";
                $scope.cabs.estimate = [];
                $scope.cabs.coordinates = {};
                $scope.availableTypes = {
                    ola: 0,
                    uber: 0,
                    tfs: 0,
                    meru: 0,
                    all: 0
                };
                mapNearByCabs();
            }

            $scope.refreshTrue = false;
            $scope.selectService = function(service, hard) {
                if ($scope.refreshTrue) {
                    console.log($scope.refreshTrue);
                    $scope.refreshTrue = false;
                    $scope.getService(service, true);
                }
                if ($scope.cabs.selected === service && !hard) return;
                if (!hard)
                    setMapHeight(($scope.availableTypes[service] > 5 ? 5 : $scope.availableTypes[service]) * 43 - 20);
                $scope.cabs.selected = service;
                mapNearByCabs();
            };

            function processData(service, data, silent) {
                $scope.mask = false;
                $scope.availableTypes = {
                    ola: 0,
                    uber: 0,
                    tfs: 0,
                    meru: 0,
                    all: 0
                };
                if (!data.cabsEstimate) {
                    $scope.mask = true;
                    return;
                }

                $scope.cabs.estimate = data.cabsEstimate;
                $scope.cabs.coordinates = data.cabs;

                for (var j = 0; j < $scope.cabs.estimate.length; j++) {
                    if ($scope.cabs.estimate[j].available) {
                        $scope.cabs.estimate[j].recommended = _l($scope.cabs.estimate[j].type) == "tfs" ? true : false;
                        $scope.availableTypes[_l(data.cabsEstimate[j].type)] ++;
                        $scope.availableTypes.all++;
                    }
                }

                $scope.loading = false;
                if (!silent) $scope.selectService(service, true);
                setMapHeight(($scope.availableTypes[$scope.cabs.selected] > 5 ? 5 : $scope.availableTypes[$scope.cabs.selected]) * 43 - 20);
                //setMapHeight(0);
                if (!$scope.isMobile) {
                    setResponseDivHeight();
                }
            }

            function setMapHeight(lessHeight) {
                if (!$scope.isMobile)
                    map.resize(document.body.clientHeight);
                else if ($scope.availableTypes[$scope.cabs.selected] === 0)
                    map.resize($scope.mapHeight - 20);
                else
                    map.resize($scope.mapHeight - lessHeight);

                if (map.existsSource() && map.existsDestination()) return;
                map.getMap().setCenter(map.getSource().location);
            }

            $scope.showMask = function() {
                return $scope.loading || $scope.availableTypes[$scope.cabs.selected] === 0;
            };

            $scope.getCabs = function(service, silent) {
                $http.get(URL_HOST + 'api/v1/cabs/now/all?lat=' + $scope.source.lat + '&lng=' + $scope.source.lng).success(function(data) {
                    processData(service, data, silent);
                });
            };

            $scope.getService = function(service, silent) {
                $scope.getCabs(service, silent);
            };

            $scope.init = function() {
                $scope.loaded = true;
                $scope.isMobile = utils.mobilecheck();
                $scope.isAndroidApp = utils.androidAppCheck();

                if ($scope.isMobile && !$scope.isAndroidApp) {
                    $scope.mapHeight = document.body.clientHeight - (78 + 70);
                    map_container.style.height = $scope.mapHeight + "px";
                } else if ($scope.isMobile && $scope.isAndroidApp) {
                    $scope.mapHeight = screen.height - (78 + 70);
                    map_container.style.height = $scope.mapHeight + "px";
                } else {
                    map_container.style.position = "absolute";
                    $scope.mapHeight = document.body.clientHeight;
                    map_container.style.height = $scope.mapHeight + "px";
                }

                $interval(function() {
                    $scope.refreshTrue = true;
                    $scope.selectService($scope.cabs.selected, true);
                }, 15000);

                if ($scope.isAndroidApp) {
                    var androidLoc = Android.getUserLocation();
                    var location = {
                        latitude: 21.0000,
                        longitude: 78.0000
                    };
                    if (androidLoc) {
                        androidLoc = androidLoc.split('|');
                        location = {
                            latitude: androidLoc[0],
                            longitude: androidLoc[1]
                        };
                    }
                    map.intializeGmaps(map_container, source_container, destination_container, location, function() {
                        map.Search.initializeAutocompleteSourceBox(source_container);
                        map.Search.initializeAutocompleteDestinationBox(destination_container);
                    });
                } else {
                    map.intializeGmapsUsingNavigator(map_container, source_container, destination_container, function() {
                        map.Search.initializeAutocompleteSourceBox(source_container);
                        map.Search.initializeAutocompleteDestinationBox(destination_container);
                    });
                }

                // TODO: sample login call for ola
                // $http.get('/login/service/ola?email=akush2007@gmail.com&password=It2InBNhr6bO865/hiTuvg==')
                //     .success(function(data) {
                //         console.log(data);
                //     });

            };

            $scope.setSourceUserLocation = function(hard) {
                $scope.newSource = {};
                if ($scope.isAndroidApp) {
                    var androidLoc = Android.getUserLocation();
                    var location = {
                        latitude: 21.0000,
                        longitude: 78.0000
                    };
                    if (androidLoc) {
                        androidLoc = androidLoc.split('|');
                        location = {
                            latitude: androidLoc[0],
                            longitude: androidLoc[1]
                        };
                    }
                    setSource(location);
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            setSource(position.coords);
                            return true;
                        });
                    }
                }
            };

            $scope.showBookingMessage = function() {
                
            };

            function setSource(location) {
                $scope.newSource = location;
                var origin = new google.maps.LatLng(location.latitude, location.longitude);
                var destination = new google.maps.LatLng($scope.source.lat, $scope.source.lng);

                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix({
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    durationInTraffic: false,
                    avoidHighways: false,
                    avoidTolls: false,
                }, setSourceCallback);
            }

            function setSourceCallback(response, status) {
                if (response.rows[0].elements[0].distance.value > 50 && $scope.newSource.latitude) {
                    map.setSource(map.convertLatLngToLocation($scope.newSource.latitude, $scope.newSource.longitude));
                }
            }

            w.addEventListener('userInfoChanged', function(info) {
                console.log('setting info');
                $scope.userInfo = utils.Storage.get('user.info');
            }, false);

            source_container.addEventListener('sourceLocationChanged', function(event) {
                $scope.typingOn = false;
                $scope.source = {
                    lat: event.detail.lat,
                    lng: event.detail.lng
                };
                $scope.getService($scope.cabs.selected);
                calculateDistance();
                getUberCost();
            }, false);

            destination_container.addEventListener('destinationLocationChanged', function(event) {
                $scope.typingOn = false;
                $scope.destination = {
                    lat: event.detail.lat,
                    lng: event.detail.lng
                };
                calculateDistance();
                getUberCost();
            }, false);

            function calculateDistance() {
                if (!$scope.destination || !$scope.destination.lat) return;
                var origin = new google.maps.LatLng($scope.source.lat, $scope.source.lng);
                var destination = new google.maps.LatLng($scope.destination.lat, $scope.destination.lng);

                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix({
                    origins: [origin],
                    destinations: [destination],
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.METRIC,
                    durationInTraffic: false,
                    avoidHighways: false,
                    avoidTolls: false,
                }, setDistanceCallback);
            }

            $scope.travelTime = 0;
            $scope.travelDistance = 0;
            $scope.travelInfoLoadFailed = false;

            function setDistanceCallback(response, status) {
                if (response.rows[0].elements[0].distance.value) {
                    $scope.travelInfoLoadFailed = false;
                    $scope.travelTime = Math.ceil(response.rows[0].elements[0].duration.value / 60);
                    $scope.travelDistance = response.rows[0].elements[0].distance.value / 1000;
                } else {
                    $scope.travelInfoLoadFailed = true;
                }
            }

            function getUberCost() {
                if (!$scope.destination || !$scope.destination.lat) return;
                $scope.uberCost = {
                    uberX: "",
                    UberBLACK: "",
                    multipliers: {
                        uberX: 1,
                        UberBLACK: 1
                    }
                };
                $http.get(URL_HOST + 'api/v1/cabs/uber/cost?srcLat=' + $scope.source.lat + '&srcLng=' + $scope.source.lng + '&destLat=' + $scope.destination.lat + '&destLng=' + $scope.destination.lng).success(function(data) {
                    for (var item in data.prices) {
                        if (data.prices[item].low_estimate == data.prices[item].high_estimate)
                            $scope.uberCost[data.prices[item].name] = data.prices[item].low_estimate;
                        else
                            $scope.uberCost[data.prices[item].name] = data.prices[item].low_estimate + "-" + data.prices[item].high_estimate;
                        $scope.uberCost.multipliers[data.prices[item].name] = data.prices[item].multiplier;
                    }
                });
            }

            function mapNearByCabs() {
                map.clearMarkers('cabs');
                if ($scope.cabs.selected !== 'all') {
                    showNearByCabs($scope.cabs.coordinates[_u($scope.cabs.selected)], $scope.cabs.selected);
                    return;
                }
                for (var i = 0; i < $scope.services.length; i++) {
                    showNearByCabs($scope.cabs.coordinates[_u($scope.services[i].name)], $scope.services[i].name, true);
                }

            }

            function showNearByCabs(cabs, service, persist) {
                if (!persist) map.clearMarkers('cabs');
                for (var cabType in cabs) {
                    var _cabs = cabs[cabType];
                    for (var i = 0; i < 2; i++) {
                        var _c = cabs[cabType][i];
                        if (_c) {
                            var location = map.convertLatLngToLocation(_c.lat, _c.lng);
                            map.setMarker(location, service.toUpperCase() + ' ' + cabType, $scope.getCabImg(cabType));
                        }
                    }
                }
            }

            function setResponseDivHeight() {
                var outer_container = document.getElementById('content-container').clientHeight;
                var profile_container = document.getElementById('profile').clientHeight;
                var logo_container = document.getElementById('logo').clientHeight;
                var content_container = document.getElementById('content').clientHeight;
                var services_container = document.getElementById('services').clientHeight;

                document.getElementById('details').style.height = (outer_container - (profile_container + logo_container + content_container + services_container)) + 'px';
            }

            $scope.init();
        }
    ]);
})(window, angular, CryptoJS, window.chanakya.utils, window.chanakya.Map, window.chanakya.user);
