import PhononCard from './PhononCard';
declare type Status = 'disconnected' | 'pairing_step_1' | 'pairing_step_2' | 'pairing_step_3' | 'pairing_step_4' | 'paired';
declare type Callbacks = {
    onStatusChange?: (newStatus: Status) => void;
    onPhononReceived?: () => void;
    onPhononTransferSuccess?: () => void;
    onUnpair?: () => void;
};
export default class RemotePairing {
    private card;
    private apiUrl;
    private events?;
    status: Status;
    private socket;
    constructor(card: PhononCard, apiUrl: string, events?: Callbacks | undefined);
    pair: (pairingId: string) => Promise<void>;
    sendPhonons: (keyIndicies: number[]) => Promise<void>;
    unpair: () => void;
    private onDisconnect;
    private onCounterpartyConnected;
    private onPairStepOne;
    private onPairStepTwo;
    private onPairStepThree;
    private onPairStepFour;
    private onPaired;
    private onReceivePhonon;
    private onPhononTransferSuccess;
    private setStatus;
}
export {};
