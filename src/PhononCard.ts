import * as secp256k1 from '@noble/secp256k1';
import { randomBytes } from 'crypto';
import { CommandApdu, ResponseApdu } from './apdu/apdu-types';
import {
  createChangeFriendlyNameCommandApdu,
  createChangePinCommandApdu,
  createCreatePhononCommandApdu,
  createDestroyPhononCommandApdu,
  createGetFriendlyNameCommandApdu,
  createGetPhononPublicKeyCommandApdu,
  createIdentifyCardCommandApdu,
  createInitCardCommandApdu,
  createListPhononsCommandApdu,
  createMutualAuthenticateCommandApdu,
  createOpenSecureChannelCommandApdu,
  createPairRecipientStepOneCommandApdu,
  createPairRecipientStepTwoCommandApdu,
  createPairSenderStepOneCommandApdu,
  createPairSenderStepTwoCommandApdu,
  createPairStepOneCommandApdu,
  createPairStepTwoCommandApdu,
  createReceivePhononsCommandApdu,
  createSelectPhononCommandApdu,
  createSendPhononsCommandApdu,
  createUnlockCommandApdu,
} from './apdu/commands';
import {
  CreatePhononResponse,
  DestroyPhononResponse,
  GetPhononPublicKeyResponse,
  PairStepOneResponse,
  PairStepTwoResponse,
  parseChangePinResponse,
  parseCreatePhononResponse,
  parseDestroyPhononResponse,
  parseGetFriendlyNameResponse,
  parseGetPhononPublicKeyResponse,
  parseListPhononsResponse,
  parsePairStepOneResponse,
  parsePairStepTwoResponse,
  parseSelectPhononAppletResponse,
  parseUnlockResponse,
  UnlockResponse,
  parseChangeFriendlyNameResponse,
  ChangePinResponse,
  ChangeFriendlyNameResponse,
  parsePairStepOneTwoThreeResponse,
  PairStepOneTwoThreeResponse,
  parsePairRecipientStepTwoResponse,
  PairStepRecipientStepTwoResponse,
  parseSendPhononsResponse,
  SendPhononsResponse,
  parseReceivePhononsResponse,
  ReceivePhononsResponse,
  parseIdentifyCardResponse,
  IdentifyCardResponse,
} from './apdu/responses';
import { CardCertificate, CurveType, Phonon } from './types';
import { createInvokeQueue } from './utils/create-invoke-queue';
import {
  createPairStepTwoCryptogram,
  decryptResponseData,
  deriveSessionKeys,
  parseResponse,
  encryptCommandApdu,
  generateRandomBytes,
  generateSharedSecret,
  isCertificateValid,
  serialiseCertificate,
  SessionKeys,
  generateInitSecrets,
  stringToBytes,
  encrypt,
} from './utils/cryptography-utils';

export default class PhononCard {
  private queue = createInvokeQueue();
  private isInitialised: boolean | undefined;
  private publicKey: Uint8Array | undefined;
  private pairingPublicKey: Uint8Array | undefined;
  private certificate: CardCertificate | undefined;
  private sessionKeys: SessionKeys | undefined;
  private pairingSignature: Uint8Array | undefined;
  private pairingSignatureData: Uint8Array | undefined;

  constructor(
    private sendCommand: (command: CommandApdu) => Promise<ResponseApdu>
  ) {}

  public select = async (): Promise<void> => {
    const command = createSelectPhononCommandApdu();
    const response = await this.sendCommandInteral(command);
    const { initialised, publicKey } =
      parseSelectPhononAppletResponse(response);

    this.isInitialised = initialised;
    this.pairingPublicKey = publicKey;
  };

  public identifyCard = async (
    nonce?: Uint8Array
  ): Promise<IdentifyCardResponse> => {
    const command = createIdentifyCardCommandApdu(nonce || randomBytes(32));
    const response = await this.sendCommandInteral(command);
    const parsedResponse = parseIdentifyCardResponse(response);
    this.publicKey = parsedResponse.publicKey;
    return parsedResponse;
  };

  public init = async (newPin: string): Promise<void> => {
    if (this.isInitialised) {
      throw new Error('Card is already initialised');
    }

    if (!this.pairingPublicKey) {
      throw new Error('Card does not have public key. Try running select.');
    }

    const pairingPrivateKey = secp256k1.utils.randomPrivateKey();
    const pairingPublicKey = secp256k1.getPublicKey(pairingPrivateKey);
    const initSecrets = generateInitSecrets();
    const sharedSecret = generateSharedSecret(
      pairingPrivateKey,
      this.pairingPublicKey
    );

    const initData = new Uint8Array([
      ...stringToBytes(newPin),
      ...initSecrets.pairingToken,
    ]);
    const iv = generateRandomBytes(16);
    const encryptedData = encrypt(initData, sharedSecret, iv);

    const data = new Uint8Array([
      pairingPublicKey.length,
      ...pairingPublicKey,
      ...iv,
      ...encryptedData,
    ]);

    const command = createInitCardCommandApdu(data);
    await this.sendCommandInteral(command);

    await this.select();
  };

