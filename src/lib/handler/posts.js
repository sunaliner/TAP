const database = require("../database");
const { decodedToken } = require("../../util/helper");

const init = app => {
  app.get("/posts", crossAllow(getPost));
  app.get("/posts/:code", crossAllow(getPostCode));
  app.patch("/posts/:code", crossAllow(patchPostCode));
  app.delete("/posts/:code", crossAllow(deletePostCode));
};

const crossAllow = cb => (req, res) => {
  const token = req.headers["x-access-token"] || req.headers["x-api-key"];

  if (!token) return res.status(401).send({ msg: "로그인 후 이용해 주세요!" });

  const dToken = decodedToken(token);

  if (dToken) {
    return cb(req, res);
  } else {
    return res.status(401).send({
      msg: "토큰 유효기간이 지났습니다.\n재로그인 후 이용해 주세요!"
    });
  }
};

const getPost = (req, res) => {
  console.log("requset get post");
  database.connect();
  database.post
    .select(req.query)
    .then(data => {
      console.log("get post success");
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
};

const getPostCode = (req, res) => {
  console.log("requset get post code");
  const code = req.params.code || req.query.code;
  database.connect();
  database.post
    .selectCode(code)
    .then(data => {
      res.json(data[0]);
    })
    .catch(err => {
      res.json(err);
    });
};

const patchPostCode = (req, res) => {
  console.log("requset patch post update");
  const code = req.params.code || req.query.code;
  const newPostData = JSON.parse(req.body.json);
  database.connect();
  database.post
    .updateCode(code, newPostData)
    .then(data => {
      console.log("post update success");
      res.json({ msg: "포스트 저장에 성공했습니다." });
    })
    .catch(error => {
      res.json({ msg: "포스트 저장에 실패했습니다.", error });
    });
};

const deletePostCode = (req, res) => {
  console.log("requset post delete");
  const code = req.params.code || req.query.code;
  console.log("code:", code);
  database.connect();
  database.post
    .deleteCode(code)
    .then(data => {
      console.log("post update success");
      res.json({ msg: "포스트 삭제에 성공했습니다." });
    })
    .catch(error => {
      res.json({
        msg: "포스트 삭제에 실패했습니다.\n잠시 후 다시 시도해주세요.",
        error
      });
    });
};

exports.init = init;
