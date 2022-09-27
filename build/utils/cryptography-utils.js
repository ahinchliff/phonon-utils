"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.curveNameToCurveCode = exports.isCertificateValid = exports.digestCertificate = exports.serialiseCertificate = exports.parseResponse = exports.numberToBytes = exports.bytesToNumber = exports.stringToBytes = exports.decryptResponseData = exports.encryptCommandApdu = exports.parseEncryptedResponseData = exports.generateSharedSecret = exports.createMeta = exports.calculateMac = exports.createPairStepTwoCryptogram = exports.decrypt = exports.encrypt = exports.deriveSessionKeys = exports.createEmptyData = exports.removePaddingFromData = exports.appendPaddingToData = exports.generateInitSecrets = exports.generateRandomBytes = void 0;
var crypto = __importStar(require("crypto"));
var secp256k1 = __importStar(require("@noble/secp256k1"));
var constants_1 = require("../constants");
var pbkdf2_1 = __importDefault(require("pbkdf2"));
var generateRandomBytes = function (length) {
    return new Uint8Array(crypto.randomBytes(length));
};
exports.generateRandomBytes = generateRandomBytes;
var generateInitSecrets = function () {
    var pairingPassword = crypto.randomBytes(12).toString('base64url');
    var puk = Math.random().toString().substring(2, 12);
    var pin = Math.random().toString().substring(2, 6);
    var pairingToken = new Uint8Array(pbkdf2_1.default.pbkdf2Sync(pairingPassword, 'Keycard Pairing Password Salt', 50000, 32, 'sha256'));
    return {
        pairingPassword: pairingPassword,
        puk: puk,
        pin: pin,
        pairingToken: pairingToken,
    };
};
exports.generateInitSecrets = generateInitSecrets;
var appendPaddingToData = function (blockSize, data) {
    var paddingSize = blockSize - (data.length % blockSize);
    return new Uint8Array(__spreadArray(__spreadArray(__spreadArray([], __read(data), false), [128], false), __read((0, exports.createEmptyData)(paddingSize - 1)), false));
};
exports.appendPaddingToData = appendPaddingToData;
var removePaddingFromData = function (blockSize, data) {
    var i = data.length - 1;
    while (i > data.length - blockSize) {
        if (data[i] == 128) {
            break;
        }
        i--;
    }
    return data.slice(0, i);
};
exports.removePaddingFromData = removePaddingFromData;
var createEmptyData = function (length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push(0);
    }
    return new Uint8Array(result);
};
exports.createEmptyData = createEmptyData;
var deriveSessionKeys = function (secureChannelSharedSecret, pairingKey, openSecureChannelCardResponse) {
    var salt = openSecureChannelCardResponse.slice(0, 32);
    var iv = openSecureChannelCardResponse.slice(32);
    var hash = crypto.createHash('sha512');
    hash.update(secureChannelSharedSecret);
    hash.update(pairingKey);
    hash.update(salt);
    var keyData = new Uint8Array(hash.digest());
    var encryptionKey = keyData.slice(0, 32);
    var macKey = keyData.slice(32);
    return {
        encryptionKey: encryptionKey,
        macKey: macKey,
        iv: iv,
    };
};
exports.deriveSessionKeys = deriveSessionKeys;
var encrypt = function (data, encryptionKey, iv) {
    var dataWithPadding = (0, exports.appendPaddingToData)(16, data);
    var cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
    return new Uint8Array(cipher.update(dataWithPadding));
};
exports.encrypt = encrypt;
var decrypt = function (responseData, secureChannelEncryptionKey, secureChannelIv) {
    var decipher = crypto.createDecipheriv('aes-256-cbc', secureChannelEncryptionKey, secureChannelIv);
    decipher.setAutoPadding(false);
    var plaintext = new Uint8Array(decipher.update(responseData));
    return (0, exports.removePaddingFromData)(16, plaintext);
};
exports.decrypt = decrypt;
var createPairStepTwoCryptogram = function (pairingSalt, sigDataHash) {
    return secp256k1.utils.sha256(new Uint8Array(__spreadArray(__spreadArray([], __read(pairingSalt), false), __read(sigDataHash), false)));
};
exports.createPairStepTwoCryptogram = createPairStepTwoCryptogram;
var calculateMac = function (meta, encryptedApduData, macKey) {
    var dataWithPadding = (0, exports.appendPaddingToData)(16, encryptedApduData);
    var cipher = crypto.createCipheriv('aes-256-cbc', macKey, (0, exports.createEmptyData)(16));
    cipher.update(meta);
    var encrypted = cipher.update(dataWithPadding);
    var macData = new Uint8Array(encrypted);
    return macData.slice(macData.length - 32, macData.length - 16);
};
exports.calculateMac = calculateMac;
var createMeta = function (command, encryptedData) {
    return new Uint8Array(__spreadArray([
        command.cla,
        command.ins,
        command.p1,
        command.p2,
        encryptedData.length + 16
    ], __read((0, exports.createEmptyData)(11)), false));
};
exports.createMeta = createMeta;
var generateSharedSecret = function (privateKey, cardPublicKey) {
    var sharedSecretRaw = secp256k1.getSharedSecret(privateKey, cardPublicKey, true);
    // not sure why I need to remove first byte
    return sharedSecretRaw.slice(1);
};
exports.generateSharedSecret = generateSharedSecret;
var parseEncryptedResponseData = function (responseData, secureChannelIv) {
    var meta = new Uint8Array(__spreadArray([responseData.length], __read((0, exports.createEmptyData)(15)), false));
    var mac = responseData.slice(0, secureChannelIv.length);
    var data = responseData.slice(secureChannelIv.length);
    return {
        meta: meta,
        mac: mac,
        data: data,
    };
};
exports.parseEncryptedResponseData = parseEncryptedResponseData;
var encryptCommandApdu = function (command, sessionKeys) {
    var encryptedData = (0, exports.encrypt)(command.data, sessionKeys.encryptionKey, sessionKeys.iv);
    var meta = (0, exports.createMeta)(command, encryptedData);
    var mac = (0, exports.calculateMac)(meta, encryptedData, sessionKeys.macKey);
    var encryptedCommand = __assign(__assign({}, command), { data: new Uint8Array(__spreadArray(__spreadArray([], __read(mac), false), __read(encryptedData), false)) });
    return {
        command: encryptedCommand,
        iv: mac,
    };
};
exports.encryptCommandApdu = encryptCommandApdu;
var decryptResponseData = function (responseData, sessionKeys) {
    var parsedResponseData = (0, exports.parseEncryptedResponseData)(responseData, sessionKeys.iv);
    var plainTextData = (0, exports.decrypt)(parsedResponseData.data, sessionKeys.encryptionKey, sessionKeys.iv);
    var mac = (0, exports.calculateMac)(parsedResponseData.meta, parsedResponseData.data, sessionKeys.macKey);
    return {
        plainTextData: plainTextData,
        iv: mac,
    };
};
exports.decryptResponseData = decryptResponseData;
var stringToBytes = function (value) {
    return new Uint8Array(Buffer.from(value));
};
exports.stringToBytes = stringToBytes;
var bytesToNumber = function (Uint8Array) {
    var length = Uint8Array.length;
    var buffer = Buffer.from(Uint8Array);
    var result = buffer.readUIntBE(0, length);
    return result;
};
exports.bytesToNumber = bytesToNumber;
var numberToBytes = function (num) {
    var buffer = new ArrayBuffer(2);
    var view = new DataView(buffer);
    view.setUint16(0, num, false);
    return new Uint8Array(buffer);
};
exports.numberToBytes = numberToBytes;
var parseResponse = function (decryptedResponseData) {
    var sw = decryptedResponseData.slice(decryptedResponseData.length - 2);
    return {
        sw: (0, exports.bytesToNumber)(sw),
        s1: sw[0],
        s2: sw[1],
        data: decryptedResponseData.slice(0, decryptedResponseData.length - 2),
    };
};
exports.parseResponse = parseResponse;
var serialiseCertificate = function (cert) {
    return Uint8Array.of.apply(Uint8Array, __spreadArray(__spreadArray([cert.permissions.certType,
        cert.permissions.certLen], __read((0, exports.digestCertificate)(cert)), false), __read(cert.signature), false));
};
exports.serialiseCertificate = serialiseCertificate;
var digestCertificate = function (cert) {
    return Uint8Array.of.apply(Uint8Array, __spreadArray(__spreadArray(__spreadArray([cert.permissions.permType,
        cert.permissions.permLen], __read(cert.permissions.permissions), false), [cert.permissions.pubKeyType,
        cert.permissions.pubKeyLen], false), __read(cert.publicKey), false));
};
exports.digestCertificate = digestCertificate;
var isCertificateValid = function (cert, certAuthorityPublicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var certDigest, sigDataHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                certDigest = (0, exports.digestCertificate)(cert);
                return [4 /*yield*/, secp256k1.utils.sha256(certDigest)];
            case 1:
                sigDataHash = _a.sent();
                return [2 /*return*/, secp256k1.verify(cert.signature, sigDataHash, certAuthorityPublicKey, {
                        strict: false,
                    })];
        }
    });
}); };
exports.isCertificateValid = isCertificateValid;
var curveNameToCurveCode = function (curve) {
    var curveCodes = Object.keys(constants_1.CURVE_TYPE_CODE_TO_NAME_MAP);
    var curveNames = Object.values(constants_1.CURVE_TYPE_CODE_TO_NAME_MAP);
    var curveNameIndex = curveNames.findIndex(function (name) { return name === curve; });
    return curveCodes[curveNameIndex];
};
exports.curveNameToCurveCode = curveNameToCurveCode;
