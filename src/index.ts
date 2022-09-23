// @ts-ignore
import * as smartcard from 'smartcard';
import { createSendCommand } from './adapters';
import PhononCard from './PhononCard';
import RemotePairing from './RemotePairing';

const devicesEvents = new smartcard.Devices();
const util = require('util');

util.inspect.defaultOptions.maxArrayLength = null;

devicesEvents.on('device-activated', (event: any) => {
  event.device.on('card-inserted', (event: any) => {
    onCardDetected(event);
  });
  event.device.on('card-removed', (event: any) => {
    console.log('Card removed');
  });
});

const phononCards: PhononCard[] = [];

const testCardPairing = async () => {
  const sender = phononCards[1];
  const recipient = phononCards[0];

  if (!sender || !recipient) {
    console.log('Waiting for both cards to connect');
    return;
  }

  console.log('Both cards connected');

  await sender.createPhonon('secp256k1');
  const beforeSenderPhonons = await sender.listPhonons();
  const beforeRecipientPhonons = await recipient.listPhonons();

  console.log('before sender phonons', beforeSenderPhonons);
  console.log('before recipient phonons', beforeRecipientPhonons);

  const senderStep1Response = await sender.cardPairStepOne(
    recipient.getCertificate()
  );

  if (senderStep1Response.success === false) {
    throw senderStep1Response.error;
  }

  const recipientStep1Response = await recipient.cardPairStepTwo(
    senderStep1Response.data.pairingData
  );

  if (recipientStep1Response.success === false) {
    throw recipientStep1Response.error;
  }

  const senderStep2Response = await sender.cardPairStepThree(
    recipientStep1Response.data.pairingData
  );

  if (senderStep2Response.success === false) {
    throw senderStep2Response.error;
  }

  await recipient.cardPairStepFour(senderStep2Response.data.pairingData);

  const sendResponse = await sender.sendPhonons([1]);

  if (sendResponse.success === false) {
    throw sendResponse.error;
  }

  const receiveResponse = await recipient.receivePhonons(
    sendResponse.data.transferPackets
  );

  if (receiveResponse.success === false) {
    throw receiveResponse.error;
  }

  const afterSenderPhonons = await sender.listPhonons();
  const afterRecipientPhonons = await recipient.listPhonons();

  console.log('after sender phonons', afterSenderPhonons);
  console.log('after recipient phonons', afterRecipientPhonons);

  const sendResponse2 = await recipient.sendPhonons([1]);

  if (sendResponse2.success === false) {
    throw sendResponse2.error;
  }

  const receiveResponse2 = await sender.receivePhonons(
    sendResponse2.data.transferPackets
  );

  if (receiveResponse2.success === false) {
    throw receiveResponse2.error;
  }

  const afterSenderPhonons2 = await sender.listPhonons();

  const afterRecipientPhonons2 = await recipient.listPhonons();

  console.log('after sender phonons', afterSenderPhonons2);
  console.log('after recipient phonons', afterRecipientPhonons2);
};

const testRemotePairing = async () => {
  const sender = phononCards[0];
  const recipient = phononCards[1];

  if (!sender || !recipient) {
    console.log('Waiting for both cards to connect');
    return;
  }

  console.log('Both cards connected');

  const senderRemotePairing = new RemotePairing(
    sender,
    'http://localhost:3001',
    { onStatusChange: (newStatus) => console.log('sender', newStatus) }
  );

  const recipientRemotePairing = new RemotePairing(
    recipient,
    'http://localhost:3001',
    { onStatusChange: (newStatus) => console.log('recipient', newStatus) }
  );

  await Promise.all([
    senderRemotePairing.pair('abc123'),
    recipientRemotePairing.pair('abc123'),
  ]);

  console.log('Cards paired');

  // await sender.createPhonon('secp256k1');
  const beforeSenderPhonons = await sender.listPhonons();
  const beforeRecipientPhonons = await recipient.listPhonons();

  console.log('before sender phonons', beforeSenderPhonons);
  console.log('before recipient phonons', beforeRecipientPhonons);

  await senderRemotePairing.sendPhonons([1]);

  senderRemotePairing.unpair();
};

const onCardDetected = async (event: any) => {
  console.log('Card inserted');
  const sendCommand = createSendCommand(event.card);
  const card = new PhononCard(sendCommand);

  await card.pair();
  await card.unlock('111111');
  phononCards.push(card);

  // await testCardPairing();

  await testRemotePairing();
};
