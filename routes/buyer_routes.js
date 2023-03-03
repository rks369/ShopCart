const express = require("express");

const authCheck = require("../middelware/auth_check");

const jsonMethods = require("../json/methods");
const sqlMethods = require("../sql/methods");

const router = express.Router();
const dataSource = sqlMethods;

router.route("/").get((req, res) => {
  if (req.session.is_logged_in) {
    if (req.session.is_mail_verified)
      res.render("buyer/products", { name: req.session.name });
    else res.redirect("/verifyMailFirst");
  } else {
    res.render("main");
  }
});

router.route("/get").get((req, res) => {
  dataSource.user.getUserList((userList) => {
    res.json(userList);
  });
});

router
  .route("/login")
  .get((req, res) => {
    res.render("auth/login");
  })
  .post((req, res) => {
    let reqBody = req.body;
    let userObj = {
      email: reqBody.email,
      password: reqBody.password,
      address: JSON.stringify({ address: [] }),
      userType: 2,
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
    res.render("auth/signup");
  })
  .post((req, res) => {
    let reqBody = req.body;
    let userObj = {
      name: reqBody.name,
      email: reqBody.email,
      mobile: reqBody.mobile,
      password: reqBody.password,
      address: {},
      userType: 2,
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

router.get("/verifyMailFirst", (req, res) => {
  res.render("auth/email_verify", { msg: "Verify Your Emial First" });
});
router.get("/verifyEmail", (req, res) => {
  let token = req.query.token;

  dataSource.auth.verifyToken(token, (msg) => {
    console.log(msg);
    if (msg["err"]) res.render("auth/email_verify", { msg: msg["err"] });
    else {
      dataSource.auth.changeUserStatus(msg["data"]["uid"], 1, (msg) => {
        if (!msg["err"]) {
          res.render("auth/email_verify", {
            msg: "Email Is Verified Login To Continue!!!",
          });
        } else {
          res.render("auth/email_verify", {
            msg: `Error : ${err}`,
          });
        }
      });
    }
  });
});

router
  .route("/changePassword")
  .get(authCheck, (req, res) => {
    res.render("auth/change_password", { name: req.session.name });
  })
  .post((req, res) => {
    dataSource.auth.changePassword(
      req.session.email,
      req.body.password,
      (msg) => {
        res.json(msg);
      }
    );
  });

router
  .route("/forgotPassword")
  .get((req, res) => {
    res.render("auth/forgot_password");
  })
  .post((req, res) => {
    dataSource.auth.forgotPassword(req.body.email, (msg) => {
      res.json(msg);
    });
  });

router.route("/verifyforgotPassword").get((req, res) => {
  let token = req.query.token;

  dataSource.auth.verifyToken(token, (msg) => {
    console.log(msg);
    if (msg["err"]) res.render("auth/email_verify", { msg: msg["err"] });
    else {
      req.session.email = msg["data"]["email"];
      res.render("auth/change_password", { name: msg["data"]["name"] });
    }
  });
});

router.route("/products").get(authCheck, (req, res) => {
  console.log(req.session);
  res.render("buyer/products", { name: req.session.name });
});

router.route("/cart").get((req, res) => {
  dataSource.user.getCartList(req.session.uid, (msg) => {
    let cartList = [];
    if (!msg["err"]) {
      cartList = msg["data"];
    }
    res.render("buyer/cart", { name: req.session.name, cartList: cartList });
  });
});

router.route("/cartItems").get((req, res) => {
  dataSource.user.getCartList(req.session.uid, (msg) => {
    res.json(msg);
  });
});

router.route("/addToCart").post((req, res) => {
  const pid = req.body.pid;
  const uid = req.session.uid;
  dataSource.user.addToCart(uid, pid, (msg) => {
    res.json(msg);
  });
});

router.route("/removeFromCart").post((req, res) => {
  const pid = req.body.pid;
  const uid = req.session.uid;
  dataSource.user.removeFromCart(uid, pid, (msg) => {
    res.json(msg);
  });
});

router.route("/increaseQuantity").post((req, res) => {
  const cart_id = req.body.cart_id;
  dataSource.user.increaseQuantity(cart_id, (msg) => {
    res.json(msg);
  });
});

router.route("/decreaseQuantity").post((req, res) => {
  const cart_id = req.body.cart_id;
  dataSource.user.decreaseQuantity(cart_id, (msg) => {
    res.json(msg);
  });
});

router.route("/order").post((req, res) => {
  console.log(req.body);
  const user_id = req.session.uid;
  const billing_address = req.body.address;
  const cart_id_list = req.body.cart_id_list;

  dataSource.user.orderProduct(
    user_id,
    cart_id_list,
    billing_address,
    (msg) => {
      res.json(msg);
    }
  );
});

router.route("/orderHistory").get((req, res) => {
  res.render("buyer/order_history", { name: req.session.name });
});

router.route("/orderHistoryList").get((req, res) => {
  // const user_id = req.session.uid;
  dataSource.user.orderHistory(10, (msg) => {
    res.json(msg);
  });
});

router.route("/orderDetails").post((req, res) => {
  const order_id = req.body.order_id;
  dataSource.user.orderDetails(order_id, (msg) => {
    res.json(msg);
  });
});

router.route("/logout").get(authCheck, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
