import { io, Socket } from 'socket.io-client';
import PhononCard from './PhononCard';
import { CardCertificate } from './types';

type Status =
  | 'disconnected'
  | 'pairing_step_1'
  | 'pairing_step_2'
  | 'pairing_step_3'
  | 'pairing_step_4'
  | 'paired';

type Callbacks = {
  onStatusChange?: (newStatus: Status) => void;
  onPhononReceived?: () => void;
  onPhononTransferSuccess?: () => void;
  onUnpair?: () => void;
};

export default class RemotePairing {
  public status: Status = 'disconnected';
  private socket: Socket | undefined;

  constructor(
    private card: PhononCard,
    private apiUrl: string,
    private events?: Callbacks
  ) {}

  public pair = async (pairingId: string): Promise<void> => {
    this.socket = io(this.apiUrl);

    this.socket.on('connect', () => {
      this.socket!.emit('JOIN_PAIRING', pairingId);
    });
    this.socket.on(
      'COUNTER_PARTY_CONNECTED',
      this.onCounterpartyConnected(this.socket)
    );
    this.socket.on('PAIR_STEP_ONE', this.onPairStepOne(this.socket));
    this.socket.on('PAIR_STEP_TWO', this.onPairStepTwo(this.socket));
    this.socket.on('PAIR_STEP_THREE', this.onPairStepThree(this.socket));
    this.socket.on('PAIR_STEP_FOUR', this.onPairStepFour(this.socket));
    this.socket.on('PAIRED', this.onPaired);
    this.socket.on('TRANSFER_PHONON', this.onReceivePhonon(this.socket));
    this.socket.on('PHONON_TRANSFER_SUCCESS', this.onPhononTransferSuccess);
    this.socket.on('UNPAIR', this.unpair);
    this.socket.on('disconnect', this.onDisconnect);

    return new Promise((resolve) => {
      this.socket!.on('PAIRED', () => {
        resolve();
      });
    });
  };

  public sendPhonons = async (keyIndicies: number[]): Promise<void> => {
    if (this.status !== 'paired' || !this.socket) {
      return console.error('Need to be paired to send phonon');
    }

    const result = await this.card.sendPhonons(keyIndicies);

    if (result.success === false) {
      // handle error
      return;
    }

    this.socket.emit(
      'TRANSFER_PHONON',
      serialiseData(result.data.transferPackets)
    );

    return new Promise((resolve) => {
      this.socket!.on('PHONON_TRANSFER_SUCCESS', () => {
        resolve();
      });
    });
  };

  public unpair = (): void => {
    this.socket?.emit('UNPAIR');
    this.socket?.disconnect();
    this.status == 'disconnected';
  };

  private onDisconnect = () => {
    console.log('disconnected');
    this.status == 'disconnected';
    this.events?.onUnpair?.();
  };

  private onCounterpartyConnected =
    (socket: Socket) =>
    async (shouldSendCardCert: boolean): Promise<void> => {
      this.setStatus('pairing_step_1');

      if (shouldSendCardCert) {
        socket.emit('PAIR_STEP_ONE', serialiseCert(this.card.getCertificate()));
      }
    };

  private onPairStepOne =
    (socket: Socket) =>
    async (cardCert: string): Promise<void> => {
      const cert = JSON.parse(cardCert);
      const result = await this.card.cardPairStepOne(cert);

      if (result.success === false) {
        // handle error
        return;
      }

      socket.emit('PAIR_STEP_TWO', serialiseData(result.data.pairingData));
      this.setStatus('pairing_step_2');
    };

  private onPairStepTwo =
    (socket: Socket) =>
    async (pairingData: string): Promise<void> => {
      this.setStatus('pairing_step_2');
      const data = JSON.parse(pairingData);
      const result = await this.card.cardPairStepTwo(data);

      if (result.success === false) {
        // handle error
        return;
      }

      socket.emit('PAIR_STEP_THREE', serialiseData(result.data.pairingData));
      this.setStatus('pairing_step_3');
    };

  private onPairStepThree =
    (socket: Socket) =>
    async (pairingData: string): Promise<void> => {
      this.setStatus('pairing_step_3');
      const data = JSON.parse(pairingData);
      const result = await this.card.cardPairStepThree(data);

      if (result.success === false) {
        // handle error
        return;
      }

      socket.emit('PAIR_STEP_FOUR', serialiseData(result.data.pairingData));
      this.setStatus('pairing_step_4');
    };

  private onPairStepFour =
    (socket: Socket) =>
    async (pairingData: string): Promise<void> => {
      this.setStatus('pairing_step_4');
      const data = JSON.parse(pairingData);
      const result = await this.card.cardPairStepFour(data);

      if (result.success === false) {
        // handle error
        return;
      }

      socket.emit('PAIRED');
    };

  private onPaired = (): void => {
    this.setStatus('paired');
  };

  private onReceivePhonon =
    (socket: Socket) =>
    async (transferPacket: string): Promise<void> => {
      const data = JSON.parse(transferPacket);

      const result = await this.card.receivePhonons(data);

      if (result.success === false) {
        // handle error
        return;
      }

      socket.emit('PHONON_TRANSFER_SUCCESS');
      this.events?.onPhononReceived?.();
    };

  private onPhononTransferSuccess = async (): Promise<void> => {
    this.events?.onPhononTransferSuccess?.();
  };

  private setStatus = (newStatus: Status) => {
    this.status = newStatus;
    this.events?.onStatusChange?.(newStatus);
  };
}

const serialiseCert = (cert: CardCertificate) => {
  return JSON.stringify({
    permissions: {
      ...cert.permissions,
      permissions: [...cert.permissions.permissions],
    },
    signature: [...cert.signature],
    publicKey: [...cert.publicKey],
  });
};

const serialiseData = (data: Uint8Array) => JSON.stringify([...data]);
