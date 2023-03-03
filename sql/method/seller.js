const sql = require("../sql_config");

const seller = {
  getProductList: async (seller_id, current_index, count, callback) => {
    console.log(seller_id);
    try {
      const productList =
        await sql.executeQuery(`SELECT * FROM products WHERE seller_id = '${seller_id}' ORDER BY pid
            OFFSET ${current_index} ROWS
            FETCH NEXT ${count} ROWS ONLY;`);
      callback({ data: productList });
    } catch (err) {
      callback({ err: err });
    }
  },
  changeStatus: async (pid, status, callback) => {
    try {
      await sql.executeQuery(
        `UPDATE products SET status=${status} WHERE pid=${pid}`
      );

      callback({ data: "Done" });
    } catch (err) {
      console.log(err);
      callback({ err: err });
    }
  },

  editProduct: async (product, callback) => {
    try {
      await sql.executeQuery(`
        UPDATE products SET title='${product.title}',description='${product.description}',
        stock ='${product.stock}',
        image='${product.image}',
        price='${product.price}'
        WHERE pid='${product.pid}'
        `);
      callback({ data: "Done" });
    } catch (err) {
      console.log(err);
      callback({ err: err });
    }
  },

  productOrders: async (product_id, callback) => {
    try {
      const result = await sql.executeQuery(
        `SELECT * FROM orderitem JOIN orders on orderitem.order_id= orders.order_id JOIN users ON users.uid = orders.user_id WHERE product_id=${product_id} ORDER BY order_time DESC`
      );
      callback({ data: result });
    } catch (err) {
      callback({ err: err });
    }
  },
  allOrders:async(seller_id,current_index,row_count,callback)=>{
    try{
      const result = await sql.executeQuery(`SELECT order_item_id,name,pid,title ,quantity,billing_address,order_time,activity FROM orderitem JOIN orders on orderitem.order_id= orders.order_id JOIN users ON users.uid = orders.user_id JOIN products On product_id = pid WHERE seller_id=${seller_id} ORDER BY orders.order_time DESC OFFSET ${current_index} ROWS FETCH NEXT ${row_count} ROW ONLY`)
      callback({data:result});
    }catch(err)
    {
      callback({err:err})
    }
  }
};

module.exports = seller;
