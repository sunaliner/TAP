const database = require("../database");
const mysqlPassword = require("mysql-password");
const { createJwtToken } = require("../../util/helper");

const init = app => {
  app.get("/overlap/:id", crossAllow(overlapCheck));
  app.post("/signup", crossAllow(signUp));
  app.post("/login", crossAllow(login));
};

const crossAllow = cb => (req, res) => {
  // res.set({ "access-control-allow-origin": "*" });
  // req.method = req.headers["access-control-request-method"];
  return cb(req, res);
};
const overlapCheck = (req, res) => {
  console.log("requset get overlap check");
  const id = req.params.id || req.query.id;
  database.connect();
  database.users
    .select()
    .then(datas => {
      let isOverlap = false;
      console.log(datas.length);
      if (datas.length > 0)
        datas.map(data => {
          console.log("database:", data.userId, ", request:", id);
          if (data.userId === id) {
            isOverlap = true;
          }
        });
      console.log("isOverlap:", isOverlap);
      if (!isOverlap)
        res.status(200).send({ msg: "사용 가능한 아이디입니다!" });
      else {
        res.status(400).send({ msg: "이미 사용중인 아이디입니다!" });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

const signUp = (req, res) => {
  console.log("requset post signUp");
  database.connect();
  const data = JSON.parse(req.body.json);
  console.log(data);
  database.users
    .insert(data, { password: "password" })
    .then(() => {
      console.log("users insert success");
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res
        .status(400)
        .json({ msg: "등록에 실패했습니다. 잠시 후 다시시도 해주세요!" });
    });
};

const login = (req, res) => {
  console.log("requset post login");
  database.connect();
  const data = JSON.parse(req.body.json);
  console.log(data);
  database.users
    .selectUserId(data.userId)
    .then(dres => {
      const passhash = mysqlPassword(data.password);
      const dpass = dres[0].password;
      if (passhash === dpass) {
        console.log("users login success passhash", passhash, "dpass", dpass);
        const jwt_token = createJwtToken(dres[0].userId);
        if (jwt_token) {
          database.users.update(dres[0].userId, { jwt_token });
        }
        res.send({ msg: "로그인에 성공했습니다!", jwt_token });
      } else {
        res.status(403).json({
          msg:
            "로그인에 실패했습니다.\n입력하신 값을 확인 후에 다시시도 해주세요!"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(403).json({
        msg:
          "로그인에 실패했습니다.\n입력하신 값을 확인 후에 다시시도 해주세요!"
      });
    });
};

exports.init = init;
