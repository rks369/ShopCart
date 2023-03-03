const load_more_orders = document.getElementById("load_more_orders");
let order_finished = false;
let current_index = 0;
const row_count = 10;

getOrderDetails();

load_more_orders.addEventListener("click", () => {
 if(!order_finished)
 {
    getOrderDetails();
 }
});

function getOrderDetails() {
  fetch("/seller/allOrders", {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ current_index, row_count }),
  })
    .then((response) => response.json())
    .then((result) => {
      current_index += row_count;
      console.log(result);
      if(result['data'].length==0)
      {
        order_finished=true;
        load_more_orders.innerHTML="No More Orders";
        load_more_orders.classList.remove("primaryButton");
        load_more_orders.classList.add("secondaryButton")
      }
      result["data"].forEach((orderDetails) => {
        createOrderDetailsTile(orderDetails);
      });
    });
}

function createOrderDetailsTile(orderDetails) {
  const orderrow = document.createElement("tr");

  const name = document.createElement("td");
  name.innerHTML = orderDetails.name;
  orderrow.appendChild(name);

  const productId = document.createElement("td");
  productId.innerHTML = orderDetails.pid;
  orderrow.appendChild(productId);

  const title = document.createElement("td");
  title.innerHTML = orderDetails.title;
  orderrow.appendChild(title);

  const quantity = document.createElement("td");
  quantity.innerHTML = orderDetails.quantity;
  orderrow.appendChild(quantity);

  const address = document.createElement("td");
  address.innerHTML = JSON.parse(orderDetails.billing_address)["address"];
  orderrow.appendChild(address);

  const orderTime = document.createElement("td");
  orderTime.innerHTML = new Date(orderDetails.order_time).toLocaleDateString();
  orderrow.appendChild(orderTime);

  let status = JSON.parse(orderDetails.activity);
  const rowValue5 = document.createElement("td");
  rowValue5.innerHTML = status[status.length - 1]["title"];
  orderrow.appendChild(rowValue5);

  order_items_list.appendChild(orderrow);
}
