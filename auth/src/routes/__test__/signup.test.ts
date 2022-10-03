import request from "supertest";
import { app } from "../../app";

/*
 app.ts & index.ts 파일 분리 후, process.env.JWT_KEY!를
 보장하지 않으므로 초기 400에러 발생 => setup.ts의 beforeAll에 
 임의의 토큰 제공
*/
it("returns a 201 on successful signup", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "alskdflaskjfd",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      email: "alskdflaskjfd",
      password: "p",
    })
    .expect(400);
});

// 복수 테스트 시, jest는 return or await만 입력해도 테스트 가능 꼭 return 안해도된다
it("returns a 400 with missing email and password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "alskjdf",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  /*
  cookieSession 라이브러리에서 secure true 설정으로 인해 https외에는
  쿠키 정보를 받아올 수 없다. 따라서 아래와 같이 설정 변경
  secure: process.env.NODE_ENV !== "test" 
  */

  expect(response.get("Set-Cookie")).toBeDefined();
});
