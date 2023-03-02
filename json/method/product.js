const fs = require("fs");

module.exports = {
  addProduct: function (product, callback) {
    fs.readFile("./data/products.json", "utf-8", function (err, data) {
      let productsList;
      if (data.length == 0) {
        productsList = [];
      } else {
        productsList = JSON.parse(data);
      }
      productsList.push(product);
      fs.writeFile(
        "./data/products.json",
        JSON.stringify(productsList),
        (err, data) => {
          callback(err, data);
        }
      );
    });
  },
  getProduct: function (id, callback) {
    fs.readFile("./data/products.json", "utf-8", function (err, data) {
      let productsList;
      if (data.length == 0) {
        productsList = [];
      } else {
        productsList = JSON.parse(data);
      }

      let index = -1;

      for (let i = 0; i < productsList.length; i++) {
        if (productsList[i].id == id) {
          index = i;
          break;
        }
      }

      if (index == -1) {
        callback(null);
      } else {
        callback(productsList[index]);
      }
    });
  },
  getProductsList: function (stratIndex, callback) {
    fs.readFile("./data/products.json", "utf-8", function (err, data) {
      let productsList;
      if (data.length == 0) {
        productsList = [];
      } else {
        productsList = JSON.parse(data);
      }
      callback(productsList.slice(stratIndex, stratIndex + 5));
    });
  },
};
