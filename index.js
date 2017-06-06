/*
* @Author: Deepak Verma
* @Date:   2015-12-02 08:50:23
* @Last Modified by:   Deepak Verma
* @Last Modified time: 2015-12-02 08:52:09
*/

'use strict';

var crypt = require('./lib');

/**
 * Return the version number of the module.
 *
 * @readonly
 * @alias module:crypt.version
 * @type Number
 */
crypt.version = require('./package.json').version;

module.exports = crypt;
