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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
var smartcard = __importStar(require("smartcard"));
var adapters_1 = require("./adapters");
var PhononCard_1 = __importDefault(require("./PhononCard"));
var RemotePairing_1 = __importDefault(require("./RemotePairing"));
var devicesEvents = new smartcard.Devices();
var util = require('util');
util.inspect.defaultOptions.maxArrayLength = null;
devicesEvents.on('device-activated', function (event) {
    event.device.on('card-inserted', function (event) {
        onCardDetected(event);
    });
    event.device.on('card-removed', function (event) {
        console.log('Card removed');
    });
});
var phononCards = [];
var testCardPairing = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sender, recipient, beforeSenderPhonons, beforeRecipientPhonons, senderStep1Response, recipientStep1Response, senderStep2Response, sendResponse, receiveResponse, afterSenderPhonons, afterRecipientPhonons, sendResponse2, receiveResponse2, afterSenderPhonons2, afterRecipientPhonons2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sender = phononCards[1];
                recipient = phononCards[0];
                if (!sender || !recipient) {
                    console.log('Waiting for both cards to connect');
                    return [2 /*return*/];
                }
                console.log('Both cards connected');
                return [4 /*yield*/, sender.createPhonon('secp256k1')];
            case 1:
                _a.sent();
                return [4 /*yield*/, sender.listPhonons()];
            case 2:
                beforeSenderPhonons = _a.sent();
                return [4 /*yield*/, recipient.listPhonons()];
            case 3:
                beforeRecipientPhonons = _a.sent();
                console.log('before sender phonons', beforeSenderPhonons);
                console.log('before recipient phonons', beforeRecipientPhonons);
                return [4 /*yield*/, sender.cardPairStepOne(recipient.getCertificate())];
            case 4:
                senderStep1Response = _a.sent();
                if (senderStep1Response.success === false) {
                    throw senderStep1Response.error;
                }
                return [4 /*yield*/, recipient.cardPairStepTwo(senderStep1Response.data.pairingData)];
            case 5:
                recipientStep1Response = _a.sent();
                if (recipientStep1Response.success === false) {
                    throw recipientStep1Response.error;
                }
                return [4 /*yield*/, sender.cardPairStepThree(recipientStep1Response.data.pairingData)];
            case 6:
                senderStep2Response = _a.sent();
                if (senderStep2Response.success === false) {
                    throw senderStep2Response.error;
                }
                return [4 /*yield*/, recipient.cardPairStepFour(senderStep2Response.data.pairingData)];
            case 7:
                _a.sent();
                return [4 /*yield*/, sender.sendPhonons([1])];
            case 8:
                sendResponse = _a.sent();
                if (sendResponse.success === false) {
                    throw sendResponse.error;
                }
                return [4 /*yield*/, recipient.receivePhonons(sendResponse.data.transferPackets)];
            case 9:
                receiveResponse = _a.sent();
                if (receiveResponse.success === false) {
                    throw receiveResponse.error;
                }
                return [4 /*yield*/, sender.listPhonons()];
            case 10:
                afterSenderPhonons = _a.sent();
                return [4 /*yield*/, recipient.listPhonons()];
            case 11:
                afterRecipientPhonons = _a.sent();
                console.log('after sender phonons', afterSenderPhonons);
                console.log('after recipient phonons', afterRecipientPhonons);
                return [4 /*yield*/, recipient.sendPhonons([1])];
            case 12:
                sendResponse2 = _a.sent();
                if (sendResponse2.success === false) {
                    throw sendResponse2.error;
                }
                return [4 /*yield*/, sender.receivePhonons(sendResponse2.data.transferPackets)];
            case 13:
                receiveResponse2 = _a.sent();
                if (receiveResponse2.success === false) {
                    throw receiveResponse2.error;
                }
                return [4 /*yield*/, sender.listPhonons()];
            case 14:
                afterSenderPhonons2 = _a.sent();
                return [4 /*yield*/, recipient.listPhonons()];
            case 15:
                afterRecipientPhonons2 = _a.sent();
                console.log('after sender phonons', afterSenderPhonons2);
                console.log('after recipient phonons', afterRecipientPhonons2);
                return [2 /*return*/];
        }
    });
}); };
var testRemotePairing = function () { return __awaiter(void 0, void 0, void 0, function () {
    var sender, recipient, senderRemotePairing, recipientRemotePairing, beforeSenderPhonons, beforeRecipientPhonons;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sender = phononCards[0];
                recipient = phononCards[1];
                if (!sender || !recipient) {
                    console.log('Waiting for both cards to connect');
                    return [2 /*return*/];
                }
                console.log('Both cards connected');
                senderRemotePairing = new RemotePairing_1.default(sender, 'http://localhost:3001', { onStatusChange: function (newStatus) { return console.log('sender', newStatus); } });
                recipientRemotePairing = new RemotePairing_1.default(recipient, 'http://localhost:3001', { onStatusChange: function (newStatus) { return console.log('recipient', newStatus); } });
                return [4 /*yield*/, Promise.all([
                        senderRemotePairing.pair('abc123'),
                        recipientRemotePairing.pair('abc123'),
                    ])];
            case 1:
                _a.sent();
                console.log('Cards paired');
                return [4 /*yield*/, sender.listPhonons()];
            case 2:
                beforeSenderPhonons = _a.sent();
                return [4 /*yield*/, recipient.listPhonons()];
            case 3:
                beforeRecipientPhonons = _a.sent();
                console.log('before sender phonons', beforeSenderPhonons);
                console.log('before recipient phonons', beforeRecipientPhonons);
                return [4 /*yield*/, senderRemotePairing.sendPhonons([1])];
            case 4:
                _a.sent();
                senderRemotePairing.unpair();
                return [2 /*return*/];
        }
    });
}); };
var onCardDetected = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var sendCommand, card;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Card inserted');
                sendCommand = (0, adapters_1.createSendCommand)(event.card);
                card = new PhononCard_1.default(sendCommand);
                return [4 /*yield*/, card.select()];
            case 1:
                _a.sent();
                if (!card.getIsInitialised()) {
                    console.log('card not initialised');
                }
                return [4 /*yield*/, card.unlock('111111')];
            case 2:
                _a.sent();
                return [4 /*yield*/, card.openSecureConnection()];
            case 3:
                _a.sent();
                console.log(card.getPublicKey());
                // await testCardPairing();
                return [4 /*yield*/, testRemotePairing()];
            case 4:
                // await testCardPairing();
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
