const cart_items = document.getElementById("cart_items");
const total_amount_tag = document.getElementById("total_amount");
const billing_address = document.getElementById("billing_address");
const Order_now = document.getElementById("Order_now");

let total_amount = 0;
let cart_id_list = [];
getCartList();
function getCartList() {
  fetch("cartItems", { method: "GET" })
    .then((response) => response.json())
    .then((result) => {
      if (result["err"]) {
        cart_items.innerHTML = result["err"];
      } else {
        result["data"].forEach((cartItem) => {
          cart_id_list.push(cartItem.cid);
          createCartItem(cartItem);
        });
      }
    });
}

Order_now.addEventListener("click", () => {
  if (billing_address.value.trim() != "") {
    let reqObj = {
      cart_id_list: cart_id_list,
      address: { address: billing_address.value.trim() },
    };
    console.log(reqObj);
    fetch("/order", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(reqObj),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result["msg"] == "Success") {
          window.location.href = "/orderHistory";
        } else {
          alert("can't Place Order");
        }
        console.log(result);
      });
  } else {
    alert("Please Fill the Address");
  }
});

function createCartItem(cartItem) {
  const status = cartItem.quantity <= cartItem.stock;

  total_amount += cartItem.quantity * cartItem.price;

  total_amount_tag.innerHTML = `Rs.${total_amount}/-`;

  const cartItemBox = document.createElement("div");
  cartItemBox.classList.add("cart_product_card");
  cartItemBox.classList.add("box");

  const productsImg = document.createElement("img");
  productsImg.classList.add("item");
  productsImg.classList.add("cart_product_img");
  productsImg.src = cartItem.image;

  const div1 = document.createElement("div");
  div1.classList.add("item");

  const title = document.createElement("p");
  title.classList.add("cart_product_title");
  title.innerHTML = cartItem.title;
  div1.appendChild(title);

  const description = document.createElement("p");
  description.classList.add("product_desc");
  description.innerHTML = cartItem.description;
  div1.appendChild(description);

  const price = document.createElement("p");
  price.classList.add("product_price");
  price.innerHTML = `Rs. ${cartItem.price}/-`;
  div1.appendChild(price);

  const div2 = document.createElement("div");
  div2.classList.add("item");

  const grossPrice = document.createElement("p");
  grossPrice.classList.add("product_price");
  grossPrice.innerHTML = `Rs. ${cartItem.price * cartItem.quantity}/-`;
  div2.appendChild(grossPrice);

  div2.appendChild(document.createElement("br"));

  const decreaseQuantity = document.createElement("a");
  decreaseQuantity.classList.add("circularButton");
  decreaseQuantity.innerHTML =
    '<span class="material-symbols-outlined"> remove</span>';
  div2.appendChild(decreaseQuantity);

  decreaseQuantity.addEventListener("click", () => {
    fetch("/decreaseQuantity", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ cart_id: cartItem.cid }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result["err"]) {
          alert("Something Went Wrong");
        } else {
          cartItem.quantity--;
          if (cartItem.quantity == 0) {
            cart_items.removeChild(cartItemBox);
          }
          quantity.innerHTML = cartItem.quantity;
          total_amount -= cartItem.price;
          grossPrice.innerHTML = `Rs. ${cartItem.price * cartItem.quantity}/-`;
          total_amount_tag.innerHTML = `Rs.${total_amount}/-`;
        }
      });
  });

  const quantity = document.createElement("span");
  quantity.classList.add("product_quantity");
  quantity.innerHTML = cartItem.quantity;
  div2.appendChild(quantity);

  const increaseQuantity = document.createElement("a");
  increaseQuantity.classList.add("circularButton");
  increaseQuantity.innerHTML =
    '<span class="material-symbols-outlined"> add</span>';
  div2.appendChild(increaseQuantity);

  increaseQuantity.addEventListener("click", () => {
    fetch("/increaseQuantity", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ cart_id: cartItem.cid }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result["err"]) {
          alert("Something Went Wrong");
        } else {
          cartItem.quantity++;
          quantity.innerHTML = cartItem.quantity;
          total_amount += cartItem.price;
          grossPrice.innerHTML = `Rs. ${cartItem.price * cartItem.quantity}/-`;
          total_amount_tag.innerHTML = `Rs.${total_amount}/-`;
        }
      });
  });

  div2.appendChild(document.createElement("br"));
  div2.appendChild(document.createElement("br"));

  const removeItem = document.createElement("a");
  removeItem.classList.add("secondaryButton");
  removeItem.innerHTML = "Remove";
  div2.appendChild(removeItem);

  removeItem.addEventListener("click", () => {
    fetch("/removeFromCart", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ pid: cartItem.pid }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result["err"]) {
          alert("Something Went Wrong");
        } else {
          cart_items.removeChild(cartItemBox);

          total_amount -= cartItem.price * cartItem.quantity;

          total_amount_tag.innerHTML = `Rs.${total_amount}/-`;
        }
      });
  });

  const buyNow = document.createElement("a");
  buyNow.classList.add("primaryButton");
  buyNow.innerHTML = "Buy Now";
  div2.appendChild(buyNow);

  buyNow.addEventListener("click", () => {
    if (billing_address.value.trim() != "") {
      let reqObj = {
        cart_id_list: [cartItem.cid],
        address: { address: billing_address.value.trim() },
      };
      console.log(reqObj);
      fetch("/order", {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(reqObj),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result["msg"] == "Success") {
            window.location.href = "/orderHistory";
          } else {
            alert("can't Place Order");
          }
          console.log(result);
        });
    } else {
      alert("Please Fill the Address");
    }
  });

  const err = document.createElement("span");
  err.classList.add("err_msg");
  err.innerHTML = "Out of Stock";
  console.log(status);
  if (!status) div2.appendChild(err);

  cartItemBox.appendChild(productsImg);
  cartItemBox.appendChild(div1);
  cartItemBox.appendChild(div2);
  cart_items.appendChild(cartItemBox);
}
