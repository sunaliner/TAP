const mysql = require("mysql");
const post = require("./post");
const tblogs = require("./tblogs");
const posting = require("./posting");
const users = require("./users");

var db;

process.title = "TAP";

const connect = () => {
  console.log("database connect!");
  db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DATABASE
  });

  db.connect();
};

const query = sql => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
const selectQuery = (tableName, where) => {
  let sql = "SELECT * FROM " + tableName;
  if (where) sql += where;
  console.log(sql);
  return query(sql);
};
const getFields = (params, tableName) => {
  const keys = Object.keys(params);
  let fields = "";
  keys.map((x, i) => {
    fields += tableName + "." + x + (i === keys.length - 1 ? "" : ", ");
  });
  return fields;
};
const getValues = (params, password) => {
  let ref = "";
  Object.keys(params).map((x, i) => {
    let str = params[x];
    if (password && password === x) {
      str = `PASSWORD("${params[x]}")`;
    } else {
      str = `"${str}"`;
    }
    ref += str;
    if (Object.keys(params).length - 1 !== i) ref += ", ";
  });
  return ref;
};
const getValuesMulti = params => {
  let ref = "";
  params.map(param => {
    let p = getValues(param);
    ref += " (" + p + ") ";
  });
  return ref;
};
const insertQuery = (tableName, params, options) => {
  let sql;
  if (Array.isArray(params)) {
    sql = `INSERT INTO ${tableName} (${getFields(
      params[0],
      tableName
    )}) VALUES ${getValuesMulti(params)}`;
  } else if (typeof params === "object") {
    sql = `INSERT INTO ${tableName} (${getFields(
      params,
      tableName
    )}) VALUES (${getValues(params, options && options.password)})`;
  } else {
    console.log("insert params null");
    return undefined;
  }
  // console.log(sql);
  return query(sql);
};

const getUpdateField = params => {
  const keys = Object.keys(params);
  let str = "";
  keys.map((field, index) => {
    str += `${field}='${params[field]}'`;
    str += keys.length - 1 === index ? "" : ", ";
  });
  console.log("getUpdateField", str);
  return str;
};

const updateQuery = (tableName, params, where = "") => {
  let sql;
  if (typeof params === "object") {
    sql = `UPDATE ${tableName} SET ${getUpdateField(params)}${where}`;
  } else {
    console.log("update params null");
    return undefined;
  }
  // console.log(sql);
  return query(sql);
};

const deleteQuery = (tableName, where = "") => {
  let sql;
  sql = `DELETE FROM ${tableName}${where}`;
  console.log(sql);
  return query(sql);
};

const cancel = () => {
  connect.end();
};

exports.connect = connect;
exports.query = query;
exports.selectQuery = selectQuery;
exports.insertQuery = insertQuery;
exports.updateQuery = updateQuery;
exports.deleteQuery = deleteQuery;
exports.cancel = cancel;

exports.post = post;
exports.posting = posting;
exports.tblogs = tblogs;
exports.users = users;
