document.addEventListener("DOMContentLoaded", function () {
  function loadContent(url, elementId) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById(elementId).innerHTML = data;
        // Ensure the badge is updated after the navigation is loaded
        if (elementId === "mainNavigation") {
          // Call the updateCartBadge function defined in nav.js
          updateCartBadge();
          updateFavoritesBadge();
        }
      })
      .catch((error) => console.error("Error loading content:", error));
  }

  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
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

  // Function to add product to favorite and save in local storage
  function addToFavorite(product) {
    const loggedInUserEmail = getLoggedInUserEmail();
    if (loggedInUserEmail) {
      const favKey = `${loggedInUserEmail}_fav`;
      let wishlist = JSON.parse(localStorage.getItem(favKey)) || [];
      const index = wishlist.findIndex((item) => item.title === product.title);

      if (index === -1) {
        // Add product to favorites
        wishlist.push(product);
        localStorage.setItem(favKey, JSON.stringify(wishlist));
        buttonfav.addClass("btn-success").removeClass(" btn-outline-secondary");
        Toast.fire({
          icon: "success",
          title: "Item added to wishlist successfully.",
        });
      } else {
        // Remove product from favorites
        wishlist.splice(index, 1);
        buttonfav.addClass("btn-outline-secondary").removeClass("btn-success");
      }

      // Show toast notification for adding product to favorite
    } else {
      Toast.fire({
        icon: "info",
        title: "You need to be logged in to add products to wishlist.",
      });
    }
    updateFavoritesBadge();
  }

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
              Object.entries(products).filter(
                ([key, product]) => product.category === category
              )
            );

      let obj = Object.keys(filteredProducts);
      obj.forEach((key) => {
        const product = filteredProducts[key];
        const BookCard = $(`
            <div class="col-lg-3 col-md-6 col-sm-12 p-4">
              <div class="card h-100 w-100" data-id="${product.title}">
                <div class="img-container">
                  <img src="${product.img_src}" alt="${product.title}" class="card-img-top imgmain"/>
                  <div class="overlay">
                    <button class="btn btn-outline-secondary btn-sm add-to-cart">
                      <i class="fas fa-cart-plus mr-2"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm btn-fav">
                      <i class="far fa-heart"></i>
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
          addToCart(product);
        });

        BookCard.find(".btn-fav").on("click", function (e) {
          e.stopPropagation(); // Prevent click from bubbling to the card
          addToFavorite(product);
        });

        BookCard.on("click", function () {
          localStorage.setItem("selectedProduct", JSON.stringify(product));
          window.location.href = "product Page.html";
        });
        container.append(BookCard);
      });

      // Add fadeIn animation
      container.fadeIn(300);
    });
  }

  displayProducts(allProducts);

  $("#tabs .nav-link").click(function (e) {
    e.preventDefault();
    $("#tabs .nav-link").removeClass("active text-primary");
    $(this).addClass("active text-primary");
    const category = $(this).data("category");

    displayProducts(allProducts, category);
  });
});
$(document).ready(function () {
  // get data fromLocalStorage
 function getData() 
  {
    const  storedData = localStorage.getItem("products");
    return JSON.parse(storedData);
  }

  // choose 4 ran book
  function getRandomProducts(products) {
    const randomProducts = [];
    const productKeys = Object.keys(products);

    // choose 4 ran book
    while (randomProducts.length < 4) {
      const randomIndex = Math.floor(Math.random() * productKeys.length);
      const randomProduct = products[productKeys[randomIndex]];

      // لو مضفناش الكتاب قبل كدا 
      if (!randomProducts.includes(randomProduct)) {
        randomProducts.push(randomProduct);
      }
    }
    return randomProducts;
  }

  // display
  function displayRandomProducts() {
    const allProducts = getData();
    const randomProducts = getRandomProducts(allProducts);
    const container = $(".ran-products .row");

    container.empty(); // delete prev

    randomProducts.forEach((product) => {
      const productCard = `
        <div class="col">
          <div class="card card-style mx-auto">
            <img style="height: 250px" src="${product.img_src}" class="card-img-top" alt="${product.title}" />
            <div class="card-body text-center">
              <a href="#" class="btn add-to-cart">Add To Cart</a>
            </div>
          </div>
        </div>
      `;
      container.append(productCard);
    });
  }

 
  
  displayRandomProducts();
});

