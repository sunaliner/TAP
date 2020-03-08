const axios = require("axios").default;
const database = require("../../database");

const blogs = app => {
  app.get("/tistory/blogs", crossAllow(getTistoryBlogs));
  app.post("/tistory/blogs", crossAllow(postTistoryBlogs));
  app.post("/tistory/blogs/:userId", crossAllow(postTistoryBlogsUserId));
};

const crossAllow = cb => (req, res) => {
  // res.set({ "access-control-allow-origin": "*" });
  // req.method = req.headers["access-control-request-method"];
  return cb(req, res);
};

const getTistoryBlogs = async (req, res) => {
  console.log("requset tistory get blog info");
  const access_token = req.query.access_token;
  database.connect();

  const tbres = await database.tblogs.select();
  axios
    .get("https://www.tistory.com/apis/blog/info", {
      params: { access_token, output: "json" }
    })
    .then(tres => {
      let data = tres.data;
      data.tistory.item.blogIds = tbres.map(t => t.blogId);
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
};

const postTistoryBlogsUserId = async (req, res) => {
  database.connect();
  const blogs = JSON.parse(req.body.json);
  const userId = req.query.userId || req.params.userId;
  console.log(blogs);
  console.log("user update tuserId set!", blogs.length);
  if (blogs[0])
    await database.users
      .update(userId, { tuserId: parseInt(blogs[0].userId) })
      .then(res => {
        console.log("user update tuserId success!", res);
      });
  console.log("requset tistory post blog info");
  blogs.map(blog => {
    const storyAI_posting = blog.storyAI_posting;
    const coupang_posting = blog.coupang_posting;
    let data = {
      access_token: blog.access_token,

      userId: parseInt(blog.userId),
      user_account: blog.id,

      blogId: parseInt(blog.blogId),
      name: blog.name,
      url: blog.url,
      nickname: blog.nickname,
      title: blog.title,
      description: blog.description,
      default: blog.default,
      statistics_post: parseInt(blog.statistics_post),
      statistics_comment: parseInt(blog.statistics_comment),
      statistics_trackback: parseInt(blog.statistics_trackback),
      storyAI_posting: parseInt(storyAI_posting) || 0,
      coupang_posting: parseInt(coupang_posting) || 0
    };
    database.tblogs
      .insert(data)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        console.log("이미 등록된 블로그 정보입니다");
        if (err.errno === 1062)
          res.json({ msg: "이미 등록된 블로그 정보입니다." });
      });
  });
};

const getBlogsCategoties = async () => {
  let response = await axios.get("https://www.tistory.com/apis/blog/info", {
    params: { access_token, output: "json" }
  });
  if (response.data) return response.data.tistory.item.categories;
  else return undefined;
};

const postTistoryBlogs = (req, res) => {
  console.log("requset tistory post blog info");
  database.connect();
  const blogs = JSON.parse(req.body.json);
  blogs.map(blog => {
    const storyAI_posting = blog.storyAI_posting;
    const coupang_posting = blog.coupang_posting;
    let data = {
      access_token: blog.access_token,

      userId: parseInt(blog.userId),
      user_account: blog.id,

      blogId: parseInt(blog.blogId),
      name: blog.name,
      url: blog.url,
      nickname: blog.nickname,
      title: blog.title,
      description: blog.description,
      default: blog.default,
      statistics_post: parseInt(blog.statistics_post),
      statistics_comment: parseInt(blog.statistics_comment),
      statistics_trackback: parseInt(blog.statistics_trackback),
      storyAI_posting: parseInt(storyAI_posting) || 0,
      coupang_posting: parseInt(coupang_posting) || 0
    };
    const categories = getBlogsCategoties();
    if (categories) {
      data.categories = JSON.stringify(categories);
    }
    database.tblogs
      .insert(data)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        if (err.errno === 1062)
          res.json({ msg: "이미 등록된 블로그 정보입니다." });
      });
  });
};

exports.blogs = blogs;
