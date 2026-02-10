
import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
  SendTemplatedEmailCommand,
  SendTemplatedEmailCommandInput,
  SendRawEmailCommand,
  SendRawEmailCommandInput,
} from "@aws-sdk/client-ses";
/**
 * Amazon SES를 사용하여 이메일을 전송하는 클래스 (AWS SDK v3)
 */
export class AmazonSESLite {
  private static client: SESClient;

  /**
   * AWS SES 클라이언트 초기화
   */
  private static getClient(): SESClient {
    if (!this.client) {
      this.client = new SESClient({
        region: process.env.AWS_REGION ?? "ap-northeast-2",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
        },
      });
    }
    return this.client;
  }

  /**
   * 간단한 텍스트 이메일 전송
   * @param from 발신자 이메일 주소 (SES에서 검증된 주소여야 함)
   * @param to 수신자 이메일 주소
   * @param subject 이메일 제목
   * @param textBody 이메일 본문 (텍스트)
   */
  static async sendSimpleEmail(
    from: string,
    to: string,
    subject: string,
    textBody: string
  ): Promise<{ MessageId: string }> {
    const client = this.getClient();

    const params: SendEmailCommandInput = {
      Source: from,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const result = await client.send(command);
      console.log("이메일 발송 성공:", result.MessageId);
      return { MessageId: result.MessageId! };
    } catch (error) {
      console.error("이메일 발송 실패:", error);
      throw error;
    }
  }

  /**
   * HTML 이메일 전송
   * @param options 이메일 옵션
   */
  static async sendEmail(options: {
    from: string;
    to: string | string[];
    subject: string;
    textBody?: string;
    htmlBody?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string | string[];
  }): Promise<{ MessageId: string }> {
    const client = this.getClient();

    // 수신자 주소들을 배열로 변환
    const toAddresses = Array.isArray(options.to) ? options.to : [options.to];
    const ccAddresses = options.cc
      ? Array.isArray(options.cc)
        ? options.cc
        : [options.cc]
      : undefined;
    const bccAddresses = options.bcc
      ? Array.isArray(options.bcc)
        ? options.bcc
        : [options.bcc]
      : undefined;
    const replyToAddresses = options.replyTo
      ? Array.isArray(options.replyTo)
        ? options.replyTo
        : [options.replyTo]
      : undefined;

    // Body 구성
    const body: any = {};
    if (options.textBody) {
      body.Text = {
        Data: options.textBody,
        Charset: "UTF-8",
      };
    }
    if (options.htmlBody) {
      body.Html = {
        Data: options.htmlBody,
        Charset: "UTF-8",
      };
    }

    // Destination 구성
    const destination: any = {
      ToAddresses: toAddresses,
    };
    if (ccAddresses && ccAddresses.length > 0) {
      destination.CcAddresses = ccAddresses;
    }
    if (bccAddresses && bccAddresses.length > 0) {
      destination.BccAddresses = bccAddresses;
    }

    const params: SendEmailCommandInput = {
      Source: options.from,
      Destination: destination,
      Message: {
        Subject: {
          Data: options.subject,
          Charset: "UTF-8",
        },
        Body: body,
      },
    };

    if (replyToAddresses && replyToAddresses.length > 0) {
      params.ReplyToAddresses = replyToAddresses;
    }

    try {
      const command = new SendEmailCommand(params);
      const result = await client.send(command);
      console.log("HTML 이메일 발송 성공:", result.MessageId);
      return { MessageId: result.MessageId! };
    } catch (error) {
      console.error("HTML 이메일 발송 실패:", error);
      throw error;
    }
  }

  /**
   * 템플릿을 사용한 이메일 전송
   * @param from 발신자 이메일 주소
   * @param to 수신자 이메일 주소
   * @param templateName SES 템플릿 이름
   * @param templateData 템플릿 데이터 (JSON 객체)
   */
  static async sendTemplateEmail(
    from: string,
    to: string | string[],
    templateName: string,
    templateData: Record<string, any>
  ): Promise<{ MessageId: string }> {
    const client = this.getClient();

    const toAddresses = Array.isArray(to) ? to : [to];

    const params: SendTemplatedEmailCommandInput = {
      Source: from,
      Destination: {
        ToAddresses: toAddresses,
      },
      Template: templateName,
      TemplateData: JSON.stringify(templateData),
    };

    try {
      const command = new SendTemplatedEmailCommand(params);
      const result = await client.send(command);
      console.log("템플릿 이메일 발송 성공:", result.MessageId);
      return { MessageId: result.MessageId! };
    } catch (error) {
      console.error("템플릿 이메일 발송 실패:", error);
      throw error;
    }
  }

  /**
   * Raw 이메일 전송 (첨부파일 포함 가능)
   * @param rawMessage Raw 이메일 메시지 (MIME 형식, base64 인코딩)
   * @param destinations 수신자 이메일 주소 배열 (선택사항)
   */
  static async sendRawEmail(
    rawMessage: string,
    destinations?: string[]
  ): Promise<{ MessageId: string }> {
    const client = this.getClient();

    const params: SendRawEmailCommandInput = {
      RawMessage: {
        Data: Buffer.from(rawMessage, "utf8"),
      },
    };

    if (destinations && destinations.length > 0) {
      params.Destinations = destinations;
    }

    try {
      const command = new SendRawEmailCommand(params);
      const result = await client.send(command);
      console.log("Raw 이메일 발송 성공:", result.MessageId);
      return { MessageId: result.MessageId! };
    } catch (error) {
      console.error("Raw 이메일 발송 실패:", error);
      throw error;
    }
  }

  /**
   * 여러 수신자에게 동일한 이메일 전송 (대량 발송)
   * @param from 발신자 이메일 주소
   * @param toList 수신자 이메일 주소 배열
   * @param subject 이메일 제목
   * @param textBody 텍스트 본문
   * @param htmlBody HTML 본문 (선택사항)
   */
  static async sendBulkEmail(
    from: string,
    toList: string[],
    subject: string,
    textBody: string,
    htmlBody?: string
  ): Promise<{ MessageId: string }> {
    const client = this.getClient();

    const body: any = {
      Text: {
        Data: textBody,
        Charset: "UTF-8",
      },
    };

    if (htmlBody) {
      body.Html = {
        Data: htmlBody,
        Charset: "UTF-8",
      };
    }

    const params: SendEmailCommandInput = {
      Source: from,
      Destination: {
        ToAddresses: toList,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: body,
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const result = await client.send(command);
      console.log("대량 이메일 발송 성공:", result.MessageId);
      return { MessageId: result.MessageId! };
    } catch (error) {
      console.error("대량 이메일 발송 실패:", error);
      throw error;
    }
  }
}
