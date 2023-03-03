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
  executeTransaction: async (user_id, cart_id_list, billing_address) => {
    console.log("Treanstion Started");

    return new Promise((resolve, reject) => {
      var connection = new Connection(config);
      connection.connect();
      connection.on("connect", function async(err) {
        if (err) reject(err);
        else {
          connection.beginTransaction(async (err) => {
            if (err) {
              reject(err);
            } else {
              try {
                const createOrderQuery = `
                INSERT INTO orders(user_id,billing_address) VALUES(${user_id},'${JSON.stringify(
                  billing_address
                )}');
                SELECT @@IDENTITY AS order_id`;
                const orderId = await sqlMethods.executeRequest(
                  connection,
                  createOrderQuery
                );


                for (let i = 0; i < cart_id_list.length; i++) {
                  const selectCartItemQuery = `SELECT * FROM cart JOIN products on pid = product_id WHERE cid = '${cart_id_list[i]}'`;
                  const cartItem = await sqlMethods.executeRequest(
                    connection,
                    selectCartItemQuery
                  );

                  const updateStockQuery = `UPDATE products SET stock = stock-${cartItem[0].quantity} where pid = ${cartItem[0].product_id}`;
                  await sqlMethods.executeRequest(connection, updateStockQuery);

                  const orderStatus = [
                    { title: "Odere Placed", time: Date.now() },
                  ];
                  const insertOrderItem = `
                  INSERT INTO orderitem VALUES('${orderId[0]["order_id"]}',${
                    cartItem[0].product_id
                  },${cartItem[0].price},${
                    cartItem[0].quantity
                  },'${JSON.stringify(orderStatus)}');`;

                  await sqlMethods.executeRequest(connection, insertOrderItem);

                  const dellteFromCart = `DELETE FROM cart WHERE cid=${cart_id_list[i]}`;
                  await sqlMethods.executeRequest(connection, dellteFromCart);
                }
                connection.commitTransaction((err) => {
                  connection.close();
                  if (err) {
                    reject(err);
                  } else {
                    resolve({ msg: "Success" });
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
