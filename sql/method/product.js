const e = require("express");
const fs = require("fs");
const sql = require("../sql_config");

module.exports = {
  addProduct: async (product, callback) => {
    const result =
      await sql.executeQuery(`INSERT INTO products VALUES('${product.title}',
    '${product.description}',
    '${product.price}',
    '${product.stock}',
    '${product.image}',
    '${product.uid}',0);`);

    try {
      console.log(result);
      callback({ data: "done" });
    } catch (err) {
      callback({ err: err });
    }
  },
  getProduct: async (pid, callback)=> {
    const product = await sql.executeQuery(`SELECT * FROM products WHERE pid='${pid}'`)
    callback(product)
  },
  getProductsList: async (stratIndex,count, callback) => {
    
    const products = await sql.executeQuery(
      `SELECT * FROM products where status=0 ORDER BY pid
      OFFSET ${stratIndex} ROWS
      FETCH NEXT ${count} ROWS ONLY;`
    );
    callback(products);
  },
};
