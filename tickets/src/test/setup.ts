import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";

declare global {
  function signin(): string[];
}

jest.mock("../kafka-wrapper");

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

/*
 기존 auth 서비스에서는 signup api로 대응했지만,
 종속성이 분리된 ticket 서비스에서는 아래와 jwt 토큰 만들어주기
*/
global.signin = () => {
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
