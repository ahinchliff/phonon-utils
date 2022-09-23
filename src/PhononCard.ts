import * as secp256k1 from '@noble/secp256k1';
import { CommandApdu, ResponseApdu } from './apdu/apdu-types';
import {
  createChangeFriendlyNameCommandApdu,
  createChangePinCommandApud,
  createCreatePhononCommandApdu,
  createDestroyPhononCommandApdu,
  createGetFriendlyNameCommandApud,
  createGetPhononPublicKeyCommandApdu,
  createListPhononsCommandApdu,
  createMutualAuthenticateCommandApdu,
  createOpenSecureChannelCommandApdu,
  createPairRecipientStepOneCommandApdu,
  createPairRecipientStepTwoCommandApdu,
  createPairSenderStepOneCommandApdu,
  createPairSenderStepTwoCommandApdu,
  createPairStepOneCommandApdu,
  createPairStepTwoCommandApdu,
  createReceivePhononsCommandApud,
  createSelectPhononCommandApdu,
  createSendPhononsCommandApud,
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
  SelectPhononFileResponse,
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
} from './apdu/responses';
import { CardCertificate, CurveType, Phonon } from './types';
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
} from './utils/cryptography-utils';

export default class PhononCard {
  private cardCertificate: CardCertificate | undefined;
  private sessionKeys: SessionKeys | undefined;
  private pairingSignature: Uint8Array | undefined;
  private verifyIdentitySignatureDataHash: Uint8Array | undefined;

  constructor(
    private sendCommand: (command: CommandApdu) => Promise<ResponseApdu>
  ) {}

  public getFriendlyName = async (): Promise<string | undefined> => {
    const command = createGetFriendlyNameCommandApud();
    const response = await this.sendCommandInternal(command);
    return parseGetFriendlyNameResponse(response);
  };

  public unlock = async (pin: string): Promise<UnlockResponse> => {
    const command = createUnlockCommandApdu(pin);
    const response = await this.sendCommandInternal(command);
    return parseUnlockResponse(response);
  };

  public createPhonon = async (
    curveType: CurveType
  ): Promise<CreatePhononResponse> => {
    const command = createCreatePhononCommandApdu(curveType);
    const response = await this.sendCommandInternal(command);
    return parseCreatePhononResponse(response);
  };

  public destroyPhonon = async (
    keyIndex: number
  ): Promise<DestroyPhononResponse> => {
    const command = createDestroyPhononCommandApdu(keyIndex);
    const response = await this.sendCommandInternal(command);
    return parseDestroyPhononResponse(response);
  };

