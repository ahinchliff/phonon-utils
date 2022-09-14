import * as crypto from 'crypto';
import * as secp256k1 from '@noble/secp256k1';
import {
  CommandApdu,
  EncryptedResponseApduData,
  ResponseApdu,
} from '../apdu/apdu-types';
import { CardCertificate, CurveType } from '../types';
import { CURVE_TYPE_CODE_TO_NAME_MAP } from '../constants';

export type SessionKeys = {
  encryptionKey: Uint8Array;
  macKey: Uint8Array;
  iv: Uint8Array;
};

export type EncryptCommandApduResult = {
  command: CommandApdu;
  iv: Uint8Array;
};

export type DecryptResponseApduResult = {
  plainTextData: Uint8Array;
  iv: Uint8Array;
};

export const generateRandomBytes = (length: number): Uint8Array =>
  new Uint8Array(crypto.randomBytes(length));

export const appendPaddingToData = (
  blockSize: number,
  data: Uint8Array
): Uint8Array => {
  const paddingSize = blockSize - (data.length % blockSize);
  return new Uint8Array([...data, 128, ...createEmptyData(paddingSize - 1)]);
};

export const removePaddingFromData = (
  blockSize: number,
  data: Uint8Array
): Uint8Array => {
  let i = data.length - 1;

  while (i > data.length - blockSize) {
    if (data[i] == 128) {
      break;
    }
    i--;
  }

  return data.slice(0, i);
};

export const createEmptyData = (length: number): Uint8Array => {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(0);
  }
  return new Uint8Array(result);
};

export const deriveSessionKeys = (
  secureChannelSharedSecret: Uint8Array,
  pairingKey: Uint8Array,
  openSecureChannelCardResponse: Uint8Array
): SessionKeys => {
  const salt = openSecureChannelCardResponse.slice(0, 32);
  const iv = openSecureChannelCardResponse.slice(32);
  const hash = crypto.createHash('sha512');
  hash.update(secureChannelSharedSecret);
  hash.update(pairingKey);
  hash.update(salt);

  const keyData = new Uint8Array(hash.digest());

  const encryptionKey = keyData.slice(0, 32);
  const macKey = keyData.slice(32);

  return {
    encryptionKey,
    macKey,
    iv,
  };
};

export const encrypt = (
  data: Uint8Array,
  encryptionKey: Uint8Array,
  iv: Uint8Array
) => {
  const dataWithPadding = appendPaddingToData(16, data);
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  return new Uint8Array(cipher.update(dataWithPadding));
};

export const decrypt = (
  responseData: Uint8Array,
  secureChannelEncryptionKey: Uint8Array,
  secureChannelIv: Uint8Array
): Uint8Array => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    secureChannelEncryptionKey,
    secureChannelIv
  );
  decipher.setAutoPadding(false);
  const plaintext = new Uint8Array(decipher.update(responseData));
  return removePaddingFromData(16, plaintext);
};

export const createPairStepTwoCryptogram = (
  pairingSalt: Uint8Array,
  sigDataHash: Uint8Array
): Promise<Uint8Array> =>
  secp256k1.utils.sha256(new Uint8Array([...pairingSalt, ...sigDataHash]));

export const calculateMac = (
  meta: Uint8Array,
  encryptedApduData: Uint8Array,
  macKey: Uint8Array
) => {
  const dataWithPadding = appendPaddingToData(16, encryptedApduData);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    macKey,
    createEmptyData(16)
  );
  cipher.update(meta);
  const encrypted = cipher.update(dataWithPadding);
  const macData = new Uint8Array(encrypted);
  return macData.slice(macData.length - 32, macData.length - 16);
};

export const createMeta = (
  command: CommandApdu,
  encryptedData: Uint8Array
): Uint8Array =>
  new Uint8Array([
    command.cla,
    command.ins,
    command.p1,
    command.p2,
    encryptedData.length + 16,
    ...createEmptyData(11),
  ]);

