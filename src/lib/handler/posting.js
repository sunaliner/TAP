const axios = require("axios").default;
const database = require("../database");
const { decodedToken } = require("../../util/helper");

const init = app => {
  app.get("/posting", crossAllow(getPostingList));
  // app.get("/posting/:blogName", crossAllow(getPostingBlogName));
  app.get("/posting/:code", crossAllow(getPostingCode));
  app.post("/posting", crossAllow(postPostingCode));
};

const crossAllow = cb => (req, res) => {
  // res.set({ "access-control-allow-origin": "*" });
  // req.method = req.headers["access-control-request-method"];
  const token =
    req.headers["x-access-token"] ||
    req.headers["x-api-key"] ||
    req.query.token ||
    req.cookie.token;
  const dToken = decodedToken(token);
  console.log(dToken);
  return cb(req, res);
};

const getPostingCode = (req, res) => {
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

const getPostingList = (req, res) => {
  console.log("requset get posting");
  const data = req.query;
  console.log(data);
  database.connect();
  database.posting
    .select(data)
    .then(data => {
      console.log("get post success");
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    });
};

// const getPostingBlogName = async (req, res) => {
//   console.log("디비 code =>  posting");
//   const blogName = req.params.blogName;
//   const dres = await axios.post(`/blogs/${blogName}`);

//   const params = {
//     access_token: req.query.access_token,
//     blogName: dres.data.blogName,
//     title: dres.data.title,
//     content: dres.data.content,
//     visibility: 3,
//     category: dres.data.category,
//     tag: dres.data.tag,
//     output: "json"
//   };
//   const storyAI_posting = dres.data.storyAI_posting;
//   if (storyAI_posting && storyAI_posting > 0)
//     axios
//       .post("https://www.tistory.com/apis/post/white", {
//         params: params
//       })
//       .then(tres => {
//         res.json(tres.data);
//       })
//       .catch(err => {
//         res.json(err);
//       });
//   else {
//   }
// };

const postPostingCode = (req, res) => {
  console.log("requset post posting");
  let { id, posting, ...data } = JSON.parse(req.body.json);
  if (typeof data !== "object") {
    res.status(500).send({ msg: "잘못된 데이터 요청입니다!" });
    return false;
  }
  if (data.title) {
    data.title = `${data.title}`.replace('"', '\\"');
    data.title = `${data.title}`.replace("'", "\\'");
  }
  if (data.context) {
    data.context = `${data.context}`.replace(/"/gi, '\\"');
    data.context = `${data.context}`.replace(/'/gi, "\\'");
  }
  database.connect();
  database.posting
    .insert(data)
    .then(pdata => {
      // res.json(data);
      console.log("posting list add successs");
      database.post.updateCode(data.code, { posting: 1 });
      res.send({ msg: "포스팅 목록에 추가되었습니다!" });
    })
    .catch(err => {
      console.log("posting list add fail", err);

      database.post.updateCode(data.code, { posting: 0 });
      res.status(400).send({
        msg: "포스팅 목록 추가가 실패했습니다.\n 입력값들을 확인해 주세요!"
      });
    });
};

exports.init = init;
