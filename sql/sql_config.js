var Connection = require("tedious").Connection;
var Request = require("tedious").Request;

var config = {
  server: "localhost",
  authentication: {
    type: "default",
    options: {
      userName: "rks369",
      password: "123456",
    },
  },
  options: {
    trustServerCertificate: true,
    database: "shopcart",
  },
};

const sqlMethods = {
  executeQuery: (query) => {
    return new Promise((resolve, reject) => {
      var connection = new Connection(config);
      let request = new Request(query, function (err) {
        if (err) {
          reject(err);
        }
      });
      var result = [];

      request.on("row", function (columns) {
        let rowObj = {};
        columns.forEach(function (column) {
          if (column.value === null) {
            console.log("NULL");
          } else {
            rowObj[column.metadata.colName] = column.value;
          }
        });
        result.push(rowObj);
      });
      request.on("error", (err) => {
        connection.close();
        reject(err);
      });
      request.on("requestCompleted", function (rowCount, more) {
        connection.close();
        resolve(result);
      });

      connection.connect();
      connection.on("connect", function (err) {
        if (err) reject(err);
        else {
          connection.execSql(request);
        }
      });
    });
  },

  executeRequest: (connection, query) => {
    return new Promise((resolve, reject) => {
      let request = new Request(query, function (err) {
        if (err) {
          reject(err);
        }
      });

      var result = [];

      request.on("row", function (columns) {
        let rowObj = {};
        columns.forEach(function (column) {
          if (column.value === null) {
            console.log("NULL");
          } else {
            rowObj[column.metadata.colName] = column.value;
          }
        });
        result.push(rowObj);
      });
      request.on("error", (err) => {
        reject(err);
      });
      request.on("requestCompleted", function (rowCount, more) {
        resolve(result);
      });

      connection.execSql(request);
    });
  },
  executeTransaction: async (query) => {
    console.log("Treanstion Started");

    return new Promise((resolve, reject) => {
      var connection = new Connection(config);
      connection.connect();
      connection.on("connect", function async(err) {
        if (err) reject(err);
        else {
          let query1 = "UPDATE products SET stock=10 WHERE pid = 1";
          let query2 = "UPDATE products SET stock=10 WHERE pid = 2";

          connection.beginTransaction(async (err) => {
            if (err) {
              reject(err);
            } else {
              try {
                await sqlMethods.executeRequest(connection, query1);
                await sqlMethods.executeRequest(connection, query2);
                connection.commitTransaction((err) => {
                  connection.close();
                  if (err) {
                    reject(err);
                  } else {
                    resolve({ msg: "Sucess" });
                  }
                });
              } catch (err) {
                console.log("ewdwed", err);
                connection.rollbackTransaction((err) => {

                  if (err) reject(err);
                  else {
                    resolve({ msg: "Fail" });
                  }
                });
              }
            }
          });
        }
      });
    });
  },
};

module.exports = sqlMethods;
