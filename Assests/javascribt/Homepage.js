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
  function addToFavorite(product, buttonfav) {
    const loggedInUserEmail = getLoggedInUserEmail();
    if (loggedInUserEmail) {
      const favKey = `${loggedInUserEmail}_fav`;
      let wishlist = JSON.parse(localStorage.getItem(favKey)) || [];
      const index = wishlist.findIndex((item) => item.title === product.title);
  
      if (index === -1) {
        // Add product to favorites
        wishlist.push(product);
        localStorage.setItem(favKey, JSON.stringify(wishlist));
        buttonfav.addClass("btn-danger").removeClass("btn-outline-secondary");
        updateFavoritesBadge();
        Toast.fire({
          icon: "success",
          title: "Item added to wishlist successfully.",
        });
      } else {
        // Remove product from favorites
        wishlist.splice(index, 1); // Remove item from the array
        localStorage.setItem(favKey, JSON.stringify(wishlist)); // Update localStorage
        buttonfav.addClass("btn-outline-secondary").removeClass("btn-danger");
        updateFavoritesBadge();
        Toast.fire({
          icon: "success",
          title: "Item removed from wishlist successfully.",
        });
      }
    } else {
      Toast.fire({
        icon: "info",
        title: "You need to be logged in to add products to wishlist.",
      });
    }
  }
  
    //check love button
    function checkheartbutton(product, BookCard) {
      const loggedInUserEmail = getLoggedInUserEmail();
      if (loggedInUserEmail) {
        const favKey = `${loggedInUserEmail}_fav`;
        let wishlist = JSON.parse(localStorage.getItem(favKey)) || [];
      const isFavorite = wishlist.some((item) => item.title === product.title);
      if (isFavorite) {
        BookCard.find(".btn-fav")
          .addClass("btn-danger")
          .removeClass("btn-outline-secondary");
      }
    }
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

        checkheartbutton(product, BookCard);

        BookCard.find(".btn-fav").on("click", function (e) {
          e.stopPropagation(); // Prevent click from bubbling to the card
          const buttonfav = $(this);
          addToFavorite(product, buttonfav);
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
