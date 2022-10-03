import mongoose from "mongoose";
import { Password } from "../services/password";

/* 
UserAttrs 와 UserDoc설정을 통해 입력값과 결과값을 
일치시키도록 한다.
*/
interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  /*
  - 결과값 Password 및 _id 형식 변환
  예시) 
  const test = {name:"sebi", toJSON() {return 1}};
  JSON.stringify(test) 의 결과는 1출력 
  */
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  // 비밀번호가 변경된 경우만 해쉬 진행
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };

/*
typescript는 user 생성 시 각 속성에서 무슨 일이 일어나는지 알 수 없다. 
new User({
  email: "test@test.com",
  pass: "dfadfads",
});

해결방안 1) 인터페이스 적용
- 아래와 같이 인터페이스 적용하면 입력값 오류 추출 가능

interface UserAttrs {
  email: string;
  password: string;
}

const buildUser = (attrs: UserAttrs) => {
  return new User(attrs);
};

buildUser({
  email: "dsfads",
  password: "dfasdf",
  dfasd: "dsfadsf",
});

- buildUser를 계속 가져와야하는 문제 발생
export { User, buildUser };

- 스태틱 메소드 만들면 buildUser import 할필요 없다.
- 그러나 typescript는 스태틱 객체를 이해하지 못한다.
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

- UserModel 인터페이스 생성 후 몽구스 모델에 적용 시 스태틱 build메소드의
  타입 유효성 검사 가능
interface UserModel extends mongoose.Model<any> {
  build(attrs: UserAttrs): any;
}

- UserDoc 생성하여 User 생성 후 결과값에 대한 타입 정의 
  user.email, user.password 출력 가능
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

*/
