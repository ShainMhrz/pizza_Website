const menu = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
let cart = document.getElementById("cart-icon");
let body = document.querySelector("body");
let closeCart = document.getElementById("closeCart");
let listProductHTML = document.querySelector(".menu-container");
let listCartHTML = document.querySelector(".listCart");
let cartSpan = document.querySelector(".notification");

let listProducts = [];
let carts = [];

cart.addEventListener("click", () => {
  body.classList.toggle("showCart");
  navbar.classList.toggle("active");
});
closeCart.addEventListener("click", () => {
  body.classList.toggle("showCart");
});
menu.addEventListener("click", () => {
  navbar.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  navbar.classList.remove("active");
});

// Dark Mode
const darkmode = document.querySelector("#darkmode");

darkmode.addEventListener("click", () => {
  if (darkmode.classList.contains("bx-moon")) {
    darkmode.classList.replace("bx-moon", "bx-sun");
    document.body.classList.add("active");
  } else {
    darkmode.classList.replace("bx-sun", "bx-moon");
    document.body.classList.remove("active");
  }
});

const initApp = () => {
  //get data from product.json
  fetch("product.json")
    .then((response) => response.json())
    .then((data) => {
      listProducts = data;
      //   console.log(listProducts);
      addDataToHTML();
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        addCartToHTML();
      }
    });
};
initApp();

const addDataToHTML = () => {
  listProductHTML.innerHTML = "";
  if (listProducts.length > 0) {
    listProducts.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("box");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
          <div class="box-img"><img src="${product.image}" alt="${product.name}"/></div>
          <h2>${product.name}</h2>
          <h3>Tasty Food</h3>
          <span>${product.price}</span>
          <button class="addCart"><i class="bx bx-cart-alt"></i></button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
};

listProductHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  let product_id;
  if (positionClick.classList.contains("addCart")) {
    // If the clicked element has the "addCart" class, directly access its parent's dataset
    product_id = positionClick.parentElement.dataset.id;
  } else if (positionClick.parentElement.classList.contains("addCart")) {
    // If the clicked element's parent has the "addCart" class, access its dataset
    product_id = positionClick.parentElement.parentElement.dataset.id;
  }
  if (product_id !== undefined) {
    addToCart(product_id);
  }
});
const addToCart = (product_id) => {
  let positionThisProductInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
    // console.log(carts);
  } else if (positionThisProductInCart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductInCart].quantity += 1;
  }
  addCartToHTML();
  addCartToMemeory();
  //   console.log(carts);
};
const addCartToMemeory = () => {
  localStorage.setItem("cart", JSON.stringify(carts));
};
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("items");
      newCart.dataset.id = cart.product_id;
      let positionProduct = listProducts.findIndex(
        (value) => value.id == cart.product_id
      );
      let info = listProducts[positionProduct];
      newCart.innerHTML = `
            <div class="image">
            <img
              src="${info.image}"
              alt=""
            />
            <div class="name">${info.name}</div>
            <div class="totalPrice">${(info.price * cart.quantity).toFixed(
              2
            )}</div>
            <div class="quantity">
              <span class="minus"> < </span>
              <span>${cart.quantity}</span
              ><span class="plus">></span>
            </div>
          </div>
          `;
      listCartHTML.appendChild(newCart);
    });
    cartSpan.innerText = totalQuantity;
  }
};

listCartHTML.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id =
      positionClick.parentElement.parentElement.parentElement.dataset.id;
    // console.log(product_id);
    let type = "minus";
    if (positionClick.classList.contains("plus")) {
      type = "plus";
    }
    changeQuantity(product_id, type);
  }
});
const changeQuantity = (product_id, type) => {
  let positionItemInCart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionItemInCart >= 0) {
    switch (type) {
      case "plus":
        carts[positionItemInCart].quantity += 1;
        break;

      default:
        let valueChange = carts[positionItemInCart].quantity - 1;
        if (valueChange >= 0) {
          carts[positionItemInCart].quantity = valueChange;
        } else {
          carts.splice(positionItemInCart, 1);
        }
        break;
    }
  }
  addCartToMemeory();
  addCartToHTML();
};
// Scroll Reveal
const sr = ScrollReveal({
  origin: "top",
  distance: "40px",
  duration: 1000,
  reset: true,
});

sr.reveal(
  `.home-text, .home-img,
  .about-img, .about-text,
  .box, .s-box,
  .btn, .connect-text`,
  {
    interval: 200,
  }
);
