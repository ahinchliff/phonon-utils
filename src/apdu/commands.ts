import { CurveType } from '../types';
import {
  curveNameToCurveCode,
  numberToBytes,
  stringToBytes,
} from '../utils/cryptography-utils';
import { encodeTlv } from '../utils/TLV';
import { CommandApdu } from './apdu-types';

export const createSelectPhononCommandApdu = (): CommandApdu => ({
  cla: 0,
  ins: 164,
  p1: 4,
  p2: 0,
  data: new Uint8Array([160, 0, 0, 8, 32, 0, 3, 1]),
});

export const createPairStepOneCommandApdu = (
  publicKey: Uint8Array,
  salt: Uint8Array
): CommandApdu => ({
  cla: 128,
  ins: 18,
  p1: 0,
  p2: 0,
  data: new Uint8Array([...salt, 128, publicKey.length, ...publicKey]),
});

export const createPairStepTwoCommandApdu = (
  cryptogram: Uint8Array
): CommandApdu => ({
  cla: 128,
  ins: 18,
  p1: 1,
  p2: 0,
  data: cryptogram,
});

export const createOpenSecureChannelCommandApdu = (
  pairingIndex: number,
  publicKey: Uint8Array
): CommandApdu => ({
  cla: 128,
  ins: 16,
  p1: pairingIndex,
  p2: 0,
  data: publicKey,
});

export const createMutualAuthenticateCommandApdu = (
  data: Uint8Array
): CommandApdu => ({
  cla: 128,
  ins: 17,
  p1: 0,
  p2: 0,
  data,
});

export const createUnlockCommandApdu = (pin: string): CommandApdu => ({
  cla: 128,
  ins: 32,
  p1: 0,
  p2: 0,
  data: stringToBytes(pin),
});

export const createGetFriendlyNameCommandApud = (): CommandApdu => ({
  cla: 128,
  ins: 87,
  p1: 0,
  p2: 0,
  data: new Uint8Array([0]),
});

export const createCreatePhononCommandApdu = (
  curveType: CurveType
): CommandApdu => {
  const curveCode = curveNameToCurveCode(curveType);

  if (!curveCode) {
    throw new Error(`Could not find curve code for curve type "${curveType}"`);
  }

  return {
    cla: 0,
    ins: 48,
    p1: curveCode,
    p2: 0,
    data: new Uint8Array([0]),
  };
};

export const createDestroyPhononCommandApdu = (
  keyIndex: number
): CommandApdu => {
  const data = encodeTlv({ tag: 65, value: numberToBytes(keyIndex) });
  return {
    cla: 0,
    ins: 52,
    p1: 0,
    p2: 0,
    data: data,
  };
};

// todo - allow user to filter
export const createListPhononsCommandApdu = (
  continuation: boolean
): CommandApdu => {
  return {
    cla: 0,
    ins: 50,
    p1: continuation ? 1 : 0,
    p2: 0,
    // hardcoded to fetch all phonons
    data: new Uint8Array([
      96, 24, 130, 2, 0, 0, 132, 8, 0, 0, 0, 0, 0, 0, 0, 0, 133, 8, 0, 0, 0, 0,
      0, 0, 0, 0,
    ]),
  };
};

export const createGetPhononPublicKeyCommandApdu = (
  keyIndex: number
): CommandApdu => {
  const data = encodeTlv({ tag: 65, value: numberToBytes(keyIndex) });
  return {
    cla: 0,
    ins: 51,
    p1: 0,
    p2: 0,
    data,
  };
};

export const createChangePinCommandApud = (newPin: string): CommandApdu => {
  return {
    cla: 128,
    ins: 33,
    p1: 0,
    p2: 0,
    data: stringToBytes(newPin),
  };
};

export const createChangeFriendlyNameCommandApdu = (
  newName: string
): CommandApdu => {
  return {
    cla: 128,
    ins: 86,
    p1: 0,
    p2: 0,
    data: stringToBytes(newName),
  };
};

export const createPairSenderStepOneCommandApdu = (
  receivingCardsCert: Uint8Array
): CommandApdu => {
  const data = encodeTlv({ tag: 144, value: receivingCardsCert });
  return {
    cla: 128,
    ins: 80,
    p1: 0,
    p2: 0,
    data,
  };
};

export const createPairRecipientStepOneCommandApdu = (
  pairSenderOneData: Uint8Array
): CommandApdu => {
  return {
    cla: 128,
    ins: 81,
    p1: 0,
    p2: 0,
    data: pairSenderOneData,
  };
};

export const createPairSenderStepTwoCommandApdu = (
  pairRecipientOneData: Uint8Array
): CommandApdu => {
  return {
    cla: 128,
    ins: 82,
    p1: 0,
    p2: 0,
    data: pairRecipientOneData,
  };
};

export const createPairRecipientStepTwoCommandApdu = (
  pairSenderTwoData: Uint8Array
): CommandApdu => {
  return {
    cla: 128,
    ins: 83,
    p1: 0,
    p2: 0,
    data: pairSenderTwoData,
  };
};

export const createSendPhononsCommandApud = (
  keyIndices: number[],
  extendedRequest: boolean
): CommandApdu => {
  const keyIndiciesBytes = keyIndices.reduce(
    (progress, keyIndex) =>
      new Uint8Array([...progress, ...numberToBytes(keyIndex)]),
    new Uint8Array()
  );

  const data = encodeTlv({ tag: 66, value: keyIndiciesBytes });

  return {
    cla: 0,
    ins: 53,
    p1: extendedRequest ? 1 : 0,
    p2: keyIndices.length,
    data,
  };
};

export const createReceivePhononsCommandApud = (
  phononTransfer: Uint8Array
): CommandApdu => {
  return {
    cla: 0,
    ins: 54,
    p1: 0,
    p2: 0,
    data: phononTransfer,
  };
};
