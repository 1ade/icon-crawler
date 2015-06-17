/*
 * dependencies.
 */
var Q = require('q');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var favicon_base_dir = __dirname + '/../favicons/';
var fs = require('fs');

/**
 * fetches icons from a domain url a writes it to file
 * 
 * @param {String} url
 * @param {Object} response
 *  
 */
var _get_favicon = function(url,res) {
    _get_favicons_from_url(url,res, 'link[rel~="icon"],link[rel^="apple-touch-icon"]');

};

/**
 * fetches icons from a domain url a writes it to file
 * 
 * @param {String} url
 * @param {Object} response
 *  
 */
exports._get_favicon = _get_favicon;


/**
 * fetches icons from a domain url a writes it to file
 * 
 * @param {String} url
 * @param {Object} response
 * @param {String} selector
 *  
 */
var _get_favicons_from_url = function(url,res, sel) {
    _invoke_request(url)
    .then(function(val) {
        var imgs = [];
        var invoked_req;
        invoked_req = val;
        if (invoked_req !== undefined) {
            var body = invoked_req.body;
            $ = cheerio.load(body);
            links = $(sel); 
            $(links).each(function(i, link) {
                imgs.push(link.attribs.href);
            });
        }
        imgs.push(url + '/favicon.ico');
        return imgs;
    },
    function (error) {
        console.error(error);
        if(res !== null){
        	res.end();
        	return;
        }
        
    })
    .then(function(imgs) {
        _choose_best_favicon(imgs)
        .then(function(best_image) {
            var image_to_pipe = request(best_image);
            var file_path = new Buffer(url).toString('base64');
            //write icon to file system
            image_to_pipe.pipe(fs.createWriteStream(path.normalize(favicon_base_dir + file_path)));
            if(res !== null){
                image_to_pipe.pipe(res);
            }

        });
    });   
};

/**
 * select best icon. Best icon is selected based on size i.e the larger the bytes the better the quality.
 * 
 * @param {Promises[]} imgs
 * 
 * TODO better implementation to determine quality of icon
 */
var _choose_best_favicon = function(imgs) {
    var deferred = Q.defer();
    var best_image;
    var body_lenght = 0;
    var largest_body = 0;
    _get_icons_as_data(imgs).
    then(function(imgs_as_data) {
        imgs_as_data.forEach(function(img_as_data) {
            if (img_as_data.state === "fulfilled") {               
                body_lenght = img_as_data.value.body.length;
                if (body_lenght > largest_body) {
                    largest_body = body_lenght;
                    best_image = img_as_data.value.url;
                    deferred.resolve(best_image);
                }                

            }

        });
    });
    return deferred.promise;
};

var _get_icons_as_data = function(imgs) {
    var promises =[];
    $(imgs).each(function(i, url) {
        promises.push(_invoke_request(url));
    });
    
    return Q.allSettled(promises);
};

/**
 * fires a request to provided domain
 * 
 * @param {String} url
 * @return {Promise}
 */
var _invoke_request = function(url) {
    var deferred = Q.defer();
    request.get(url, function(err, resp, body) {
        if (!err && resp.statusCode === 200) {
            var retVal = {"response": resp, "body": body,"url":url};
            deferred.resolve(retVal);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

/**
 * update icons that have been cached
 */
var _update_icons = function() {
   
    fs.readdir(path.normalize(favicon_base_dir), function(err, files) {
        if (err) {
            console.log(err);
            return;
        }
        files.forEach(function(fileName){
            var url = new Buffer(fileName, 'base64').toString('utf-8');
            _get_favicon(url,null);
        });
    });

};

/**
 * interval between icon updates
 * TODO: This might become quite expensive as the cache grows a better implementation might be to update the icons per/request by setting an expiry date
 */
setInterval(_update_icons, 1000 * 60 * 60 * 24);