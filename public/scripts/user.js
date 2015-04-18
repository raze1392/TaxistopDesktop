(function(w, a, crypto, utils, undefined) {
    w.chanakya = w.chanakya || {};
    w.chanakya.user = (function() {

        var userInfo;

        var setUserInfo = function(hash) {
            console.debug('setting user info');
            $.ajax({
                url: utils.fire.toString() + "/users/" + hash + ".json?auth=" + utils.fire.getAuth().token,
                jsonp: "updateUserInfo",
                success: function(user) {
                    getRatesAuth(hash, user);
                },
                error: function(xhr, status, err) {
                    userInfo = undefined;
                }
            });
        };

        var getRatesAuth = function(hash, info) {
            console.log('getting rates auth', utils.fire.toString() + "/ratesAuth/.json?auth=" + utils.fire.getAuth().token);
            $.ajax({
                url: utils.fire.toString() + "/ratesAuth/.json?auth=" + utils.fire.getAuth().token,
                jsonp: "updateRatesAuth",
                success: function(ratesAuth) {
                    if (!ratesAuth || !ratesAuth.expires || ratesAuth.expires < ((new Date()).getTime() / 1000)) {
                        setRatesAuth(hash, info);
                    } else {
                        setUserInfoObject(hash, info, ratesAuth);
                    }
                },
                error: function(xhr, status, err) {
                    console.error(err);
                }
            });
        }

        var ratesFailed = 0;
        var setRatesAuth = function(hash, info) {
            utils.ratesfire.authAnonymously(function(error, ratesAuth) {
                console.log("Authenticating for rates");
                if (error) {
                    if (ratesFailed > 5) {
                        console.log("Authenticating for rates has failed 5 time. Reload or try again.");
                    } else {
                        ratesFailed++;
                        setRatesAuth(hash, info);
                        console.log("Rates Login Failed!", error);
                    }
                } else {
                    setUserInfoObject(hash, info, ratesAuth);
                    utils.fire.child("ratesAuth").set({
                        token: ratesAuth.token,
                        expires: ratesAuth.expires
                    });
                }
            });
        };

        function setUserInfoObject(hash, info, ratesAuth) {
            userInfo = info;
            userInfo.ratesauth = {
                token: ratesAuth.token,
                expires: ratesAuth.expires
            };
            saveUserInfo(userInfo);
        }

        function saveUserInfo(info) {
            console.log('registering info event');
            utils.Storage.set("user.info", userInfo);
            var userInfoChangedEvent = new CustomEvent('userInfoChanged', {
                details: userInfo
            });
            w.dispatchEvent(userInfoChangedEvent);
        }

        var getUserInfo = function() {
            return userInfo;
        };

        function getName(authData) {
            switch (authData.provider) {
                case 'password':
                    return authData.password.email.replace(/@.*/, '');
                case 'google':
                    return authData.google.displayName;
                case 'facebook':
                    return authData.facebook.displayName;
            }
        }

        var authHandle = function(error, authData, location, showError) {
            if (error) {
                handleError(error, showError);
            } else {
                saveAuth(authData, location);
            }
        };

        var saveAuth = function(authData, location) {
            var hash = crypto.SHA1(authData[authData.provider].email).toString();

            $.ajax({
                url: utils.fire.toString() + "/users/" + hash + ".json?auth=" + utils.fire.getAuth().token,
                jsonp: "updateUser",
                success: function(user) {
                    console.log(user);
                    user = user || {};
                    user.uid = authData.uid;
                    user.name = user.name || getName(authData);
                    user.email = user.email || authData[authData.provider].email;
                    if (authData[authData.provider].cachedUserProfile && authData[authData.provider].cachedUserProfile.picture) {
                        if (authData.provider === 'google')
                            user.picture = authData[authData.provider].cachedUserProfile.picture;
                        else if (authData.provider === 'facebook')
                            user.picture = authData[authData.provider].cachedUserProfile.picture.data.url;
                    }
                    user.timestamp = (new Date()).getTime();
                    user.facebook = user.facebook || null;
                    user.google = user.google || null;
                    user.password = user.password || null;
                    user[authData.provider] = authData.provider[authData.provider] || {
                        uid: authData.uid
                    };
                    utils.fire.child("users").child(hash).set(user);
                    utils.cookie.create({
                        name: 'user',
                        value: hash,
                        days: 1
                    });

                    setUserInfo(hash);
                    w.location.hash = '#/app';
                },
                error: function(xhr, status, err) {
                    console.log(err);
                }
            });
        };

        var register = function(options, location, showError) {
            utils.fire.createUser({
                email: options.email,
                password: options.password
            }, function(error, userData) {
                if (error) {
                    console.log("Error creating user:", error);
                } else {
                    utils.fire.authWithPassword({
                        email: options.email,
                        password: options.password
                    }, function(error, authData) {
                        authHandle(error, authData, location, showError);
                    });
                }
            });
        };

        var login = function(options, location, showError) {
            console.log('trying login', options);
            if (utils.cookie.get('loginClicked')) return;
            utils.cookie.create({
                name: 'loginClicked',
                value: true,
                secs: 60
            });
            if (options.provider === 'facebook' || options.provider === 'google') {
                utils.fire.authWithOAuthRedirect(options.provider, function(error, authData) {
                    if (error)
                        handleError(error, showError);
                }, {
                    scope: "email"
                });
            } else {
                utils.fire.authWithPassword({
                    email: options.email,
                    password: options.password
                }, function(error, authData) {
                    authHandle(error, authData, location, showError);
                });
            }
        };

        var logout = function(location) {
            userInfo = undefined;
            utils.fire.unauth();
            utils.cookie.erase('user');
            utils.cookie.erase('loginClicked');
            utils.Storage.erase('user.info');
            location.path("/login");
        };

        var resetPassword = function(email, handleSuccess, handleError) {
            utils.fire.resetPassword({
                email: email
            }, function(error) {
                if (error === null) {
                    handleSuccess();
                } else {
                    handleError(error, handleError);
                }
            });
        };

        // var changeEmail = function(oldEmail, newEmail, password) {
        //     utils.fire.changeEmail({
        //         oldEmail: oldEmail,
        //         newEmail: newEmail,
        //         password: password
        //     }, function(error) {
        //         if (error === null) {
        //             console.log("Email changed successfully");
        //         } else {
        //             console.log("Error changing email:", error);
        //         }
        //     });
        // };

        var changePassword = function(email, oldPswd, newPswd, handleSuccess, handleError) {
            utils.fire.changePassword({
                email: email,
                oldPassword: oldPswd,
                newPassword: newPswd
            }, function(error) {
                if (error === null) {
                    handleSuccess();
                } else {
                    handleError(error);
                }
            });
        };

        var handleError = function(error, showError) {
            console.log(error);
            utils.cookie.erase('user');
            utils.cookie.erase('loginClicked');
            switch (error.code) {
                case "INVALID_EMAIL":
                    showError("The specified user account email is invalid.");
                    break;
                case "INVALID_PASSWORD":
                    showError("The specified user account password is incorrect.");
                    break;
                case "INVALID_USER":
                    showError("The specified user account does not exist.");
                    break;
                default:
                    showError("Error logging user in");
            }
        };
        return {
            info: getUserInfo,
            setUserInfo: setUserInfo,
            saveAuth: saveAuth,
            register: register,
            login: login,
            logout: logout,
            resetPassword: resetPassword,
            changePassword: changePassword,
            handleError: handleError
        };
    }());
})(window, angular, CryptoJS, chanakya.utils);
