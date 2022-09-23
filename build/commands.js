"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var smartcard = __importStar(require("smartcard"));
var ethers_1 = require("ethers");
var selectPhononApplet = function (application) { return __awaiter(void 0, void 0, void 0, function () {
    var _response, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, application.selectFile([
                    0xa0, 0x00, 0x00, 0x08, 0x20, 0x00, 0x03, 0x01,
                ])];
            case 1:
                _response = _a.sent();
                console.log(_response);
                response = byteArrayToHexArray(_response.data);
                console.log('----', response);
                return [2 /*return*/, {
                        initialised: response[0] === 164,
                        uuid: response.slice(4, 20),
                        publicKey: response.slice(22, 87),
                    }];
        }
    });
}); };
var bytesToHex = function (array) {
    return Array.from(array, function (byte) {
        return ('0' + (byte & 0xff).toString(16)).slice(-2);
    }).join('');
};
var pairStepOne = function (application, salt, publicKey) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, pairCommand, _response, response, certificationLength, rawCert, certLen, permLen, pubKeyLen, cert;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                payload = __spreadArray(__spreadArray(__spreadArray([], __read(salt), false), [
                    0x80,
                    0x41
                ], false), __read(ethers_1.ethers.utils.arrayify(publicKey)), false);
                pairCommand = new smartcard.CommandApdu({
                    cla: 0x80,
                    ins: 0x12,
                    p1: 0x00,
                    p2: 0x00,
                    data: payload,
                });
                return [4 /*yield*/, application.issueCommand(pairCommand)];
            case 1:
                _response = _a.sent();
                console.log('----abc', typeof _response.buffer);
                response = byteArrayToHexArray(_response.buffer);
                certificationLength = response[33];
                rawCert = response.slice(32, 34 + certificationLength);
                certLen = rawCert[1];
                permLen = rawCert[3];
                pubKeyLen = rawCert[5 + permLen];
                cert = {
                    Permissions: {
                        certType: rawCert[0],
                        certLen: certLen,
                        permType: rawCert[2],
                        permLen: permLen,
                        permissions: rawCert.slice(4, 4 + permLen),
                        pubKeyType: rawCert[4 + permLen],
                        pubKeyLen: pubKeyLen,
                    },
                    PubKey: rawCert.slice(6 + permLen, 6 + permLen + pubKeyLen),
                    Sig: rawCert.slice(6 + permLen + pubKeyLen, certLen),
                };
                return [2 /*return*/, {
                        cert: cert,
                        salt: response.slice(0, 32),
                        sig: response.slice(34 + certLen),
                    }];
        }
    });
}); };
exports.default = {
    selectPhononApplet: selectPhononApplet,
    pairStepOne: pairStepOne,
};
var byteArrayToHexArray = function (response) {
    var e_1, _a;
    console.log(typeof response);
    var view = new Uint8Array(response);
    console.log(view);
    try {
        for (var view_1 = __values(view), view_1_1 = view_1.next(); !view_1_1.done; view_1_1 = view_1.next()) {
            var hex = view_1_1.value;
            console.log('------');
            console.log(hex);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (view_1_1 && !view_1_1.done && (_a = view_1.return)) _a.call(view_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    // const numChunks = Math.ceil(response.length / 2);
    // const chunks = new Array(numChunks);
    // for (let i = 0, o = 0; i < numChunks; ++i, o += 2) {
    //   chunks[i] = response.substring(o, o + 2);
    // }
    // return chunks.map((chunk: string) => parseInt(`0x${chunk.toUpperCase()}`));
    return [0];
};
