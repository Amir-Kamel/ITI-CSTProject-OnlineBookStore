document.addEventListener("DOMContentLoaded", function () {
  updateCartBadge();
});
function cartFunction() {
  console.log("event fired");
  const loggedInUser = getLoggedInUserEmail();
  if (loggedInUser) {
    window.location.href = "./cart.html";
  } else {
    console.log("Login failed");
    Toast.fire({
      icon: "info",
      title: "You need to be logged in to add products to cart.",
    });
  }
}

// Function to retrieve current session email from sessionStorage
function getLoggedInUserEmail() {
  const currentSession = JSON.parse(sessionStorage.getItem("currentSession"));
  return currentSession?.session;
}
function getUsersData() {
  const storedData = localStorage.getItem("signUpData");
  return JSON.parse(storedData);
}
function getProductsData() {
  const storedData = localStorage.getItem("products");
  return JSON.parse(storedData);
}

// Function to update the cart badge based on the items in local storage
function updateCartBadge() {
  const loggedInUser = getLoggedInUserEmail();
  // console.log(loggedInUser);
  // console.log(loggedInUser["category"]);
  if (loggedInUser) {
    // Retrieve the cart from local storage and update the cart badge
    let UsersData = getUsersData();
    // console.log(UsersData[loggedInUser["category"]][loggedInUser["email"]]["cart"]);
    let customerCart = UsersData[loggedInUser["category"]][loggedInUser["email"]]["cart"];
    let productsNumber = 0;
    for (product in customerCart) {
      // console.log(customerCart[product]);
      productsNumber += customerCart[product]["quantity"];
    }
    $("#cartBadge").text(productsNumber);
  } else {
    $("#cartBadge").text(0);
  }
}
function productNotAvailableMessage() {
  Toast.fire({
    icon: "info",
    title: "Sorry, this product is currently unavailable.",
  });
}
function outOfStockMessage() {
  Toast.fire({
    icon: "info",
    title: "Sorry, You have exceeded the available stock for this item.",
  });
}

// Function to add product to cart and save in local storage
function addToCart(product_id) {
  const loggedInUser = getLoggedInUserEmail();
  if (loggedInUser) {
    // Retrieve the cart from local storage and update the cart badge
    let UsersData = getUsersData();
    let inStock = getProductsData()[product_id]["stock"];
    // console.log(inStock);
    if (inStock == 0) {
      productNotAvailableMessage();
      return;
    }

    let product = { quantity: 1, selected: true };

    // console.log(UsersData);
    if (product_id in UsersData[loggedInUser["category"]][loggedInUser["email"]]["cart"]) {
      if (UsersData[loggedInUser["category"]][loggedInUser["email"]]["cart"][product_id]["quantity"] + 1 > inStock) {
        outOfStockMessage();
        return;
      }
      UsersData[loggedInUser["category"]][loggedInUser["email"]]["cart"][product_id]["quantity"]++;
    } else {
      UsersData[loggedInUser["category"]][loggedInUser["email"]]["cart"][product_id] = product;
    }
    localStorage.setItem("signUpData", JSON.stringify(UsersData));
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

// Sign-in function
function signInUser(email) {
  const sessionData = {
    session: {
      email: email,
    },
  };
  sessionStorage.setItem("currentSession", JSON.stringify(sessionData));
  updateCartBadge(); // Update the cart badge after sign-in
}

// Sign-out function
function signOutUser() {
  sessionStorage.removeItem("currentSession");
  updateCartBadge(); // Update the cart badge after sign-out
}

// Ensure the updateCartBadge function is called when the navigation loads
