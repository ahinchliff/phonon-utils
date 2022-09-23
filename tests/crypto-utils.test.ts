import { CommandApdu } from '../src/apdu/apdu-types';
import {
  calculateMac,
  createMeta,
  createPairStepTwoCryptogram,
  decrypt,
  deriveSessionKeys,
  parseResponse,
  encrypt,
  generateSharedSecret,
  parseEncryptedResponseData,
} from '../src/utils/cryptography-utils';

describe('crypto utils', () => {
  describe('deriveSessionKeys', () => {
    it('should return the correct result', () => {
      const SECRET = new Uint8Array([
        60, 196, 131, 164, 15, 70, 12, 174, 47, 78, 178, 227, 223, 113, 108,
        230, 121, 117, 81, 120, 77, 67, 130, 168, 9, 242, 39, 219, 213, 169,
        151, 173,
      ]);
      const PAIRING_KEY = new Uint8Array([
        213, 210, 255, 126, 218, 39, 114, 149, 214, 14, 144, 222, 85, 86, 76,
        122, 177, 159, 130, 233, 143, 87, 43, 161, 53, 239, 142, 23, 8, 75, 139,
        78,
      ]);
      const OPEN_SECURE_CHANNEL_RESPONSE = new Uint8Array([
        144, 15, 222, 252, 98, 131, 144, 72, 39, 89, 47, 255, 10, 39, 235, 56,
        223, 202, 247, 242, 28, 86, 221, 245, 89, 76, 61, 189, 84, 36, 187, 85,
        218, 211, 5, 241, 189, 68, 249, 98, 108, 202, 241, 49, 162, 213, 31, 29,
      ]);
      const result = deriveSessionKeys(
        SECRET,
        PAIRING_KEY,
        OPEN_SECURE_CHANNEL_RESPONSE
      );
      expect(result.encryptionKey).toEqual(
        new Uint8Array([
          150, 211, 142, 220, 213, 102, 109, 251, 144, 8, 41, 175, 4, 113, 237,
          9, 159, 75, 149, 148, 84, 239, 209, 181, 100, 194, 230, 229, 116, 32,
          173, 207,
        ])
      );
      expect(result.macKey).toEqual(
        new Uint8Array([
          45, 81, 90, 155, 60, 200, 46, 103, 109, 210, 171, 128, 254, 26, 12,
          238, 230, 110, 112, 35, 82, 213, 150, 14, 118, 112, 1, 5, 116, 130,
          79, 78,
        ])
      );
      expect(result.iv).toEqual(
        new Uint8Array([
          218, 211, 5, 241, 189, 68, 249, 98, 108, 202, 241, 49, 162, 213, 31,
          29,
        ])
      );
    });
  });

  describe('createPairStepTwoCryptogram', () => {
    it('should return the correct result', async () => {
      const SALT = new Uint8Array([
        146, 121, 172, 224, 30, 200, 185, 129, 62, 92, 108, 20, 11, 30, 207, 63,
        19, 43, 75, 229, 93, 131, 208, 226, 84, 89, 169, 113, 238, 159, 227, 60,
      ]);
      const SIG_DATA_HASH = new Uint8Array([
        133, 121, 60, 88, 4, 208, 195, 75, 88, 64, 40, 92, 3, 255, 177, 217, 41,
        33, 80, 131, 179, 212, 230, 234, 67, 55, 144, 65, 152, 171, 234, 5,
      ]);
      const result = await createPairStepTwoCryptogram(SALT, SIG_DATA_HASH);
      expect(result).toEqual(
        new Uint8Array([
          119, 242, 14, 34, 20, 236, 240, 7, 132, 9, 211, 173, 163, 172, 80,
          152, 42, 75, 218, 205, 248, 183, 152, 77, 195, 132, 21, 59, 116, 5,
          240, 55,
        ])
      );
    });
  });

  describe('createMeta', () => {
    it('should return the correct result #1', async () => {
      const COMMAND: CommandApdu = {
        cla: 128,
        ins: 17,
        p1: 0,
        p2: 0,
        data: new Uint8Array([
          134, 49, 187, 119, 242, 25, 34, 175, 192, 13, 218, 18, 241, 40, 130,
          101, 169, 26, 225, 104, 67, 118, 248, 159, 187, 179, 153, 172, 85,
          114, 205, 228,
        ]),
      };
      const ENCRYPTED_DATA = new Uint8Array([
        70, 134, 124, 123, 200, 235, 230, 210, 113, 174, 61, 206, 125, 46, 218,
        194, 171, 239, 16, 73, 109, 237, 21, 178, 90, 253, 191, 46, 158, 1, 129,
        9, 159, 94, 203, 239, 24, 241, 168, 205, 129, 148, 245, 248, 225, 160,
        125, 88,
      ]);
      const result = createMeta(COMMAND, ENCRYPTED_DATA);
      expect(result).toEqual(
        new Uint8Array([128, 17, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      );
    });
  });

  describe('calculateMac', () => {
    it('should return the correct result #1', async () => {
      const META = new Uint8Array([
        128, 17, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ]);
      const DATA = new Uint8Array([
        211, 155, 191, 64, 114, 125, 155, 255, 4, 19, 92, 65, 82, 88, 173, 182,
        127, 94, 114, 98, 85, 89, 98, 245, 74, 45, 153, 117, 152, 122, 104, 231,
        31, 121, 121, 28, 70, 134, 117, 5, 176, 181, 234, 112, 129, 164, 215,
        186,
      ]);
      const MAC_KEY = new Uint8Array([
        111, 23, 86, 202, 155, 172, 160, 7, 192, 199, 252, 107, 50, 130, 116,
        196, 57, 159, 151, 114, 144, 19, 81, 69, 31, 228, 101, 173, 178, 34,
        114, 199,
      ]);
      const result = calculateMac(META, DATA, MAC_KEY);
      expect(result).toEqual(
        new Uint8Array([
          28, 3, 95, 12, 174, 17, 92, 110, 73, 194, 205, 179, 11, 182, 12, 121,
        ])
      );
    });
  });

  describe('generateSharedSecret', () => {
    it('should return the correct result', async () => {
      const PRIVATE_KEY = new Uint8Array([
        91, 226, 124, 234, 115, 24, 90, 194, 216, 209, 39, 49, 183, 45, 178, 30,
        138, 184, 34, 42, 171, 3, 220, 138, 233, 168, 166, 188, 30, 33, 57, 191,
      ]);
      const CARD_PUBLIC_KEY = new Uint8Array([
        4, 125, 77, 144, 17, 232, 218, 90, 239, 151, 120, 217, 31, 153, 229,
        222, 209, 43, 231, 172, 121, 110, 74, 18, 151, 106, 141, 145, 104, 99,
        45, 142, 160, 169, 126, 245, 52, 176, 92, 205, 156, 114, 129, 242, 38,
        43, 214, 198, 198, 67, 201, 131, 165, 55, 21, 94, 176, 160, 228, 57,
        134, 85, 62, 178, 165,
      ]);
      const result = generateSharedSecret(PRIVATE_KEY, CARD_PUBLIC_KEY);
      expect(result).toEqual(
        new Uint8Array([
          133, 59, 198, 184, 39, 47, 82, 59, 11, 115, 120, 76, 208, 16, 198, 62,
          201, 230, 154, 165, 119, 86, 145, 185, 80, 231, 38, 124, 44, 64, 78,
          178,
        ])
      );
    });
  });

  describe('parseEncryptedResponseData', () => {
    it('should return the correct result', async () => {
      const RESPONSE_DATA = new Uint8Array([
        50, 153, 65, 190, 189, 16, 191, 113, 217, 134, 199, 153, 83, 207, 165,
        249, 224, 174, 104, 225, 19, 105, 98, 194, 201, 8, 204, 70, 251, 18, 76,
        255, 160, 115, 237, 138, 60, 10, 11, 229, 7, 179, 137, 186, 237, 50, 79,
        16,
      ]);

      const IV = new Uint8Array([
        242, 197, 40, 191, 189, 251, 53, 116, 136, 134, 75, 186, 36, 52, 103,
        38,
      ]);

      const result = parseEncryptedResponseData(RESPONSE_DATA, IV);

      expect(result.data).toEqual(
        new Uint8Array([
          224, 174, 104, 225, 19, 105, 98, 194, 201, 8, 204, 70, 251, 18, 76,
          255, 160, 115, 237, 138, 60, 10, 11, 229, 7, 179, 137, 186, 237, 50,
          79, 16,
        ])
      );

      expect(result.meta).toEqual(
        new Uint8Array([48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
      );

      expect(result.mac).toEqual(
        new Uint8Array([
          50, 153, 65, 190, 189, 16, 191, 113, 217, 134, 199, 153, 83, 207, 165,
          249,
        ])
      );
    });
  });

  describe('encrypt', () => {
    it('should return the correct result', () => {
      const DATA = new Uint8Array([
        214, 202, 77, 20, 164, 24, 61, 53, 170, 17, 133, 120, 114, 162, 218,
        250, 162, 92, 26, 99, 135, 67, 239, 26, 102, 205, 3, 157, 160, 243, 12,
        59,
      ]);
      const ENCRYPTION_KEY = new Uint8Array([
        79, 192, 231, 24, 194, 221, 68, 130, 84, 202, 189, 96, 195, 82, 91, 188,
        140, 164, 105, 85, 108, 43, 12, 195, 78, 203, 65, 102, 76, 144, 61, 24,
      ]);
      const IV = new Uint8Array([
        171, 195, 2, 46, 56, 36, 12, 114, 127, 199, 4, 85, 91, 116, 27, 179,
      ]);
      const result = encrypt(DATA, ENCRYPTION_KEY, IV);
      expect(result).toEqual(
        new Uint8Array([
          105, 154, 95, 230, 236, 126, 177, 126, 62, 108, 245, 194, 138, 88, 7,
          166, 199, 25, 53, 57, 156, 173, 153, 51, 83, 37, 76, 190, 2, 164, 221,
          49, 190, 70, 32, 34, 8, 87, 173, 126, 49, 251, 165, 186, 6, 112, 174,
          185,
        ])
      );
    });
  });

  describe('decrypt', () => {
    it('should return the correct result', async () => {
      const ENCRYPTED_DATA = new Uint8Array([
        106, 81, 128, 138, 87, 84, 114, 37, 69, 13, 223, 155, 181, 75, 36, 225,
        15, 94, 192, 209, 110, 32, 10, 73, 59, 159, 109, 63, 1, 171, 234, 138,
        104, 67, 3, 66, 73, 223, 57, 113, 71, 250, 50, 76, 119, 195, 15, 23,
        151, 45, 64, 237, 172, 103, 85, 122, 39, 174, 207, 23, 197, 110, 243,
        90, 12, 44, 1, 126, 86, 4, 201, 221, 49, 81, 129, 231, 204, 70, 201,
        225,
      ]);

      const ENCRYPTION_KEY = new Uint8Array([
        62, 78, 39, 237, 228, 242, 202, 117, 230, 253, 186, 180, 40, 110, 7,
        132, 215, 16, 156, 114, 91, 74, 60, 101, 209, 143, 103, 39, 82, 136,
        164, 74,
      ]);

      const IV = new Uint8Array([
        26, 222, 134, 124, 115, 89, 38, 92, 227, 212, 211, 62, 210, 98, 131, 91,
      ]);

      const result = decrypt(ENCRYPTED_DATA, ENCRYPTION_KEY, IV);

      [
        67, 72, 68, 70, 135, 1, 0, 128, 65, 4, 245, 98, 29, 235, 203, 81, 124,
        165, 113, 39, 185, 142, 255, 242, 133, 31, 72, 49, 45, 72, 254, 4, 100,
        232, 202, 78, 246, 202, 155, 21, 236, 249, 188, 245, 143, 64, 41, 80,
        169, 12, 70, 24, 1, 22, 6, 193, 221, 253, 145, 105, 200, 191, 172, 37,
      ];

      expect(result).toEqual(
        new Uint8Array([
          67, 72, 68, 70, 135, 1, 0, 128, 65, 4, 245, 98, 29, 235, 203, 81, 124,
          165, 113, 39, 185, 142, 255, 242, 133, 31, 72, 49, 45, 72, 254, 4,
          100, 232, 202, 78, 246, 202, 155, 21, 236, 249, 188, 245, 143, 64, 41,
          80, 169, 12, 70, 24, 1, 22, 6, 193, 221, 253, 145, 105, 200, 191, 172,
          37, 80, 182, 231, 102, 203, 28, 191, 140, 115, 102, 144, 0,
        ])
      );
    });
  });

  describe('parseResponseData', () => {
    it("should return the correct result when the response doesn't contain any data", async () => {
      const DATA = new Uint8Array([99, 201]);

      const result = parseResponse(DATA);

      expect(result.sw).toEqual(25545);
      expect(result.s1).toEqual(99);
      expect(result.s2).toEqual(201);
      expect(result.data).toEqual(new Uint8Array());
    });

    it('should return the correct result when the response contains data', async () => {
      const DATA = new Uint8Array([
        19, 208, 120, 33, 94, 183, 236, 174, 167, 68, 26, 122, 127, 79, 75, 118,
        172, 248, 231, 161, 236, 157, 20, 35, 46, 223, 27, 138, 192, 6, 85, 37,
        144, 0,
      ]);
      const result = parseResponse(DATA);
      expect(result.sw).toEqual(36864);
      expect(result.s1).toEqual(144);
      expect(result.s2).toEqual(0);
      expect(result.data).toEqual(
        new Uint8Array([
          19, 208, 120, 33, 94, 183, 236, 174, 167, 68, 26, 122, 127, 79, 75,
          118, 172, 248, 231, 161, 236, 157, 20, 35, 46, 223, 27, 138, 192, 6,
          85, 37,
        ])
      );
    });
  });
});
