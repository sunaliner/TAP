const database = require("./index");
const tableName = "tblogs";

const select = () => {
  return database.selectQuery(tableName);
};
const selectBlogId = id => {
  return database.selectQuery(tableName, ` WHERE ${blogs}.blogId="${id}"`);
};
const selectUserId = code => {
  return database.selectQuery(tableName, ` WHERE ${blogs}.userId="${code}"`);
};

const insert = params => {
  return database.insertQuery(tableName, params);
};

const update = (id, params) => {};

const _delete = id => {};

exports.select = select;
exports.selectBlogId = selectBlogId;
exports.selectUserId = selectUserId;
exports.insert = insert;
exports.update = update;
exports.delete = _delete;
