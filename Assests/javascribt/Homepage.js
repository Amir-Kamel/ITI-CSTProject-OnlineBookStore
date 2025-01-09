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
          setActiveLink();
          updateUserDropdown();
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
    const currentSession = JSON.parse(sessionStorage.getItem("currentSession"));

    if (
      currentSession &&
      currentSession.session &&
      currentSession.session.email
    ) {
      const loggedInUserEmail = currentSession.session.email;
      const signUpData = JSON.parse(localStorage.getItem("signUpData")) || {};

      if (signUpData.customers && signUpData.customers[loggedInUserEmail]) {
        const customer = signUpData.customers[loggedInUserEmail];
        const productIndex = customer.wishlist.findIndex(
          (item) => item.title === product.title
        );

        if (productIndex === -1) {
          // Add the product to the wishlist
          customer.wishlist.push(product);
          buttonfav.addClass("btn-danger").removeClass("btn-outline-secondary");
          Toast.fire({
            icon: "success",
            title: "Item added to wishlist successfully.",
          });
        } else {
          // Remove the product from the wishlist
          customer.wishlist.splice(productIndex, 1);
          buttonfav.addClass("btn-outline-secondary").removeClass("btn-danger");
          Toast.fire({
            icon: "warning",
            title: "Item removed from wishlist successfully.",
          });
        }

        // Save updated data to localStorage
        localStorage.setItem("signUpData", JSON.stringify(signUpData));
        updateFavoritesBadge();
      } else {
        Toast.fire({
          icon: "info",
          title: "You need to sign up to add products to wishlist.",
        });
      }
    } else {
      Toast.fire({
        icon: "info",
        title: "You need to log in to add products to wishlist.",
      });
    }
  }

  //check love button
  function checkheartbutton(product, BookCard) {
    const currentSession = JSON.parse(sessionStorage.getItem("currentSession"));

    if (
      currentSession &&
      currentSession.session &&
      currentSession.session.email
    ) {
      const loggedInUserEmail = currentSession.session.email;
      const signUpData = JSON.parse(localStorage.getItem("signUpData")) || {};

      if (signUpData.customers && signUpData.customers[loggedInUserEmail]) {
        const customer = signUpData.customers[loggedInUserEmail];
        const wishlist = customer.wishlist || []; // Fetch the wishlist from the customer data

        // Check if the product is in the wishlist
        const isFavorite = wishlist.some(
          (item) => item.title === product.title
        );

        if (isFavorite) {
          // Update the button style for favorite products
          BookCard.find(".btn-fav")
            .addClass("btn-danger")
            .removeClass("btn-outline-secondary");
        } else {
          // Reset the button style for non-favorite products
          BookCard.find(".btn-fav")
            .addClass("btn-outline-secondary")
            .removeClass("btn-danger");
        }
      }
    } else {
      // If no user is logged in, ensure the button has the default style
      BookCard.find(".btn-fav")
        .addClass("btn-outline-secondary")
        .removeClass("btn-danger");
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
setActiveLink = function () {
  const pathName = window?.location?.pathname?.toLowerCase();
  if (pathName.includes("home") && pathName) {
    document.getElementById("home-link")?.classList?.add("active");
  } else if (pathName.includes("about") && pathName) {
    document.getElementById("about-link")?.classList?.add("active");
  } else if (pathName.includes("contact") && pathName) {
    document.getElementById("contact-link")?.classList?.add("active");
  } else if (pathName.includes("service") && pathName) {
    document.getElementById("service-link").classList?.add("active");
  } else {
    document.getElementById("home-link").classList?.add("active");
  }
};
