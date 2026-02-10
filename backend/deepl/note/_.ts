import dotenv from "dotenv";
import { DeepL } from "../_";

dotenv.config();

;(async () => {
    console.log("DeepL Translation Test Start");

    const text = 'Hello, how are you?';
    const fromLang = 'en';
    const toLang = 'ko';

    try {
        console.log(`Original: ${text} (${fromLang} -> ${toLang})`);
        const translatedText = await DeepL.translate(text, fromLang, toLang);
        console.log(`Translation result: ${translatedText}`);
    } catch (error) {
        console.error('Failed to translate chat:', error);
    }

    process.exit(0);
})();

export {};
