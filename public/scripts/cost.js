/*
 * @Author: Abhinav Kushwaha <akush2007@gmail.com>
 *
 */
(function(w, $, crypto, undefined) {

    // http://map.what3words.com/calls/position/25.317645,82.973914?lang=en&debug=1
    // $.ajax({
    //     url: "http://map.what3words.com/calls/position/25.317645,82.973914?lang=en&debug=1",
    //     jsonp: "getW3W",
    //     success: function(resp) {
    //         console.log(resp);
    //     }
    // });

    w.chanakya = w.chanakya || {};
    w.chanakya.cost = (function() {
        var rates = {
            "ZRn8FQHbKo": {
                "meru": {
                    "cabstype": {
                        "genie": {
                            "cabname": "Genie",
                            "day": {
                                "km": "6",
                                "min": "90",
                                "rate": "10",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "wait": "1.50",
                                "waitpost": "0",
                                "waitpulse": "1"
                            },
                            "dayTime": "00.05-23.00",
                            "night": {
                                "km": "6",
                                "min": "112.50",
                                "rate": "12.5",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "wait": "1.88",
                                "waitpost": "0",
                                "waitpulse": "1"
                            }
                        },
                        "meru": {
                            "cabname": "Meru",
                            "day": {
                                "km": "4",
                                "min": "80",
                                "rate": "19.5",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "wait": "10",
                                "waitpost": "20",
                                "waitpulse": "15"
                            },
                            "dayTime": "00.05-23.00",
                            "night": {
                                "km": "4",
                                "min": "88",
                                "rate": "21.45",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "wait": "11",
                                "waitpost": "20",
                                "waitpulse": "15"
                            }
                        }
                    },
                    "contactNumbers": "080-44224422",
                    "providerId": "meru",
                    "providerName": "Meru",
                    "status": "true"
                },
                "ola": {
                    "cabstype": {
                        "auto": {
                            "cabname": "Auto",
                            "day": {
                                "km": "1.8",
                                "min": "25",
                                "rate": "13",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "dayTime": "00.00-24.00",
                            "night": {
                                "km": "1.8",
                                "min": "37",
                                "rate": "20",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            }
                        },
                        "mini": {
                            "airportday": {
                                "frommin": "540",
                                "km": "30",
                                "rate": "13",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "tomin": "540",
                                "wait": "2",
                                "waitpost": "10",
                                "waitpulse": "1"
                            },
                            "airportnight": {
                                "frommin": "540",
                                "km": "30",
                                "rate": "13",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "tomin": "540",
                                "wait": "2",
                                "waitpost": "10",
                                "waitpulse": "1"
                            },
                            "cabname": "Mini",
                            "day": {
                                "km": "4",
                                "min": "80",
                                "rate": "10",
                                "ridecharge": "1",
                                "ridechargepost": "5",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "dayTime": "00.00-24.00",
                            "night": {
                                "km": "4",
                                "min": "80",
                                "rate": "10",
                                "ridecharge": "1",
                                "ridechargepost": "5",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            }
                        },
                        "prime": {
                            "airportday": {
                                "frommin": "800",
                                "km": "30",
                                "rate": "18",
                                "ridecharge": "2",
                                "ridechargepost": "10",
                                "tomin": "800",
                                "wait": "2",
                                "waitpost": "0",
                                "waitpulse": "1"
                            },
                            "airportnight": {
                                "frommin": "800",
                                "km": "30",
                                "rate": "18",
                                "ridecharge": "2",
                                "ridechargepost": "10",
                                "tomin": "800",
                                "wait": "2",
                                "waitpost": "0",
                                "waitpulse": "1"
                            },
                            "cabname": "Prime",
                            "day": {
                                "km": "5",
                                "min": "200",
                                "rate": "18",
                                "ridecharge": "2",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "dayTime": "00.00-24.00",
                            "night": {
                                "km": "5",
                                "min": "200",
                                "rate": "18",
                                "ridecharge": "2",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            }
                        },
                        "sedan": {
                            "airportday": {
                                "frommin": "600",
                                "km": "30",
                                "rate": "16",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "tomin": "600",
                                "wait": "2",
                                "waitpost": "10",
                                "waitpulse": "1"
                            },
                            "airportnight": {
                                "frommin": "600",
                                "km": "30",
                                "rate": "16",
                                "ridecharge": "0",
                                "ridechargepost": "0",
                                "tomin": "600",
                                "wait": "2",
                                "waitpost": "10",
                                "waitpulse": "1"
                            },
                            "cabname": "Seden",
                            "day": {
                                "km": "4",
                                "min": "100",
                                "rate": "13",
                                "ridecharge": "1",
                                "ridechargepost": "5",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "dayTime": "00.00-24.00",
                            "night": {
                                "km": "4",
                                "min": "100",
                                "rate": "13",
                                "ridecharge": "1",
                                "ridechargepost": "5",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            }
                        }
                    },
                    "contactNumbers": "",
                    "providerId": "ola",
                    "providerName": "Ola",
                    "status": "true"
                },
                "tfs": {
                    "cabstype": {
                        "hatchback": {
                            "airportday": {
                                "frommin": "700",
                                "km": "30",
                                "rate": "14",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "tomin": "700",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "airportnight": {
                                "frommin": "700",
                                "km": "30",
                                "rate": "14",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "tomin": "700",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "cabname": "Tata Indica AC",
                            "day": {
                                "km": "4",
                                "min": "49",
                                "rate": "14",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "dayTime": "00.06-24.00",
                            "night": {
                                "km": "4",
                                "min": "99",
                                "rate": "15",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            }
                        },
                        "nano": {
                            "cabname": "Nano",
                            "day": {
                                "km": "0",
                                "min": "25",
                                "rate": "10",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "dayTime": "00.05-24.00",
                            "night": {
                                "km": "0",
                                "min": "25",
                                "rate": "10",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            }
                        },
                        "sedan": {
                            "airportday": {
                                "frommin": "700",
                                "km": "30",
                                "rate": "16",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "tomin": "700",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "airportnight": {
                                "frommin": "700",
                                "km": "30",
                                "rate": "16",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "tomin": "700",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "cabname": "Sedan",
                            "day": {
                                "km": "2",
                                "min": "49",
                                "rate": "16",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            },
                            "dayTime": "00.06-24.00",
                            "night": {
                                "km": "2",
                                "min": "99",
                                "rate": "17",
                                "ridecharge": "1.25",
                                "ridechargepost": "0",
                                "wait": "0",
                                "waitpost": "0",
                                "waitpulse": "0"
                            }
                        }
                    },
                    "contactNumbers": "080 60601010",
                    "providerId": "tfs",
                    "providerName": "TaxiForSure",
                    "status": "true"
                }
            }
        };
        var cityCodes = {"bengaluru": "ZRn8FQHbKo"};
        var currentCity = "bengaluru";

        var update = function() {
            var token = chanakya.user.info().ratesauth.token;
            var city = _l(chanakya.Map.getSourceCity());
            if (!cityCodes.hasOwnProperty(city))
                getCityCode(city, token);
            else
                currentCity = city;
        };

        function getCityCode(city, token) {
            // $.ajax({
            //     url: "https://taxistop-rates.firebaseio.com/cities/" + city + ".json?auth=" + token,
            //     jsonp: "updateCity",
            //     success: function(cityCode) {
            //         if (cityCode === null) {
            //             console.log("City not supported.");
            //         } else if (rates.hasOwnProperty(cityCode)) {
            //             console.log('Already fetched.');
            //         } else {
            //             currentCity = city;
            //             cityCodes[currentCity] = cityCode;
            //             getCabRates(cityCode, token);
            //         }
            //     }
            // });
        }

        function getCabRates(cityCode, token) {
            // $.ajax({
            //     url: "https://taxistop-rates.firebaseio.com/rates/" + cityCode + ".json?auth=" + token,
            //     jsonp: "updateRates",
            //     success: function(resp) {
            //         rates[cityCode] = resp;
            //     }
            // });
        }

        var calculate = function(service, type, distance, airport, later) {
            var rates = getRates()[_l(service)].cabstype[_l(type)];
            return parseInt(rates.day.min) + (distance - parseFloat(rates.day.km)) * parseFloat(rates.day.rate) + (distance * 2 * parseFloat(rates.day.ridecharge));
        };

        var getRates = function() {
            return currentCity ? rates[cityCodes[currentCity]] : {};
        };

        return {
            calculate: calculate,
            update: update,
            getRates: getRates
        };
    }());
})(window, jQuery, CryptoJS);
