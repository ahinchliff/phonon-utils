import { CommandApdu, EncryptedResponseApduData, ResponseApdu } from '../apdu/apdu-types';
import { CardCertificate, CurveType } from '../types';
export declare type SessionKeys = {
    encryptionKey: Uint8Array;
    macKey: Uint8Array;
    iv: Uint8Array;
};
export declare type EncryptCommandApduResult = {
    command: CommandApdu;
    iv: Uint8Array;
};
export declare type DecryptResponseApduResult = {
    plainTextData: Uint8Array;
    iv: Uint8Array;
};
export declare const generateRandomBytes: (length: number) => Uint8Array;
export declare const generateInitSecrets: () => {
    pairingPassword: string;
    puk: string;
    pin: string;
    pairingToken: Uint8Array;
};
export declare const appendPaddingToData: (blockSize: number, data: Uint8Array) => Uint8Array;
export declare const removePaddingFromData: (blockSize: number, data: Uint8Array) => Uint8Array;
export declare const createEmptyData: (length: number) => Uint8Array;
export declare const deriveSessionKeys: (secureChannelSharedSecret: Uint8Array, pairingKey: Uint8Array, openSecureChannelCardResponse: Uint8Array) => SessionKeys;
export declare const encrypt: (data: Uint8Array, encryptionKey: Uint8Array, iv: Uint8Array) => Uint8Array;
export declare const decrypt: (responseData: Uint8Array, secureChannelEncryptionKey: Uint8Array, secureChannelIv: Uint8Array) => Uint8Array;
export declare const createPairStepTwoCryptogram: (pairingSalt: Uint8Array, sigDataHash: Uint8Array) => Promise<Uint8Array>;
export declare const calculateMac: (meta: Uint8Array, encryptedApduData: Uint8Array, macKey: Uint8Array) => Uint8Array;
export declare const createMeta: (command: CommandApdu, encryptedData: Uint8Array) => Uint8Array;
export declare const generateSharedSecret: (privateKey: Uint8Array, cardPublicKey: Uint8Array) => Uint8Array;
export declare const parseEncryptedResponseData: (responseData: Uint8Array, secureChannelIv: Uint8Array) => EncryptedResponseApduData;
export declare const encryptCommandApdu: (command: CommandApdu, sessionKeys: SessionKeys) => EncryptCommandApduResult;
export declare const decryptResponseData: (responseData: Uint8Array, sessionKeys: SessionKeys) => DecryptResponseApduResult;
export declare const stringToBytes: (value: string) => Uint8Array;
export declare const bytesToNumber: (Uint8Array: Uint8Array) => number;
export declare const numberToBytes: (num: number) => Uint8Array;
export declare const parseResponse: (decryptedResponseData: Uint8Array) => ResponseApdu;
export declare const serialiseCertificate: (cert: CardCertificate) => Uint8Array;
export declare const digestCertificate: (cert: CardCertificate) => Uint8Array;
export declare const isCertificateValid: (cert: CardCertificate, certAuthorityPublicKey: Uint8Array) => Promise<boolean>;
export declare const curveNameToCurveCode: (curve: CurveType) => number | undefined;
