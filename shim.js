/* eslint-disable */
// THIS file contains shims and polyfills which are
// applied before icebear is imported

// LEGACY: next paragraph is legacy and a candidate for removal
if (typeof __dirname === 'undefined') global.__dirname = '/'
if (typeof __filename === 'undefined') global.__filename = ''
if (typeof process === 'undefined') {
	global.process = require('process');
} else {
	var bProcess = require('process');
	for (var p in bProcess) {
		if (!(p in process)) {
			process[p] = bProcess[p];
		}
	}
}

// telling our websocketio that we are not browser for sure
process.browser = false;
// JSCore buffer support
if (typeof Buffer === 'undefined') global.Buffer = require('buffer').Buffer;

// polyfill for join (jscore/safari)
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
if (!Uint8Array.prototype.join) {
	Object.defineProperty(Uint8Array.prototype, 'join', {
		value: Array.prototype.join
	});
}

// polyfill for fill (jscore/safari)
// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
if (!Uint8Array.prototype.fill) {
	Uint8Array.prototype.fill = Array.prototype.fill;
}

// determining dev environment
var isDev = typeof __DEV__ === 'boolean' && __DEV__;
const env = process.env;
// providing correct NODE_ENV for libraries which depend on it
env.NODE_ENV = isDev ? 'development' : 'production';

// if we are being executed in browser for some reason
// provide local storage with information about debug
if (typeof localStorage !== 'undefined') {
	localStorage.debug = isDev ? '*' : '';
}

// patching react native websocket JS bridge
// for SSL pinning
// TODO: subject for review
const rnWebSocket = global.WebSocket;
global.WebSocket = function (url) {
	// enforce TLS pinning for our main server
	const options = url.startsWith('wss://') ? {
		// for ios, name of asset containing verified cert
		pinSSLCert: 'maincert.com',
		// for Android, sha256 hash of verified cert
		pinSSLHost: url.match(/\/\/(.*?)\//)[1],
		pinSSLCertHash: 'sha256/hOTzKrLdAWvqPQuVV2lYC61JxrXUYyTudUmMhppBkVk='
	} : null;
	const r = new rnWebSocket(url, null, null, options);
	r.binaryType = 'blob';
	return r;
};

// randomBytes polyfill is used by tweetnacl
const { randomBytes } = require('react-native-randombytes');
// cryptoShim global is used by icebear to provide tweetnacl with randomBytes
// here: https://github.com/PeerioTechnologies/peerio-icebear/blob/dev/src/crypto/util/random.ts#L20
global.cryptoShim = { randomBytes };

console.log(`shim.js: checking randomBytes`);
console.log(randomBytes(8));

const nacl = require('tweetnacl');
nacl.setPRNG((x, n) => {
	const a = randomBytes(n);
	a.copy(x);
});

// codepointat polyfill for string (used for utf-8 substring extraction)
/*! https://mths.be/codepointat v0.2.0 by @mathias */
if (!String.prototype.codePointAt) {
	(function () {
		'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
		var defineProperty = (function () {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch (error) { }
			return result;
		}());
		var codePointAt = function (position) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			var size = string.length;
			// `ToInteger`
			var index = position ? Number(position) : 0;
			if (index != index) { // better `isNaN`
				index = 0;
			}
			// Account for out-of-bounds indices:
			if (index < 0 || index >= size) {
				return undefined;
			}
			// Get the first code unit
			var first = string.charCodeAt(index);
			var second;
			if ( // check if it’s the start of a surrogate pair
				first >= 0xD800 && first <= 0xDBFF && // high surrogate
				size > index + 1 // there is a next code unit
			) {
				second = string.charCodeAt(index + 1);
				if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
				}
			}
			return first;
		};
		if (defineProperty) {
			defineProperty(String.prototype, 'codePointAt', {
				'value': codePointAt,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.codePointAt = codePointAt;
		}
	}());
}

// fromcodepointat polyfill for string (used for utf-8 substring extraction)
/*! https://mths.be/fromcodepoint v0.2.1 by @mathias */
if (!String.fromCodePoint) {
	(function () {
		var defineProperty = (function () {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch (error) { }
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function (_) {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}

// random polyfill
if (!Array.prototype.random) {
	Array.prototype.random = function () {
		return this[Math.floor((Math.random() * this.length))];
	}
}

// String.normalize is required by isemail
// Now used as a stub
// TODO: implement a proper polyfill
if (!String.prototype.normalize) {
	String.prototype.normalize = function () {
		return this;
	}
}

// used by icebear benchmarks
// console.time and console.timeEnd polyfill
if (!console["time"] || !console["timeEnd"]) {
	var timers = {};
	console["time"] = function (id) {
		timers[id] = new Date().getTime();
	};
	console["timeEnd"] = function (id) {
		var start = timers[id];
		if (start) {
			console.log(id + ": " + (new Date().getTime() - start) + "ms");
			delete timers[id];
		}
	};
}

