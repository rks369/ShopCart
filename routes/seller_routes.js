const express = require("express");
const multer = require("multer");

const authCheck = require("../middelware/auth_check");

const jsonMethods = require("../json/methods");
const sqlMethods = require("../sql/methods");

const router = express.Router();
const dataSource = sqlMethods;

const upload = multer({ dest: "./public/uploads" });

router.get("/", (req, res, next) => {
  res.render("auth/seller_signup");
});

router
  .route("/login")
  .get((req, res) => {
    res.render("auth/seller_login");
  })
  .post((req, res) => {
    let reqBody = req.body;
    let userObj = {
      email: reqBody.email,
      password: reqBody.password,
      userType: 1,
    };
    dataSource.auth.login(userObj, function (msg) {
      if (!msg["err"]) {
        req.session.is_logged_in = true;
        req.session.is_mail_verified = true;
        req.session.email = userObj.email;
        req.session.name = msg["data"]["name"];
        req.session.uid = msg["data"]["uid"];
      }
      res.json(msg);
    });
  });

router
  .route("/signup")
  .get((req, res) => {
    res.render("auth/seller_signup");
  })
  .post((req, res) => {
    let reqBody = req.body;

    let userObj = {
      name: reqBody.name,
      email: reqBody.email,
      mobile: reqBody.mobile,
      password: reqBody.password,
      address: JSON.stringify(reqBody.address),
      userType: 1,
      token: Date.now(),
    };
    dataSource.auth.signup(userObj, function (msg) {
      if (msg["data"] == "done") {
        req.session.is_logged_in = true;
        req.session.is_mail_verified = false;
        req.session.email = req.body.email;
        req.session.name = req.body.name;
      }
      res.json(msg);
    });
  });

router
  .route("/addProduct")
  .get((req, res) => {
    res.render("seller/add_product", { name: req.session.name });
  })
  .post(upload.single("image"), (req, res) => {
    console.log("ddferf");
    let product = {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      image: req.file.filename,
      uid: req.session.uid,
    };
    dataSource.product.addProduct(product, (msg) => {
      res.json(msg);
    });
  });

router.route("/getProductList").post((req, res) => {
  const seller_id = req.session.uid;
  const current_index = req.body.current_index;
  const count = req.body.count;
  dataSource.seller.getProductList(seller_id, current_index, count, (msg) => {
    res.json(msg);
  });
});

router.route("/changeStatus").post((req, res) => {
  const pid = req.body.pid;
  const status = req.body.status;

  dataSource.seller.changeStatus(pid, status, (msg) => {
    res.json(msg);
  });
});

router.route("/editProduct").post(upload.single("image"), (req, res) => {
  let img = req.file != null ? req.file.filename : req.body.image_url;
  let product = {
    pid: req.body.pid,
    title: req.body.title,
    description: req.body.description,
    stock: req.body.stock,
    price: req.body.price,
    image: img,
  };
  console.log(product, req.file != null);
  dataSource.seller.editProduct(product, (msg) => {
    res.json(msg);
  });
});

router.route("/productOrders").post((req, res) => {
  const product_id = req.body.product_id;
  dataSource.seller.productOrders(product_id, (msg) => {
    res.json(msg);
  });
});

router
  .route("/allOrders")
  .get((req, res) => {
    res.render("seller/product_orders", { name: req.session.name });
  })
  .post((req, res) => {
    const seller_id = req.session.uid;
    const current_index = req.body.current_index;
    const row_count = req.body.row_count;
    dataSource.seller.allOrders(seller_id, current_index, row_count, (msg) => {
      res.json(msg);
    });
  });

module.exports = router;
