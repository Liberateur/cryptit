/*
* @Author: Deepak Verma
* @Date:   2015-09-23 09:30:12
* @Last Modified by:   dverma
* @Last Modified time: 2017-02-06 12:28:33
*/

'use strict';
const should = require('should');
const join = require('path').join;
const fs = require('fs');
const root = require('../../index').crypt;

describe('Encrypt ENV -', function() {
	it('should encrypt and return a boolean back', function(done) {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/env.json'),
			outputFilePath: join(__dirname, '../resources/config.env')
		});
		crypt.encryptCBC()
			.then(function(data) {
				should.exist(data);
				should(typeof data).equal('boolean');
				done();
			})
			.catch(function(err) {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});

	it('should encrypt and return a string back', function(done) {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/env.json'),
			outputFilePath: join(__dirname, '../resources/config.env'),
			return: true
		});
		crypt.encryptCBC()
			.then(function(data) {
				// console.log(data);
				should.exist(data);
				should(typeof data).equal('string');
				done();
			})
			.catch(function(err) {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});
});
describe('Decrypt ENV -', function() {
	it('should decrypt and return an boolean success back', function(done) {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/config.env'),
			outputFilePath: join(__dirname, '../resources/env.json')
		});
		crypt.decryptCBC()
			.then(function(data) {
				// console.log(data);
				should.exist(data);
				should(typeof data).equal('boolean');
				done();
			})
			.catch(function(err) {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});

	it('should decrypt and return an object back', function(done) {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/config.env'),
			outputFilePath: join(__dirname, '../resources/env.json'),
			return: true
		});
		crypt.decryptCBC()
			.then(function(data) {
				// console.log(data);
				should.exist(data);
				should(typeof data).equal('string');
				const thisObject = JSON.parse(data);
				should(thisObject.base['app-port']).equal(3000);
				done();
			})
			.catch(function(err) {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});
	// TODO: FIXME: need to handle wrond keys
	it.skip('should return invalid key error', function(done) {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i55word',
			inputFilePath: join(__dirname, '../resources/config.env'),
			outputFilePath: join(__dirname, '../resources/env.json')
		});
		crypt.decryptCBC()
			.then(function(data) {
				should.not.exist(data);
				done();
			})
			.catch(function(err) {
				// console.error(err);
				const error = new Error(err);
				should(error.message).equal('Error: error:06065064:digital envelope routines:EVP_DecryptFinal_ex:bad decrypt');
				should.exist(err);
				done();
			});
	});
});