  public listPhonons = async (): Promise<Phonon[]> => {
    const phonons: Phonon[] = [];
    const getBatch = async (continuation: boolean) => {
      const command = createListPhononsCommandApdu(continuation);
      const response = await this.sendCommandInternal(command);
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
    const response = await this.sendCommandInternal(command);
    return parseGetPhononPublicKeyResponse(response);
  };

  public setPhononDescription = async (
    keyIndex: number
  ): Promise<GetPhononPublicKeyResponse> => {
    const command = createGetPhononPublicKeyCommandApdu(keyIndex);
    const response = await this.sendCommandInternal(command);
    return parseGetPhononPublicKeyResponse(response);
  };

  public changePin = async (newPin: string): Promise<ChangePinResponse> => {
    const command = createChangePinCommandApud(newPin);
    const response = await this.sendCommandInternal(command);
    return parseChangePinResponse(response);
  };

  public changeFriendlyName = async (
    newName: string
  ): Promise<ChangeFriendlyNameResponse> => {
    const command = createChangeFriendlyNameCommandApdu(newName);
    const response = await this.sendCommandInternal(command);
    return parseChangeFriendlyNameResponse(response);
  };

  public cardPairStepOne = async (
    recipientsCardCert: CardCertificate
  ): Promise<PairStepOneTwoThreeResponse> => {
    const command = createPairSenderStepOneCommandApdu(
      serialiseCertificate(recipientsCardCert)
    );
    const response = await this.sendCommandInternal(command);

    return parsePairStepOneTwoThreeResponse(response);
  };

  public cardPairStepTwo = async (
    pairSenderStepOneData: Uint8Array
  ): Promise<PairStepOneTwoThreeResponse> => {
    const command = createPairRecipientStepOneCommandApdu(
      pairSenderStepOneData
    );
    const response = await this.sendCommandInternal(command);
    return parsePairStepOneTwoThreeResponse(response);
  };

  public cardPairStepThree = async (
    pairRecipientStepOneData: Uint8Array
  ): Promise<PairStepOneTwoThreeResponse> => {
    const command = createPairSenderStepTwoCommandApdu(
      pairRecipientStepOneData
    );
    const response = await this.sendCommandInternal(command);
    return parsePairStepOneTwoThreeResponse(response);
  };

  public cardPairStepFour = async (
    pairSenderStepTwoData: Uint8Array
  ): Promise<PairStepRecipientStepTwoResponse> => {
    const command = createPairRecipientStepTwoCommandApdu(
      pairSenderStepTwoData
    );
    const response = await this.sendCommandInternal(command);
    return parsePairRecipientStepTwoResponse(response);
  };

  public sendPhonons = async (
    keyIndicies: number[]
  ): Promise<SendPhononsResponse> => {
    const command = createSendPhononsCommandApud(keyIndicies, false);
    const response = await this.sendCommandInternal(command);
    return parseSendPhononsResponse(response);
  };

  public receivePhonons = async (
    transfer: Uint8Array
  ): Promise<ReceivePhononsResponse> => {
    const command = createReceivePhononsCommandApud(transfer);
    const response = await this.sendCommandInternal(command);
    return parseReceivePhononsResponse(response);
  };

  public pair = async () => {
    const selectResponse = await this.selectPhononApplet();
    const secureChannelPrivateKey = secp256k1.utils.randomPrivateKey();
    const secureChannelPublicKey = secp256k1.getPublicKey(
      secureChannelPrivateKey
    );
    const secureChannelSharedSecret = generateSharedSecret(
      secureChannelPrivateKey,
      selectResponse.publicKey
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

    this.cardCertificate = pairOneResponse.cardIdentityCertificate;
    this.pairingSignature = pairOneResponse.pairingSignature;
    this.verifyIdentitySignatureDataHash = verifyIdentifySignatureDataHash;
  };

  public verifyCard = async (caAuthorityCert: Uint8Array) => {
    if (
      !this.cardCertificate ||
      !this.pairingSignature ||
      !this.verifyIdentitySignatureDataHash
    ) {
      throw new Error("Can't verify card before paring");
    }

    const certIsValid = await isCertificateValid(
      this.cardCertificate,
      caAuthorityCert
    );

    const signatureIsValid = secp256k1.verify(
      this.pairingSignature,
      this.verifyIdentitySignatureDataHash,
      this.cardCertificate.publicKey,
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
    if (!this.cardCertificate) {
      throw new Error("Can't get public key before paring");
    }

    return this.cardCertificate.publicKey;
  };

  public getCertificate = (): CardCertificate => {
    if (!this.cardCertificate) {
      throw new Error("Can't get public key before paring");
    }

    return this.cardCertificate;
  };

  private selectPhononApplet = async (): Promise<SelectPhononFileResponse> => {
    const command = createSelectPhononCommandApdu();
    const response = await this.sendCommandInternal(command);
    return parseSelectPhononAppletResponse(response);
  };

  private pairStepOne = async (
    publicKey: Uint8Array,
    salt: Uint8Array
  ): Promise<PairStepOneResponse> => {
    const command = createPairStepOneCommandApdu(publicKey, salt);
    const response = await this.sendCommandInternal(command);
    return parsePairStepOneResponse(response);
  };

  private pairStepTwo = async (
    cryptogram: Uint8Array
  ): Promise<PairStepTwoResponse> => {
    const command = createPairStepTwoCommandApdu(cryptogram);
    const response = await this.sendCommandInternal(command);
    return parsePairStepTwoResponse(response);
  };

  private openSecureChannel = async (
    pairingIndex: number,
    publicKey: Uint8Array
  ): Promise<Uint8Array> => {
    const command = createOpenSecureChannelCommandApdu(pairingIndex, publicKey);
    const response = await this.sendCommandInternal(command);
    return response.data;
  };

  private mutualAuthenticate = async (data: Uint8Array): Promise<void> => {
    const command = createMutualAuthenticateCommandApdu(data);
    await this.sendCommandInternal(command);
  };

  private sendCommandInternal = async (
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
