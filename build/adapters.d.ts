import { CommandApdu, ResponseApdu } from './apdu/apdu-types';
export declare const createSendCommand: (card: any) => (command: CommandApdu) => Promise<ResponseApdu>;
