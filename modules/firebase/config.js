var ENV = process.env.NODE_ENV;

var FirebaseConfig = {};
FirebaseConfig.dbs = {
    prod: {
        app: {
            url: "https://taxistop.firebaseio.com/",
            auth: "vVBHenEDBFihTCpkoADAyFbQaG1AtbsuXEROsi6g"
        }
    },
    dev: {
        app: {
            url: "https://vivid-inferno-8339.firebaseio.com/",
            auth: "4fbWFdEsKHSwkNG6xDikveNBMnSBbYGPlkn4QSNG"
        }
    },
    common: {
        rates: {
            url: "https://taxistop-rates.firebaseio.com/",
            auth: "cogYDhJs5DhOXMcDIF2YrdsSkk5Eivx4vLli2K1d"
        },
        cablogin: {
            url: "https://flickering-inferno-5036.firebaseio.com/",
            auth: "QbJrI593zkc2pvfQnHNIXsrNfgIUSR8MlOGVpRIq"
        }
    }
};

FirebaseConfig.config = {
    options: {
        port: 443,
        method: 'GET',
        headers: {
            
        }
    }
};

FirebaseConfig.getDb = function(type) {
	var db = {};
	if (FirebaseConfig.dbs.common.hasOwnProperty(type))
		db = FirebaseConfig.dbs.common[type];
	else if (ENV === 'production')
		db = FirebaseConfig.dbs.prod[type];
	else
		db = FirebaseConfig.dbs.dev[type];
	return db;
}

FirebaseConfig.buildPath = function(type, path) {
	var db = getDb(type);
    return db.url + path + ".json?auth=" + db.auth;
};

module.exports = FirebaseConfig;