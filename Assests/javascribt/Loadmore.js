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
  container.fadeOut(300, function () {
    container.empty();

    for (let key in productsCategories) {
      console.log(key, productsCategories[key]);
    }
  });

  $("#slider-range").slider({
    range: true,
    min: 0,
    max: 500,
    values: [0, 500],
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
