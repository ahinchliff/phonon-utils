export declare type CardCertificate = {
    permissions: {
        certType: number;
        certLen: number;
        permType: number;
        permLen: number;
        permissions: Uint8Array;
        pubKeyType: number;
        pubKeyLen: number;
    };
    publicKey: Uint8Array;
    signature: Uint8Array;
};
export declare type CurveType = 'secp256k1' | 'native';
export declare type Phonon = {
    keyIndex: number;
    curveType: CurveType;
};
