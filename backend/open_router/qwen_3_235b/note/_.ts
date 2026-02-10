
import { requestOpenRouterQwen3_235B_A22B_2507 } from "../_";

;(async () => {
  console.log("Qwen 3 235B 테스트 시작");

  const prompt = "안녕하세요! 간단한 자기소개를 해주세요.";

  try {
    const response = await requestOpenRouterQwen3_235B_A22B_2507(prompt);

    if (response) {
      console.log("응답:", response);
    } else {
      console.log("응답을 받지 못했습니다.");
    }
  } catch (error) {
    console.error("테스트 중 오류 발생:", error);
  }

  console.log("테스트 완료");
  process.exit(0);
})();

export {};
