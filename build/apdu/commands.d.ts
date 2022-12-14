import { CurveType } from '../types';
import { CommandApdu } from './apdu-types';
export declare const createSelectPhononCommandApdu: () => CommandApdu;
export declare const createPairStepOneCommandApdu: (publicKey: Uint8Array, salt: Uint8Array) => CommandApdu;
export declare const createPairStepTwoCommandApdu: (cryptogram: Uint8Array) => CommandApdu;
export declare const createOpenSecureChannelCommandApdu: (pairingIndex: number, publicKey: Uint8Array) => CommandApdu;
export declare const createMutualAuthenticateCommandApdu: (data: Uint8Array) => CommandApdu;
export declare const createUnlockCommandApdu: (pin: string) => CommandApdu;
export declare const createGetFriendlyNameCommandApdu: () => CommandApdu;
export declare const createCreatePhononCommandApdu: (curveType: CurveType) => CommandApdu;
export declare const createDestroyPhononCommandApdu: (keyIndex: number) => CommandApdu;
export declare const createListPhononsCommandApdu: (continuation: boolean) => CommandApdu;
export declare const createGetPhononPublicKeyCommandApdu: (keyIndex: number) => CommandApdu;
export declare const createChangePinCommandApdu: (newPin: string) => CommandApdu;
export declare const createChangeFriendlyNameCommandApdu: (newName: string) => CommandApdu;
export declare const createPairSenderStepOneCommandApdu: (receivingCardsCert: Uint8Array) => CommandApdu;
export declare const createPairRecipientStepOneCommandApdu: (pairSenderOneData: Uint8Array) => CommandApdu;
export declare const createPairSenderStepTwoCommandApdu: (pairRecipientOneData: Uint8Array) => CommandApdu;
export declare const createPairRecipientStepTwoCommandApdu: (pairSenderTwoData: Uint8Array) => CommandApdu;
export declare const createSendPhononsCommandApdu: (keyIndices: number[], extendedRequest: boolean) => CommandApdu;
export declare const createReceivePhononsCommandApdu: (phononTransfer: Uint8Array) => CommandApdu;
export declare const createInitCardCommandApdu: (data: Uint8Array) => CommandApdu;
export declare const createIdentifyCardCommandApdu: (nonce: Uint8Array) => CommandApdu;
