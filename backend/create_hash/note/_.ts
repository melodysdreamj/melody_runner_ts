import dotenv from "dotenv";
import { HashGenerator } from "../_";

dotenv.config();

;(async () => {
    console.log("start");

    const word = "hello";
    const userLanguageForWord = "en";
    const wordLanguage = "en";

    const sentence = "안녕하세요, 이것은 문장입니다.";
    const userLanguageForSentence = "ko";
    const sentenceLanguage = "ko";

    console.log("--- Word Hash ---");
    const wordHash = await HashGenerator.createWordHash(
        word,
        userLanguageForWord,
        wordLanguage
    );
    console.log(`Hash of the word "${word}": ${wordHash}`);

    console.log("\n--- Sentence Hash ---");
    const sentenceHash = await HashGenerator.createSentenceHash(
        sentence,
        sentenceLanguage,
        userLanguageForSentence
    );
    console.log(`Hash of the sentence "${sentence}": ${sentenceHash}`);

    console.log("\n--- Sentence Voice Hash ---");
    const voiceHash = await HashGenerator.createSentenceVoiceHash(
        sentence, "unknown_speaker", "ko"
    );
    console.log(`Hash of voice: ${voiceHash}`);

    process.exit(0);
})();

export {};
