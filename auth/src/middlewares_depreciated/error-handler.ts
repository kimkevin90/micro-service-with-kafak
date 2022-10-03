import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 추상클래스 사용으로 instanceof 체크 가능
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  /* CustomeError 추상 클래스 적용 전

   아래와 같은 형식으로 에러처리 진행
   {
            "message": "Email must be valid",
            "field": "email"
    }

  - 각 에러별 statusCode & serializeErrors메소드 생성하여 데이터 반환 일치

  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  */

  /* DB & 요청 에러가 아닌경우 나머지 진행 */
  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
