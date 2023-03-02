const port = 3000;

const express = require("express");
const session = require("express-session");
const multer = require("multer");

const sellerRoutes = require("./routes/seller_routes");
const buyerRoutes = require("./routes/buyer_routes");
const productsRoutes = require("./routes/products_routes");

const app = express();

app.use(express.static("./public/static"));
app.use(express.static("./public/images"));
app.use(express.static("./public/uploads"));

app.use(express.urlencoded({ "extended": true }));
app.use(express.json());

app.use(
  session({
    secret: "auth key",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");



app.use("/", buyerRoutes);
app.use("/seller", sellerRoutes);
app.use("/product", productsRoutes);

app.get("*", (req, res) => {
  res.render("error");
});

app.listen(port, () => {
  console.log("Server Is running On  http://localhost:" + port);
});
