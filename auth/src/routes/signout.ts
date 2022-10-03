import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  // session 삭제
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
