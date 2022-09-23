declare type TLV = {
    tag: number;
    value: Uint8Array;
};
export default class TLVCollection {
    tlvs: TLV[];
    constructor(bytes: Uint8Array);
    getValues: (tag: number) => Uint8Array[];
    getValue: (tag: number) => Uint8Array;
}
export declare const encodeTlv: (tlv: TLV) => Uint8Array;
export {};
