const load_more_orders = document.getElementById("load_more_orders");
let order_finished = false;
let current_index = 0;
const row_count = 10;

getOrderDetails();

load_more_orders.addEventListener("click", () => {
  if (!order_finished) {
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
      if (result["data"].length == 0) {
        order_finished = true;
        load_more_orders.innerHTML = "No More Orders";
        load_more_orders.classList.remove("primaryButton");
        load_more_orders.classList.add("secondaryButton");
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
  const statusBox = document.createElement("td");

  let ooderHistoryList = document.createElement("ul");

  status.forEach((activity) => {
    let li = document.createElement("li");
    li.innerHTML =
      activity.title +
      "\n" +
      new Date(activity.time).toLocaleDateString() +
      new Date(activity.time).toLocaleTimeString();
    ooderHistoryList.appendChild(li);
  });

  const updateInput = document.createElement("input");

  updateInput.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
      if (updateInput.value.trim() == "") {
        alert("Please Enter The Valid Value");
      } else {
        let newStatus = {
          title: updateInput.value.trim(),
          time: Date.now(),
        };
        status.push(newStatus);
        console.log(status);

        fetch("/seller/updateStatus", {
          method: "POST",
          headers: {
            "Content-type": "application/json;charset=utf-8",
          },
          body: JSON.stringify({
            order_item_id: orderDetails.order_item_id,
            status: status,
          }),
        })
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            if (result["err"]) {
              status.remove(newStatus);
            } else {
              let li = document.createElement("li");
              let t = Date.now();

              li.innerHTML =
                updateInput.value.trim() +
                "\n" +
                new Date(t).toLocaleDateString() +
                new Date(t).toLocaleTimeString();
              ooderHistoryList.appendChild(li);
            }
            updateInput.value = "";
          });
      }
    }
  });

  statusBox.appendChild(ooderHistoryList);

  statusBox.appendChild(updateInput);

  orderrow.appendChild(statusBox);

  order_items_list.appendChild(orderrow);
}
