import { CommandApdu, ResponseApdu } from './apdu/apdu-types';
import { CreatePhononResponse, DestroyPhononResponse, GetPhononPublicKeyResponse, UnlockResponse, ChangePinResponse, ChangeFriendlyNameResponse, PairStepOneTwoThreeResponse, PairStepRecipientStepTwoResponse, SendPhononsResponse, ReceivePhononsResponse, IdentifyCardResponse } from './apdu/responses';
import { CardCertificate, CurveType, Phonon } from './types';
export default class PhononCard {
    private sendCommand;
    private queue;
    private isInitialised;
    private publicKey;
    private pairingPublicKey;
    private certificate;
    private sessionKeys;
    private pairingSignature;
    private pairingSignatureData;
    constructor(sendCommand: (command: CommandApdu) => Promise<ResponseApdu>);
    select: () => Promise<void>;
    identifyCard: (nonce?: Uint8Array | undefined) => Promise<IdentifyCardResponse>;
    init: (newPin: string) => Promise<void>;
    getFriendlyName: () => Promise<string | undefined>;
    unlock: (pin: string) => Promise<UnlockResponse>;
    createPhonon: (curveType: CurveType) => Promise<CreatePhononResponse>;
    destroyPhonon: (keyIndex: number) => Promise<DestroyPhononResponse>;
    listPhonons: () => Promise<Phonon[]>;
    getPhononPublicKey: (keyIndex: number) => Promise<GetPhononPublicKeyResponse>;
    setPhononDescription: (keyIndex: number) => Promise<GetPhononPublicKeyResponse>;
    changePin: (newPin: string) => Promise<ChangePinResponse>;
    changeFriendlyName: (newName: string) => Promise<ChangeFriendlyNameResponse>;
    cardPairStepOne: (recipientsCardCert: CardCertificate) => Promise<PairStepOneTwoThreeResponse>;
    cardPairStepTwo: (pairSenderStepOneData: Uint8Array) => Promise<PairStepOneTwoThreeResponse>;
    cardPairStepThree: (pairRecipientStepOneData: Uint8Array) => Promise<PairStepOneTwoThreeResponse>;
    cardPairStepFour: (pairSenderStepTwoData: Uint8Array) => Promise<PairStepRecipientStepTwoResponse>;
    sendPhonons: (keyIndicies: number[]) => Promise<SendPhononsResponse>;
    receivePhonons: (transfer: Uint8Array) => Promise<ReceivePhononsResponse>;
    openSecureConnection: () => Promise<void>;
    verifyCard: (caAuthorityCert: Uint8Array) => Promise<{
        valid: boolean;
        reason?: undefined;
    } | {
        valid: boolean;
        reason: {
            certIsValid: boolean;
            signatureIsValid: boolean;
        };
    }>;
    getPublicKey: () => Uint8Array;
    getIsInitialised: () => boolean;
    getCertificate: () => CardCertificate;
    private pairStepOne;
    private pairStepTwo;
    private openSecureChannel;
    private mutualAuthenticate;
    private sendCommandInteral;
    private _sendCommandInteral;
}
