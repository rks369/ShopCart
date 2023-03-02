const express = require("express");
const multer = require("multer");

const authCheck = require("../middelware/auth_check");
const jsonMethods = require("../json/methods");
const sqlMethods = require("../sql/methods");

const router = express.Router();
const upload = multer({ dest: "./public/uploads" });

const dataSource = sqlMethods;

router
  .route("/addProduct")
  .get((req, res) => {
    res.render("seller/add_product");
  })
  .post(upload.single("image"), (req, res) => {
    let product = {
      id: Date.now(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: req.file.filename,
    };
    dataSource.product.addProduct(product, (err, data) => {
      if (err) res.json({ msg: "error" });
      else res.json({ msg: "done" });
    });
  });

router.route("/getMoreProducts").post((req, res) => {
  const startIndex = req.body.start;
  const count = req.body.count
  dataSource.product.getProductsList(startIndex,count, (productsList) => {
    res.json(productsList);
  });
});

router.post("/productDetails", (req, res) => {
  dataSource.product.getProduct(req.body.id, (product) => {
    if (product == []) {
      res.json({ err: "NO Product Found" });
    } else {
      res.json(product[0]);
    }
  });
});

module.exports = router;
