import { CURVE_TYPE_CODE_TO_NAME_MAP } from '../constants';
import { CardCertificate, Phonon } from '../types';
import { bytesToNumber } from '../utils/cryptography-utils';
import TLVCollection from '../utils/TLV';
import { ResponseApdu } from './apdu-types';

const SW_SUCCESS = 36864;
// const SW_DATA_INVALID = 27012;

export type ParseResponse<SuccessData, ErrorData> =
  | {
      success: true;
      data: SuccessData;
    }
  | { success: false; error: ErrorData };

export type UnknownError = {
  code: 'UNKNOWN';
  data: {};
};

export type UnlockError = {
  code: 'INCORRECT_PIN';
  data: { triesRemaining: number };
};

export type UnlockResponse = ParseResponse<{}, UnlockError>;

export type SelectPhononFileResponse = {
  initialised: boolean;
  uuid: Uint8Array;
  publicKey: Uint8Array;
};

export type PairStepOneResponse = {
  cardIdentityCertificate: CardCertificate;
  pairingSalt: Uint8Array;
  pairingSignature: Uint8Array;
};

export type PairStepTwoResponse = {
  pairingIndex: number;
  salt: Uint8Array;
};

export type CreatePhononResponse = { keyIndex: number; publicKey: Uint8Array };

export type DestroyPhononResponse = { privateKey: Uint8Array };

export type ListPhononsResponse = {
  moreToLoad: boolean;
  phonons: Phonon[];
};

export type GetPhononPublicKeyResponse = {
  publicKey: Uint8Array;
};

export type ChangeFriendlyNameResponse = ParseResponse<{}, UnknownError>;
export type ChangePinResponse = ParseResponse<{}, UnknownError>;

export type PairStepOneTwoThreeResponse = ParseResponse<
  { pairingData: Uint8Array },
  UnknownError
>;

export type PairStepRecipientStepTwoResponse = ParseResponse<{}, UnknownError>;

export type SendPhononsResponse = ParseResponse<
  {
    transferPackets: Uint8Array;
  },
  UnknownError
>;

export type ReceivePhononsResponse = ParseResponse<{}, UnknownError>;

export const parseSelectPhononAppletResponse = (
  responseApdu: ResponseApdu
): SelectPhononFileResponse => {
  return {
    initialised: responseApdu.data[0] === 164,
    uuid: responseApdu.data.slice(4, 20),
    publicKey: responseApdu.data.slice(22, 87),
  };
};

export const parsePairStepOneResponse = (
  responseApdu: ResponseApdu
): PairStepOneResponse => {
  const certLength = responseApdu.data[33];
  const rawCert = responseApdu.data.slice(32, 34 + certLength);
  const cert = parseCert(rawCert);

  return {
    cardIdentityCertificate: cert,
    pairingSalt: responseApdu.data.slice(0, 32),
    pairingSignature: responseApdu.data.slice(34 + certLength),
  };
};

export const parsePairStepTwoResponse = (
  responseApdu: ResponseApdu
): PairStepTwoResponse => {
  return {
    pairingIndex: responseApdu.data[0],
    salt: responseApdu.data.slice(1),
  };
};

export const parseUnlockResponse = (
  responseApdu: ResponseApdu
): UnlockResponse => {
  if (responseApdu.sw === SW_SUCCESS) {
    return { success: true, data: {} };
  }

  const triesRemaining = responseApdu.sw - 25536;

  return {
    success: false,
    error: {
      code: 'INCORRECT_PIN',
      data: {
        triesRemaining,
      },
    },
  };
};

export const parseGetFriendlyNameResponse = (
  responseApdu: ResponseApdu
): string | undefined => {
  if (responseApdu.sw !== SW_SUCCESS) {
    return undefined;
  }

  let str = new TextDecoder().decode(responseApdu.data);

  return str;
};

export const parseCreatePhononResponse = (
  responseApdu: ResponseApdu
): CreatePhononResponse => {
  const phononCollection = new TLVCollection(
    new TLVCollection(responseApdu.data).getValue(64)
  );

  const rawIndex = phononCollection.getValue(65);
  const publicKey = phononCollection.getValue(128);

  return {
    keyIndex: bytesToNumber(rawIndex),
    publicKey,
  };
};

