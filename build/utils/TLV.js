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
exports.encodeTlv = void 0;
var TLVCollection = /** @class */ (function () {
    function TLVCollection(bytes) {
        var _this = this;
        this.getValues = function (tag) {
            return _this.tlvs.filter(function (tlv) { return tlv.tag === tag; }).map(function (tvl) { return tvl.value; });
        };
        this.getValue = function (tag) {
            var value = _this.getValues(tag)[0];
            if (!value) {
                throw new Error("No tag found: ".concat(tag));
            }
            return value;
        };
        var index = 0;
        var results = [];
        while (index < bytes.length) {
            var tag = bytes[index];
            var length_1 = bytes[index + 1];
            var dataEndingIndex = index + 2 + length_1;
            var value = bytes.slice(index + 2, dataEndingIndex);
            results.push({ tag: tag, value: value });
            index = dataEndingIndex;
        }
        this.tlvs = results;
    }
    return TLVCollection;
}());
exports.default = TLVCollection;
var encodeTlv = function (tlv) {
    return new Uint8Array(__spreadArray([tlv.tag, tlv.value.length], __read(tlv.value), false));
};
exports.encodeTlv = encodeTlv;
