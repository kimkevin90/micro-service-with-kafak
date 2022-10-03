import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  function signin(): Promise<string[]>;
}

let mongo: any;

// setupFilesAfterEnv 환경으로 실행
// beforeAll 모든 테스트가 실행되기 전에 실행
beforeAll(async () => {
  process.env.JWT_KEY = "asdfasdf";
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// beforeAll 이후 , 각각의 테스트 진행전에 진행
beforeEach(async () => {
  // 모든 컬렉션 초기화
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// 모든 테스트 끝낸 후 inmemory 몽고DB 종료
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

// signin 요청 재활용할 수 있는 signin 함수 선언
global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
