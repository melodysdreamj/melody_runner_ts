
import { requestDeepseek32Exp } from "../_";

;(async () => {
  console.log("Deepseek 3.2 Exp 테스트 시작");

  const prompt = "안녕하세요! 간단한 자기소개를 해주세요.";

  try {
    const response = await requestDeepseek32Exp(prompt);

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
