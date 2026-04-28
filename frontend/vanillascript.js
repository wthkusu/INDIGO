const menu = document.getElementById("menu");
const filter = document.getElementById("categoryFilter");
const cart = document.getElementById("cart");
const totalDisplay = document.getElementById("total");

let total = 0;
let allItems = [];
let role = localStorage.getItem("role") || "admin";

// LOAD MENU
function loadMenu() {
  fetch("http://localhost:3000/items")
    .then(res => res.json())
    .then(data => {
      allItems = data;
      displayItems(allItems);
    });
}

// LOAD CATEGORIES
function loadCategories() {
  fetch("http://localhost:3000/categories")
    .then(res => res.json())
    .then(data => {
      filter.innerHTML = '<option value="all">All</option>';

      data.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        filter.appendChild(option);
      });
    });
}

// DISPLAY ITEMS
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

      ${role === "admin" ? `
        <button class="editBtn">Edit</button>
        <button class="deleteBtn">Delete</button>
      ` : ""}
    `;

    // ADD
    div.querySelector(".addBtn").onclick = () => {
      if (item.stock > 0) {
        item.stock--;
        addToCart(item);
        displayItems(allItems);
      }
    };

    if (role === "admin") {
      div.querySelector(".deleteBtn").onclick = () => {
        deleteItem(item.id);
      };

      div.querySelector(".editBtn").onclick = () => {
        editItem(item);
      };
    }

    menu.appendChild(div);
  });
}

// FILTER
filter.addEventListener("change", () => {
  const val = filter.value;
  displayItems(
    val === "all" ? allItems : allItems.filter(i => i.category === val)
  );
});

// CART
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

// DELETE
function deleteItem(id) {
  fetch(`http://localhost:3000/items/${id}`, { method: "DELETE" })
    .then(() => loadMenu());
}

// EDIT
function editItem(item) {
  const name = prompt("Name:", item.name);
  const price = prompt("Price:", item.price);
  const category = prompt("Category:", item.category);

  if (!name || !price || !category) return;

  fetch(`http://localhost:3000/items/${item.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      price,
      category,
      stock: item.stock
    })
  }).then(() => loadMenu());
}

// ROLE UI
function applyRoleUI() {
  const roleText = document.getElementById("currentRole");
  if (roleText) {
    roleText.textContent = "Role: " + role;
  }

  const addItemForm = document.getElementById("addItemForm");
  const addCategoryForm = document.getElementById("addCategoryForm");

  if (role === "admin") {
    addItemForm.style.display = "block";
    addCategoryForm.style.display = "block";
  } else {
    addItemForm.style.display = "none";
    addCategoryForm.style.display = "none";
  }
}

document.getElementById("roleToggle").onclick = () => {
  role = role === "admin" ? "customer" : "admin";
  localStorage.setItem("role", role);

  applyRoleUI();
  displayItems(allItems);
};

// ADD ITEM
document.getElementById("addItemForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;

  fetch("http://localhost:3000/items", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name, price, category })
  }).then(() => {
    e.target.reset();
    loadMenu();
  });
});

// ADD CATEGORY
document.getElementById("addCategoryForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("newCategory").value;

  fetch("http://localhost:3000/categories", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ name })
  }).then(() => {
    e.target.reset();
    loadCategories();
  });
});

// DARK MODE
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("dark");
};

// INIT
loadMenu();
loadCategories();
applyRoleUI();