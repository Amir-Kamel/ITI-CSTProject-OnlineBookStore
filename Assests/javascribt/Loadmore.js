lastChoosenCategory = null;

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
        }
      })
      .catch((error) => console.error("Error loading content:", error));
  }

  // Load navigation and footer
  loadContent("nav.html", "mainNavigation");
  loadContent("footer.html", "footer");
});

$(function () {
  //create an array of objects that contains each category name and its quantity
  // get all products
  let allProducts = getBooksData();
  // console.log(allProducts);
  storeProductCategory(allProducts);
  let productsCategories = getProductCategory();
  // console.log(productsCategories);
  //display number of products in the categories-container div
  const container = $("#categories-container");
  fillBookCategory(container, allProducts, productsCategories);
  $("#sort").on("click", function () {
    sortWay = $(this).val();
    // console.log(sortWay);

    getDisplayedProducts()
      .then((displayedProducts) => {
        // console.log("Retrieved displayed products:", displayedProducts);
        // displayedProducts = displayedProducts.map((id) => allProducts[id]);
        console.log(displayedProducts);
        switch (sortWay) {
          case "name":
            displayedProducts.sort((a, b) => {
              if (allProducts[a].title < allProducts[b].title) return -1;
              if (allProducts[a].title > allProducts[b].title) return 1;
              return 0;
            });
            console.log(displayedProducts);
            break;
          case "ascending":
            displayedProducts.sort((a, b) => allProducts[a].price - allProducts[b].price);
            console.log(displayedProducts);
            break;
          case "descending":
            displayedProducts.sort((a, b) => allProducts[b].price - allProducts[a].price);
            console.log(displayedProducts);
            break;
          default:
            break;
        }
        // update the displayed products
        updateDisplayedProducts(allProducts, displayedProducts);
      })
      .catch((error) => {
        console.error(error);
        // Handle the error case (e.g., display a message to the user)
      });
  });
  let x = 30;
});
function getUserFromSession() {
  const user = JSON.parse(sessionStorage.getItem("currentSession"));
  return user;
}
function getBooksData() {
  const storedData = localStorage.getItem("products");
  // console.log("Retrieved data from localStorage:", storedData);
  return JSON.parse(storedData);
}
function storeProductCategory(products) {
  //convert all products to array
  let allProductsArray = Object.entries(products);
  // console.log(allProductsArray);
  //create the object that will contain all products categories
  let productsCategories = {};
  // save the quantity of all products
  productsCategories.all = [];
  //looping through all products
  allProductsArray.forEach(([key, value]) => {
    const productKey = key;
    const productDetails = value;
    // console.log(productKey);
    // console.log(productDetails);
    //get product category
    const productCategory = productDetails.category;
    // console.log(productCategory);
    // console.log(productsCategories[productCategory]);
    if (typeof productsCategories[productCategory] === "undefined") {
      // console.log("inside the if statement");
      productsCategories[productCategory] = [];
    }
    // console.log(productsCategories[productCategory]);

    productsCategories[productCategory].push(productKey);
    productsCategories.all.push(productKey);
  });
  // Save to local storage
  localStorage.setItem("productsCategories", JSON.stringify(productsCategories));
}
function getProductCategory() {
  const storedData = localStorage.getItem("productsCategories");
  // console.log("Retrieved data from localStorage:", storedData);
  return JSON.parse(storedData);
}

function fillBookCategory(container, allProducts, productsCategories) {
  container.fadeOut(300, function () {
    container.empty();

    for (let key in productsCategories) {
      // console.log(key, productsCategories[key]);
      length = productsCategories[key].length;

      // console.log(length);
      let categoryLi = $("<li>");
      categoryLi.text(key.charAt(0).toUpperCase() + key.slice(1));
      let quantityLi = $("<li>");
      quantityLi.text(productsCategories[key].length);
      let ulContainer = $("<ul>");
      ulContainer.addClass("list-unstyled counter d-flex justify-content-between fs-5");
      if (key == "all") {
        $("#items-counter").text(length);
        lastChoosenCategory = ulContainer;
        ulContainer.addClass("text-primary fs-4");
      }
      ulContainer.append(categoryLi);
      ulContainer.append(quantityLi);
      ulContainer.on("click", function () {
        // console.log($(this).text());
        if (lastChoosenCategory) {
          lastChoosenCategory.removeClass("text-primary fs-4");
          lastChoosenCategory = $(this);
          lastChoosenCategory.addClass("text-primary fs-4");
          $("#items-counter").text(lastChoosenCategory.children()[1].innerText);
          updateDisplayedProducts(allProducts, productsCategories[$(lastChoosenCategory.children()[0]).text().toLowerCase()])
            .then((displayedProducts) => {
              // Save to local storage
              localStorage.setItem("displayedProducts", JSON.stringify(displayedProducts));
              // console.log("Displayed products saved to localStorage:", displayedProducts);
            })
            .catch((error) => {
              console.error("Error processing products:", error);
            });
        }
      });
      container.append(ulContainer);
    }

    updateDisplayedProducts(allProducts, productsCategories[$(lastChoosenCategory.children()[0]).text().toLowerCase()])
      .then((displayedProducts) => {
        // Save to local storage
        localStorage.setItem("displayedProducts", JSON.stringify(displayedProducts));
        // console.log("Displayed products saved to localStorage:", displayedProducts);
      })
      .catch((error) => {
        console.error("Error processing products:", error);
      });
  });
  container.fadeIn(300);
}

