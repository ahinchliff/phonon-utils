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
Object.defineProperty(exports, "__esModule", { value: true });
var secp256k1 = __importStar(require("@noble/secp256k1"));
var crypto_1 = require("crypto");
var commands_1 = require("./apdu/commands");
var responses_1 = require("./apdu/responses");
var create_invoke_queue_1 = require("./utils/create-invoke-queue");
var cryptography_utils_1 = require("./utils/cryptography-utils");
var PhononCard = /** @class */ (function () {
    function PhononCard(sendCommand) {
        var _this = this;
        this.sendCommand = sendCommand;
        this.queue = (0, create_invoke_queue_1.createInvokeQueue)();
        this.select = function () { return __awaiter(_this, void 0, void 0, function () {
            var command, response, _a, initialised, publicKey;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        command = (0, commands_1.createSelectPhononCommandApdu)();
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _b.sent();
                        _a = (0, responses_1.parseSelectPhononAppletResponse)(response), initialised = _a.initialised, publicKey = _a.publicKey;
                        this.isInitialised = initialised;
                        this.pairingPublicKey = publicKey;
                        return [2 /*return*/];
                }
            });
        }); };
        this.identifyCard = function (nonce) { return __awaiter(_this, void 0, void 0, function () {
            var command, response, parsedResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createIdentifyCardCommandApdu)(nonce || (0, crypto_1.randomBytes)(32));
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        parsedResponse = (0, responses_1.parseIdentifyCardResponse)(response);
                        this.publicKey = parsedResponse.publicKey;
                        return [2 /*return*/, parsedResponse];
                }
            });
        }); };
        this.init = function (newPin) { return __awaiter(_this, void 0, void 0, function () {
            var pairingPrivateKey, pairingPublicKey, initSecrets, sharedSecret, initData, iv, encryptedData, data, command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isInitialised) {
                            throw new Error('Card is already initialised');
                        }
                        if (!this.pairingPublicKey) {
                            throw new Error('Card does not have public key. Try running select.');
                        }
                        pairingPrivateKey = secp256k1.utils.randomPrivateKey();
                        pairingPublicKey = secp256k1.getPublicKey(pairingPrivateKey);
                        initSecrets = (0, cryptography_utils_1.generateInitSecrets)();
                        sharedSecret = (0, cryptography_utils_1.generateSharedSecret)(pairingPrivateKey, this.pairingPublicKey);
                        initData = new Uint8Array(__spreadArray(__spreadArray([], __read((0, cryptography_utils_1.stringToBytes)(newPin)), false), __read(initSecrets.pairingToken), false));
                        iv = (0, cryptography_utils_1.generateRandomBytes)(16);
                        encryptedData = (0, cryptography_utils_1.encrypt)(initData, sharedSecret, iv);
                        data = new Uint8Array(__spreadArray(__spreadArray(__spreadArray([
                            pairingPublicKey.length
                        ], __read(pairingPublicKey), false), __read(iv), false), __read(encryptedData), false));
                        command = (0, commands_1.createInitCardCommandApdu)(data);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.select()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getFriendlyName = function () { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createGetFriendlyNameCommandApdu)();
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseGetFriendlyNameResponse)(response)];
                }
            });
        }); };
        this.unlock = function (pin) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createUnlockCommandApdu)(pin);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseUnlockResponse)(response)];
                }
            });
        }); };
        this.createPhonon = function (curveType) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createCreatePhononCommandApdu)(curveType);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseCreatePhononResponse)(response)];
                }
            });
        }); };
        this.destroyPhonon = function (keyIndex) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createDestroyPhononCommandApdu)(keyIndex);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseDestroyPhononResponse)(response)];
                }
            });
        }); };
        this.listPhonons = function () { return __awaiter(_this, void 0, void 0, function () {
            var phonons, getBatch;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        phonons = [];
                        getBatch = function (continuation) { return __awaiter(_this, void 0, void 0, function () {
                            var command, response, parsedResponse;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        command = (0, commands_1.createListPhononsCommandApdu)(continuation);
                                        return [4 /*yield*/, this.sendCommandInteral(command)];
                                    case 1:
                                        response = _a.sent();
                                        parsedResponse = (0, responses_1.parseListPhononsResponse)(response);
                                        phonons.push.apply(phonons, __spreadArray([], __read(parsedResponse.phonons), false));
                                        if (!parsedResponse.moreToLoad) return [3 /*break*/, 3];
                                        return [4 /*yield*/, getBatch(true)];
                                    case 2:
                                        _a.sent();
                                        _a.label = 3;
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, getBatch(false)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, phonons];
                }
            });
        }); };
        this.getPhononPublicKey = function (keyIndex) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createGetPhononPublicKeyCommandApdu)(keyIndex);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseGetPhononPublicKeyResponse)(response)];
                }
            });
        }); };
        this.setPhononDescription = function (keyIndex) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createGetPhononPublicKeyCommandApdu)(keyIndex);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseGetPhononPublicKeyResponse)(response)];
                }
            });
        }); };
        this.changePin = function (newPin) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createChangePinCommandApdu)(newPin);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseChangePinResponse)(response)];
                }
            });
        }); };
        this.changeFriendlyName = function (newName) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createChangeFriendlyNameCommandApdu)(newName);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseChangeFriendlyNameResponse)(response)];
                }
            });
        }); };
        this.cardPairStepOne = function (recipientsCardCert) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createPairSenderStepOneCommandApdu)((0, cryptography_utils_1.serialiseCertificate)(recipientsCardCert));
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parsePairStepOneTwoThreeResponse)(response)];
                }
            });
        }); };
        this.cardPairStepTwo = function (pairSenderStepOneData) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createPairRecipientStepOneCommandApdu)(pairSenderStepOneData);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parsePairStepOneTwoThreeResponse)(response)];
                }
            });
        }); };
        this.cardPairStepThree = function (pairRecipientStepOneData) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createPairSenderStepTwoCommandApdu)(pairRecipientStepOneData);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parsePairStepOneTwoThreeResponse)(response)];
                }
            });
        }); };
        this.cardPairStepFour = function (pairSenderStepTwoData) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createPairRecipientStepTwoCommandApdu)(pairSenderStepTwoData);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parsePairRecipientStepTwoResponse)(response)];
                }
            });
        }); };
        this.sendPhonons = function (keyIndicies) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createSendPhononsCommandApdu)(keyIndicies, false);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseSendPhononsResponse)(response)];
                }
            });
        }); };
        this.receivePhonons = function (transfer) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createReceivePhononsCommandApdu)(transfer);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parseReceivePhononsResponse)(response)];
                }
            });
        }); };
        this.openSecureConnection = function () { return __awaiter(_this, void 0, void 0, function () {
            var secureChannelPrivateKey, secureChannelPublicKey, secureChannelSharedSecret, clientSalt, pairingPrivateKey, pairingPublicKey, pairOneResponse, pairingSecret, verifyIdentifySignatureData, verifyIdentifySignatureDataHash, cryptogram, pairTwoResponse, openSecureChannelResponse, pairingKey, mutuallyAuthenticateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isInitialised || !this.pairingPublicKey) {
                            throw new Error('Card is not initalised');
                        }
                        secureChannelPrivateKey = secp256k1.utils.randomPrivateKey();
                        secureChannelPublicKey = secp256k1.getPublicKey(secureChannelPrivateKey);
                        secureChannelSharedSecret = (0, cryptography_utils_1.generateSharedSecret)(secureChannelPrivateKey, this.pairingPublicKey);
                        clientSalt = (0, cryptography_utils_1.generateRandomBytes)(32);
                        pairingPrivateKey = secp256k1.utils.randomPrivateKey();
                        pairingPublicKey = secp256k1.getPublicKey(pairingPrivateKey);
                        return [4 /*yield*/, this.pairStepOne(pairingPublicKey, clientSalt)];
                    case 1:
                        pairOneResponse = _a.sent();
                        pairingSecret = (0, cryptography_utils_1.generateSharedSecret)(pairingPrivateKey, pairOneResponse.cardIdentityCertificate.publicKey);
                        verifyIdentifySignatureData = Uint8Array.of.apply(Uint8Array, __spreadArray(__spreadArray([], __read(clientSalt), false), __read(pairingSecret), false));
                        return [4 /*yield*/, secp256k1.utils.sha256(verifyIdentifySignatureData)];
                    case 2:
                        verifyIdentifySignatureDataHash = _a.sent();
                        return [4 /*yield*/, (0, cryptography_utils_1.createPairStepTwoCryptogram)(pairOneResponse.pairingSalt, verifyIdentifySignatureDataHash)];
                    case 3:
                        cryptogram = _a.sent();
                        return [4 /*yield*/, this.pairStepTwo(cryptogram)];
                    case 4:
                        pairTwoResponse = _a.sent();
                        return [4 /*yield*/, this.openSecureChannel(pairTwoResponse.pairingIndex, secureChannelPublicKey)];
                    case 5:
                        openSecureChannelResponse = _a.sent();
                        return [4 /*yield*/, secp256k1.utils.sha256(new Uint8Array(__spreadArray(__spreadArray([], __read(pairTwoResponse.salt), false), __read(verifyIdentifySignatureDataHash), false)))];
                    case 6:
                        pairingKey = _a.sent();
                        this.sessionKeys = (0, cryptography_utils_1.deriveSessionKeys)(secureChannelSharedSecret, pairingKey, openSecureChannelResponse);
                        mutuallyAuthenticateData = (0, cryptography_utils_1.generateRandomBytes)(32);
                        return [4 /*yield*/, this.mutualAuthenticate(mutuallyAuthenticateData)];
                    case 7:
                        _a.sent();
                        this.certificate = pairOneResponse.cardIdentityCertificate;
                        this.pairingSignature = pairOneResponse.pairingSignature;
                        this.pairingSignatureData = verifyIdentifySignatureDataHash;
                        return [2 /*return*/];
                }
            });
        }); };
        this.verifyCard = function (caAuthorityCert) { return __awaiter(_this, void 0, void 0, function () {
            var certIsValid, signatureIsValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.certificate ||
                            !this.pairingSignature ||
                            !this.pairingSignatureData) {
                            throw new Error("Can't verify card before paring");
                        }
                        return [4 /*yield*/, (0, cryptography_utils_1.isCertificateValid)(this.certificate, caAuthorityCert)];
                    case 1:
                        certIsValid = _a.sent();
                        signatureIsValid = secp256k1.verify(this.pairingSignature, this.pairingSignatureData, this.certificate.publicKey, {
                            strict: false,
                        });
                        if (certIsValid && signatureIsValid) {
                            return [2 /*return*/, { valid: true }];
                        }
                        return [2 /*return*/, {
                                valid: false,
                                reason: {
                                    certIsValid: certIsValid,
                                    signatureIsValid: signatureIsValid,
                                },
                            }];
                }
            });
        }); };
        this.getPublicKey = function () {
            var _a;
            if (!_this.certificate && !_this.publicKey) {
                throw new Error("Can't get public key before running select or openSecureConnection");
            }
            return (((_a = _this.certificate) === null || _a === void 0 ? void 0 : _a.publicKey) || _this.publicKey);
        };
        this.getIsInitialised = function () {
            if (_this.isInitialised === undefined) {
                throw new Error("Can't determine if card is initialised before running select");
            }
            return _this.isInitialised;
        };
        this.getCertificate = function () {
            if (!_this.certificate) {
                throw new Error("Can't get certificate before running openSecureConnection");
            }
            return _this.certificate;
        };
        this.pairStepOne = function (publicKey, salt) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createPairStepOneCommandApdu)(publicKey, salt);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parsePairStepOneResponse)(response)];
                }
            });
        }); };
        this.pairStepTwo = function (cryptogram) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createPairStepTwoCommandApdu)(cryptogram);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, responses_1.parsePairStepTwoResponse)(response)];
                }
            });
        }); };
        this.openSecureChannel = function (pairingIndex, publicKey) { return __awaiter(_this, void 0, void 0, function () {
            var command, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createOpenSecureChannelCommandApdu)(pairingIndex, publicKey);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        }); };
        this.mutualAuthenticate = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        command = (0, commands_1.createMutualAuthenticateCommandApdu)(data);
                        return [4 /*yield*/, this.sendCommandInteral(command)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.sendCommandInteral = function (command) {
            return _this.queue(function () { return _this._sendCommandInteral(command); });
        };
        this._sendCommandInteral = function (command) { return __awaiter(_this, void 0, void 0, function () {
            var _a, encryptedCommand, iv_1, response, _b, plainTextData, iv;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.sessionKeys) {
                            _a = (0, cryptography_utils_1.encryptCommandApdu)(command, this.sessionKeys), encryptedCommand = _a.command, iv_1 = _a.iv;
                            this.sessionKeys = __assign(__assign({}, this.sessionKeys), { iv: iv_1 });
                            command = encryptedCommand;
                        }
                        return [4 /*yield*/, this.sendCommand(command)];
                    case 1:
                        response = _c.sent();
                        if (!this.sessionKeys) {
                            return [2 /*return*/, response];
                        }
                        _b = (0, cryptography_utils_1.decryptResponseData)(response.data, this.sessionKeys), plainTextData = _b.plainTextData, iv = _b.iv;
                        this.sessionKeys = __assign(__assign({}, this.sessionKeys), { iv: iv });
                        return [2 /*return*/, (0, cryptography_utils_1.parseResponse)(plainTextData)];
                }
            });
        }); };
    }
    return PhononCard;
}());
exports.default = PhononCard;