export const parseDestroyPhononResponse = (
  responseApdu: ResponseApdu
): DestroyPhononResponse => {
  const collection = new TLVCollection(responseApdu.data);

  return {
    privateKey: collection.getValue(129),
  };
};

export const parseListPhononsResponse = (
  responseApdu: ResponseApdu
): ListPhononsResponse => {
  const phononCollection = new TLVCollection(responseApdu.data).getValue(82);
  const phononDescriptions = new TLVCollection(phononCollection).getValues(80);

  const phonons = phononDescriptions.map((phononDescription): Phonon => {
    const rawPhonon = new TLVCollection(phononDescription);
    const rawIndex = rawPhonon.getValue(65);
    const rawCurveType = rawPhonon.getValue(135);
    return {
      keyIndex: bytesToNumber(rawIndex),
      curveType: CURVE_TYPE_CODE_TO_NAME_MAP[bytesToNumber(rawCurveType)],
    };
  });

  return {
    phonons,
    moreToLoad: responseApdu.sw !== SW_SUCCESS,
  };
};

export const parseGetPhononPublicKeyResponse = (
  responseApdu: ResponseApdu
): GetPhononPublicKeyResponse => {
  const collection = new TLVCollection(
    new TLVCollection(responseApdu.data).getValue(67)
  );
  const phononDescription = new TLVCollection(collection.getValue(68));

  return {
    publicKey: phononDescription.getValue(128),
  };
};

export const parseChangePinResponse = (
  responseApdu: ResponseApdu
): ChangePinResponse => {
  if (responseApdu.sw === SW_SUCCESS) {
    return {
      success: true,
      data: {},
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN',
      data: {},
    },
  };
};

export const parseChangeFriendlyNameResponse = (
  responseApdu: ResponseApdu
): ChangeFriendlyNameResponse => {
  if (responseApdu.sw === SW_SUCCESS) {
    return {
      success: true,
      data: {},
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN',
      data: {},
    },
  };
};

export const parsePairStepOneTwoThreeResponse = (
  responseApdu: ResponseApdu
): PairStepOneTwoThreeResponse => {
  if (responseApdu.sw === SW_SUCCESS) {
    return {
      success: true,
      data: {
        pairingData: responseApdu.data,
      },
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN',
      data: {},
    },
  };
};

export const parsePairRecipientStepTwoResponse = (
  responseApdu: ResponseApdu
): PairStepRecipientStepTwoResponse => {
  if (responseApdu.sw === SW_SUCCESS) {
    return {
      success: true,
      data: {},
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN',
      data: {},
    },
  };
};

export const parseSendPhononsResponse = (
  responseApdu: ResponseApdu
): SendPhononsResponse => {
  if (responseApdu.sw === SW_SUCCESS) {
    return {
      success: true,
      data: {
        transferPackets: responseApdu.data,
      },
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN',
      data: {},
    },
  };
};

export const parseReceivePhononsResponse = (
  responseApdu: ResponseApdu
): ReceivePhononsResponse => {
  if (responseApdu.sw === SW_SUCCESS) {
    return {
      success: true,
      data: {},
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN',
      data: {},
    },
  };
};

const parseCert = (bytes: Uint8Array): CardCertificate => {
  const certType = bytes[0];
  const certLen = bytes[1];
  const permType = bytes[2];
  const permLen = bytes[3];
  const permissions = bytes.slice(4, 4 + permLen);
  const pubKeyType = bytes[4 + permLen];
  const pubKeyLen = bytes[5 + permLen];
  const publicKey = bytes.slice(6 + permLen, 6 + permLen + pubKeyLen);
  const signature = bytes.slice(6 + permLen + pubKeyLen, certLen);

  return {
    permissions: {
      certType,
      certLen,
      permType,
      permLen,
      pubKeyType,
      pubKeyLen,
      permissions,
    },
    publicKey,
    signature,
  };
};
