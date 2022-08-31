import { ResponseFormat } from '@/common/interfaces';

export class Response {
  public code: number;
  public message: string;
  public result?: any;

  constructor(responseCode: ResponseFormat) {
    this.code = responseCode.code;
    this.message = responseCode.message;
  }

  public data(data: any) {
    this.result = data;
    return this;
  }

  public toJson() {
    return {
      code: this.code,
      message: this.message,
      data: this.result,
    };
  }
}