export const generateSharedSecret = (
  privateKey: Uint8Array,
  cardPublicKey: Uint8Array
) => {
  const sharedSecretRaw = secp256k1.getSharedSecret(
    privateKey,
    cardPublicKey,
    true
  );
  // not sure why I need to remove first byte
  return sharedSecretRaw.slice(1);
};

export const parseEncryptedResponseData = (
  responseData: Uint8Array,
  secureChannelIv: Uint8Array
): EncryptedResponseApduData => {
  const meta = new Uint8Array([responseData.length, ...createEmptyData(15)]);
  const mac = responseData.slice(0, secureChannelIv.length);
  const data = responseData.slice(secureChannelIv.length);
  return {
    meta,
    mac,
    data,
  };
};

export const encryptCommandApdu = (
  command: CommandApdu,
  sessionKeys: SessionKeys
): EncryptCommandApduResult => {
  const encryptedData = encrypt(
    command.data,
    sessionKeys.encryptionKey,
    sessionKeys.iv
  );

  const meta = createMeta(command, encryptedData);
  const mac = calculateMac(meta, encryptedData, sessionKeys.macKey);

  const encryptedCommand = {
    ...command,
    data: new Uint8Array([...mac, ...encryptedData]),
  };

  return {
    command: encryptedCommand,
    iv: mac,
  };
};

export const decryptResponseData = (
  responseData: Uint8Array,
  sessionKeys: SessionKeys
): DecryptResponseApduResult => {
  const parsedResponseData = parseEncryptedResponseData(
    responseData,
    sessionKeys.iv
  );

  const plainTextData = decrypt(
    parsedResponseData.data,
    sessionKeys.encryptionKey,
    sessionKeys.iv
  );

  const mac = calculateMac(
    parsedResponseData.meta,
    parsedResponseData.data,
    sessionKeys.macKey
  );

  return {
    plainTextData,
    iv: mac,
  };
};

export const stringToBytes = (value: string) =>
  new Uint8Array(Buffer.from(value));

export const bytesToNumber = (Uint8Array: Uint8Array) => {
  var length = Uint8Array.length;
  let buffer = Buffer.from(Uint8Array);
  var result = buffer.readUIntBE(0, length);
  return result;
};

export const numberToBytes = (num: number) => {
  const buffer = new ArrayBuffer(2);
  const view = new DataView(buffer);
  view.setUint16(0, num, false);
  return new Uint8Array(buffer);
};

export const deserializeResponse = (
  decryptedResponseData: Uint8Array
): ResponseApdu => {
  const sw = decryptedResponseData.slice(decryptedResponseData.length - 2);
  return {
    sw: bytesToNumber(sw),
    s1: sw[0],
    s2: sw[1],
    data: decryptedResponseData.slice(0, decryptedResponseData.length - 2),
  };
};

export const isCertificateValid = async (
  cert: CardCertificate,
  certAuthorityPublicKey: Uint8Array
): Promise<boolean> => {
  const sigData = Uint8Array.of(
    cert.permissions.permType,
    cert.permissions.permLen,
    ...cert.permissions.permissions,
    cert.permissions.pubKeyType,
    cert.permissions.pubKeyLen,
    ...cert.publicKey
  );

  const sigDataHash = await secp256k1.utils.sha256(sigData);

  return secp256k1.verify(cert.signature, sigDataHash, certAuthorityPublicKey, {
    strict: false,
  });
};

export const curveNameToCurveCode = (curve: CurveType): number | undefined => {
  const curveCodes = Object.keys(
    CURVE_TYPE_CODE_TO_NAME_MAP
  ) as unknown as number[];
  const curveNames = Object.values(CURVE_TYPE_CODE_TO_NAME_MAP);
  const curveNameIndex = curveNames.findIndex((name) => name === curve);
  return curveCodes[curveNameIndex];
};
