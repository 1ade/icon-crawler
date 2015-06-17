var path = require('path');
var request = require('request');
var sinon = require('sinon');
var favicon_base_dir = __dirname + '/../test/favicons/';
var crawler = require('../lib/crawler');
var fs = require('fs');
var should = require('should');

describe('Crawler Unit test', function(){
	var callback;
  var test_file = favicon_base_dir + "test.txt";
	
	before(function(done){
		var htmlHeader = "<html>" +
							"<head>" +
							"<link rel='shortcut icon' href='http://www.some.site/image.png' />" +
							"<link rel='apple-touch-icon-precomposed' href='http://www.some.site2/image.png' />" +
						 "</head>" +
						 "<body></body>" +
						 "</html>";
		var image_1_mock = new Buffer("||||||||||||||");
		var image_2_mock = new Buffer("||||||||||||");
		var image_3_mock = new Buffer("|||||||||");
		var response = {statusCode:200};

		callback = sinon.stub(request,'get');
		callback.onCall(0).yields(null,response,htmlHeader);
		callback.onCall(1).yields(null,response,image_1_mock);
		callback.onCall(2).yields(null,response,image_2_mock);
		callback.onCall(3).yields(null,response,image_3_mock);
		
	
		sinon.stub(path,"normalize").returns(test_file);
		
		done();
	});
	
	after(function(done){

		request.get.restore();
		path.normalize.restore();

		done();
	});

	it('it can write file to disk',function(done){
		var spy  = sinon.spy();
		crawler._get_favicon("http://whoop.ti.do",spy);

		sinon.assert.called(callback);
		sinon.assert.notCalled(spy);
		fs.readFile(test_file,function(err,data){
			should.exist(data);
		})	
		
		done();
	});
})