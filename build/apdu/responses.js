"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseReceivePhononsResponse = exports.parseSendPhononsResponse = exports.parsePairRecipientStepTwoResponse = exports.parsePairStepOneTwoThreeResponse = exports.parseChangeFriendlyNameResponse = exports.parseChangePinResponse = exports.parseGetPhononPublicKeyResponse = exports.parseListPhononsResponse = exports.parseDestroyPhononResponse = exports.parseCreatePhononResponse = exports.parseGetFriendlyNameResponse = exports.parseUnlockResponse = exports.parsePairStepTwoResponse = exports.parsePairStepOneResponse = exports.parseSelectPhononAppletResponse = void 0;
var constants_1 = require("../constants");
var cryptography_utils_1 = require("../utils/cryptography-utils");
var TLV_1 = __importDefault(require("../utils/TLV"));
var SW_SUCCESS = 36864;
var parseSelectPhononAppletResponse = function (responseApdu) {
    return {
        initialised: responseApdu.data[0] === 164,
        uuid: responseApdu.data.slice(4, 20),
        publicKey: responseApdu.data.slice(22, 87),
    };
};
exports.parseSelectPhononAppletResponse = parseSelectPhononAppletResponse;
var parsePairStepOneResponse = function (responseApdu) {
    var certLength = responseApdu.data[33];
    var rawCert = responseApdu.data.slice(32, 34 + certLength);
    var cert = parseCert(rawCert);
    return {
        cardIdentityCertificate: cert,
        pairingSalt: responseApdu.data.slice(0, 32),
        pairingSignature: responseApdu.data.slice(34 + certLength),
    };
};
exports.parsePairStepOneResponse = parsePairStepOneResponse;
var parsePairStepTwoResponse = function (responseApdu) {
    return {
        pairingIndex: responseApdu.data[0],
        salt: responseApdu.data.slice(1),
    };
};
exports.parsePairStepTwoResponse = parsePairStepTwoResponse;
var parseUnlockResponse = function (responseApdu) {
    if (responseApdu.sw === SW_SUCCESS) {
        return { success: true, data: {} };
    }
    var triesRemaining = responseApdu.sw - 25536;
    return {
        success: false,
        error: {
            code: 'INCORRECT_PIN',
            data: {
                triesRemaining: triesRemaining,
            },
        },
    };
};
exports.parseUnlockResponse = parseUnlockResponse;
var parseGetFriendlyNameResponse = function (responseApdu) {
    if (responseApdu.sw !== SW_SUCCESS) {
        return undefined;
    }
    var str = new TextDecoder().decode(responseApdu.data);
    return str;
};
exports.parseGetFriendlyNameResponse = parseGetFriendlyNameResponse;
var parseCreatePhononResponse = function (responseApdu) {
    var phononCollection = new TLV_1.default(new TLV_1.default(responseApdu.data).getValue(64));
    var rawIndex = phononCollection.getValue(65);
    var publicKey = phononCollection.getValue(128);
    return {
        keyIndex: (0, cryptography_utils_1.bytesToNumber)(rawIndex),
        publicKey: publicKey,
    };
};
exports.parseCreatePhononResponse = parseCreatePhononResponse;
var parseDestroyPhononResponse = function (responseApdu) {
    var collection = new TLV_1.default(responseApdu.data);
    return {
        privateKey: collection.getValue(129),
    };
};
exports.parseDestroyPhononResponse = parseDestroyPhononResponse;
var parseListPhononsResponse = function (responseApdu) {
    var phononCollection = new TLV_1.default(responseApdu.data).getValue(82);
    var phononDescriptions = new TLV_1.default(phononCollection).getValues(80);
    var phonons = phononDescriptions.map(function (phononDescription) {
        var rawPhonon = new TLV_1.default(phononDescription);
        var rawIndex = rawPhonon.getValue(65);
        var rawCurveType = rawPhonon.getValue(135);
        return {
            keyIndex: (0, cryptography_utils_1.bytesToNumber)(rawIndex),
            curveType: constants_1.CURVE_TYPE_CODE_TO_NAME_MAP[(0, cryptography_utils_1.bytesToNumber)(rawCurveType)],
        };
    });
    return {
        phonons: phonons,
        moreToLoad: responseApdu.sw !== SW_SUCCESS,
    };
};
exports.parseListPhononsResponse = parseListPhononsResponse;
var parseGetPhononPublicKeyResponse = function (responseApdu) {
    var collection = new TLV_1.default(new TLV_1.default(responseApdu.data).getValue(67));
    var phononDescription = new TLV_1.default(collection.getValue(68));
    return {
        publicKey: phononDescription.getValue(128),
    };
};
exports.parseGetPhononPublicKeyResponse = parseGetPhononPublicKeyResponse;
var parseChangePinResponse = function (responseApdu) {
    if (responseApdu.sw === SW_SUCCESS) {
        return {
            success: true,
            data: {},
        };
    }
    return {
        success: false,
        error: {
            code: 'UNKNOWN',
            data: {},
        },
    };
};
exports.parseChangePinResponse = parseChangePinResponse;
var parseChangeFriendlyNameResponse = function (responseApdu) {
    if (responseApdu.sw === SW_SUCCESS) {
        return {
            success: true,
            data: {},
        };
    }
    return {
        success: false,
        error: {
            code: 'UNKNOWN',
            data: {},
        },
    };
};
exports.parseChangeFriendlyNameResponse = parseChangeFriendlyNameResponse;
var parsePairStepOneTwoThreeResponse = function (responseApdu) {
    if (responseApdu.sw === SW_SUCCESS) {
        return {
            success: true,
            data: {
                pairingData: responseApdu.data,
            },
        };
    }
    return {
        success: false,
        error: {
            code: 'UNKNOWN',
            data: {},
        },
    };
};
exports.parsePairStepOneTwoThreeResponse = parsePairStepOneTwoThreeResponse;
var parsePairRecipientStepTwoResponse = function (responseApdu) {
    if (responseApdu.sw === SW_SUCCESS) {
        return {
            success: true,
            data: {},
        };
    }
    return {
        success: false,
        error: {
            code: 'UNKNOWN',
            data: {},
        },
    };
};
exports.parsePairRecipientStepTwoResponse = parsePairRecipientStepTwoResponse;
var parseSendPhononsResponse = function (responseApdu) {
    if (responseApdu.sw === SW_SUCCESS) {
        return {
            success: true,
            data: {
                transferPackets: responseApdu.data,
            },
        };
    }
    return {
        success: false,
        error: {
            code: 'UNKNOWN',
            data: {},
        },
    };
};
exports.parseSendPhononsResponse = parseSendPhononsResponse;
var parseReceivePhononsResponse = function (responseApdu) {
    if (responseApdu.sw === SW_SUCCESS) {
        return {
            success: true,
            data: {},
        };
    }
    return {
        success: false,
        error: {
            code: 'UNKNOWN',
            data: {},
        },
    };
};
exports.parseReceivePhononsResponse = parseReceivePhononsResponse;
var parseCert = function (bytes) {
    var certType = bytes[0];
    var certLen = bytes[1];
    var permType = bytes[2];
    var permLen = bytes[3];
    var permissions = bytes.slice(4, 4 + permLen);
    var pubKeyType = bytes[4 + permLen];
    var pubKeyLen = bytes[5 + permLen];
    var publicKey = bytes.slice(6 + permLen, 6 + permLen + pubKeyLen);
    var signature = bytes.slice(6 + permLen + pubKeyLen, certLen);
    return {
        permissions: {
            certType: certType,
            certLen: certLen,
            permType: permType,
            permLen: permLen,
            pubKeyType: pubKeyType,
            pubKeyLen: pubKeyLen,
            permissions: permissions,
        },
        publicKey: publicKey,
        signature: signature,
    };
};
