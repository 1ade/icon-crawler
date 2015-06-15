/*
 * dependencies.
 */
var fs = require('fs');
var favicon_base_dir = __dirname + '/../favicons/';
var path = require('path');
var validator = require('validator');
var crawler = require('../lib/crawler');

/**
 * handle http request and response
 */
exports.index = function(req, res) {
    var url = req.query.domain || "";

    if(!(url.indexOf('http')=== 0)){
    	url = 'http://' + url;
    }
    var is_valid_url = validator.isURL(url);
    if(!is_valid_url){
    	res.end();
    	return;
    }
    //read icon from file system
    var encoded_url = path.normalize(favicon_base_dir + new Buffer(url).toString('base64'));
    if(fs.existsSync(encoded_url)){
        var file = fs.createReadStream(encoded_url);
        file.pipe(res);
    }
    else{
    	crawler._get_favicon(url,res);
    }    
};

