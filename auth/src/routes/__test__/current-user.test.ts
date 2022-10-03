import request from "supertest";
import { app } from "../../app";

/*
 supertest는 자동으로 쿠키와 함꼐 요청을 보내지 않으므로 currentuser에 null이 출력됨

1) 쉬운 해결 방안 - cookie set으로 할당
it("responds with details about the current user", async () => {
  const authRes = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const cookie = authRes.get("Set-Cookie");

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  console.log(response.body);
  expect(response.body.currentUser.eampi).toEqual('test@test.com');
});
*/

/*
  위 해결방안의 경우 매번 쿠키가 필요할시 작성 해야한다.
 setup.ts에 global signin 함수만든 후 재사용 가능
*/
it("responds with details about the current user", async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  console.log("response---");
  expect(response.body.currentUser).toEqual(null);
});
