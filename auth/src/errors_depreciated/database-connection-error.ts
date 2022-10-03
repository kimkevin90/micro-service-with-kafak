import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to database";

  constructor() {
    super("Error connecting to database");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

/*
- CustomError 추상클래스 적용 전

export class DatabaseConnectionError extends Error {
  statusCode = 500;
  reason = "데이터베이스 오류";
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  // 모든 에러 형식 동일하게
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
*/
