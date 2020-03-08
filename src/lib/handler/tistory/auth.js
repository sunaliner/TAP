const axios = require("axios").default;

const tistoryAuth = app => {
  app.get("/auth", crossAllow(auth));
  app.get("/auth/callback", crossAllow(authCallback));
  app.get("/auth/access_token", crossAllow(getAccessToken));
};

const crossAllow = cb => (req, res) => {
  // res.set({ "access-control-allow-origin": "*" });
  // req.method = req.headers["access-control-request-method"];
  return cb(req, res);
};

const auth = (req, res) => {
  console.log("requset tistory get posting");
  const client_id = process.env.TISTORY_APP_ID;
  const redirect_uri = process.env.TISTORY_REDIRECT_URL;
  axios
    .get("https://www.tistory.com/oauth/authorize", {
      params: { client_id, redirect_uri, response_type: "code" }
    })
    .then(tres => {
      res.send(tres.data);
    })
    .catch(err => {
      res.json(err);
    });
};

const authCallback = (req, res) => {
  console.log("requset tistory get redirect");
  const code = req.query.code;
  const state = req.query.state;
  const client_id = process.env.TISTORY_APP_ID;
  const client_secret = process.env.TISTORY_CLIENT_SECRET;
  const redirect_uri = process.env.TISTORY_REDIRECT_URL;
  const grant_type = "authorization_code";

  axios
    .get("https://www.tistory.com/oauth/access_token", {
      params: {
        client_id,
        client_secret,
        redirect_uri,
        code: code,
        grant_type
      }
    })
    .then(tres => {
      console.log([code, client_id, client_secret, redirect_uri]);
      res.json(tres.data);
    })
    .catch(err => {
      res.json(err);
    });
};
const getAccessToken = (req, res) => {
  console.log("requset tistory get access_token");
  const client_id = process.env.TISTORY_APP_ID;
  const client_secret = process.env.TISTORY_CLIENT_SECRET;
  const redirect_uri = process.env.TISTORY_REDIRECT_URL;
  const code = req.params.code || req.query.code;
  axios
    .get("https://www.tistory.com/oauth/access_token", {
      params: {
        client_id,
        client_secret,
        redirect_uri,
        code: code,
        grant_type: "authorization_code"
      }
    })
    .then(tres => {
      console.log([code, client_id, client_secret, redirect_uri]);
      res.json(tres.data);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.auth = tistoryAuth;
