document.addEventListener("DOMContentLoaded", function () {
  async function loadContent(url, elementId) {
    try {
      const response = await fetch(url);
      const data = await response.text();
      document.getElementById(elementId).innerHTML = data;

      // Ensure the badge is updated after the navigation is loaded
      if (elementId === "mainNavigation") {
        // Call the functions defined in nav.js
        updateCartBadge();
        updateFavoritesBadge();
        setActiveLink();
        updateUserDropdown();
      }
    } catch (error) {
      console.error("Error loading content:", error);
    }
  }

  // Load navigation and footer, then initialize search functionality
  (async function () {
    await loadContent("nav.html", "mainNavigation");
    await loadContent("footer.html", "footer");
    // Initialize search functionality after navigation content is loaded
    $("#global-search").on("keydown", function (e) {
      // console.log("I am here");
      if (e.key === "Enter") {
        let allProducts = getData();
        const searchTerm = $(this).val().toLowerCase();

        // console.log(searchTerm);

        let filteredProducts = [];
        for (let productId in allProducts) {
          let product = allProducts[productId];
          if (product.title.toLowerCase().includes(searchTerm)) {
            filteredProducts.push(productId);
          }
        }

        console.log(filteredProducts);

        // save filtered products in local storage
        localStorage.setItem("displajedProducts", JSON.stringify(filteredProducts));

        // Redirect to the search results page
        window.location.href = "./LoadMore.html";
      }
    });
  })();
});
// Importing Products Data
import { products } from "./productsdata.js";
// Using jQuery to set data and interact with DOM
$(document).ready(function () {
  // If the products data is null
  if (!localStorage.getItem("products")) {
    setData();
  }

  let allProducts = getData();
  displayRandomProducts(allProducts);

  displayProducts(allProducts);
  let allProductsLength = Object.keys(allProducts).length;
  let product_id = Math.floor(Math.random() * (allProductsLength - 1 + 1) + 1);
  const randomProducts = allProducts[product_id];
  // console.log(randomProducts);

  //updating banner photo,title and description
  if (randomProducts) {
    $("#banner > div>img ").prop("src", randomProducts.img_src); // updating image
    $("#banner-title").text(`Book of the Month : ${randomProducts.title}`); // updating title
    $("#banner-description").text(`${randomProducts.description}`);
    localStorage.setItem("bannerProduct", JSON.stringify(randomProducts));
  }
  $("#banner-btn").on("click", function () {
    localStorage.setItem("selectedProduct", JSON.stringify(product_id));
    window.location.href = "./Product Page.html";
  });

  $("#tabs .nav-link").click(function (e) {
    e.preventDefault();
    $("#tabs .nav-link").removeClass("active text-primary");
    $(this).addClass("active text-primary");
    const category = $(this).data("category");

    displayProducts(allProducts, category);
  });
});
function displayRandomProducts(allProducts) {
  const randomProducts = getRandomProducts(allProducts);
  const container = $(".ran-products > .row");

  container.empty(); // clear last content
  // console.log(randomProducts);

  randomProducts.forEach((productId) => {
    let product = allProducts[productId];

    const productCard = $(`
      <div class="col">
        <div class="card card-style mx-auto">
          <img style="height: 250px" src="${product.img_src}" class="card-img-top" alt="${product.title}" />
          <div class="card-body text-center">
            <a href="#" class="btn add-to-cart">Add To Cart</a>
          </div>
        </div>
      </div>
    `);
    productCard.find(".add-to-cart").on("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling
      addToCart(productId);
    });
    container.append(productCard);
    productCard.on("click", function () {
      localStorage.setItem("selectedProduct", JSON.stringify(productId));
      window.location.href = "./Product Page.html";
    });
  });
}

function getRandomProducts(products) {
  const randomProducts = [];
  const productKeys = Object.keys(products);
  // console.log(productKeys);

  // select 4 random products
  while (randomProducts.length < 4) {
    const randomIndex = Math.floor(Math.random() * productKeys.length) + 1;

    // check if the product had been added before
    if (!randomProducts.includes(randomIndex)) {
      randomProducts.push(randomIndex);
    }
  }
  return randomProducts;
}

function setData() {
  localStorage.setItem("products", JSON.stringify(products));
}

function getData() {
  const storedData = localStorage.getItem("products");
  return JSON.parse(storedData);
}

function displayProducts(products, category = "All") {
  const container = $("#books-Container");

  // Add fadeOut animation
  container.fadeOut(300, function () {
    container.empty();

    const filteredProducts =
      category === "All"
        ? products // if the tab is all show the all products
        : Object.fromEntries(
            //else convert object to array then filter
            Object.entries(products).filter(([key, product]) => product.category === category),
          );

    let obj = Object.keys(filteredProducts);
    obj.forEach((key) => {
      const product = filteredProducts[key];
      const BookCard = $(`
          <div class="col-lg-3 col-md-6 col-sm-12 p-4">
            <div class="card h-100 w-100" id="product_${key}">
              <div class="img-container">
                <img src="${product.img_src}" alt="${product.title}" class="card-img-top imgmain"/>
                <div class="overlay">
                  <button class="btn btn-outline-secondary btn-sm add-to-cart">
                    <i class="fas fs-2 fa-cart-plus mr-2"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm add-to-fav">
                    <i class="fa-regular fs-2 fa-heart"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title">${product.title}</h5>
                <p class="card-text">${product.description}</p>
                <p class="card-text price" style="color: green; font-weight: bold;">Price: ${product.price}</p>
              </div>
            </div>
          </div>
        `);

      // Handle "add to cart" button click
      BookCard.find(".add-to-cart").on("click", function (e) {
        e.stopPropagation(); // Prevent event bubbling
        addToCart(key);
      });

      // checkheartbutton(product, BookCard);

      BookCard.find(".add-to-fav").on("click", function (e) {
        e.stopPropagation(); // Prevent click from bubbling to the card
        // console.log("event fired");
        const buttonfav = $(this);
        addToFavorite(key, buttonfav);
      });

      BookCard.on("click", function () {
        localStorage.setItem("selectedProduct", JSON.stringify(key));
        window.location.href = "Product Page.html";
      });
      container.append(BookCard);
    });
    checkheartbutton();
    // Add fadeIn animation
    container.fadeIn(300);
  });
}
