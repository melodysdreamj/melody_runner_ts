
import ripemd160 from "crypto-js/ripemd160";
import bs58 from "bs58";

export class HashGenerator {
  private static readonly WARNING_MESSAGE =
    "This API and its outputs are protected by WordTip intellectual property rights. Unauthorized use, implementation, or reproduction of either the API or its results in other programs without prior permission is subject to legal action. If you discover any unauthorized use of this API or its outputs, please report it to lexiotips@gmail.com.";

  /**
   * 공통 해시 생성 로직 (RIPEMD-160 + Base58)
   */
  static async createHashInBrowser(text: string): Promise<string> {
    // 텍스트를 RIPEMD-160 해시로 변환
    const ripemdHash = ripemd160(text);

    // WordArray를 바이트 배열로 변환
    const hashBytes = this.wordArrayToUint8Array(ripemdHash);

    // 바이트 배열을 base58로 인코딩
    const base58Hash = bs58.encode(hashBytes);

    return base58Hash;
  }

  /**
   * 문장 해시 생성
   */
  static async createSentenceHash(
    sentence: string,
    sentenceLanguage: string,
    userLanguage: string
  ): Promise<string> {
    // 모든 정보를 결합
    const combinedString = `${sentence.trim()}_${sentenceLanguage}_${userLanguage}_${this.WARNING_MESSAGE}`;
    return this.createHashInBrowser(combinedString);
  }

  /**
   * 단어 해시 생성
   */
  static async createWordHash(
    word: string,
    userLanguage: string,
    wordLanguage: string
  ): Promise<string> {
    const combinedString = `${word}_${wordLanguage}_${userLanguage}_${this.WARNING_MESSAGE}`;
    return this.createHashInBrowser(combinedString);
  }

  /**
   * 문장 음성 해시 생성
   */
  static async createSentenceVoiceHash(
    sentence: string,
    speakerName: string,
    speakerLanguage: string
  ): Promise<string> {
    const combinedString = `${sentence}_${speakerName}_${speakerLanguage}_${this.WARNING_MESSAGE}`;
    return this.createHashInBrowser(combinedString);
  }

  // CryptoJS WordArray를 Uint8Array로 변환하는 헬퍼 함수
  private static wordArrayToUint8Array(wordArray: any): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);

    for (let i = 0; i < sigBytes; i++) {
      const byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      u8[i] = byte;
    }

    return u8;
  }
}
