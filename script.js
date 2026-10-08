// Store — класс из лабораторной работы 4.
class Store {
  constructor(name, price, qty) {
    this.name = name;
    this.price = Number(price);
    this.qty = Number(qty);
  }

  getTotal() {
    return this.price * this.qty;
  }
}

// Начальные товары. Они хранятся как объекты Store.
const products = [
  new Store("Наушники", 25000, 2),
  new Store("Клавиатура", 18000, 1),
  new Store("Мышь", 12000, 3)
];

const form = document.querySelector("#productForm");
const productList = document.querySelector("#productList");
const totalElement = document.querySelector("#total");
const emptyMessage = document.querySelector("#emptyMessage");

const nameInput = document.querySelector("#name");
const priceInput = document.querySelector("#price");
const qtyInput = document.querySelector("#qty");

const nameError = document.querySelector("#nameError");
const priceError = document.querySelector("#priceError");
const qtyError = document.querySelector("#qtyError");

function formatMoney(value) {
  return `${value.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ₸`;
}

// Полная отрисовка списка в DOM.
function renderProducts() {
  productList.innerHTML = "";

  products.forEach((product, index) => {
    const item = document.createElement("article");
    item.className = "product";
    item.dataset.index = index;

    item.innerHTML = `
      <div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>Цена: ${formatMoney(product.price)}</p>
      </div>

      <div class="quantity">
        <button type="button" data-action="decrease" title="Уменьшить количество">−</button>
        <span>${product.qty}</span>
        <button type="button" data-action="increase" title="Увеличить количество">+</button>
      </div>

      <div class="item-total">
        ${formatMoney(product.getTotal())}
      </div>

      <button type="button" class="delete" data-action="remove">Удалить</button>
    `;

    productList.appendChild(item);
  });

  emptyMessage.hidden = products.length !== 0;
  updateTotal();
}

// Пересчёт общего total без перезагрузки страницы.
function updateTotal() {
  const total = products.reduce((sum, product) => sum + product.getTotal(), 0);
  totalElement.textContent = formatMoney(total);
}

// Простая защита при выводе пользовательского имени в HTML.
function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clearErrors() {
  nameError.textContent = "";
  priceError.textContent = "";
  qtyError.textContent = "";

  nameInput.classList.remove("invalid");
  priceInput.classList.remove("invalid");
  qtyInput.classList.remove("invalid");
}

function validateForm() {
  clearErrors();

  const name = nameInput.value.trim();
  const price = Number(priceInput.value);
  const qty = Number(qtyInput.value);

  let valid = true;

  if (!name) {
    nameError.textContent = "Введите название товара.";
    nameInput.classList.add("invalid");
    valid = false;
  }

  if (!Number.isFinite(price) || price <= 0) {
    priceError.textContent = "Цена должна быть больше 0.";
    priceInput.classList.add("invalid");
    valid = false;
  }

  if (!Number.isInteger(qty) || qty < 0) {
    qtyError.textContent = "Количество должно быть целым числом 0 или больше.";
    qtyInput.classList.add("invalid");
    valid = false;
  }

  return valid;
}

// Добавление товара через форму.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  products.push(
    new Store(
      nameInput.value.trim(),
      Number(priceInput.value),
      Number(qtyInput.value)
    )
  );

  form.reset();
  clearErrors();
  renderProducts();
});

// Делегирование событий: один слушатель на весь список.
// Он обрабатывает remove / increase / decrease.
productList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const item = button.closest(".product");
  const index = Number(item.dataset.index);
  const action = button.dataset.action;

  if (action === "remove") {
    products.splice(index, 1);
  }

  if (action === "increase") {
    products[index].qty += 1;
  }

  if (action === "decrease") {
    products[index].qty = Math.max(0, products[index].qty - 1);
  }

  renderProducts();
});

renderProducts();
