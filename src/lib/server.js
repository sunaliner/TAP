const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const swaggerUi = require("swagger-ui-express");
// const swaggerDocument = require("../../swagger.json");

const handler = require("./handler");

const app = express();
dotenv.config();

const start = route => {
  console.log("TAP service start!");

  // process.setMaxListeners(10);
  handler.schedule.start();

  // swagger 문서 설정
  // app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // CORS 설정
  app.use(cors());
  // body use
  app.use(express.json());

  app.listen(process.env.PORT, () => {
    // curl -X GET '127.0.0.1:3003/posts
    console.log("listen port " + process.env.PORT);
  });

  // 루트
  app.get("/", function(req, res) {
    return res.send("Hello word!");
  });

  // 에러 처리
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  });

  // 티스토리 블로그 인증
  handler.tistory.auth(app);
  // 티스트리 블로그 등록
  handler.tistory.blogs(app);

  // 디비 포스트
  handler.posts.init(app);

  // 자동 포스팅 목록 기능
  handler.posting.init(app);

  // 사용자 로그인, 블로그 등록
  handler.user.init(app);

  app.use("/error", err => {
    console.log("error : ", err);
  });
};
exports.start = start;