  public getFriendlyName = async (): Promise<string | undefined> => {
    const command = createGetFriendlyNameCommandApdu();
    const response = await this.sendCommandInteral(command);
    return parseGetFriendlyNameResponse(response);
  };

  public unlock = async (pin: string): Promise<UnlockResponse> => {
    const command = createUnlockCommandApdu(pin);
    const response = await this.sendCommandInteral(command);
    return parseUnlockResponse(response);
  };

  public createPhonon = async (
    curveType: CurveType
  ): Promise<CreatePhononResponse> => {
    const command = createCreatePhononCommandApdu(curveType);
    const response = await this.sendCommandInteral(command);
    return parseCreatePhononResponse(response);
  };

  public destroyPhonon = async (
    keyIndex: number
  ): Promise<DestroyPhononResponse> => {
    const command = createDestroyPhononCommandApdu(keyIndex);
    const response = await this.sendCommandInteral(command);
    return parseDestroyPhononResponse(response);
  };

  public listPhonons = async (): Promise<Phonon[]> => {
    const phonons: Phonon[] = [];
    const getBatch = async (continuation: boolean) => {
      const command = createListPhononsCommandApdu(continuation);
      const response = await this.sendCommandInteral(command);
      const parsedResponse = parseListPhononsResponse(response);
      phonons.push(...parsedResponse.phonons);
      if (parsedResponse.moreToLoad) {
        await getBatch(true);
      }
    };
    await getBatch(false);
    return phonons;
  };

  public getPhononPublicKey = async (
    keyIndex: number
  ): Promise<GetPhononPublicKeyResponse> => {
    const command = createGetPhononPublicKeyCommandApdu(keyIndex);
    const response = await this.sendCommandInteral(command);
    return parseGetPhononPublicKeyResponse(response);
  };

  public setPhononDescription = async (
    keyIndex: number
  ): Promise<GetPhononPublicKeyResponse> => {
    const command = createGetPhononPublicKeyCommandApdu(keyIndex);
    const response = await this.sendCommandInteral(command);
    return parseGetPhononPublicKeyResponse(response);
  };

  public changePin = async (newPin: string): Promise<ChangePinResponse> => {
    const command = createChangePinCommandApdu(newPin);
    const response = await this.sendCommandInteral(command);
    return parseChangePinResponse(response);
  };

  public changeFriendlyName = async (
    newName: string
  ): Promise<ChangeFriendlyNameResponse> => {
    const command = createChangeFriendlyNameCommandApdu(newName);
    const response = await this.sendCommandInteral(command);
    return parseChangeFriendlyNameResponse(response);
  };

  public cardPairStepOne = async (
    recipientsCardCert: CardCertificate
  ): Promise<PairStepOneTwoThreeResponse> => {
    const command = createPairSenderStepOneCommandApdu(
      serialiseCertificate(recipientsCardCert)
    );
    const response = await this.sendCommandInteral(command);

    return parsePairStepOneTwoThreeResponse(response);
  };

  public cardPairStepTwo = async (
    pairSenderStepOneData: Uint8Array
  ): Promise<PairStepOneTwoThreeResponse> => {
    const command = createPairRecipientStepOneCommandApdu(
      pairSenderStepOneData
    );
    const response = await this.sendCommandInteral(command);
    return parsePairStepOneTwoThreeResponse(response);
  };

  public cardPairStepThree = async (
    pairRecipientStepOneData: Uint8Array
  ): Promise<PairStepOneTwoThreeResponse> => {
    const command = createPairSenderStepTwoCommandApdu(
      pairRecipientStepOneData
    );
    const response = await this.sendCommandInteral(command);
    return parsePairStepOneTwoThreeResponse(response);
  };

  public cardPairStepFour = async (
    pairSenderStepTwoData: Uint8Array
  ): Promise<PairStepRecipientStepTwoResponse> => {
    const command = createPairRecipientStepTwoCommandApdu(
      pairSenderStepTwoData
    );
    const response = await this.sendCommandInteral(command);
    return parsePairRecipientStepTwoResponse(response);
  };

  public sendPhonons = async (
    keyIndicies: number[]
  ): Promise<SendPhononsResponse> => {
    const command = createSendPhononsCommandApdu(keyIndicies, false);
    const response = await this.sendCommandInteral(command);
    return parseSendPhononsResponse(response);
  };

  public receivePhonons = async (
    transfer: Uint8Array
  ): Promise<ReceivePhononsResponse> => {
    const command = createReceivePhononsCommandApdu(transfer);
    const response = await this.sendCommandInteral(command);
    return parseReceivePhononsResponse(response);
  };

