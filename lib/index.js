/*
* @Author: Deepak Verma
* @Date:   2015-09-23 09:30:12
* @Last Modified by:   dverma
* @Last Modified time: 2017-06-06 09:56:28
*/

'use strict';

const crypto = require('crypto');
const fs = require('fs');
const zlib = require('zlib');
const _ = require('underscore');
const errs = require('errs');

/**
 * [crypt description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
class crypt {

	constructor(options) {
		options = options || {};

		const bytes = options.bytes || 256;
		// algorithm = 'aes-' + bytes + '-ctr';
		// algorithm = 'aes-' + bytes + '-gcm';
		// algorithm = 'aes-' + bytes + '-cbc';
		const algorithm = options.algorithmSuffix || null;
		if (!algorithm) {
			return errs.create({ message: 'algorithm not supported' });
		}
		this.options = _.defaults(options, {
			algorithm: 'aes-' + bytes + '-' + algorithm,
			iv: options.iv || 'adefa',
			key: options.key || 'd6F3Efeq',
			inputFilePath: options.inputFilePath || null,
			outputFilePath: options.outputFilePath || null,
			return: options.return || false
		});

		return this;
	}

	/**
	 * [encryptCBC description]
	 * @return {[type]} [description]
	 */
	encryptCBC() {
		const self = this;
		return new Promise(function(success, fail) {
			// get your password from safe store and create the cipher
			const aes = crypto.createCipher(self.options.algorithm, new Buffer(self.options.key));
			const rstream = fs.createReadStream(self.options.inputFilePath);
			const wstream = fs.createWriteStream(self.options.outputFilePath, { encoding: 'UTF-8' });

			rstream   // reads from inputFilePath
				.pipe(aes)  // encrypts with aes256
				.pipe(wstream)  // writes to myfile.encrypted
				.on('error', function(err) {
					console.log('Oops! below error occured : \n', err);
					return fail(errs.merge(err, { message: 'unable to encrypt' }));
				})
				.on('finish', function() {  // finished
					console.log('\n\n Encryption Completed');
					if (self.options.return) {
						return success(fs.readFileSync(self.options.outputFilePath, { encoding: 'UTF-8' }));
					}
					return success(true);
				});
		});
	}

	/**
	 * [decrypt : this decrypt the data using openssl aes-256-cbc ]
	 * @param  {[string]} inputFilePath [files location with file name to be decrypted]
	 * @param  {[string]} key      [key to be used for decryption]
	 * @return {[string]}          [object back]
	 */
	decryptCBC() {
		const self = this;
		return new Promise(function(success, fail) {
			// get your password from safe store and create the cipher
			const aes = crypto.createDecipher(self.options.algorithm, new Buffer(self.options.key));
			const rstream = fs.createReadStream(self.options.inputFilePath);
			let data = '';
			rstream   			// reads from filepath
				.pipe(aes)  	// decrypt with aes256
				.on('error', function(err) {
					console.log('Oops! below error occured : \n', err);
					return fail(errs.merge(err, { message: 'unable to decrypt' }));
				})
				.on('data', function(buffer) {  // finished
					data += buffer.toString();
				})
				.on('end', function() {  // finished
					console.log('\n\n Decryption Completed');
					if (self.options.return) {
						return success(data);
					}
					fs.writeFileSync(self.options.outputFilePath, data, { encoding: 'UTF-8' });
					return success(true);
				});
		});
	}

	/**
	 * [encryptStream description]
	 * @return {[type]} [description]
	 */
	encryptStream() {
		const self = this;
		// input file
		const r = fs.createReadStream(self.options.inputFilePath);
		// start pipe
		return r.pipe(
			zlib.createGzip()) // zip content
		.pipe(
			crypto.createCipher(self.options.algorithm, self.options.key)); // encrypt content
	}

	/**
	 * [encryptStream description]
	 * @return {[type]} [description]
	 */
	decryptStream() {
		const self = this;
		// input file
		const r = fs.createReadStream(self.options.inputFilePath);
		// Getting file location
		const path = self.options.inputFilePath.substring(0, self.options.inputFilePath.lastIndexOf('/') + 1);
		// start pipe
		return r.pipe(
			crypto.createDecipher(self.options.algorithm, self.options.key)) // decrypt content
		.pipe(
			zlib.createGunzip()) // unzip content
		.pipe(fs.createWriteStream(Math.random() + '.out.txt')); // write file
	}

	/**
	 * [encryptCTR description]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
	encryptCTR(text) {
		const self = this;
		return new Promise(function(success, fail) {
			const cipher = crypto.createCipher(self.options.algorithm, self.options.key);
			let crypted = cipher.update(text, 'utf8', 'hex');
			crypted += cipher.final('hex');
			return success(crypted);
		});
	}

	/**
	 * [decryptCTR description]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
	decryptCTR(text) {
		const self = this;
		return new Promise(function(success, fail) {
			const decipher = crypto.createDecipher(self.options.algorithm, self.options.key);
			let dec = decipher.update(text, 'hex', 'utf8');
			dec += decipher.final('utf8');
			return success(dec);
		});
	}

	/**
	 * [encryptGCM description]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
	encryptGCM(text) {
		const self = this;
		return new Promise(function(success, fail) {
			const cipher = crypto.createCipheriv(self.options.algorithm, self.options.key, self.options.iv);
			let encrypted = cipher.update(text, 'utf8', 'hex'),
				tag = cipher.getAuthTag();
			encrypted += cipher.final('hex');
			return success({
				content: encrypted,
				tag: tag
			});
		});
	}

	/**
	 * [decryptGCM description]
	 * @param  {[type]} encrypted [description]
	 * @return {[type]}           [description]
	 */
	decryptGCM(encrypted) {
		const self = this;
		return new Promise(function(success, fail) {
			const decipher = crypto.createDecipheriv(self.options.algorithm, self.options.key, self.options.iv);
			// set auth tag
			decipher.setAuthTag(encrypted.tag);
			let dec = decipher.update(encrypted.content, 'hex', 'utf8');
			dec += decipher.final('utf8');
			return success(dec);
		});
	}

	/**
	 * [encryptBuffer description]
	 * @param  {[type]} buffer [description]
	 * @return {[type]}        [description]
	 */
	encryptBuffer(buffer) {
		const self = this;
		return new Promise(function(success, fail) {
			const cipher = crypto.createCipher(self.options.algorithm, self.options.key);
			return success(Buffer.concat([cipher.update(buffer), cipher.final()]));
		});
	}

	/**
	 * [decryptBuffer description]
	 * @param  {[type]} buffer [description]
	 * @return {[type]}        [description]
	 */
	decryptBuffer(buffer) {
		const self = this;
		return new Promise(function(success, fail) {
			const decipher = crypto.createDecipher(self.options.algorithm, self.options.key);
			return success(Buffer.concat([decipher.update(buffer), decipher.final()]));

		});
	}

	/**
	 * [createHash description]
	 * @param  {[type]} text [description]
	 * @return {[type]}      [description]
	 */
	createHash(text) {
		const self = this;
		return new Promise(function(success, fail) {
			// create hash
			const hash = crypto.createHmac('sha512', this.options.key);
			hash.update(text);
			return success(hash.digest('hex'));
		});
	}
}

module.exports = {
	crypt: crypt
};
