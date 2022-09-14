// @ts-ignore
import * as smartcard from 'smartcard';
import { createSendCommand } from './adapters';
import { PHONON_CA_PUBLIC_KEY_DEV } from './constants';
import PhononCard from './PhononCard';

const devices = new smartcard.Devices();
const util = require('util');

util.inspect.defaultOptions.maxArrayLength = null;

devices.on('device-activated', (event: any) => {
  event.device.on('card-inserted', (event: any) => {
    onCardDetected(event);
  });
  event.device.on('card-removed', (event: any) => {
    console.log('Card removed');
  });
});

const onCardDetected = async (event: any) => {
  console.log('Card inserted');
  const sendCommand = createSendCommand(event.card);
  const card = new PhononCard(sendCommand);
  await card.pair();

  console.log(await card.verifyCard(PHONON_CA_PUBLIC_KEY_DEV));
  await card.unlock('111111');
  console.log(await card.listPhonons());
};
