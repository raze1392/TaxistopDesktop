var express = require('express');
var globals = require(__dirname + '/../modules/helpers/globals');
var logger = require(__dirname + '/../modules/helpers/log');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var session = req.session;

    var url = {
        cdnImagePrefix: globals.getCDNUrlPrefix(),
        gMapsAPI: globals.getGmapsAPI(),
        firebase: globals.getFirebaseUrls()
    };

    res.render('index', {
        isProd: globals.isEnvironmentProduction(),
        title: 'TaxiStop',
        url: url
    });
});

router.get('/login.html', function(req, res) {
    res.render('login', {
        cdnImagePrefix: globals.getCDNUrlPrefix()
    });
});

router.get('/content.html', function(req, res) {
    res.render('content', {
        cdnImagePrefix: globals.getCDNUrlPrefix()
    });
});

module.exports = router;
