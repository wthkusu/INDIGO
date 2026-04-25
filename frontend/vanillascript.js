const menu = document.getElementById("menu");
const filter = document.getElementById("categoryFilter");
const cart = document.getElementById("cart");
const totalDisplay = document.getElementById("total");

let total = 0;
let allItems = [];

function loadMenu() {
  fetch("http://localhost:3000/items")
    .then(res => res.json())
    .then(data => {
      allItems = data.map(item => ({
        ...item,
        stock: 5 
      }));
      displayItems(allItems);
    })
    .catch(err => console.error("Error loading menu:", err));
}

function displayItems(items) {
  menu.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");

    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>$${item.price}</p>
      <p>Stock: ${item.stock}</p>
      <button class="addBtn" ${item.stock === 0 ? "disabled" : ""}>
        ${item.stock === 0 ? "Out of Stock" : "Add"}
      </button>
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    `;

    div.querySelector(".addBtn").onclick = () => {
      if (item.stock > 0) {
        item.stock--;
        addToCart(item);
        displayItems(allItems);
      }
    };

    div.querySelector(".deleteBtn").onclick = () => deleteItem(item.id);

    div.querySelector(".editBtn").onclick = () => editItem(item);

    menu.appendChild(div);
  });
}

filter.addEventListener("change", () => {
  const val = filter.value;
  displayItems(
    val === "all" ? allItems : allItems.filter(i => i.category === val)
  );
});

function addToCart(item) {
  const li = document.createElement("li");
  li.textContent = `${item.name} - $${item.price}`;

  li.onclick = () => {
    li.remove();
    total -= item.price;
    totalDisplay.textContent = total;

    item.stock++; 
    displayItems(allItems);
  };

  cart.appendChild(li);

  total += item.price;
  totalDisplay.textContent = total;
}

function deleteItem(id) {
  fetch(`http://localhost:3000/items/${id}`, { method: "DELETE" })
    .then(() => loadMenu());
}

function editItem(item) {
  const name = prompt("Name:", item.name);
  const price = prompt("Price:", item.price);
  const category = prompt("Category:", item.category);

  if (!name || !price || !category) return;

  fetch(`http://localhost:3000/items/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, category })
  }).then(() => loadMenu());
}

document.getElementById("addItemForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;

  fetch("http://localhost:3000/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, price, category })
  }).then(() => {
    e.target.reset();
    loadMenu();
  });
});

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

loadMenu();