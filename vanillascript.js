const filter = document.getElementById("categoryFilter");
const items = document.querySelectorAll(".item");

filter.addEventListener("change", function () {
  const selected = this.value;

  items.forEach(item => {
    const category = item.dataset.category;

    if (selected === "all" || category === selected) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
});

const buttons = document.querySelectorAll(".addBtn");
const cart = document.getElementById("cart");
const totalDisplay = document.getElementById("total");

let total = 0;

buttons.forEach(button => {
  button.addEventListener("click", function () {
    const item = this.parentElement;
    const name = item.querySelector("h3").textContent;
    const price = Number(item.dataset.price);

    
    const li = document.createElement("li");
    li.textContent = `${name} - $${price}`;
    cart.appendChild(li);

    total += price;
    totalDisplay.textContent = total;
  });
});