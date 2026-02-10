
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface DuckDuckGoResult {
    title: string;
    link: string;
}

export class DuckDuckGo {
    /**
     * DuckDuckGo에서 검색 수행 (HTML 파싱 방식)
     * @param query 검색어
     * @returns 검색 결과 배열 { title, link }
     */
    static async search(query: string): Promise<DuckDuckGoResult[]> {
        try {
            // 덕덕고 검색 URL (HTML 버전)
            const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

            // HTTP GET 요청으로 HTML 데이터 가져오기
            // User-Agent 헤더를 추가하여 봇 차단을 방지하는 것이 좋음
            const { data } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Referer': 'https://duckduckgo.com/'
                }
            });

            // Cheerio를 이용해 HTML 파싱
            const $ = cheerio.load(data);

            // 검색 결과를 저장할 배열
            const results: DuckDuckGoResult[] = [];

            // 검색 결과를 선택하고 배열에 저장
            // 덕덕고 HTML 구조에 의존적이므로 변경될 수 있음
            $('a.result__a').each((i, element) => {
                const title = $(element).text();
                const link = $(element).attr('href');
                
                if (title && link) {
                    results.push({ title, link });
                }
            });

            return results;
        } catch (error) {
            console.error('Error searching DuckDuckGo:', error);
            // 에러 발생 시 빈 배열 반환 또는 throw 선택
            return [];
        }
    }
}
