/*
* @Author: Deepak Verma
* @Date:   2015-09-23 09:30:12
* @Last Modified by:   dverma
* @Last Modified time: 2017-06-06 11:05:14
*/

'use strict';
const should = require('should');
const join = require('path').join;
const fs = require('fs');
const root = require('../../index').crypt;

describe('Encrypt ENV -', () => {
	it('should encrypt and return a boolean back', (done) => {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/env.json'),
			outputFilePath: join(__dirname, '../resources/config.env')
		});
		crypt.encryptCBC()
			.then((data) => {
				should.exist(data);
				should(typeof data).equal('boolean');
				done();
			})
			.catch((err) => {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});

	it('should encrypt and return a string back', (done) => {
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
			.then((data) => {
				// console.log(data);
				should.exist(data);
				should(typeof data).equal('string');
				done();
			})
			.catch((err) => {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});
});
describe('Decrypt ENV -', () => {
	it('should decrypt and return an boolean success back', (done) => {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/config.env'),
			outputFilePath: join(__dirname, '../resources/env.json')
		});
		crypt.decryptCBC()
			.then((data) => {
				// console.log(data);
				should.exist(data);
				should(typeof data).equal('boolean');
				done();
			})
			.catch((err) => {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});

	it('should decrypt and return an object back', (done) => {
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
			.then((data) => {
				// console.log(data);
				should.exist(data);
				should(typeof data).equal('string');
				const thisObject = JSON.parse(data);
				should(thisObject.base['app-port']).equal(3000);
				done();
			})
			.catch((err) => {
				console.error(err);
				should.not.exist(err);
				done();
			});
	});

	it('should return invalid key error', (done) => {
		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i55word',
			inputFilePath: join(__dirname, '../resources/config.env'),
			outputFilePath: join(__dirname, '../resources/env.json')
		});
		crypt.decryptCBC()
			.then((data) => {
				should.not.exist(data);
				done();
			})
			.catch((err) => {
				const error = new Error(err);
				should(error.message).equal('Error: Unable to decrypt. Bad Key');
				should.exist(err);
				done();
			});
	});
});
