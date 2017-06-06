cryptit (V0.1.0)
 [![Build Status](https://travis-ci.org/deepaknverma/cryptit.svg?branch=master)](https://travis-ci.org/deepaknverma/cryptit)
================

node promise module to perform encryption and decryption process based on the details provided below:

- Input : Input files name to be encrypted or decrypted. Note: file to be present in src folder for encryption and 	build folder for decryption 
- Output : Output files name to be encrypted or decrypted. Note: file to be present in src folder for encryption 	and build folder for decryption
- key : Key for encryption

This library is helpful in defining environment variable in your project where you want to keep them secure and only accessible to your application. There is also a functionality to trigger encryption and decryption manually calling below method and passing file path and key. Instead of saving to file it will return data back to user.

Methods
=======
- **encryptCBC** : This encrypt the data using openssl aes-256-cbc
- **decryptCBC** : This decrypt the data using openssl aes-256-cbc
    -  **Arguments:**
    	- **bytes**: bytes for encryption
    	- **algorithmSuffix**:  algorithm to chose from (cbc, gcm ctr)
    	- **iv**:  secret
    	- **key**: password key
    	- **inputFilePath**: input filename
    	- **outputFilePath**: output filename

USAGE
======

**encryptCBC**

- **METHOD CALL**

		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/env.json'),
			outputFilePath: join(__dirname, '../resources/config.env')
		});
		crypt.encryptCBC()
	
**decryptCBC**

- **METHOD CALL**

		const crypt = new root({
			bytes: 256,
			algorithmSuffix: 'cbc',
			iv: 'afeda',
			key: 'thi5i5apa55word',
			inputFilePath: join(__dirname, '../resources/config.env'),
			outputFilePath: join(__dirname, '../resources/env.json')
		});
		crypt.decryptCBC()
			
IMPROVEMENTS:
==============

- Need test cases for other methods
- Improve documentation around other methods 
