import dotenv from "dotenv";
import { translateTextByGoogle } from "./_";

dotenv.config();

;(async () => {
    console.log("start");
    
    const text = 'Hello, how are you?';
    const fromLang = 'en';
    const toLang = 'ko';

    try {
        const translatedText = await translateTextByGoogle(text, fromLang, toLang);
        console.log(`Translation result: ${translatedText}`);
    } catch (error) {
        console.error('Failed to translate chat:', error);
    }
    process.exit(0);
})();

export {};
