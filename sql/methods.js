const usersMethod = require("./method/users");
const productsMethod = require("./method/product");
const sellersMethod = require("./method/seller");
const authMethod = require("./method/auth")
let methods = {
  auth:authMethod,
  user: usersMethod,
  seller: sellersMethod,
  product: productsMethod,
};

module.exports = methods;