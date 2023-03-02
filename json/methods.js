const usersMethod = require("./method/users");
const productsMethod = require("./method/product");
const sellersMethod = require("./method/seller");
let methods = {
  user: usersMethod,
  seller: sellersMethod,
  product: productsMethod,
};

module.exports = methods;
