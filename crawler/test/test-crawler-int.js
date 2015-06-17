var hippie = require('hippie');
var server = require('../app');
var expect = require('chai').expect;
var favicon_base_dir = __dirname + '/../favicons/';
var path = require('path');
var fs = require('fs');

hippie.assert.showDiff = true;

describe('Crawler Integration Test', function(){

	var domain = 'http://www.google.com';
	var filename = path.normalize(favicon_base_dir + new Buffer(domain).toString('base64'));

	function api(){
		return hippie(server).
		base("http://localhost:3000/");					
	}

	function check_for_favicon(done){
		fs.exists(filename,function(exists){
			expect(exists).to.be.true;
			done();
		})	
	}


	it('icon crawler works fine',function(done){

		api()
		.get("get/")
		.qs({'domain':domain})
		.expectStatus(200)
		.end(function(err,res,body){
			if(err) throw err;
			check_for_favicon(done);					
		});

	});

})
