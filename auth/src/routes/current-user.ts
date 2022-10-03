import express from "express";
import jwt from "jsonwebtoken";
import { currentUser } from "@limkevin1313_ticket/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  // currentUser미들웨어 실행 후 값 없으면 null로 설정
  res.send({ currentUser: req.currentUser || null });

  /*
  currentUser 적용 전 예시)
  - 쿠키를 통한 유저 확인
  유저가 보낸 토큰이 유효하면 payload 리턴
  유효하지 않거나 토큰 자체가 없다면 null 리턴하여 현재 유저확인가능

  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
  */
});

export { router as currentUserRouter };
