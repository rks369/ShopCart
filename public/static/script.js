let items = document.getElementById("products");
let load_more = document.getElementById("load_more");

let pop_up = document.getElementById("popup");
let product_details = document.getElementById("product_details");

let current_index = 0;
let count = 8;

let no_more_product = false;
getProducts();

load_more.addEventListener("click", () => {
  if (!no_more_product) {
    getProducts();
  }
});

function getProducts() {
  fetch("/product/getMoreProducts", {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ start: current_index, count: count }),
  })
    .then((response) => response.json())
    .then((result) => {
      current_index += count;
      if (result.length == 0) {
        load_more.innerHTML = "No More Products";
        load_more.classList.remove("primaryButton");
        load_more.classList.add("secondaryButton");
        no_more_product = true;
      } else {
        result.forEach((product) => {
         createProductItem(product )
        });
      }
    });
}

function createProductItem(productItem)
{
  let productUI = document.createElement("div");
  productUI.classList.add("product_card");

  productUI.innerHTML = `
    <img src=${product.image} class="product_img" alt="...">
    <div>
    <h5 class="product_title">${product.title}</h5>
    <span class="product_price">Rs.${product.price}/-</span>
    </div>
    <div>
      <button class="secondaryButton"  onclick="addToCart(${product.pid})"  id=${product.pid}>Add To Cart</button>
      <button class="primaryButton"  onclick="viewMore(${product.pid})"  id=${product.pid}>View More</button>
    </div>
    <br>`;
  items.appendChild(productUI);
}

function addToCart(id) {
  let p = document.getElementById(id);

  if (p.innerHTML == "Add To Cart") {
    fetch("/addToCart", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ pid: id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result["err"]) {
          alert("Something Went Wrong");
        } else {
          p.innerHTML = "Remove From Cart";
        }
        console.log(result);
      });
  } else if (p.innerHTML == "Remove From Cart") {
    fetch("/removeFromCart", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ pid: id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result["err"]) {
          alert("Something Went Wrong");
        } else {
          p.innerHTML = "Add To Cart";
        }
        console.log(result);
      });
  }
}

function viewMore(id) {
  pop_up.style.display = "block";

  product_details.innerHTML = "";

  fetch("/product/productDetails", {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.json())
    .then((product) => {
      let img = document.createElement("img");
      img.src = product.image;
      img.classList.add("product_img");
      let div = document.createElement("div");
      div.classList.add("product_card_side");
      let div1 = document.createElement("div");
      let div2 = document.createElement("div");
      div1.innerHTML = `
          <div>
              <h5 class="product_title">${product.title}</h5>
              <h5 class="product_desc">iPhone 9</h5>

              <span class="product_price">Rs.${product.price}/-</span>
          </div>`;

      div2.innerHTML = `  <div>
      <button class="secondaryButton"  onclick="addToCart(${product.pid})"  id=${product.pid}>Add To Cart</button>
      <button class="primaryButton"    id=${product.pid}>Buy Now</button>
    </div>`;
      div.append(div1);
      div.append(div2);
      product_details.append(img);
      product_details.append(div);
    });
}

pop_up.addEventListener("click", () => {
  pop_up.style.display = "none";
});
