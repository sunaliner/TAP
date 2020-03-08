const database = require("./index");
const tableName = "post";

const select = (options = { limit: 0 }) => {
  return database.selectQuery(
    tableName,
    ` WHERE ${tableName}.posting=false LIMIT ${options.limit}`
  );
};
const selectFirst = () => {
  return database.selectQuery(
    tableName,
    ` WHERE ${tableName}.posting=false LIMIT 1`
  );
};
const selectId = id => {
  return database.selectQuery(tableName, ` WHERE ${tableName}.id="${id}"`);
};
const selectCode = code => {
  return database.selectQuery(tableName, ` WHERE ${tableName}.code="${code}"`);
};

const insert = params => {
  return database.insertQuery(tableName, params);
};

const updateCode = (code, params) => {
  return database.updateQuery(
    tableName,
    params,
    ` WHERE ${tableName}.code="${code}"`
  );
};

const _delete = id => {};

const deleteCode = (code = "") => {
  return database.deleteQuery(tableName, ` WHERE ${tableName}.code="${code}"`);
};

exports.select = select;
exports.selectFirst = selectFirst;
exports.selectId = selectId;
exports.selectCode = selectCode;
exports.insert = insert;
exports.updateCode = updateCode;
exports.delete = _delete;
exports.deleteCode = deleteCode;
