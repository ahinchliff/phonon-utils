export type CommandApdu = {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  data: Uint8Array;
};

export type ResponseApdu = {
  sw: number;
  s1: number;
  s2: number;
  data: Uint8Array;
};

export type EncryptedResponseApduData = {
  data: Uint8Array;
  meta: Uint8Array;
  mac: Uint8Array;
};
