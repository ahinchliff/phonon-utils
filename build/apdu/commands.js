"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIdentifyCardCommandApdu = exports.createInitCardCommandApdu = exports.createReceivePhononsCommandApdu = exports.createSendPhononsCommandApdu = exports.createPairRecipientStepTwoCommandApdu = exports.createPairSenderStepTwoCommandApdu = exports.createPairRecipientStepOneCommandApdu = exports.createPairSenderStepOneCommandApdu = exports.createChangeFriendlyNameCommandApdu = exports.createChangePinCommandApdu = exports.createGetPhononPublicKeyCommandApdu = exports.createListPhononsCommandApdu = exports.createDestroyPhononCommandApdu = exports.createCreatePhononCommandApdu = exports.createGetFriendlyNameCommandApdu = exports.createUnlockCommandApdu = exports.createMutualAuthenticateCommandApdu = exports.createOpenSecureChannelCommandApdu = exports.createPairStepTwoCommandApdu = exports.createPairStepOneCommandApdu = exports.createSelectPhononCommandApdu = void 0;
var cryptography_utils_1 = require("../utils/cryptography-utils");
var TLV_1 = require("../utils/TLV");
var createSelectPhononCommandApdu = function () { return ({
    cla: 0,
    ins: 164,
    p1: 4,
    p2: 0,
    data: new Uint8Array([160, 0, 0, 8, 32, 0, 3, 1]),
}); };
exports.createSelectPhononCommandApdu = createSelectPhononCommandApdu;
var createPairStepOneCommandApdu = function (publicKey, salt) { return ({
    cla: 128,
    ins: 18,
    p1: 0,
    p2: 0,
    data: new Uint8Array(__spreadArray(__spreadArray(__spreadArray([], __read(salt), false), [128, publicKey.length], false), __read(publicKey), false)),
}); };
exports.createPairStepOneCommandApdu = createPairStepOneCommandApdu;
var createPairStepTwoCommandApdu = function (cryptogram) { return ({
    cla: 128,
    ins: 18,
    p1: 1,
    p2: 0,
    data: cryptogram,
}); };
exports.createPairStepTwoCommandApdu = createPairStepTwoCommandApdu;
var createOpenSecureChannelCommandApdu = function (pairingIndex, publicKey) { return ({
    cla: 128,
    ins: 16,
    p1: pairingIndex,
    p2: 0,
    data: publicKey,
}); };
exports.createOpenSecureChannelCommandApdu = createOpenSecureChannelCommandApdu;
var createMutualAuthenticateCommandApdu = function (data) { return ({
    cla: 128,
    ins: 17,
    p1: 0,
    p2: 0,
    data: data,
}); };
exports.createMutualAuthenticateCommandApdu = createMutualAuthenticateCommandApdu;
var createUnlockCommandApdu = function (pin) { return ({
    cla: 128,
    ins: 32,
    p1: 0,
    p2: 0,
    data: (0, cryptography_utils_1.stringToBytes)(pin),
}); };
exports.createUnlockCommandApdu = createUnlockCommandApdu;
var createGetFriendlyNameCommandApdu = function () { return ({
    cla: 128,
    ins: 87,
    p1: 0,
    p2: 0,
    data: new Uint8Array([0]),
}); };
exports.createGetFriendlyNameCommandApdu = createGetFriendlyNameCommandApdu;
var createCreatePhononCommandApdu = function (curveType) {
    var curveCode = (0, cryptography_utils_1.curveNameToCurveCode)(curveType);
    if (!curveCode) {
        throw new Error("Could not find curve code for curve type \"".concat(curveType, "\""));
    }
    return {
        cla: 0,
        ins: 48,
        p1: curveCode,
        p2: 0,
        data: new Uint8Array([0]),
    };
};
exports.createCreatePhononCommandApdu = createCreatePhononCommandApdu;
var createDestroyPhononCommandApdu = function (keyIndex) {
    var data = (0, TLV_1.encodeTlv)({ tag: 65, value: (0, cryptography_utils_1.numberToBytes)(keyIndex) });
    return {
        cla: 0,
        ins: 52,
        p1: 0,
        p2: 0,
        data: data,
    };
};
exports.createDestroyPhononCommandApdu = createDestroyPhononCommandApdu;
// todo - allow user to filter
var createListPhononsCommandApdu = function (continuation) {
    return {
        cla: 0,
        ins: 50,
        p1: continuation ? 1 : 0,
        p2: 0,
        // hardcoded to fetch all phonons
        data: new Uint8Array([
            96, 24, 130, 2, 0, 0, 132, 8, 0, 0, 0, 0, 0, 0, 0, 0, 133, 8, 0, 0, 0, 0,
            0, 0, 0, 0,
        ]),
    };
};
exports.createListPhononsCommandApdu = createListPhononsCommandApdu;
var createGetPhononPublicKeyCommandApdu = function (keyIndex) {
    var data = (0, TLV_1.encodeTlv)({ tag: 65, value: (0, cryptography_utils_1.numberToBytes)(keyIndex) });
    return {
        cla: 0,
        ins: 51,
        p1: 0,
        p2: 0,
        data: data,
    };
};
exports.createGetPhononPublicKeyCommandApdu = createGetPhononPublicKeyCommandApdu;
var createChangePinCommandApdu = function (newPin) {
    return {
        cla: 128,
        ins: 33,
        p1: 0,
        p2: 0,
        data: (0, cryptography_utils_1.stringToBytes)(newPin),
    };
};
exports.createChangePinCommandApdu = createChangePinCommandApdu;
var createChangeFriendlyNameCommandApdu = function (newName) {
    return {
        cla: 128,
        ins: 86,
        p1: 0,
        p2: 0,
        data: (0, cryptography_utils_1.stringToBytes)(newName),
    };
};
exports.createChangeFriendlyNameCommandApdu = createChangeFriendlyNameCommandApdu;
var createPairSenderStepOneCommandApdu = function (receivingCardsCert) {
    var data = (0, TLV_1.encodeTlv)({ tag: 144, value: receivingCardsCert });
    return {
        cla: 128,
        ins: 80,
        p1: 0,
        p2: 0,
        data: data,
    };
};
exports.createPairSenderStepOneCommandApdu = createPairSenderStepOneCommandApdu;
var createPairRecipientStepOneCommandApdu = function (pairSenderOneData) {
    return {
        cla: 128,
        ins: 81,
        p1: 0,
        p2: 0,
        data: pairSenderOneData,
    };
};
exports.createPairRecipientStepOneCommandApdu = createPairRecipientStepOneCommandApdu;
var createPairSenderStepTwoCommandApdu = function (pairRecipientOneData) {
    return {
        cla: 128,
        ins: 82,
        p1: 0,
        p2: 0,
        data: pairRecipientOneData,
    };
};
exports.createPairSenderStepTwoCommandApdu = createPairSenderStepTwoCommandApdu;
var createPairRecipientStepTwoCommandApdu = function (pairSenderTwoData) {
    return {
        cla: 128,
        ins: 83,
        p1: 0,
        p2: 0,
        data: pairSenderTwoData,
    };
};
exports.createPairRecipientStepTwoCommandApdu = createPairRecipientStepTwoCommandApdu;
var createSendPhononsCommandApdu = function (keyIndices, extendedRequest) {
    var keyIndiciesBytes = keyIndices.reduce(function (progress, keyIndex) {
        return new Uint8Array(__spreadArray(__spreadArray([], __read(progress), false), __read((0, cryptography_utils_1.numberToBytes)(keyIndex)), false));
    }, new Uint8Array());
    var data = (0, TLV_1.encodeTlv)({ tag: 66, value: keyIndiciesBytes });
    return {
        cla: 0,
        ins: 53,
        p1: extendedRequest ? 1 : 0,
        p2: keyIndices.length,
        data: data,
    };
};
exports.createSendPhononsCommandApdu = createSendPhononsCommandApdu;
var createReceivePhononsCommandApdu = function (phononTransfer) {
    return {
        cla: 0,
        ins: 54,
        p1: 0,
        p2: 0,
        data: phononTransfer,
    };
};
exports.createReceivePhononsCommandApdu = createReceivePhononsCommandApdu;
var createInitCardCommandApdu = function (data) {
    return {
        cla: 128,
        ins: 254,
        p1: 0,
        p2: 0,
        data: data,
    };
};
exports.createInitCardCommandApdu = createInitCardCommandApdu;
var createIdentifyCardCommandApdu = function (nonce) {
    return {
        cla: 128,
        ins: 20,
        p1: 0,
        p2: 0,
        data: nonce,
    };
};
exports.createIdentifyCardCommandApdu = createIdentifyCardCommandApdu;