  public openSecureConnection = async (): Promise<void> => {
    if (!this.isInitialised || !this.pairingPublicKey) {
      throw new Error('Card is not initalised');
    }

    const secureChannelPrivateKey = secp256k1.utils.randomPrivateKey();
    const secureChannelPublicKey = secp256k1.getPublicKey(
      secureChannelPrivateKey
    );
    const secureChannelSharedSecret = generateSharedSecret(
      secureChannelPrivateKey,
      this.pairingPublicKey
    );

    const clientSalt = generateRandomBytes(32);
    const pairingPrivateKey = secp256k1.utils.randomPrivateKey();
    const pairingPublicKey = secp256k1.getPublicKey(pairingPrivateKey);

    const pairOneResponse = await this.pairStepOne(
      pairingPublicKey,
      clientSalt
    );

    const pairingSecret = generateSharedSecret(
      pairingPrivateKey,
      pairOneResponse.cardIdentityCertificate.publicKey
    );

    const verifyIdentifySignatureData = Uint8Array.of(
      ...clientSalt,
      ...pairingSecret
    );

    const verifyIdentifySignatureDataHash = await secp256k1.utils.sha256(
      verifyIdentifySignatureData
    );

    const cryptogram = await createPairStepTwoCryptogram(
      pairOneResponse.pairingSalt,
      verifyIdentifySignatureDataHash
    );

    const pairTwoResponse = await this.pairStepTwo(cryptogram);

    const openSecureChannelResponse = await this.openSecureChannel(
      pairTwoResponse.pairingIndex,
      secureChannelPublicKey
    );

    const pairingKey = await secp256k1.utils.sha256(
      new Uint8Array([
        ...pairTwoResponse.salt,
        ...verifyIdentifySignatureDataHash,
      ])
    );

    this.sessionKeys = deriveSessionKeys(
      secureChannelSharedSecret,
      pairingKey,
      openSecureChannelResponse
    );

    const mutuallyAuthenticateData = generateRandomBytes(32);

    await this.mutualAuthenticate(mutuallyAuthenticateData);

    this.certificate = pairOneResponse.cardIdentityCertificate;
    this.pairingSignature = pairOneResponse.pairingSignature;
    this.pairingSignatureData = verifyIdentifySignatureDataHash;
  };

  public verifyCard = async (caAuthorityCert: Uint8Array) => {
    if (
      !this.certificate ||
      !this.pairingSignature ||
      !this.pairingSignatureData
    ) {
      throw new Error("Can't verify card before paring");
    }

    const certIsValid = await isCertificateValid(
      this.certificate,
      caAuthorityCert
    );

    const signatureIsValid = secp256k1.verify(
      this.pairingSignature,
      this.pairingSignatureData,
      this.certificate.publicKey,
      {
        strict: false,
      }
    );

    if (certIsValid && signatureIsValid) {
      return { valid: true };
    }

    return {
      valid: false,
      reason: {
        certIsValid,
        signatureIsValid,
      },
    };
  };

  public getPublicKey = (): Uint8Array => {
    if (!this.certificate && !this.publicKey) {
      throw new Error(
        "Can't get public key before running select or openSecureConnection"
      );
    }
    return (this.certificate?.publicKey || this.publicKey) as Uint8Array;
  };

  public getIsInitialised = (): boolean => {
    if (this.isInitialised === undefined) {
      throw new Error(
        "Can't determine if card is initialised before running select"
      );
    }

    return this.isInitialised;
  };

  public getCertificate = (): CardCertificate => {
    if (!this.certificate) {
      throw new Error(
        "Can't get certificate before running openSecureConnection"
      );
    }
    return this.certificate;
  };

  private pairStepOne = async (
    publicKey: Uint8Array,
    salt: Uint8Array
  ): Promise<PairStepOneResponse> => {
    const command = createPairStepOneCommandApdu(publicKey, salt);
    const response = await this.sendCommandInteral(command);
    return parsePairStepOneResponse(response);
  };

  private pairStepTwo = async (
    cryptogram: Uint8Array
  ): Promise<PairStepTwoResponse> => {
    const command = createPairStepTwoCommandApdu(cryptogram);
    const response = await this.sendCommandInteral(command);
    return parsePairStepTwoResponse(response);
  };

  private openSecureChannel = async (
    pairingIndex: number,
    publicKey: Uint8Array
  ): Promise<Uint8Array> => {
    const command = createOpenSecureChannelCommandApdu(pairingIndex, publicKey);
    const response = await this.sendCommandInteral(command);
    return response.data;
  };

  private mutualAuthenticate = async (data: Uint8Array): Promise<void> => {
    const command = createMutualAuthenticateCommandApdu(data);
    await this.sendCommandInteral(command);
  };

  private sendCommandInteral = (command: CommandApdu) =>
    this.queue(() => this._sendCommandInteral(command));

  private _sendCommandInteral = async (
    command: CommandApdu
  ): Promise<ResponseApdu> => {
    if (this.sessionKeys) {
      const { command: encryptedCommand, iv } = encryptCommandApdu(
        command,
        this.sessionKeys
      );

      this.sessionKeys = {
        ...this.sessionKeys,
        iv,
      };

      command = encryptedCommand;
    }

    const response = await this.sendCommand(command);

    if (!this.sessionKeys) {
      return response;
    }

    const { plainTextData, iv } = decryptResponseData(
      response.data,
      this.sessionKeys
    );

    this.sessionKeys = {
      ...this.sessionKeys,
      iv,
    };

    return parseResponse(plainTextData);
  };
}
