import dotenv from "dotenv";
import { synthesizeSpeechToFile, synthesizeSpeechToBuffer } from "../_";
import * as fs from "fs/promises";

dotenv.config();

;(async () => {
    console.log("start GCP TTS Test");

    const text = "안녕하세요, 이것은 구글 클라우드 TTS 테스트입니다.";
    
    // 테스트용 음성 설정 (한국어, Neural2-C)
    // 실제 사용 가능한 보이스 이름은 `gcloud alpha text-to-speech voices list` 명령어로 확인 가능
    const voiceOptions = {
        languageCode: "ko-KR",
        name: "ko-KR-Neural2-C", // 남성 (추정)
        ssmlGender: "MALE" as const
    };

    // 1. 파일로 저장
    console.log("\n[1] Synthesize to File");
    const fileResult = await synthesizeSpeechToFile(
        text, 
        voiceOptions, 
        "test_output.ogg"
    );
    if (fileResult) {
        console.log("File saved: test_output.ogg");
    }

    // 2. 버퍼로 반환
    console.log("\n[2] Synthesize to Buffer");
    const buffer = await synthesizeSpeechToBuffer(
        text, 
        voiceOptions
    );
    if (buffer) {
        await fs.writeFile("test_buffer_output.ogg", buffer);
        console.log("Buffer saved: test_buffer_output.ogg");
    }

    process.exit(0);
})();

export {};
