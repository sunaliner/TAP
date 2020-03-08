const database = require("./index");
const tableName = "users";

const select = () => {
  return database.selectQuery(tableName);
};
const selectUserId = code => {
  return database.selectQuery(
    tableName,
    ` WHERE ${tableName}.userId="${code}"`
  );
};
const selectTistoryBlogId = id => {
  return database.selectQuery(tableName, ` WHERE ${tableName}.tuserId="${id}"`);
};
const selectNaverBlogId = id => {
  return database.selectQuery(tableName, ` WHERE ${tableName}.nuserId="${id}"`);
};

const insert = (params, options) => {
  return database.insertQuery(tableName, params, options);
};

const update = (id, params) => {
  return database.updateQuery(
    tableName,
    params,
    ` WHERE ${tableName}.userId="${id}"`
  );
};

const _delete = id => {};

exports.select = select;
exports.selectUserId = selectUserId;
exports.selectTistoryBlogId = selectTistoryBlogId;
exports.selectNaverBlogId = selectNaverBlogId;
exports.insert = insert;
exports.update = update;
exports.delete = _delete;
