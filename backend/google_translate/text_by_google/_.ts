import translate from 'translate-google';

export async function translateTextByGoogle(text: string, fromLang: string, toLang: string): Promise<string> {
    try {
        const res = await translate(text, { from: fromLang, to: toLang });
        return res;
    } catch (err) {
        console.error('Error translating chat:', err);
        throw err;
    }
}
