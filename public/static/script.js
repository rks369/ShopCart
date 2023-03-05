let items = document.getElementById("products");

let pop_up = document.getElementById("popup");
let product_details = document.getElementById("product_details");

let current_index = 0;
let count = 8;

let no_more_product = false;
getProducts();

pop_up.addEventListener("click", () => {
  pop_up.style.display = "none";
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
          createProductItem(product);
        });
      }
    });
}

function createProductItem(product) {
  const productUI = document.createElement("div");
  productUI.classList.add("product_card");

  const productImg = document.createElement("img");
  productImg.classList.add("product_img");
  productImg.src = "../" + product.image;

  const div1 = document.createElement("div");

  const title = document.createElement("p");
  title.classList.add("product_title");
  title.innerHTML = product.title;
  div1.appendChild(title);

  const price = document.createElement("p");
  price.classList.add("product_price");
  price.innerHTML = `Rs. ${product.price}/-`;
  div1.appendChild(price);

  const description = document.createElement("p");
  description.classList.add("product_desc");
  description.innerHTML = product.description;

  const div2 = document.createElement("div");

  const addToCart = document.createElement("button");
  addToCart.classList.add("secondaryButton");
  addToCart.innerHTML = "Add To Cart";
  div2.appendChild(addToCart);

  addToCart.addEventListener("click", () => {
  
    if (addToCart.innerHTML == "Add To Cart") {
      fetch("/addToCart", {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ pid: product.pid }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result["err"]) {
            alert("Something Went Wrong");
          } else if (result["data"] == "Not Login") {
            window.location.href = "./login";
          } else {
            addToCart.innerHTML = "Remove From Cart";
          }
          console.log(result);
        });
    } else if (p.innerHTML == "Remove From Cart") {
      fetch("/removeFromCart", {
        method: "POST",
        headers: {
          "Content-type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ pid: product.pid }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result["err"]) {
            alert("Something Went Wrong");
          } else {
            addToCart.innerHTML = "Add To Cart";
          }
          console.log(result);
        });
    }
  });

  const viewMore = document.createElement("button");
  viewMore.classList.add("primaryButton");
  viewMore.innerHTML = "View More";
  div2.appendChild(viewMore);

  viewMore.addEventListener("click", () => {
    pop_up.style.display = "block";

    product_details.innerHTML = "";

    fetch("/product/productDetails", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ id: product.pid }),
    })
      .then((response) => response.json())
      .then((product) => {
        let img = document.createElement("img");
        img.src = product.image;
        img.classList.add("product_img");

        let div = document.createElement("div");
        div.classList.add("product_card_side");

        const div1 = document.createElement("div");

        const title = document.createElement("p");
        title.classList.add("product_title");
        title.innerHTML = product.title;
        div1.appendChild(title);
      
        const price = document.createElement("p");
        price.classList.add("product_price");
        price.innerHTML = `Rs. ${product.price}/-`;
        div1.appendChild(price);
      
        const description = document.createElement("p");
        description.classList.add("product_desc");
        description.innerHTML = product.description;

        const div2 = document.createElement("div");

        const addToCart = document.createElement("button");
        addToCart.classList.add("secondaryButton");
        addToCart.innerHTML = "Add To Cart";
        div2.appendChild(addToCart);
      
        addToCart.addEventListener("click", (event) => {
            event.stopPropagation()
          if (addToCart.innerHTML == "Add To Cart") {
            fetch("/addToCart", {
              method: "POST",
              headers: {
                "Content-type": "application/json;charset=utf-8",
              },
              body: JSON.stringify({ pid: product.pid }),
            })
              .then((response) => response.json())
              .then((result) => {
                if (result["err"]) {
                  alert("Something Went Wrong");
                } else if (result["data"] == "Not Login") {
                  window.location.href = "./login";
                } else {
                  addToCart.innerHTML = "Remove From Cart";
                }
                console.log(result);
              });
          } else if (p.innerHTML == "Remove From Cart") {
            fetch("/removeFromCart", {
              method: "POST",
              headers: {
                "Content-type": "application/json;charset=utf-8",
              },
              body: JSON.stringify({ pid: product.pid }),
            })
              .then((response) => response.json())
              .then((result) => {
                if (result["err"]) {
                  alert("Something Went Wrong");
                } else {
                  addToCart.innerHTML = "Add To Cart";
                }
                console.log(result);
              });
          }
        });
      
        const buyNow = document.createElement("button");
        buyNow.classList.add("primaryButton");
        buyNow.innerHTML = "Buy Now";
        div2.appendChild(buyNow);

        buyNow.addEventListener('click',(event)=>{
          event.stopPropagation();
          fetch("/addToCart", {
            method: "POST",
            headers: {
              "Content-type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ pid: product.pid }),
          })
            .then((response) => response.json())
            .then((result) => {
              if (result["err"]) {
                alert("Something Went Wrong");
              } else if (result["data"] == "Not Login") {
                window.location.href = "./login";
              } else {
                window.location.href = "./cart";
              }
              console.log(result);
            });

        })
      
        div.append(div1);
        div.append(div2);

        product_details.append(img);
        product_details.append(div);
      });
  });

  productUI.appendChild(productImg);
  productUI.appendChild(div1);
  productUI.appendChild(description);
  productUI.appendChild(div2);
  productUI.appendChild(document.createElement("br"));
  items.appendChild(productUI);
}
