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
var socket_io_client_1 = require("socket.io-client");
var RemotePairing = /** @class */ (function () {
    function RemotePairing(card, apiUrl, events) {
        var _this = this;
        this.card = card;
        this.apiUrl = apiUrl;
        this.events = events;
        this.status = 'disconnected';
        this.pair = function (pairingId) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.socket = (0, socket_io_client_1.io)(this.apiUrl);
                this.socket.on('connect', function () {
                    _this.socket.emit('JOIN_PAIRING', pairingId);
                });
                this.socket.on('COUNTER_PARTY_CONNECTED', this.onCounterpartyConnected(this.socket));
                this.socket.on('PAIR_STEP_ONE', this.onPairStepOne(this.socket));
                this.socket.on('PAIR_STEP_TWO', this.onPairStepTwo(this.socket));
                this.socket.on('PAIR_STEP_THREE', this.onPairStepThree(this.socket));
                this.socket.on('PAIR_STEP_FOUR', this.onPairStepFour(this.socket));
                this.socket.on('PAIRED', this.onPaired);
                this.socket.on('TRANSFER_PHONON', this.onReceivePhonon(this.socket));
                this.socket.on('PHONON_TRANSFER_SUCCESS', this.onPhononTransferSuccess);
                this.socket.on('UNPAIR', this.unpair);
                this.socket.on('disconnect', this.onDisconnect);
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.socket.on('PAIRED', function () {
                            resolve();
                        });
                    })];
            });
        }); };
        this.sendPhonons = function (keyIndicies) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.status !== 'paired' || !this.socket) {
                            return [2 /*return*/, console.error('Need to be paired to send phonon')];
                        }
                        return [4 /*yield*/, this.card.sendPhonons(keyIndicies)];
                    case 1:
                        result = _a.sent();
                        if (result.success === false) {
                            // handle error
                            return [2 /*return*/];
                        }
                        this.socket.emit('TRANSFER_PHONON', serialiseData(result.data.transferPackets));
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.socket.on('PHONON_TRANSFER_SUCCESS', function () {
                                    resolve();
                                });
                            })];
                }
            });
        }); };
        this.unpair = function () {
            var _a, _b;
            (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.emit('UNPAIR');
            (_b = _this.socket) === null || _b === void 0 ? void 0 : _b.disconnect();
            _this.status == 'disconnected';
        };
        this.onDisconnect = function () {
            var _a, _b;
            console.log('disconnected');
            _this.status == 'disconnected';
            (_b = (_a = _this.events) === null || _a === void 0 ? void 0 : _a.onUnpair) === null || _b === void 0 ? void 0 : _b.call(_a);
        };
        this.onCounterpartyConnected = function (socket) {
            return function (shouldSendCardCert) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.setStatus('pairing_step_1');
                    if (shouldSendCardCert) {
                        socket.emit('PAIR_STEP_ONE', serialiseCert(this.card.getCertificate()));
                    }
                    return [2 /*return*/];
                });
            }); };
        };
        this.onPairStepOne = function (socket) {
            return function (cardCert) { return __awaiter(_this, void 0, void 0, function () {
                var cert, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            cert = JSON.parse(cardCert);
                            return [4 /*yield*/, this.card.cardPairStepOne(cert)];
                        case 1:
                            result = _a.sent();
                            if (result.success === false) {
                                // handle error
                                return [2 /*return*/];
                            }
                            socket.emit('PAIR_STEP_TWO', serialiseData(result.data.pairingData));
                            this.setStatus('pairing_step_2');
                            return [2 /*return*/];
                    }
                });
            }); };
        };
        this.onPairStepTwo = function (socket) {
            return function (pairingData) { return __awaiter(_this, void 0, void 0, function () {
                var data, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setStatus('pairing_step_2');
                            data = JSON.parse(pairingData);
                            return [4 /*yield*/, this.card.cardPairStepTwo(data)];
                        case 1:
                            result = _a.sent();
                            if (result.success === false) {
                                // handle error
                                return [2 /*return*/];
                            }
                            socket.emit('PAIR_STEP_THREE', serialiseData(result.data.pairingData));
                            this.setStatus('pairing_step_3');
                            return [2 /*return*/];
                    }
                });
            }); };
        };
        this.onPairStepThree = function (socket) {
            return function (pairingData) { return __awaiter(_this, void 0, void 0, function () {
                var data, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setStatus('pairing_step_3');
                            data = JSON.parse(pairingData);
                            return [4 /*yield*/, this.card.cardPairStepThree(data)];
                        case 1:
                            result = _a.sent();
                            if (result.success === false) {
                                // handle error
                                return [2 /*return*/];
                            }
                            socket.emit('PAIR_STEP_FOUR', serialiseData(result.data.pairingData));
                            this.setStatus('pairing_step_4');
                            return [2 /*return*/];
                    }
                });
            }); };
        };
        this.onPairStepFour = function (socket) {
            return function (pairingData) { return __awaiter(_this, void 0, void 0, function () {
                var data, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.setStatus('pairing_step_4');
                            data = JSON.parse(pairingData);
                            return [4 /*yield*/, this.card.cardPairStepFour(data)];
                        case 1:
                            result = _a.sent();
                            if (result.success === false) {
                                // handle error
                                return [2 /*return*/];
                            }
                            socket.emit('PAIRED');
                            return [2 /*return*/];
                    }
                });
            }); };
        };
        this.onPaired = function () {
            _this.setStatus('paired');
        };
        this.onReceivePhonon = function (socket) {
            return function (transferPacket) { return __awaiter(_this, void 0, void 0, function () {
                var data, result;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            data = JSON.parse(transferPacket);
                            return [4 /*yield*/, this.card.receivePhonons(data)];
                        case 1:
                            result = _c.sent();
                            if (result.success === false) {
                                // handle error
                                return [2 /*return*/];
                            }
                            socket.emit('PHONON_TRANSFER_SUCCESS');
                            (_b = (_a = this.events) === null || _a === void 0 ? void 0 : _a.onPhononReceived) === null || _b === void 0 ? void 0 : _b.call(_a);
                            return [2 /*return*/];
                    }
                });
            }); };
        };
        this.onPhononTransferSuccess = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                (_b = (_a = this.events) === null || _a === void 0 ? void 0 : _a.onPhononTransferSuccess) === null || _b === void 0 ? void 0 : _b.call(_a);
                return [2 /*return*/];
            });
        }); };
        this.setStatus = function (newStatus) {
            var _a, _b;
            _this.status = newStatus;
            (_b = (_a = _this.events) === null || _a === void 0 ? void 0 : _a.onStatusChange) === null || _b === void 0 ? void 0 : _b.call(_a, newStatus);
        };
    }
    return RemotePairing;
}());
exports.default = RemotePairing;
var serialiseCert = function (cert) {
    return JSON.stringify({
        permissions: __assign(__assign({}, cert.permissions), { permissions: __spreadArray([], __read(cert.permissions.permissions), false) }),
        signature: __spreadArray([], __read(cert.signature), false),
        publicKey: __spreadArray([], __read(cert.publicKey), false),
    });
};
var serialiseData = function (data) { return JSON.stringify(__spreadArray([], __read(data), false)); };
