const order_history = document.getElementById("order_history");
const order_items_list = document.getElementById('order_items_list');
const popup = document.getElementById("popup");
const total_amount_tag = document.getElementById('total_amount');

popup.addEventListener("click", () => {
    order_items_list.innerHTML="";
  popup.style["display"] = "none";
});

getOrderHistory();

function getOrderHistory() {
  fetch("/orderHistoryList")
    .then((response) => response.json())
    .then((result) => {
      orders = result["data"];
      for (let i = 0; i < orders.length; i++) {
        createOrdersTile(orders[i]);
      }
    });
}

function createOrdersTile(order) {
  const orderItemBox = document.createElement("div");
  orderItemBox.classList.add("cart_product_card");
  orderItemBox.classList.add("box");

  const div1 = document.createElement("div");
  div1.classList.add("item");

  const order_time = document.createElement("p");
  order_time.classList.add("cart_product_title");
  order_time.innerHTML = new Date(order["order_time"]).toLocaleDateString();
  div1.appendChild(order_time);

  const address = document.createElement("p");
  address.innerHTML = JSON.parse(order["billing_address"])["address"];
  div1.appendChild(address);

  const div2 = document.createElement("div");
  div2.classList.add("item");

  const orderDetails = document.createElement("a");
  orderDetails.classList.add("primaryButton");
  orderDetails.innerHTML = "Order Details";
  div2.appendChild(orderDetails);

  orderDetails.addEventListener("click", () => {
    fetch("/orderDetails", {
      method: "POST",
      headers: {
        "Content-type": "application/json;charset=utf-8",
      },
      body: JSON.stringify({ order_id: order["order_id"] }),
    })
      .then((response) => response.json())
      .then((result) => {
        let  total =0;
        popup.style["display"] = "block";
        const orderItemList = result["data"];

        for(let i=0;i<orderItemList.length;i++)
        {
            total+=orderItemList[i].price*orderItemList[i].quantity;
            createOrderItemTile(orderItemList[i]);
        }
        total_amount_tag.innerHTML = total;
      });
  });

  orderItemBox.appendChild(div1);
  orderItemBox.appendChild(div2);
  order_history.appendChild(orderItemBox);
}


function createOrderItemTile(orderItem){
    const orderItemCard = document.createElement('div');

    orderItemCard.classList.add("cart_product_card");
    orderItemCard.classList.add("box");
  
    const productsImg = document.createElement("img");
    productsImg.classList.add("item");
    productsImg.classList.add("cart_product_img");
    productsImg.src = orderItem.image;
  
    const div1 = document.createElement("div");
    div1.classList.add("item");
  
    const title = document.createElement("p");
    title.classList.add("cart_product_title");
    title.innerHTML = orderItem.title;
    div1.appendChild(title);
  
    const description = document.createElement("p");
    description.classList.add("product_desc");
    description.innerHTML = orderItem.description;
    div1.appendChild(description);
  
    const price = document.createElement("p");
    price.classList.add("product_price");
    price.innerHTML = `Rs. ${orderItem.price}/-`;
    div1.appendChild(price);
  
    const div2 = document.createElement("div");
    div2.classList.add("item");
  
    const grossPrice = document.createElement("p");
    grossPrice.classList.add("product_price");
    grossPrice.innerHTML = `Rs. ${orderItem.price * orderItem.quantity}/-`;
    div2.appendChild(grossPrice);

    const qunatity = document.createElement('p');
    qunatity.classList.add('product_quantity');
    qunatity.innerHTML =`Qunatity :  ${orderItem.quantity}`;
    div2.appendChild(qunatity)

    const status = document.createElement('p');
    let statusArray= JSON.parse(orderItem.activity);
    status.innerHTML = statusArray[statusArray.length-1]['title']+ "\n"+ new Date(statusArray[statusArray.length-1]['time']).toLocaleDateString()
    div2.appendChild(status);
  
    div2.appendChild(document.createElement("br"));
    orderItemCard.appendChild(productsImg);
    orderItemCard.appendChild(div1);
    orderItemCard.appendChild(div2);
    order_items_list.appendChild(orderItemCard);
}