const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const secret = process.env.SECRET;

const getStoryCode = title => {
  return typeof title === "string" && title.split("_")[1];
};

const createJwtToken = id => {
  let token = jwt.sign(
    {
      id: id // 토큰의 내용(payload)
    },
    secret, // 비밀 키
    {
      expiresIn: "7d" // 유효 시간은 5분
    }
  );
  return token;
};

const decodedToken = token => {
  try {
    let decoded = jwt.verify(token, secret);
    console.log("decoded", decoded);

    return decoded;
  } catch (error) {
    console.log("토큰 유효기간이 지났습니다.");
    return undefined;
  }
};

exports.getStoryCode = getStoryCode;
exports.decodedToken = decodedToken;
exports.createJwtToken = createJwtToken;