function updateDisplayedProducts(products, filteredProducts) {
  return new Promise((resolve, reject) => {
    let productsContainer = $("#products-container");
    let displayedProducts = [];
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    // Fade out and process products
    productsContainer.fadeOut(300, function () {
      try {
        productsContainer.empty();
        filteredProducts.forEach((productId) => {
          let product = products[productId];
          displayedProducts.push(productId);

          if (minPrice > product.price) {
            minPrice = product.price;
          }
          if (maxPrice < product.price) {
            maxPrice = product.price;
          }

          // Create the card UI elements (as in the original code)
          let img = $("<img />").prop("src", product.img_src).prop("alt", product.title).addClass("card-img-top");
          let cartButton = $("<button>").addClass("btn cart btn-outline-secondary btn-lg").append($("<i>").addClass("fas fs-2 fa-cart-plus"));
          let favButton = $("<button>").addClass("btn wish-list btn-outline-secondary btn-lg").append($("<i>").addClass("far fs-2 fa-heart"));
          cartButton.on("click", function (e) {
            e.stopPropagation(); // Prevent event bubbling
            addToCart(productId);
          });
          let overlay = $("<div>").addClass("overlay").append(cartButton).append(favButton);
          let imgContainer = $("<div>").addClass("img-container").append(img).append(overlay);
          let productTitle = $("<h5>").addClass("card-title").text(product.title);
          let productDescription = $("<p>").addClass("card-text").text(product.description);
          let productPrice = $("<p>")
            .addClass("card-text text-success fw-bold")
            .text("price: $" + product.price);
          let cardBody = $("<div>").addClass("card-body").append(productTitle).append(productDescription).append(productPrice);
          let card = $("<div>").addClass("card").append(imgContainer).append(cardBody);
          let container = $("<div>").addClass("col-lg-4 col-md-6 col-sm-12 p-0v").append(card);
          // Attach event handlers

          $(".wish-list").on("click", function () {
            console.log(this);
          });
          card.on("click", function () {
            localStorage.setItem("selectedProduct", JSON.stringify(product));
            window.location.href = "Product Page.html";
          });
          productsContainer.append(container);
        });
        updateSlider(minPrice, maxPrice);
        productsContainer.fadeIn(300);

        // Resolve the Promise with displayed products
        resolve(displayedProducts);
      } catch (error) {
        // Reject the Promise in case of errors
        reject(error);
      }
    });
  });
}
function getDisplayedProducts() {
  return new Promise((resolve, reject) => {
    try {
      const storedProducts = localStorage.getItem("displayedProducts");
      if (storedProducts) {
        const displayedProducts = JSON.parse(storedProducts);
        resolve(displayedProducts); // Successfully retrieved and parsed
      } else {
        reject("No displayed products found in localStorage."); // Handle missing data
      }
    } catch (error) {
      reject(`Error retrieving displayed products: ${error.message}`); // Handle parse or other errors
    }
  });
}

function updateSlider(minPrice, maxPrice) {
  $("#slider-range").slider({
    range: true,
    min: 0,
    max: maxPrice,
    values: [0, maxPrice],
    slide: function (event, ui) {
      $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
      const min = ui.values[0];
      const max = ui.values[1];
      const totalRange = $("#slider-range").slider("option", "max");
      console.log(min, max, totalRange);
      // Calculate percentages for gradient
      const leftPercentage = (min / totalRange) * 100;
      const rightPercentage = (max / totalRange) * 100;

      // Update range background color
      $("#slider-range .ui-slider-range").css({
        left: leftPercentage + "%",
        width: rightPercentage - leftPercentage + "%",
        "background-color": "#810b0b", // Highlight color
      });
      console.log(leftPercentage);
      // Apply gradient background
      $("#slider-range").css({
        background: `linear-gradient(to right, white ${leftPercentage}%, #810b0b ${leftPercentage}%, #810b0b ${rightPercentage}%, white ${rightPercentage}%)`,
      });
    },
  });

  // Set initial state
  const initialMin = $("#slider-range").slider("values", 0);
  const initialMax = $("#slider-range").slider("values", 1);
  const totalRange = $("#slider-range").slider("option", "max");
  const leftPercentage = (initialMin / totalRange) * 100;
  const rightPercentage = (initialMax / totalRange) * 100;

  $("#slider-range").css({
    background: `linear-gradient(to right, white ${leftPercentage}%, #810b0b ${leftPercentage}%, #810b0b ${rightPercentage}%, white ${rightPercentage}%)`,
  });

  $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));
}

// Call the function with your desired min and max values
updateSlider(6, 14);
