const fs = require("fs");
const sendMail = require("../../utils/send_mail");

const sql = require("../sql_config");

usersMethods = {
  getUserList: async (callback) => {
    const users = await sql.executeQuery("SELECT * FROM users;");
    callback(users);
  },
  getCartList: async (uid, callback) => {
    try {
      const cartList = await sql.executeQuery(
        `SELECT * FROM cart,products WHERE user_id='${uid}' AND cart.product_id = products.pid`
      );
      callback({ data: cartList });
    } catch (err) {
      callback({ err: err });
    }
  },
  addToCart: async (user_id, pid, callback) => {
    try {
      const cart = await sql.executeQuery(
        `SELECT * FROM cart WHERE product_id='${pid}' and user_id='${user_id}' `
      );

      if (cart.length == 0) {
        const result = await sql.executeQuery(
          `INSERT INTO cart VALUES('${user_id}','${pid}','1')`
        );
        try {
          callback({ data: "Done" });
        } catch (err) {
          callback({ err: "Something Went Wrong !!!" });
        }
      } else {
        const result = await sql.executeQuery(
          `UPDATE cart SET quantity = '${cart[0].quantity + 1}' WHERE cid='${
            cart[0].cid
          }'`
        );
        callback({ data: "Done" });
      }
    } catch (err) {
      console.log(err);
      callback({ err: "Something Went Wrong !!!" });
    }
  },
  removeFromCart: async (user_id, pid, callback) => {
    try {
      const result = await sql.executeQuery(
        `DELETE  FROM cart WHERE product_id='${pid}' and user_id='${user_id}'`
      );

      callback({ data: "Done" });
    } catch (err) {
      callback({ err: err });
    }
  },
  increaseQuantity: async (cart_id, callback) => {
    try {
      const cart = await sql.executeQuery(
        `SELECT * FROM cart WHERE cid='${cart_id}' `
      );

      if (cart.length == 0) {
        const result = await sql.executeQuery(
          `INSERT INTO cart VALUES('${user_id}','${product_id}','1')`
        );
        try {
          callback({ data: "Done" });
        } catch (err) {
          callback({ err: "Something Went Wrong !!!" });
        }
      } else {
        const result = await sql.executeQuery(
          `UPDATE cart SET quantity = '${
            cart[0].quantity + 1
          }' WHERE cid='${cart_id}'`
        );
        callback({ data: "Done" });
      }
    } catch (err) {
      callback({ err: "Something Went Wrong !!!" });
    }
  },
  decreaseQuantity: async (cart_id, callback) => {
    try {
      const cart = await sql.executeQuery(
        `SELECT * FROM cart WHERE cid='${cart_id}'`
      );
      console.log(cart[0].quantity);
      if (cart[0].quantity != 1) {
        const result = await sql.executeQuery(
          `UPDATE cart SET quantity = '${
            cart[0].quantity - 1
          }' WHERE  cid='${cart_id}' `
        );
        callback({ data: "Done" });
      } else {
        const result = await sql.executeQuery(
          `DELETE  FROM cart WHERE cid='${cart_id}'`
        );

        callback({ data: "Done" });
      }
    } catch (err) {
      callback({ err: "Something Went Wrong !!!" });
    }
  },

  orderProduct: async (user_id,cart_id_list, billing_address, callback) => {
    try{
     const result= await sql.executeTransaction(user_id,cart_id_list, billing_address)
      callback(result)
    }catch(err)
    {
      callback({err:err});
    }
  },

  orderHistory:async(user_id,callback)=>{
    try{
      const result= await sql.executeQuery(`SELECT * FROM orders WHERE user_id ='${user_id}' order  by order_time DESC`)
       callback({data:result})
     }catch(err)
     {
       callback({err:err});
     }
  },

  orderDetails:async(order_id,callback)=>{
    try{
      const result  = await sql.executeQuery(`
      SELECT * FROM orderitem JOIN products ON pid = product_id where order_id = ${order_id}`);
      callback({data:result});
    }catch(err){
      callback({err:err});
    }
  }

};  

module.exports = usersMethods;
