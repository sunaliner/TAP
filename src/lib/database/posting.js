const database = require("./index");
const tableName = "posting";

const select = (options = { limit: 100 }) => {
  return database.selectQuery(tableName, ` LIMIT ${options.limit}`);
};
const selectFirst = () => {
  return database.selectQuery(tableName, ` LIMIT 1`);
};
const selectCode = code => {
  return database.selectQuery(tableName, ` WHERE ${tableName}.code="${code}"`);
};

const insert = params => {
  return database.insertQuery(tableName, params);
};

const update = (id, params) => {};

const _delete = code => {
  return database.deleteQuery(tableName, ` WHERE ${tableName}.code="${code}"`);
};

exports.select = select;
exports.selectFirst = selectFirst;
exports.selectCode = selectCode;
exports.insert = insert;
exports.update = update;
exports.delete = _delete;
