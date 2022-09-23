import { CardCertificate, Phonon } from '../types';
import { ResponseApdu } from './apdu-types';
export declare type ParseResponse<SuccessData, ErrorData> = {
    success: true;
    data: SuccessData;
} | {
    success: false;
    error: ErrorData;
};
export declare type UnknownError = {
    code: 'UNKNOWN';
    data: {};
};
export declare type UnlockError = {
    code: 'INCORRECT_PIN';
    data: {
        triesRemaining: number;
    };
};
export declare type UnlockResponse = ParseResponse<{}, UnlockError>;
export declare type SelectPhononFileResponse = {
    initialised: boolean;
    uuid: Uint8Array;
    publicKey: Uint8Array;
};
export declare type PairStepOneResponse = {
    cardIdentityCertificate: CardCertificate;
    pairingSalt: Uint8Array;
    pairingSignature: Uint8Array;
};
export declare type PairStepTwoResponse = {
    pairingIndex: number;
    salt: Uint8Array;
};
export declare type CreatePhononResponse = {
    keyIndex: number;
    publicKey: Uint8Array;
};
export declare type DestroyPhononResponse = {
    privateKey: Uint8Array;
};
export declare type ListPhononsResponse = {
    moreToLoad: boolean;
    phonons: Phonon[];
};
export declare type GetPhononPublicKeyResponse = {
    publicKey: Uint8Array;
};
export declare type ChangeFriendlyNameResponse = ParseResponse<{}, UnknownError>;
export declare type ChangePinResponse = ParseResponse<{}, UnknownError>;
export declare type PairStepOneTwoThreeResponse = ParseResponse<{
    pairingData: Uint8Array;
}, UnknownError>;
export declare type PairStepRecipientStepTwoResponse = ParseResponse<{}, UnknownError>;
export declare type SendPhononsResponse = ParseResponse<{
    transferPackets: Uint8Array;
}, UnknownError>;
export declare type ReceivePhononsResponse = ParseResponse<{}, UnknownError>;
export declare const parseSelectPhononAppletResponse: (responseApdu: ResponseApdu) => SelectPhononFileResponse;
export declare const parsePairStepOneResponse: (responseApdu: ResponseApdu) => PairStepOneResponse;
export declare const parsePairStepTwoResponse: (responseApdu: ResponseApdu) => PairStepTwoResponse;
export declare const parseUnlockResponse: (responseApdu: ResponseApdu) => UnlockResponse;
export declare const parseGetFriendlyNameResponse: (responseApdu: ResponseApdu) => string | undefined;
export declare const parseCreatePhononResponse: (responseApdu: ResponseApdu) => CreatePhononResponse;
export declare const parseDestroyPhononResponse: (responseApdu: ResponseApdu) => DestroyPhononResponse;
export declare const parseListPhononsResponse: (responseApdu: ResponseApdu) => ListPhononsResponse;
export declare const parseGetPhononPublicKeyResponse: (responseApdu: ResponseApdu) => GetPhononPublicKeyResponse;
export declare const parseChangePinResponse: (responseApdu: ResponseApdu) => ChangePinResponse;
export declare const parseChangeFriendlyNameResponse: (responseApdu: ResponseApdu) => ChangeFriendlyNameResponse;
export declare const parsePairStepOneTwoThreeResponse: (responseApdu: ResponseApdu) => PairStepOneTwoThreeResponse;
export declare const parsePairRecipientStepTwoResponse: (responseApdu: ResponseApdu) => PairStepRecipientStepTwoResponse;
export declare const parseSendPhononsResponse: (responseApdu: ResponseApdu) => SendPhononsResponse;
export declare const parseReceivePhononsResponse: (responseApdu: ResponseApdu) => ReceivePhononsResponse;
