
import { AmazonSESLite } from "../_";

;(async () => {
    console.log("Amazon SES 이메일 전송 테스트 시작");

    try {
        // 1. 간단한 텍스트 이메일 전송
        console.log("\n1. 간단한 텍스트 이메일 전송");
        const simpleResult = await AmazonSESLite.sendSimpleEmail(
            "master@canto.gg",
            "melodysdreamj@gmail.com",
            "테스트 이메일 제목",
            "이것은 간단한 텍스트 이메일입니다."
        );
        console.log("전송 성공! Message ID:", simpleResult.MessageId);

        // 2. HTML 이메일 전송
        console.log("\n2. HTML 이메일 전송");
        const htmlResult = await AmazonSESLite.sendEmail({
            from: "master@canto.gg",
            to: "melodysdreamj@gmail.com",
            subject: "HTML 이메일 테스트",
            textBody: "이것은 텍스트 버전입니다.",
            htmlBody: `
        <html>
          <body>
            <h1>안녕하세요!</h1>
            <p>이것은 <strong>HTML</strong> 이메일입니다.</p>
            <ul>
              <li>항목 1</li>
              <li>항목 2</li>
              <li>항목 3</li>
            </ul>
          </body>
        </html>
      `,
        });
        console.log("전송 성공! Message ID:", htmlResult.MessageId);

        // 3. 여러 수신자에게 이메일 전송
        console.log("\n3. 여러 수신자에게 이메일 전송");
        const multipleResult = await AmazonSESLite.sendEmail({
            from: "master@canto.gg",
            to: ["melodysdreamj@gmail.com", "melodysdreamjune@gmail.com", "melodydreamjtest14@gmail.com"],
            cc: "cc@example.com",
            bcc: ["bcc1@example.com", "bcc2@example.com"],
            replyTo: "reply-to@example.com",
            subject: "여러 수신자 테스트",
            textBody: "여러 수신자에게 보내는 이메일입니다.",
            htmlBody: "<h1>여러 수신자에게 보내는 HTML 이메일</h1>",
        });
        console.log("전송 성공! Message ID:", multipleResult.MessageId);

        console.log("\n모든 테스트 완료!");
    } catch (error) {
        console.error("이메일 전송 중 오류 발생:", error);
    }

    process.exit(0);
})();

export {};
