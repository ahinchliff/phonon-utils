// @ts-ignore
import * as smartcard from 'smartcard';
import { CommandApdu, ResponseApdu } from './apdu/apdu-types';
import { deserializeResponse } from './utils/cryptography-utils';

export const createSendCommand =
  (card: any) =>
  async (command: CommandApdu): Promise<ResponseApdu> => {
    const application = new smartcard.Iso7816Application(card);
    const _response = await application.issueCommand(
      new smartcard.CommandApdu({ ...command, data: [...command.data] })
    );
    const response = new Uint8Array(_response.buffer);
    return deserializeResponse(response);
  };
