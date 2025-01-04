lastChoosenCategory = null;
minPrice = 1e6;
maxPrice = 0;
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
  console.log("before");
  fillBookCategory(container, allProducts, productsCategories);

  // display products based on category choosen
  console.log("after");
  $("#slider-range").slider({
    range: true,
    min: minPrice,
    max: maxPrice,
    values: [minPrice, maxPrice],
    slide: function (event, ui) {
      // console.log(ui);
      $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);

      // Dynamically set the range background color
      const min = ui.values[0];
      const max = ui.values[1];
      const totalRange = $("#slider-range").slider("option", "max");
      const leftPercentage = (min / totalRange) * 100;
      const rightPercentage = (max / totalRange) * 100;

      // Update range background color
      $("#slider-range .ui-slider-range").css({
        left: leftPercentage + "%",
        width: rightPercentage - leftPercentage + "%",
        "background-color": "#810b0b", // Highlight color
      });

      // Update outer sides to white
      $("#slider-range").css({
        background: `linear-gradient(to right, white ${leftPercentage}%, #810b0b ${leftPercentage}%, #810b0b ${rightPercentage}%, white ${rightPercentage}%)`,
      });
    },
  });
  $("#amount").val("$" + $("#slider-range").slider("values", 0) + " - $" + $("#slider-range").slider("values", 1));
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
          fillProductsContainer(allProducts, productsCategories, $(lastChoosenCategory.children()[0]).text().toLowerCase());
        }
      });
      container.append(ulContainer);
    }

    fillProductsContainer(allProducts, productsCategories, $(lastChoosenCategory.children()[0]).text().toLowerCase());
  });
  container.fadeIn(300);
}

function fillProductsContainer(products, productsCategories, category) {
  let productsContainer = $("#products-container");
  // console.log(products);
  // console.log(productsCategories);
  // console.log(category);
  productsContainer.fadeOut(300, function () {
    productsContainer.empty();
    productsCategories[category].forEach((productId) => {
      // console.log(productId);
      let product = products[productId];
      if (minPrice > product.price) {
        minPrice = product.price;
        console.log("min" + minPrice);
      }
      if (maxPrice < product.price) {
        maxPrice = product.price;
        console.log("max" + maxPrice);
      }
      // image container
      img = $("<img />");
      img.prop("src", product.img_src);
      img.prop("alt", product.title);
      img.addClass("card-img-top");
      //overlay container
      let cartButton = $("<button>");
      cartButton.addClass("btn cart btn-outline-secondary btn-lg");
      let cartShape = $("<i>");
      cartShape.addClass("fas fs-2 fa-cart-plus");
      cartButton.append(cartShape);
      let favButton = $("<button>");
      favButton.addClass("btn wish-list btn-outline-secondary btn-lg");
      let favShape = $("<i>");
      favShape.addClass("far fs-2 fa-heart");
      favButton.append(favShape);
      let overlay = $("<div>");
      overlay.addClass("overlay");
      overlay.append(cartButton);
      overlay.append(favButton);
      let imgContainer = $("<div>");
      imgContainer.addClass("img-container");
      imgContainer.append(img);
      imgContainer.append(overlay);
      //card container
      let productTitle = $("<h5>");
      productTitle.addClass("card-title");
      productTitle.text(product.title);
      let productDescription = $("<p>");
      productDescription.addClass("card-text");
      productDescription.text(product.description);
      let productPrice = $("<p>");
      productPrice.addClass("card-text text-success fw-bold");
      productPrice.text("price: $" + product.price);
      let cardBody = $("<div>");
      cardBody.addClass("card-body");
      cardBody.append(productTitle);
      cardBody.append(productDescription);
      cardBody.append(productPrice);

      // card
      let card = $("<div>");
      card.addClass("card");
      card.append(imgContainer);
      card.append(cardBody);
      // append to products-container
      productsContainer.append(card);
      // container that contain the responsive classes
      let container = $("<div>");
      container.addClass("col-lg-4 col-md-6 col-sm-12 p-0v");
      container.append(card);
      productsContainer.append(container);
    });
    $(".cart").on("click", function () {
      console.log(this);
      // console.log("from cart");
    });
    $(".wish-list").on("click", function () {
      console.log(this);
      // console.log("from wish list");
    });
  });
  productsContainer.fadeIn(300);
}
