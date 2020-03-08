const axios = require("axios").default;
const database = require("../database");
const cron = require("node-cron");

const log = text => {
  console.log("[schedule]:", `[${new Date()}]`, text);
};

const work = async () => {
  let dbData;
  let blogInfos;

  // posting data 불러오기
  database.connect();
  blogInfos = await database.tblogs.select();
  console.log(blogInfos);
  dbData = await database.posting.select();

  if (blogInfos.length > 0) {
    blogInfos.map((blogInfo, index) => {
      let blogCategories;
      let postCategory;
      const storyAI_posting = blogInfo.storyAI_posting;

      if (storyAI_posting <= 0) {
        log(`storyAI_posting: ${storyAI_posting}`);
        return;
      }
      if (!dbData && dbData.length <= 0) {
        log(`posting: ${dbData.length}`);
        return;
      }

      log(`is_categories: ${blogInfo.categories}`);
      if (blogInfo.categories) {
        blogCategories = JSON.parse(blogInfo.categories);
      } else {
        for (let i = 0; i < storyAI_posting; i++) {
          const post = dbData.pop();
          const params = {
            access_token: blogInfo.access_token,
            output: "json"
          };
          const data = {
            blogName: blogInfo.name,
            title: post.title,
            content: post.context,
            visibility: 3,
            tag: post.tags
          };
          axios
            .post("https://www.tistory.com/apis/post/write", data, {
              params: params
            })
            .then(res => {
              log(`success: ${res.data}`);
              database.posting.delete(post.code);
            })
            .catch(err => {
              log(`error: ${err.response.data}`);
            });
        }
      }
    });
  }
};

const start = async () => {
  const scheduler = cron.schedule("0 12 * * *", async () => {
    log("start!");
    await work();
  });
};

exports.start = start;
