/*
각 custom에러의 형식이 statusCode & serializeErrors가 오타로인해 다를 수 있다.
해결방안 1) interface 사용하면 오타 시 에러 발생
interface CustomeError {
  statusCode: number;
  serializeErrors(): {
    message: string;
    field: string;
  }[]
}
*/

/*
해결방안 2) 추상클래스 사용
- 인스턴스화할 수 없고 서브클래스 필요하며, *인스턴스 체크 가능
err instanceof CustomError로 체크
*/
export abstract class CustomError extends Error {
  abstract statusCode: number;

  // new Error('message') ~ 로깅 목적
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
