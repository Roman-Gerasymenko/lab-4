const productsJson = `
[
    {
        "category": "category1",
        "image": "https://www.sephora.com/productimages/sku/s1506526-main-zoom.jpg?imwidth=315",
        "description": "Item 1",
        "price": 10
    },
    {
        "category": "category2",
        "image": "https://images.lululemon.com/is/image/lululemon/LU9BY6S_064762_1",
        "description": "Item 2",
        "price": 15
    },
    {
        "category": "category1",
        "image": "https://www.ikea.com/ca/en/images/products/vadsoe-spring-mattress-firm-light-blue__1077760_pe856997_s5.jpg?f=s",
        "description": "Item 3",
        "price": 20
    }
]
`;

const cards = JSON.parse(productsJson);

let cart = [];

window.onload = function () {
  loadCards();
  if (!localStorage.getItem("subscribed")) {
    setTimeout(showSubscriptionBox, 5000);
  }
  setTimeout(showAdBox, 10000);

  document.getElementById("subscribe-button").onclick = subscribe;
  document.getElementById("close-subscription-button").onclick = closeBox;
  document.getElementById("close-ad-button").onclick = closeAd;
};

function loadCards(filter = "all") {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  cards.forEach((card) => {
    if (filter === "all" || filter === card.category) {
      const cardElement = document.createElement("div");
      cardElement.className = "card";
      cardElement.innerHTML = `
                  <img src="${card.image}" alt="Image">
                  <p>${card.description}</p>
                  <p>Price: $${card.price}</p>
                  <button onclick="addToCart(${card.price}, '${card.description}')">Add to Cart</button>
              `;
      container.appendChild(cardElement);
    }
  });
}

function filterCards() {
  const filter = document.getElementById("filter").value;
  loadCards(filter);
}

function sortCards(criterion) {
  cards.sort((a, b) => {
    if (criterion === "name") {
      return a.description.localeCompare(b.description);
    } else if (criterion === "priceAsc") {
      return a.price - b.price;
    } else if (criterion === "priceDesc") {
      return b.price - a.price;
    }
  });
  loadCards();
}

function addToCart(price, description) {
  if (!isLoggedIn()) {
    alert("You must be logged in to add items to the cart.");
    window.location.href = "login.html";
    return;
  }

  const quantity = parseInt(prompt("Enter quantity:", 1), 10);
  const item = {
    description,
    price,
    quantity: quantity,
  };
  cart.push(item);
  alert(
    `Added ${quantity} of ${description} to cart. Total items: ${cart.length}`
  );
  updateCart();
}

function updateCart() {
  const cartContainer = document.getElementById("cart-container");
  cartContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.className = "cart-item";
    itemElement.innerHTML = `
        <p>${item.description} - ${item.quantity} x $${item.price} = $${
      item.price * item.quantity
    }</p>
        <button onclick="removeFromCart('${item.description}')">Remove</button>
      `;
    cartContainer.appendChild(itemElement);
    total += item.price * item.quantity;
  });

  const totalElement = document.createElement("div");
  totalElement.className = "cart-total";
  totalElement.innerHTML = `<p>Total: $${total}</p>`;
  cartContainer.appendChild(totalElement);
}

function removeFromCart(description) {
  cart = cart.filter((item) => item.description !== description);
  updateCart();
}

function showSubscriptionBox() {
  document.getElementById("subscription-box").classList.remove("hidden");
}

function closeBox() {
  document.getElementById("subscription-box").classList.add("hidden");
}

function subscribe() {
  alert("Thank you for subscribing!");
  localStorage.setItem("subscribed", "true");
  closeBox();
}

function showAdBox() {
  document.getElementById("ad-box").classList.remove("hidden");
}

function closeAd() {
  document.getElementById("ad-box").classList.add("hidden");
}

window.onscroll = function () {
  const scrollButton = document.getElementById("scroll-to-top");
  if (
    document.body.scrollTop > (window.innerHeight * 2) / 3 ||
    document.documentElement.scrollTop > (window.innerHeight * 2) / 3
  ) {
    scrollButton.classList.remove("hidden");
  } else {
    scrollButton.classList.add("hidden");
  }
};

function scrollToTop() {
  document.documentElement.scrollTop = 0;
}

function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function login(username, password) {
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("loggedIn", "true");
    return true;
  }
  return false;
}

function logout() {
  localStorage.removeItem("loggedIn");
}

function isAdmin() {
  return localStorage.getItem("role") === "admin";
}

function editProduct(productId) {
  if (!isAdmin()) {
    alert("You do not have permission to edit this product.");
    return;
  }
}
