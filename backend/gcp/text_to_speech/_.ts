
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";
import * as fs from "fs/promises";

// 클라이언트는 한 번만 초기화하고 재사용하는 것이 좋습니다.
const client = new TextToSpeechClient();

export interface TTSVoiceOptions {
  languageCode: string; // e.g., "ko-KR"
  name: string;         // e.g., "ko-KR-Neural2-A"
  ssmlGender?: "MALE" | "FEMALE" | "NEUTRAL";
}

function cleanTextForTTS(text: string): string {
  let cleanedText = text;

  // 1. ⟪...⟫ 패턴을 반복적으로 제거 (중첩 처리)
  while (/⟪([^⧸]+)⧸[^⟫]*⟫/.test(cleanedText)) {
    cleanedText = cleanedText.replace(/⟪([^⧸]+)⧸[^⟫]*⟫/g, "$1");
  }

  // 2. HTML/XML 태그 제거 (예: <b>, <p> 등)
  cleanedText = cleanedText.replace(/<[^>]*>/g, "");

  // 3. 다양한 종류의 장식용 괄호 제거
  cleanedText = cleanedText.replace(/[「」『』【】]/g, "");

  // 4. 이모지 제거
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  cleanedText = cleanedText.replace(emojiRegex, "");

  // 5. 연속된 공백 정리
  cleanedText = cleanedText.replace(/\s+/g, " ").trim();

  return cleanedText;
}

function truncateTextByBytes(
  text: string,
  maxBytes: number,
  force: boolean = false
): string {
  const buffer = Buffer.from(text, "utf8");

  if (buffer.length <= maxBytes) {
    return text;
  }

  if (force) {
    console.log(
      `[TTS] 강제로 텍스트를 자릅니다. (원본: ${buffer.length} bytes -> 대상: ${maxBytes} bytes)`
    );
  } else {
    console.log(
      `[TTS] 텍스트가 너무 깁니다 (${buffer.length} bytes). ${maxBytes} 바이트로 잘라냅니다.`
    );
  }

  let truncatedBuffer = buffer.slice(0, maxBytes);

  // 멀티바이트 문자가 깨지지 않도록 마지막 문자 경계를 찾습니다.
  while (
    truncatedBuffer.length > 0 &&
    (truncatedBuffer[truncatedBuffer.length - 1] & 0xc0) === 0x80
  ) {
    truncatedBuffer = truncatedBuffer.slice(0, -1);
  }

  return truncatedBuffer.toString("utf8");
}

/**
 * 텍스트를 음성으로 변환하여 파일에 저장합니다.
 * @param text 변환할 텍스트
 * @param options 음성 설정 (언어, 이름 등)
 * @param outputFileName 저장할 파일 경로
 * @param forceTruncate 텍스트 길이 강제 자르기 여부
 */
export async function synthesizeSpeechToFile(
  text: string,
  options: TTSVoiceOptions,
  outputFileName: string,
  forceTruncate: boolean = false
): Promise<boolean> {
  const cleanedText = cleanTextForTTS(text);
  const processedText = truncateTextByBytes(cleanedText, 800, forceTruncate);

  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text: processedText },
    voice: { 
        languageCode: options.languageCode, 
        name: options.name,
        ssmlGender: options.ssmlGender as protos.google.cloud.texttospeech.v1.SsmlVoiceGender 
    },
    audioConfig: {
      audioEncoding: "OGG_OPUS",
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error("Audio content is empty.");
    }

    await fs.writeFile(outputFileName, response.audioContent, "binary");
    console.log(`✅ [${outputFileName}] 생성 완료!`);
    return true;

  } catch (error) {
    console.error(`[TTS Error] File Synthesis failed:`, error);
    return false;
  }
}

/**
 * 텍스트를 음성으로 변환하여 버퍼(Uint8Array) 형태로 반환합니다.
 * @param text 변환할 텍스트
 * @param options 음성 설정
 * @param forceTruncate 텍스트 길이 강제 자르기 여부
 */
export async function synthesizeSpeechToBuffer(
  text: string,
  options: TTSVoiceOptions,
  forceTruncate: boolean = false
): Promise<Buffer | null> {
  const cleanedText = cleanTextForTTS(text);
  const processedText = truncateTextByBytes(cleanedText, 800, forceTruncate);

  const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
    input: { text: processedText },
    voice: { 
        languageCode: options.languageCode, 
        name: options.name,
        ssmlGender: options.ssmlGender as protos.google.cloud.texttospeech.v1.SsmlVoiceGender 
    },
    audioConfig: {
      audioEncoding: "OGG_OPUS",
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
        return null;
    }

    return response.audioContent instanceof Buffer
      ? response.audioContent
      : Buffer.from(response.audioContent);

  } catch (error) {
    console.error(`[TTS Error] Buffer Synthesis failed:`, error);
    return null;
  }
}
