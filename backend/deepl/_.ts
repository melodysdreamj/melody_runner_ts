
import axios from 'axios';
export class DeepL {
    /**
     * 텍스트 번역 함수
     * @param text 번역할 텍스트
     * @param fromLang 원본 언어 코드 (예: 'en')
     * @param toLang 목표 언어 코드 (예: 'ko')
     * @returns 번역된 텍스트
     */
    static async translate(text: string, fromLang: string, toLang: string): Promise<string> {
        const apiKey = process.env.DEEPL_API_KEY;
        const url = 'https://api-free.deepl.com/v2/translate';

        if (!apiKey) {
            throw new Error("DEEPL_API_KEY is not set in environment variables.");
        }

        try {
            // DeepL API 요청 보내기
            // axios.post의 두 번째 인자는 body, 세 번째는 config
            // DeepL API는 x-www-form-urlencoded 형식이나 JSON 등을 지원하지만
            // 여기서는 params(Query String)로 보내거나 data로 보낼 수 있음.
            // 원본 코드는 params를 사용했으나 POST body로 보내는 것이 더 안전함 (길이 제한 등).
            // 하지만 원본 코드의 의도를 유지하여 params로 보냄 (DeepL 문서를 보면 POST로 body에 데이터를 담는 것을 권장하지만 params도 동작은 함)
            // 안정을 위해 `new URLSearchParams`를 사용하여 body로 전송하도록 개선
            
            const params = new URLSearchParams();
            params.append('auth_key', apiKey);
            params.append('text', text);
            params.append('source_lang', fromLang);
            params.append('target_lang', toLang);

            const response = await axios.post(url, params);

            // 번역된 텍스트 가져오기
            const translatedText = response.data.translations[0].text;
            return translatedText;
        } catch (err) {
            console.error('Error translating text:', err);
            throw err;
        }
    }
}
