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
        let allProducts = getProductsData();
        const searchTerm = $(this).val().toLowerCase();

        console.log(searchTerm);
        // console.log(allProducts);

        let filteredProducts = [];
        for (let productId in allProducts) {
          // console.log(productId);

          let product = allProducts[productId];

          // console.log(product);

          if (product.title.toLowerCase().includes(searchTerm)) {
            filteredProducts.push(productId);
          }
        }

        console.log(filteredProducts);

        // save filtered products in local storage
        localStorage.setItem("forSearch", JSON.stringify(filteredProducts));

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
  function setData() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  function getData() {
    const storedData = localStorage.getItem("products");
    return JSON.parse(storedData);
  }

  // If the products data is null
  if (!localStorage.getItem("products")) {
    setData();
  }

  let allProducts = getData();

  // Function to add product to cart and save in local storage
  function addToCart(product) {
    const loggedInUserEmail = getLoggedInUserEmail();
    if (loggedInUserEmail) {
      const cartKey = `${loggedInUserEmail}_cart`;

      let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      cart.push(product);
      localStorage.setItem(cartKey, JSON.stringify(cart));
      updateCartBadge(); // Update the cart badge after adding the product

      // Show toast notification for adding product to cart
      Toast.fire({
        icon: "success",
        title: "Item added to cart successfully.",
      });
    } else {
      Toast.fire({
        icon: "info",
        title: "You need to be logged in to add products to cart.",
      });
    }
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
