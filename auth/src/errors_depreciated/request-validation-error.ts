import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");

    // Error 클래스를 확장하므로 RequestValidationError 프로토타입을 요청
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}

/*
- CustomError 추상클래스 적용 전

export class RequestValidationError extends CustomError {
      // private을 사용하여 error속성을 전체 클래스에 적용한다. 아래와 동일
      // errors: ValidationError[]
      // constructor(errors: ValidationError[]) {
      //   this.errors = errors;
      // }
  

      statusCode = 400;
      constructor(public errors: ValidationError[]) {
        super();
    
        // Error 클래스를 확장하므로 RequestValidationError 프로토타입을 요청
        Object.setPrototypeOf(this, RequestValidationError.prototype);
      }
    
      serializeErrors() {
        return this.errors.map((error) => {
          return { message: error.msg, field: error.param };
        });
      }
    }
    
*/
