import { CommandApdu, ResponseApdu } from './apdu/apdu-types';
import { CreatePhononResponse, DestroyPhononResponse, GetPhononPublicKeyResponse, UnlockResponse, ChangePinResponse, ChangeFriendlyNameResponse, PairStepOneTwoThreeResponse, PairStepRecipientStepTwoResponse, SendPhononsResponse, ReceivePhononsResponse } from './apdu/responses';
import { CardCertificate, CurveType, Phonon } from './types';
export default class PhononCard {
    private sendCommand;
    private cardCertificate;
    private sessionKeys;
    private pairingSignature;
    private verifyIdentitySignatureDataHash;
    constructor(sendCommand: (command: CommandApdu) => Promise<ResponseApdu>);
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
    pair: () => Promise<void>;
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
    getCertificate: () => CardCertificate;
    private selectPhononApplet;
    private pairStepOne;
    private pairStepTwo;
    private openSecureChannel;
    private mutualAuthenticate;
    private sendCommandInternal;
}
